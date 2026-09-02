const trackingKeys = new Set(['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id', 'utm_source_platform', 'utm_creative_format', 'utm_marketing_tactic', 'gclid', 'dclid', 'fbclid', 'msclkid', 'gbraid', 'wbraid'])
const pages = { '/': 'home', '/about': 'about', '/works': 'works', '/workflow': 'workflow', '/press': 'press', '/contact': 'contact', '/privacy-policy': 'privacy' }

// Keep this contract aligned with PublicUrl.php; both run the same URL fixtures.
export function parsePublicUrl(fullPath) {
  const withoutHash = fullPath.split('#', 1)[0]
  const question = withoutHash.indexOf('?')
  const path = question < 0 ? withoutHash : withoutHash.slice(0, question)
  const search = question < 0 ? '' : withoutHash.slice(question + 1)
  const match = /^\/works\/([1-9][0-9]{0,9})$/.exec(path)
  const id = match && Number(match[1]) <= 4294967295 ? Number(match[1]) : null
  const key = id !== null ? 'work' : pages[path]
  if (!key) return null
  const allowed = new Set(path === '/works' ? ['category', 'page'] : path === '/press' ? ['page'] : [])
  const query = new Map()
  for (const [name, value] of new URLSearchParams(search)) {
    if (query.has(name) || (!allowed.has(name) && !trackingKeys.has(name)) || /[\x00-\x1f\x7f]/.test(value)) return null
    query.set(name, value)
  }
  const page = query.get('page') ?? '1'
  const category = query.get('category') ?? 'all'
  if (!/^[1-9][0-9]{0,5}$/.test(page) || Number(page) > 100000) return null
  if (category !== 'all' && (!/^[1-9][0-9]{0,9}$/.test(category) || Number(category) > 4294967295)) return null
  return { path, key, id, category, page: Number(page), canonicalPath: listingPath(path, Number(page), category) }
}

export function listingPath(path, page = 1, category = 'all') {
  const query = new URLSearchParams()
  if (path === '/works' && category !== 'all') query.set('category', category)
  if (['/works', '/press'].includes(path) && page !== 1) query.set('page', String(page))
  return path + (query.size ? `?${query}` : '')
}

export const outOfRange = (pagination) => pagination.page > Math.max(1, pagination.totalPages)
export const isMissing = (error) => error?.status === 404 || error?.status === 422
export const initialNotFound = (initial, fullPath) => initial?.status === 404 && initial.requestPath === fullPath.split('#', 1)[0]

export function paginationPages(current, total, maxShown = 5) {
  if (total <= 1) return []
  const radius = Math.floor(maxShown / 2)
  const pages = new Set([1, total])
  for (let page = Math.max(1, current - radius); page <= Math.min(total, current + radius); page++) pages.add(page)
  return [...pages].sort((a, b) => a - b)
}
