import test from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import { gzipSync } from 'node:zlib'
import { checkBudget, initialState, isLocal, mapOwnedUrl, median, metaValue, origin, request } from './launch-support.mjs'

test('launch origins reject credentials, paths and ambiguous production defaults', () => {
  assert.equal(origin('http://localhost:8080/'), 'http://localhost:8080')
  for (const value of ['file:///x', 'https://u:p@example.com', 'http://localhost/x', 'https://example.com/?x=1']) assert.throws(() => origin(value))
  for (const value of ['http://example.com', 'https://localhost', 'https://rm.localhost']) assert.throws(() => origin(value, { production: true }))
  assert.equal(origin('https://www.example.com', { production: true }), 'https://www.example.com')
  assert.ok(isLocal('http://[::1]:8080'))
  assert.ok(!isLocal('https://localhost.example.com'))
})
test('discovered images are limited to explicitly configured website/API origins', () => {
  const targets = { front: 'http://127.0.0.1:8080', api: 'http://127.0.0.1:8081', canonical: 'http://rm.localhost:8080', apiCanonical: 'http://rm-api.localhost:8081' }
  assert.equal(mapOwnedUrl('/assets/a.jpg', targets), targets.front + '/assets/a.jpg')
  assert.equal(mapOwnedUrl(targets.apiCanonical + '/uploads/a.jpg', targets), targets.api + '/uploads/a.jpg')
  for (const value of ['https://external.example/x', 'http://localhost:9999/x', 'http://u:p@rm.localhost:8080/x']) assert.throws(() => mapOwnedUrl(value, targets))
})
test('initial data and metadata parser fail clearly on static preview shells', () => {
  assert.throws(() => initialState('<html></html>'), /PHP initial state/)
  assert.deepEqual(initialState('<script id="rm-initial-state" type="application/json">{"page":"home"}</script>'), { page: 'home' })
  assert.equal(metaValue('<meta property="og:title" content="A &amp; B">', 'og:title'), 'A & B')
})
test('median preserves original samples and rejects non-measurements', () => {
  const values = [3, 1, 2]
  assert.equal(median(values), 2)
  assert.deepEqual(values, [3, 1, 2])
  assert.equal(median([4, 1]), 2.5)
  assert.throws(() => median([]))
  assert.throws(() => median([NaN]))
})
test('resource budgets fail at oversize and invalid measurements', () => {
  checkBudget(100, 100, 'asset')
  for (const value of [101, NaN, -1]) assert.throws(() => checkBudget(value, 100, 'asset'))
})
test('HTTP sampler measures gzip wire bytes, handles 304, refuses redirects and size excess', async () => {
  const body = Buffer.from('local fixture '.repeat(100))
  const server = http.createServer((req, res) => {
    if (req.url === '/redirect') { res.writeHead(302, { Location: 'https://external.example/' }); return res.end() }
    if (req.url === '/304') { res.writeHead(304, { 'Content-Encoding': 'gzip' }); return res.end() }
    res.writeHead(200, { 'Content-Encoding': 'gzip' }); res.end(gzipSync(body))
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  try {
    const base = `http://127.0.0.1:${server.address().port}`
    const result = await request(base)
    assert.equal(result.decodedBytes, body.length)
    assert.equal(result.wireBytes, gzipSync(body).length)
    assert.deepEqual(result.body, body)
    assert.ok(result.ttfbMs >= 0)
    assert.equal((await request(base + '/redirect')).status, 302)
    assert.equal((await request(base + '/304')).wireBytes, 0)
    await assert.rejects(request(base, { limit: 20 }))
    await assert.rejects(request(base, { limit: 100 })) // Small compressed body, oversized decoded body.
  } finally { await new Promise(resolve => server.close(resolve)) }
})
