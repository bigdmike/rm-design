import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { parsePublicUrl, listingPath, outOfRange, isMissing, initialNotFound, paginationPages } from '../src/common/publicUrl.js'
import { pageSeo, headEntries, errorSeo, serializeSchema } from '../src/common/seo.js'
import { latestRequest } from '../src/common/latestRequest.js'
import { createHead, renderSSRHead } from '@unhead/vue/server'

const cases = JSON.parse(await readFile(new URL('../../api/tests/public-url-cases.json', import.meta.url), 'utf8'))
for (const fixture of cases) test(`public URL: ${fixture.url}`, () => {
  assert.equal(parsePublicUrl(fixture.url)?.canonicalPath ?? null, fixture.canonical)
})

test('pagination preserves category, omits page one, and exposes adjacent pages', () => {
  assert.equal(listingPath('/works', 1, '2'), '/works?category=2')
  assert.equal(listingPath('/works', 3, '2'), '/works?category=2&page=3')
  assert.equal(listingPath('/press', 1), '/press')
  assert.deepEqual(paginationPages(5, 10), [1, 3, 4, 5, 6, 7, 10])
  assert.deepEqual(paginationPages(1, 1), [])
  assert.equal(outOfRange({ page: 1, totalPages: 0 }), false)
  assert.equal(outOfRange({ page: 2, totalPages: 0 }), true)
  assert.equal(outOfRange({ page: 2, totalPages: 2 }), false)
})

test('category title and independent OG overrides survive resolution', () => {
  const page = { seo: { ogTitle: '分享專用標題', resolved: { title: '設計案例', description: '一般描述', ogDescription: '分享描述', ogImage: { url: 'https://api.example.test/cover.webp', width: 1200, height: 630 } } } }
  const seo = pageSeo(page, 'https://example.test/works?category=2', '住宅空間')
  assert.equal(seo.title, '住宅空間｜設計案例')
  assert.equal(seo.ogTitle, '分享專用標題')
  assert.equal(seo.ogDescription, '分享描述')
  assert.equal(seo.ogImageWidth, 1200)
  page.seo.ogTitle = null
  assert.equal(pageSeo(page, '/works?category=2', '住宅空間').ogTitle, '住宅空間｜設計案例')
})

test('no legacy sharing-image fallback; site default is used when configured', () => {
  assert.equal(pageSeo(null, '/about').ogImage, '')
  assert.equal(pageSeo({ site: { settings: { defaultOgImage: { url: '/uploads/default.webp' } } } }, '/').ogImage, '/uploads/default.webp')
})

test('article head retains type, schema, image dimensions; error drops all article state', () => {
  const schema = { '@type': 'Article', headline: '案例', articleBody: '內容' }
  const article = headEntries({ title: '案例', canonical: '/works/6', ogType: 'article', ogImage: '/cover.webp', ogImageWidth: 1200, ogImageHeight: 630, robots: 'index,follow', jsonLd: schema })
  assert.equal(article.meta.find((tag) => tag.property === 'og:type').content, 'article')
  assert.equal(article.meta.find((tag) => tag.property === 'og:locale').content, 'zh_TW')
  assert.deepEqual(JSON.parse(article.script[0].textContent), schema)
  const error = headEntries(errorSeo('https://example.test', '阜居'))
  assert.equal(error.link[0].href, 'https://example.test/404')
  assert.deepEqual(error.script, [])
  assert.equal(error.meta.some((tag) => tag.property === 'og:image'), false)
  assert.equal(error.meta.find((tag) => tag.name === 'robots').content, 'noindex,nofollow')
  const recovered = headEntries({ ...pageSeo(null, '/works'), robots: 'index,follow' })
  assert.equal(recovered.meta.find((tag) => tag.name === 'robots').content, 'index,follow')
})

test('schema script cannot be escaped by article text', () => {
  const data = { articleBody: '</script><script>alert(1)</script>&\u2028' }
  assert.equal(serializeSchema(data).includes('</script>'), false)
  assert.deepEqual(JSON.parse(serializeSchema(data)), data)
})

test('temporary failures are not missing content', () => {
  assert.equal(isMissing({ status: 404 }), true)
  assert.equal(isMissing({ status: 422 }), true)
  for (const status of [0, 429, 500, 502, 503]) assert.equal(isMissing({ status }), false)
  assert.equal(isMissing(new TypeError('Failed to fetch')), false)
  const seo = errorSeo('', '阜居', false, '/works/6')
  assert.equal(seo.canonical, '/works/6')
  assert.match(seo.title, /暫時/)
})

test('server 404 snapshot applies only to its original document, not later navigation', () => {
  const initial = { status: 404, requestPath: '/works/99' }
  assert.equal(initialNotFound(initial, '/works/99'), true)
  assert.equal(initialNotFound(initial, '/works/99#details'), true)
  assert.equal(initialNotFound(initial, '/works/6'), false)
  assert.equal(initialNotFound(initial, '/works'), false)
  assert.equal(initialNotFound({ ...initial, status: 200 }, '/works/99'), false)
})

test('out-of-order case responses do not overwrite current case or metadata', async () => {
  const request = latestRequest()
  let resolveOld
  const applied = []
  const old = request.run(() => new Promise((resolve) => { resolveOld = resolve }), { success: (value) => applied.push(value), settled: () => applied.push('old settled') })
  await request.run(() => Promise.resolve('new case'), { success: (value) => applied.push(value) })
  resolveOld('old case')
  await old
  assert.deepEqual(applied, ['new case'])
})

test('late errors and results after leaving a page do not change the new screen', async () => {
  const request = latestRequest()
  let rejectOld
  const applied = []
  const old = request.run(() => new Promise((_, reject) => { rejectOld = reject }), { error: () => applied.push('404'), settled: () => applied.push('settled') })
  request.invalidate()
  rejectOld({ status: 404 })
  await old
  assert.deepEqual(applied, [])
})

test('head manager removes article tags and schema on error, then restores normal indexing', async () => {
  const head = createHead()
  const entry = head.push(headEntries({ title: '案例', canonical: '/works/6', ogType: 'article', ogImage: '/cover.webp', ogImageWidth: 1200, ogImageHeight: 630, robots: 'index,follow', jsonLd: { '@type': 'Article', articleBody: '案例內容' } }))
  assert.match((await renderSSRHead(head)).headTags, /application\/ld\+json/)
  entry.patch(headEntries(errorSeo('', '阜居')))
  const failed = (await renderSSRHead(head)).headTags
  assert.doesNotMatch(failed, /application\/ld\+json|og:image|articleBody/)
  assert.match(failed, /noindex,nofollow/)
  assert.equal((failed.match(/rel="canonical"/g) || []).length, 1)
  entry.patch(headEntries({ ...pageSeo(null, '/works'), robots: 'index,follow' }))
  const recovered = (await renderSSRHead(head)).headTags
  assert.doesNotMatch(recovered, /noindex|application\/ld\+json/)
  assert.match(recovered, /content="index,follow"/)
})
