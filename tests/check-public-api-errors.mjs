// Read-only public routes plus preflight checks; never logs in or submits a form.
import assert from 'node:assert/strict'

const base = process.argv[2] || 'http://127.0.0.1:8081'
assert.ok(['localhost', '127.0.0.1', '[::1]', 'rm-api.localhost'].includes(new URL(base).hostname), 'Use a local API URL')
const origin = 'http://localhost:8080'
const cases = [
  { path: '/works', status: 200, cors: true },
  { path: '/works/999999', status: 404, cors: true },
  { path: '/works?category=999', status: 422, cors: true },
  { path: '/works/not-a-number', status: 404, cors: true },
  { path: '/press-items/999999', status: 404, cors: true },
  { path: '/pages/not-a-page', status: 404, cors: true },
  { path: '/admin/not-a-route', status: 404, cors: false },
  { path: '/dev/not-a-route', status: 404, cors: false },
  { path: '/contact-inquiries/not-a-route', status: 404, cors: false },
  { path: '/works', status: 403, cors: false, origin: 'https://untrusted.example' },
  { path: '/works', status: 204, cors: true, method: 'OPTIONS', requestedMethod: 'GET' },
  { path: '/works', status: 403, cors: false, method: 'OPTIONS', requestedMethod: 'POST' },
]
for (const fixture of cases) {
  const response = await fetch(base + '/api/v1' + fixture.path, { method: fixture.method || 'GET', headers: {
    Origin: fixture.origin || origin,
    ...(fixture.requestedMethod ? { 'Access-Control-Request-Method': fixture.requestedMethod } : {}),
  } })
  assert.equal(response.status, fixture.status, fixture.path)
  assert.equal(response.headers.get('access-control-allow-origin'), fixture.cors ? origin : null, fixture.path)
  assert.equal(response.headers.get('access-control-allow-credentials'), null, fixture.path)
  if (fixture.status >= 400) assert.equal(response.headers.get('cache-control'), 'no-store', fixture.path)
  console.log(`PASS: ${fixture.method || 'GET'} ${fixture.path} → ${response.status}, CORS ${fixture.cors ? 'allowed' : 'absent'}`)
}
