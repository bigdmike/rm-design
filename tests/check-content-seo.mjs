// Local, read-only audit: metadata, schema parity, OG delivery and internal links.
import assert from 'node:assert/strict'
import { pageSchema } from '../src/common/seo.js'
const base = process.argv[2] || 'http://127.0.0.1:8080'
assert.ok(['localhost', '127.0.0.1', 'rm.localhost'].includes(new URL(base).hostname))
const local = url => { const target = new URL(url); assert.ok(['localhost', '127.0.0.1', 'rm.localhost', 'rm-api.localhost'].includes(target.hostname)); target.hostname = '127.0.0.1'; return target.href }
const paths = ['/', '/about', '/works', '/workflow', '/press', '/contact', '/privacy-policy']
const records = [], links = new Set(), images = new Map(), warnings = []
const stateOf = html => JSON.parse(html.match(/<script id="rm-initial-state"[^>]*>([\s\S]*?)<\/script>/)[1])
const listing = stateOf(await (await fetch(base + '/works')).text())
paths.push(...listing.works.items.map(work => '/works/' + work.id))
for (const path of paths) {
  const response = await fetch(base + path), html = await response.text(), state = stateOf(html), seo = state.seo
  assert.equal(response.status, 200, path)
  for (const field of ['title','description','ogTitle','ogDescription','ogImage']) if (!seo[field]) warnings.push({ path, missing: field })
  const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]))
  assert.deepEqual(schemas, seo.jsonLd ? [seo.jsonLd] : [], path + ' single matching server schema')
  if (state.page !== 'work') assert.deepEqual(seo.jsonLd, pageSchema(state.pageData, seo.canonical), path + ' PHP / JS schema parity')
  const levels = [...html.matchAll(/<h([1-6])\b/g)].map(match => Number(match[1]))
  for (const heading of html.matchAll(/<h([1-6])\b[^>]*>[\s\S]*?<\/h([1-6])>/g)) assert.equal(heading[1], heading[2], path + ' matching heading tags')
  assert.equal(levels.filter(level => level === 1).length, 1, path + ' one h1')
  const skippedHeadings = levels.filter((level, i) => i > 0 && level > levels[i - 1] + 1)
  assert.equal(skippedHeadings.length, 0, path + ' heading levels')
  for (const match of html.matchAll(/<img\b[^>]*>/g)) assert.match(match[0], /\balt="/, path + ' image alt exists')
  if (seo.ogImage) images.set(seo.ogImage, [seo.ogImageWidth, seo.ogImageHeight])
  for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const href = match[1].replaceAll('&amp;', '&'), url = new URL(href, state.frontendOrigin + path)
    if (url.origin === state.frontendOrigin && !url.hash) links.add(url.pathname + url.search)
  }
  records.push({ path, title: seo.title, descriptionLength: [...seo.description].length, og: seo.ogImage ? `${seo.ogImageWidth}×${seo.ogImageHeight}` : '未設定', schema: schemas[0]?.['@type'] || schemas[0]?.['@graph']?.[0]?.['@type'] || 'none' })
}
for (const [url, dimensions] of images) {
  const response = await fetch(local(url), { method: 'HEAD' })
  assert.equal(response.status, 200, url)
  assert.match(response.headers.get('content-type'), /^image\//, url)
  assert.ok(dimensions.every(value => Number.isInteger(value) && value > 0), url + ' dimensions')
}
for (const path of links) assert.equal((await fetch(base + path, { method: 'HEAD' })).status, 200, 'internal link ' + path)
console.table(records)
console.log(`PASS ${records.length} pages, ${images.size} distinct OG images, ${links.size} internal destinations; no data writes.`)
if (warnings.length) {
  console.log('CONTENT WARNINGS: fill these in CMS before launch (no automatic content edits).')
  console.table(warnings)
  if (process.argv.includes('--strict-content')) process.exitCode = 1
}
