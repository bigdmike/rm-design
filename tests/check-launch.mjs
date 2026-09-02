// Read-only launch gate. No cookies, login, form submissions, DB writes or Google calls.
import assert from 'node:assert/strict'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import { resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { checkBudget, decodeHtml, initialState, isLocal, mapOwnedUrl, median, metaValue, origin, request } from './launch-support.mjs'

const flags = {}
for (const arg of process.argv.slice(2)) {
  const match = arg.match(/^--([a-z-]+)=(.+)$/)
  if (!match || !['mode', 'front', 'api', 'canonical', 'api-canonical', 'report'].includes(match[1]) || flags[match[1]]) throw new Error('Use --mode=local|staging|production --front=ORIGIN --api=ORIGIN --canonical=ORIGIN --api-canonical=ORIGIN --report=NAME')
  flags[match[1]] = match[2]
}
const mode = flags.mode || 'local'
assert.ok(['local', 'staging', 'production'].includes(mode))
const production = mode === 'production'
const publicHost = mode !== 'local'
if (publicHost) for (const key of ['front', 'api', 'canonical', 'api-canonical']) assert.ok(flags[key], `${mode} requires explicit --${key}`)
const targets = {
  front: origin(flags.front || 'http://127.0.0.1:8080', { production: publicHost }),
  api: origin(flags.api || 'http://127.0.0.1:8081', { production: publicHost }),
  canonical: origin(flags.canonical || 'http://rm.localhost:8080', { production: publicHost }),
  apiCanonical: origin(flags['api-canonical'] || 'http://rm-api.localhost:8081', { production: publicHost }),
}
if (!publicHost) for (const value of Object.values(targets)) assert.ok(isLocal(value), 'Local mode cannot contact public hosts')
const reportName = flags.report || `stage5-${mode}`
assert.match(reportName, /^[a-z0-9][a-z0-9_-]{0,70}$/i)
const root = fileURLToPath(new URL('../', import.meta.url))
const budget = JSON.parse(await readFile(new URL('./launch-budgets.json', import.meta.url), 'utf8'))
const report = { generatedAt: new Date().toISOString(), mode, targets, scope: 'GET/HEAD/OPTIONS only; no redirect following or third-party content fetching', measurement: '3 serial unconditional HTTP GET samples, gzip response body bytes and TTFB; NOT browser cold/warm cache, LCP, CLS, INP or Lighthouse', checks: [], pages: [], apis: [], images: [], assets: [], budgets: budget, limitations: ['No CPU/network throttling or physical-device evidence', 'No real-user metrics/Search Console evidence', 'Public HTTPS redirect/TLS validation still requires the real deployment', 'PHP 503 failure isolation and browser interactions are tested separately'] }
async function check(label, run) {
  try { await run(); report.checks.push({ label, status: 'pass' }) }
  catch (error) { report.checks.push({ label, status: 'fail', message: error.message }); console.error('FAIL', label, error.message) }
}
function robotsHeader(response, context, mustBlock = false) {
  if (!production || mustBlock) assert.match(response.headers['x-robots-tag'] || '', /noindex/i, context)
  else assert.doesNotMatch(response.headers['x-robots-tag'] || '', /noindex|none/i, context)
}
function owned(value) { return mapOwnedUrl(value, targets) }
const imageCandidates = new Map()
const assetUrls = new Set()
const paths = new Set(['/', '/about', '/works', '/workflow', '/press', '/contact', '/privacy-policy'])

await check('robots.txt environment policy', async () => {
  const res = await request(targets.front + '/robots.txt')
  assert.equal(res.status, 200)
  assert.match(res.headers['content-type'], /text\/plain/)
  if (!production) assert.match(res.body.toString(), /^Disallow: \/\s*$/m)
  else {
    assert.doesNotMatch(res.body.toString(), /^Disallow: \/\s*$/m)
    assert.ok(res.body.toString().includes(`Sitemap: ${targets.canonical}/sitemap.xml`))
  }
})
await check('sitemap URLs and modification dates', async () => {
  const res = await request(targets.front + '/sitemap.xml')
  assert.equal(res.status, 200)
  assert.match(res.headers['content-type'], /xml/)
  const entries = [...res.body.toString().matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>\s*<\/url>/g)]
  assert.ok(entries.length >= 7)
  const unique = new Set()
  for (const [, raw, date] of entries) {
    const url = new URL(decodeHtml(raw))
    assert.equal(url.origin, targets.canonical)
    assert.ok(!url.search && !url.hash && !url.username && !url.password)
    assert.match(url.pathname, /^(?:\/|\/(?:about|works|workflow|press|contact|privacy-policy)|\/works\/[1-9]\d*)$/)
    assert.ok(!unique.has(url.href), 'Duplicate sitemap entry')
    assert.ok(Number.isFinite(Date.parse(date)) && Date.parse(date) <= Date.now() + 60000, 'Invalid/future lastmod')
    unique.add(url.href)
    paths.add(url.pathname)
  }
  for (const path of ['/', '/about', '/works', '/workflow', '/press', '/contact', '/privacy-policy']) {
    assert.ok(unique.has(targets.canonical + path), 'Fixed canonical page missing from sitemap: ' + path)
  }
  report.sitemapEntries = entries.length
})
// Prevent an accidentally enormous CMS from causing an unbounded audit run.
if (paths.size > 107) throw new Error('More than 100 cases: explicitly plan paginated audit batches instead of silently sampling')
for (const path of paths) await check(`HTML ${path}`, async () => {
  const samples = []
  for (let i = 0; i < 3; i++) samples.push(await request(targets.front + path, { headers: { 'Cache-Control': 'no-cache' } }))
  const res = samples[0], html = res.body.toString(), state = initialState(html)
  assert.ok(samples.every(sample => sample.status === 200))
  assert.match(res.headers['content-type'], /text\/html/)
  const csp = res.headers['content-security-policy'] || ''
  assert.match(csp, /default-src 'self'/)
  assert.match(csp, /script-src 'self'/)
  assert.match(csp, /script-src-attr 'none'/)
  assert.match(csp, /object-src 'none'/)
  assert.match(csp, /base-uri 'none'/)
  assert.match(csp, /frame-ancestors 'none'/)
  assert.ok(csp.includes(`connect-src 'self' ${state.apiOrigin}`))
  if (production) assert.match(csp, /upgrade-insecure-requests/)
  else assert.doesNotMatch(csp, /upgrade-insecure-requests/)
  assert.equal(res.headers['set-cookie'], undefined, 'Public HTML must not start a session')
  assert.equal(state.frontendOrigin, targets.canonical)
  assert.equal(state.apiOrigin, targets.apiCanonical)
  assert.equal(state.seo.canonical, targets.canonical + path)
  assert.equal(state.indexable, production)
  assert.equal(metaValue(html, 'robots'), production ? 'index,follow' : 'noindex,nofollow')
  robotsHeader(res, path)
  assert.match(res.headers['cache-control'], production ? /max-age=60, must-revalidate/ : /no-store/)
  assert.equal((html.match(/<title\b/g) || []).length, 1)
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1)
  assert.equal(decodeHtml(html.match(/<title[^>]*>([^<]*)<\/title>/)?.[1] || ''), state.seo.title)
  const canonicalTag = (html.match(/<link\b[^>]*>/g) || []).find(tag => tag.includes('rel="canonical"'))
  assert.equal(decodeHtml(canonicalTag?.match(/href="([^"]*)"/)?.[1] || ''), state.seo.canonical)
  assert.equal((html.match(/<h1\b/g) || []).length, 1)
  assert.match(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, ''), /<main\b[\s\S]+<\/main>/)
  for (const [property, field] of [['description', 'description'], ['og:title', 'ogTitle'], ['og:description', 'ogDescription'], ['og:type', 'ogType'], ['og:url', 'canonical'], ['og:image', 'ogImage']]) {
    assert.ok(state.seo[field], `${path}: missing ${field}; fill in CMS`)
    assert.equal(metaValue(html, property), state.seo[field], property)
  }
  assert.ok(state.seo.ogImageWidth > 0 && state.seo.ogImageHeight > 0)
  imageCandidates.set(state.seo.ogImage, { kind: 'og', path })
  for (const tag of html.match(/<img\b[^>]*>/g) || []) {
    assert.match(tag, /\balt="/)
    if (tag.includes('fetchpriority="high"')) {
      const src = tag.match(/\bsrc="([^"]+)"/)?.[1]
      if (src) imageCandidates.set(decodeHtml(src), { kind: 'priority', path })
    }
  }
  for (const tag of html.match(/<(?:script|link)\b[^>]*>/g) || []) {
    const url = tag.match(/(?:src|href)="([^"]+)"/)?.[1]
    if (url?.startsWith('/assets/')) assetUrls.add(url)
  }
  checkBudget(res.decodedBytes, budget.pageHtmlDecodedBytes, path + ' HTML')
  report.pages.push({ path, status: res.status, htmlBytes: res.decodedBytes, wireBytes: res.wireBytes, encoding: res.headers['content-encoding'] || 'identity', medianHttpTtfbMs: median(samples.map(sample => sample.ttfbMs)), ttfbSamplesMs: samples.map(sample => sample.ttfbMs), ogWidth: state.seo.ogImageWidth, ogHeight: state.seo.ogImageHeight })
})
for (const page of ['home', 'about', 'works', 'workflow', 'press', 'contact', 'privacy']) await check(`API ${page}`, async () => {
  const url = targets.api + '/api/v1/pages/' + page
  const res = await request(url, { headers: { Origin: targets.front } })
  assert.equal(res.status, 200)
  assert.match(res.headers['content-type'], /application\/json/)
  assert.match(res.headers['content-security-policy'] || '', /default-src 'none'/)
  assert.match(res.headers['content-security-policy'] || '', /frame-ancestors 'none'/)
  assert.equal(JSON.parse(res.body.toString()).page, page)
  robotsHeader(res, 'API JSON is not an indexable page', true)
  assert.match(res.headers['cache-control'], /public, max-age=60, must-revalidate/)
  assert.equal(res.headers['access-control-allow-origin'], targets.front)
  assert.equal(res.headers['access-control-allow-credentials'], undefined)
  assert.equal(res.headers['set-cookie'], undefined)
  assert.ok(res.headers.etag)
  const conditional = await request(url, { headers: { Origin: targets.front, 'If-None-Match': res.headers.etag } })
  assert.equal(conditional.status, 304)
  robotsHeader(conditional, 'API 304', true)
  assert.equal(conditional.wireBytes, 0)
  assert.match(conditional.headers['cache-control'], /must-revalidate/)
  assert.equal(conditional.headers['access-control-allow-origin'], targets.front)
  checkBudget(res.decodedBytes, budget.pageApiDecodedBytes, page + ' API')
  report.apis.push({ page, bytes: res.decodedBytes, wireBytes: res.wireBytes, conditionalStatus: conditional.status })
})
for (const [value, { kind, path }] of imageCandidates) await check(`image ${kind} ${path}`, async () => {
  const url = owned(value)
  const res = await request(url, { method: 'HEAD', headers: { 'Accept-Encoding': 'identity' } })
  assert.equal(res.status, 200)
  assert.match(res.headers['content-type'], /^image\//)
  robotsHeader(res, `public image ${url}; X-Robots-Tag=${res.headers['x-robots-tag'] || '(missing)'}`)
  const bytes = Number(res.headers['content-length'])
  assert.ok(bytes > 0)
  checkBudget(bytes, kind === 'og' ? budget.ogImageBytes : budget.priorityImageBytes, `${kind} image`)
  report.images.push({ path: new URL(url).pathname, kind, bytes })
})
for (const path of assetUrls) await check(`static asset ${path}`, async () => {
  const res = await request(targets.front + path)
  assert.equal(res.status, 200)
  assert.match(res.headers['content-type'], path.endsWith('.js') ? /javascript/ : /text\/css/)
  assert.equal(res.headers['content-encoding'], 'gzip', 'JS/CSS response compression')
  assert.match(res.headers['cache-control'], /max-age=31536000, immutable/)
  assert.ok(res.headers['last-modified'], 'Static bundle Last-Modified validator')
  assert.equal(res.headers.etag, undefined, 'Avoid the mod_deflate gzip ETag revalidation mismatch')
  assert.match(res.headers.vary || '', /Accept-Encoding/i)
  const conditional = await request(targets.front + path, { headers: { 'If-Modified-Since': res.headers['last-modified'] } })
  assert.equal(conditional.status, 304)
  assert.equal(conditional.wireBytes, 0)
  assert.match(conditional.headers['cache-control'], /immutable/)
  const identity = await request(targets.front + path, { headers: { 'Accept-Encoding': 'identity', 'If-Modified-Since': res.headers['last-modified'] } })
  assert.equal(identity.status, 304)
  report.assets.push({ path, bytes: res.decodedBytes, wireBytes: res.wireBytes, validator: 'Last-Modified', gzipConditionalStatus: conditional.status, identityConditionalStatus: identity.status })
})
for (const path of ['/__stage5_missing__', '/works/4294967295', '/works?category=999', '/press?page=100000', '/assets/__stage5_missing__.js']) await check(`HTTP 404 ${path}`, async () => {
  const res = await request(targets.front + path)
  assert.equal(res.status, 404)
  assert.match(res.headers['cache-control'] || '', /no-store/)
  robotsHeader(res, '404', true)
  assert.doesNotMatch(res.headers['cache-control'] || '', /immutable/)
})
await check('entry redirect and private shell', async () => {
  const redirect = await request(targets.front + '/index.html')
  assert.equal(redirect.status, 301)
  assert.equal(new URL(redirect.headers.location, targets.front).pathname, '/')
  assert.equal((await request(targets.front + '/app-shell.html')).status, 404)
})
await check('private contact token, no public cache', async () => {
  const res = await request(targets.api + '/api/v1/contact-form', { headers: { Origin: targets.front } })
  assert.equal(res.status, 200)
  assert.match(res.headers['cache-control'], /no-store/)
  assert.equal(res.headers.etag, undefined)
  // Do not store/log the token payload or response cookies in reports.
})
await check('CORS rejection and read preflight', async () => {
  const url = targets.api + '/api/v1/works'
  const rejected = await request(url, { headers: { Origin: 'https://untrusted.example' } })
  assert.equal(rejected.status, 403)
  assert.equal(rejected.headers['access-control-allow-origin'], undefined)
  assert.match(rejected.headers['cache-control'], /no-store/)
  const allowed = await request(url, { method: 'OPTIONS', headers: { Origin: targets.front, 'Access-Control-Request-Method': 'GET' } })
  assert.equal(allowed.status, 204)
  assert.equal(allowed.headers['access-control-allow-origin'], targets.front)
})
await check('admin page remains non-indexable', async () => {
  const res = await request(targets.api + '/admin/')
  assert.equal(res.status, 200)
  assert.match(metaValue(res.body.toString(), 'robots'), /noindex/)
  robotsHeader(res, 'admin', true)
  assert.match(res.headers['cache-control'], /no-store/)
  assert.match(res.headers['content-security-policy'] || '', /script-src 'self'/)
  assert.match(res.headers['content-security-policy'] || '', /frame-ancestors 'none'/)
})
if (!production) await check('built JS/CSS regression budgets', async () => {
  const directory = join(root, 'dist', 'assets')
  const files = []
  for (const name of await readdir(directory)) {
    if (!/\.(?:js|css)$/.test(name)) continue
    const body = await readFile(join(directory, name))
    files.push({ name, bytes: body.length, gzipBytes: gzipSync(body).length })
  }
  const entry = files.find(file => /^index-.*\.js$/.test(file.name))
  assert.ok(entry)
  const allJsGzipBytes = files.filter(file => file.name.endsWith('.js')).reduce((sum, file) => sum + file.gzipBytes, 0)
  const allCssGzipBytes = files.filter(file => file.name.endsWith('.css')).reduce((sum, file) => sum + file.gzipBytes, 0)
  report.build = { entry, allJsGzipBytes, allCssGzipBytes, files, note: 'All JS chunks includes lazy routes; neither this total nor entry size alone equals first-screen transfer.' }
  checkBudget(entry.gzipBytes, budget.entryJsGzipBytes, 'entry JS gzip')
  checkBudget(allJsGzipBytes, budget.allJsGzipBytes, 'all JS gzip')
  checkBudget(allCssGzipBytes, budget.allCssGzipBytes, 'all CSS gzip')
})
report.summary = { passed: report.checks.filter(row => row.status === 'pass').length, failed: report.checks.filter(row => row.status === 'fail').length }
const directory = resolve(root, 'reports')
await mkdir(directory, { recursive: true })
const file = join(directory, `${reportName}.json`)
await writeFile(file, JSON.stringify(report, null, 2) + '\n')
console.table(report.pages)
console.log(JSON.stringify(report.summary), `Report: ${file}`)
if (report.summary.failed) process.exitCode = 1
