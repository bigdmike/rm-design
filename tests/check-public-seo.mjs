// Read-only HTTP checks. Does not submit forms or create fixtures.
import assert from 'node:assert/strict'

const base = process.argv[2] || 'http://127.0.0.1:8080'
const parsed = new URL(base)
assert.ok(['localhost', '127.0.0.1', '[::1]', 'rm.localhost'].includes(parsed.hostname), 'Use a local frontend URL')
const valid = ['/', '/about', '/works', '/works?category=2', '/works?utm_source=audit', '/press', '/workflow', '/contact', '/privacy-policy']
const invalid = ['/does-not-exist', '/works/999999', '/works?category=999', '/works?page=100000', '/works?page=1&page=2', '/press?page=100000', '/press?page[]=2']
const escape = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
const snapshots = []

for (const path of [...valid, ...invalid]) {
  const response = await fetch(base + path)
  const html = await response.text()
  assert.equal(response.status, valid.includes(path) ? 200 : 404, path)
  const state = JSON.parse(html.match(/<script id="rm-initial-state"[^>]*>([\s\S]*?)<\/script>/)?.[1] || 'null')
  assert.ok(state?.seo, `SEO snapshot: ${path}`)
  assert.equal((html.match(/<title\b/g) || []).length, 1, path)
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1, path)
  assert.ok(html.includes(`href="${escape(state.seo.canonical)}"`), path)
  for (const [property, value] of Object.entries({ 'og:type': state.seo.ogType, 'og:title': state.seo.ogTitle, 'og:description': state.seo.ogDescription })) {
    assert.ok(html.includes(`property="${property}" content="${escape(value)}"`), `${path}: ${property}`)
  }
  assert.equal(state.indexable, false, 'local environment must stay non-indexable')
  assert.equal(state.seo.robots, 'noindex,nofollow')
  assert.match(response.headers.get('x-robots-tag'), /noindex/)
  if (invalid.includes(path)) {
    assert.equal(state.seo.jsonLd, null)
    assert.equal(state.seo.canonical, state.frontendOrigin + '/404')
  }
  snapshots.push({ path, status: response.status, title: state.seo.title, canonical: state.seo.canonical })
}
const redirect = await fetch(base + '/index.html', { redirect: 'manual' })
assert.equal(redirect.status, 301)
assert.equal(new URL(redirect.headers.get('location'), base).pathname, '/')
console.table(snapshots)
console.log(`PASS: ${snapshots.length} HTML responses plus canonical entry redirect; local noindex preserved.`)
