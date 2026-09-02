import http from 'node:http'
import https from 'node:https'
import { gunzipSync, inflateSync } from 'node:zlib'

export function origin(value, { production = false } = {}) {
  const url = new URL(value)
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw new Error('Expected an HTTP(S) origin without credentials, path or query')
  if (production && (url.protocol !== 'https:' || isLocal(url))) throw new Error('Production checks require an explicit public HTTPS origin')
  return url.origin
}

export function isLocal(value) {
  const hostname = new URL(value).hostname
  return ['localhost', '127.0.0.1', '[::1]'].includes(hostname) || hostname.endsWith('.localhost')
}

// Never follow redirects or fetch third-party URLs discovered in content.
export function mapOwnedUrl(value, { front, api, canonical, apiCanonical }) {
  const url = new URL(value, canonical)
  if (url.username || url.password) throw new Error('Resource URL contains credentials')
  const target = url.origin === canonical ? front : url.origin === apiCanonical ? api : [front, api].includes(url.origin) ? url.origin : null
  if (!target) throw new Error(`Resource origin outside configured website/API: ${url.origin}`)
  return target + url.pathname + url.search
}

export function request(url, { method = 'GET', headers = {}, limit = 4 * 1024 * 1024 } = {}) {
  return new Promise((resolve, reject) => {
    const started = performance.now()
    const req = (new URL(url).protocol === 'https:' ? https : http).request(url, { method, headers: { 'Accept-Encoding': 'gzip', ...headers } }, (res) => {
      const ttfbMs = performance.now() - started
      const chunks = []
      let wireBytes = 0
      res.on('data', (chunk) => {
        wireBytes += chunk.length
        if (wireBytes > limit) res.destroy(new Error('Response exceeds audit size limit'))
        else chunks.push(chunk)
      })
      res.on('error', reject)
      res.on('end', () => {
        try {
          let body = Buffer.concat(chunks)
          if (body.length && res.headers['content-encoding'] === 'gzip') body = gunzipSync(body, { maxOutputLength: limit })
          else if (body.length && res.headers['content-encoding'] === 'deflate') body = inflateSync(body, { maxOutputLength: limit })
          resolve({ status: res.statusCode, headers: res.headers, body, wireBytes, decodedBytes: body.length, ttfbMs: Math.round(ttfbMs * 100) / 100 })
        } catch (error) { reject(error) }
      })
    })
    req.setTimeout(15000, () => req.destroy(new Error('Audit request timed out')))
    req.on('error', reject)
    req.end()
  })
}

export function initialState(html) {
  const match = html.match(/<script\b[^>]*\bid="rm-initial-state"[^>]*>([\s\S]*?)<\/script>/)
  if (!match) throw new Error('Missing PHP initial state (do not use Vite dev/preview)')
  return JSON.parse(match[1])
}

export function median(values) {
  if (!values.length || values.some(value => !Number.isFinite(value))) throw new Error('Invalid measurement samples')
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2
}

export function decodeHtml(value) {
  return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
}

export function metaValue(html, name) {
  const tags = html.match(/<meta\b[^>]*>/g) || []
  const tag = tags.find(value => value.includes(`name="${name}"`) || value.includes(`property="${name}"`))
  return decodeHtml(tag?.match(/\bcontent="([^"]*)"/)?.[1] || '')
}

export function checkBudget(value, maximum, label) {
  if (!Number.isFinite(value) || value < 0 || !Number.isFinite(maximum) || maximum <= 0 || value > maximum) throw new Error(`${label}: ${value} bytes exceeds/invalid budget ${maximum}`)
}
