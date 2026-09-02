import { getInitialState } from './initialState.js'
import { createResourceCache } from './resourceCache.js'
import { parsePublicUrl } from './publicUrl.js'
import { useUIStore } from '../store/index.js'

const initialState = getInitialState()
const apiOrigin = (
  initialState?.apiOrigin
  || import.meta.env.VITE_API_URL
  || (import.meta.env.DEV ? 'http://localhost:8081' : '')
).replace(/\/$/, '')

export const publicCache = createResourceCache((path, { foreground }) => request(path, { cache: 'no-cache' }, foreground))

export class PublicApiError extends Error {
  constructor(message, options = {}) {
    super(message)
    this.name = 'PublicApiError'
    this.status = options.status || 0
    this.code = options.code || 'REQUEST_FAILED'
    this.fields = options.fields || {}
    this.retryAfter = options.retryAfter || null
  }
}

async function request(path, options = {}, foreground = false) {
  const uiStore = useUIStore()
  uiStore.setLoadingCount(1)
  if (foreground) uiStore.setPageLoadingCount(1)

  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 15_000)
  try {
    const headers = new Headers(options.headers || {})
    headers.set('Accept', 'application/json')
    const response = await fetch(`${apiOrigin}/api/v1${path}`, { ...options, headers, signal: controller.signal })
    const payload = await response.json().catch(() => null)
    if (!response.ok) {
      throw new PublicApiError(payload?.error?.message || '網站資料暫時無法載入。', {
        status: response.status,
        code: payload?.error?.code,
        fields: payload?.error?.fields,
        retryAfter: response.headers.get('Retry-After'),
      })
    }
    if (!payload || typeof payload !== 'object') throw new PublicApiError('網站資料格式不正確。')
    return payload
  } catch (error) {
    if (controller.signal.aborted) throw new PublicApiError(options.method === 'POST' ? '送出連線逾時，尚無法確認結果，請勿連續重複送出。' : '連線逾時，請稍後再試。', { code: 'REQUEST_TIMEOUT' })
    throw error
  } finally {
    window.clearTimeout(timeout)
    uiStore.setLoadingCount(-1)
    if (foreground) uiStore.setPageLoadingCount(-1)
  }
}

export function getPublicJson(path, options) { return publicCache.get(path, options) }
export function publicPagePath(page, number = 1) {
  return '/pages/' + encodeURIComponent(page) + (page === 'press' && number > 1 ? '?page=' + number : '')
}
export function primePublicPage(page, data, savedAt) {
  if (data?.page === page) publicCache.prime(publicPagePath(page, data.data?.pressItems?.pagination?.page), data, savedAt)
}
export function getPublicPage(page, { number = 1, ...options } = {}) {
  return getPublicJson(publicPagePath(page, number), options).then((data) => {
    if (data.site?.workCategories && publicCache.peek(publicPagePath(page, number)) === data) publicCache.prime('/work-categories', data.site.workCategories, publicCache.savedAt(publicPagePath(page, number)))
    return data
  })
}

export function getContactForm() {
  return request('/contact-form')
}

export function submitContactInquiry(payload) {
  return request('/contact-inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

if (initialState) {
  const savedAt = Math.min(Date.now(), initialState.generatedAt || Date.now())
  if (initialState.pageData?.page) primePublicPage(initialState.pageData.page, initialState.pageData, savedAt)
  const categories = initialState.workCategories || initialState.pageData?.site?.workCategories
  if (categories) publicCache.prime('/work-categories', categories, savedAt)
  if (initialState.work) publicCache.prime('/works/' + initialState.work.id, { work: initialState.work }, savedAt)
  const url = parsePublicUrl(initialState.requestPath || '/')
  if (initialState.works && url?.key === 'works') {
    publicCache.prime('/works?' + new URLSearchParams({ category: url.category, page: String(url.page), per_page: '9' }), initialState.works, savedAt)
  }
}
