// Local-only GET proxy / fault-injection harness. Never packaged into dist.
import http from 'node:http'
import { readFile } from 'node:fs/promises'
import { request } from './launch-support.mjs'
const front = 'http://127.0.0.1:8080', api = 'http://127.0.0.1:8081'
const port = 5176
function installFixture() {
  const nativeFetch = window.fetch.bind(window)
  const fixture = window.__launchFixture = { mode: 'normal', target: '', calls: [] }
  window.fetch = async (input, init = {}) => {
    const url = new URL(typeof input === 'string' ? input : input.url, location.href)
    const method = (init.method || input?.method || 'GET').toUpperCase()
    if (method !== 'GET' && method !== 'HEAD') throw new Error('Read-only launch fixture blocks writes')
    if (!url.pathname.startsWith('/api/v1/')) return nativeFetch(input, init)
    if (!['localhost', '127.0.0.1', 'rm-api.localhost'].includes(url.hostname)) throw new Error('Unexpected API host')
    fixture.calls.push({ path: url.pathname + url.search, mode: fixture.mode })
    if (url.pathname === fixture.target) {
      if (fixture.mode === 'delay') await new Promise(resolve => setTimeout(resolve, 2000))
      if (fixture.mode === 'error') return new Response(JSON.stringify({ error: { message: '驗收用暫時錯誤', code: 'SERVICE_UNAVAILABLE' } }), { status: 503, headers: { 'Content-Type': 'application/json' } })
    }
    return nativeFetch('/__api' + url.pathname + url.search, init)
  }
  // A test user cannot accidentally send the live contact form from this fixture.
  document.addEventListener('submit', event => { event.preventDefault(); event.stopImmediatePropagation() }, true)
}
const hook = `<script data-launch-test>(${installFixture.toString()})()</script>`
const server = http.createServer(async (req, res) => {
  try {
    if (!['127.0.0.1:' + port, 'localhost:' + port].includes(req.headers.host)) { res.writeHead(403); return res.end() }
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }); return res.end() }
    const url = new URL(req.url, 'http://127.0.0.1:' + port)
    const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow', 'X-Content-Type-Options': 'nosniff' }
    if (url.pathname === '/__qa' || url.pathname === '/__qa/layout') {
      const name = url.pathname.endsWith('/layout') ? 'initial-content-preview.html' : 'launch-browser.html'
      const body = await readFile(new URL(name, import.meta.url))
      res.writeHead(200, { ...headers, 'Content-Type': 'text/html; charset=utf-8' }); return res.end(req.method === 'HEAD' ? undefined : body)
    }
    const isApi = url.pathname.startsWith('/__api/')
    const path = isApi ? url.pathname.slice('/__api'.length) : url.pathname
    if (isApi && !/^\/api\/v1\/(?:pages\/(?:home|about|works|workflow|press|contact|privacy)|works(?:\/[1-9]\d*)?|work-categories|contact-form)$/.test(path)) { res.writeHead(403, headers); return res.end() }
    const upstream = await request((isApi ? api : front) + path + url.search, { method: req.method, headers: req.headers.range ? { Range: req.headers.range } : {}, limit: 16 * 1024 * 1024 })
    let body = upstream.body
    const type = upstream.headers['content-type'] || 'application/octet-stream'
    if (!isApi && type.includes('text/html')) body = Buffer.from(body.toString().replace(/<head\b[^>]*>/, '$&' + hook))
    if (upstream.headers['content-range']) headers['Content-Range'] = upstream.headers['content-range']
    // Deliberately never forward cookies, remote redirects, auth or contact tokens to logs.
    res.writeHead(upstream.status, { ...headers, 'Content-Type': type }); res.end(req.method === 'HEAD' ? undefined : body)
  } catch { res.writeHead(502, { 'Cache-Control': 'no-store' }); res.end('Local fixture upstream unavailable') }
})
server.listen(port, '127.0.0.1', () => console.log(`Read-only browser fixture: http://127.0.0.1:${port}/__qa (Ctrl+C to stop). Synthetic delay is NOT real network/CPU throttling.`))
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => { server.close(); server.closeAllConnections() })
