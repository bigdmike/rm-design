import { workBreadcrumbs, breadcrumbSchema } from './breadcrumbs.js'

export function pageSeo(page, canonical, categoryName = null) {
  const source = page?.seo
  const resolved = source?.resolved || {}
  const title = (categoryName ? `${categoryName}｜` : '') + (resolved.title || page?.site?.settings?.siteName || 'RM Design')
  const image = resolved.ogImage || page?.site?.settings?.defaultOgImage
  return { title, description: resolved.description ?? '', canonical,
    ogTitle: source?.ogTitle ?? title, ogDescription: resolved.ogDescription ?? '',
    ogImage: image?.url || '', ogImageWidth: image?.width, ogImageHeight: image?.height,
    ogType: 'website', jsonLd: pageSchema(page, canonical, categoryName) }
}

export function pageSchema(page, canonical, categoryName = null) {
  // Relative URLs are supported in unit/fallback metadata but cannot identify an entity.
  if (!canonical.startsWith('https://') && !canonical.startsWith('http://')) return null
  const url = new URL(canonical)
  if (url.pathname === '/works') {
    const category = categoryName ? { id: url.searchParams.get('category'), name: categoryName } : null
    return { '@context': 'https://schema.org', ...breadcrumbSchema(workBreadcrumbs(url.pathname + url.search, category), url.origin) }
  }
  const settings = page?.site?.settings
  if (!['/', '/about', '/contact'].includes(url.pathname) || !settings?.siteName) return null
  const schema = { '@context': 'https://schema.org', '@type': 'Organization', '@id': url.origin + '/#organization', name: settings.siteName, url: url.origin + '/', logo: url.origin + '/img/nav_logo.svg' }
  if (settings.publicEmail) schema.email = settings.publicEmail
  const social = [settings.facebookUrl, settings.instagramUrl].filter(Boolean)
  if (social.length) schema.sameAs = social
  return schema
}

export function errorSeo(origin, siteName = 'RM Design', missing = true, canonicalPath = '/404') {
  const title = missing ? '找不到頁面' : '資料暫時無法載入'
  const description = missing
    ? '這個頁面可能已移動或不存在。返回阜居空間設計首頁，或繼續探索設計案例。'
    : '目前暫時無法取得網站資料，請稍後再試。'
  return { title: `${title}｜${siteName}`, description, canonical: origin + canonicalPath,
    ogTitle: title, ogDescription: description, ogImage: '', ogType: 'website',
    robots: 'noindex,nofollow', jsonLd: null }
}

export function serializeSchema(schema) {
  return JSON.stringify(schema).replace(/</g, '\\u003C').replace(/>/g, '\\u003E').replace(/&/g, '\\u0026').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
}

export function headEntries(seo) {
  const meta = [
    { name: 'description', content: seo.description || '' },
    { name: 'robots', content: seo.robots || 'noindex,nofollow' },
    { property: 'og:locale', content: 'zh_TW' },
    { property: 'og:type', content: seo.ogType || 'website' },
    { property: 'og:title', content: seo.ogTitle ?? seo.title },
    { property: 'og:description', content: seo.ogDescription ?? seo.description ?? '' },
    { property: 'og:url', content: seo.canonical },
    { name: 'twitter:card', content: 'summary_large_image' },
  ]
  if (seo.ogImage) {
    meta.push({ property: 'og:image', content: seo.ogImage })
    if (seo.ogImageWidth && seo.ogImageHeight) meta.push({ property: 'og:image:width', content: String(seo.ogImageWidth) }, { property: 'og:image:height', content: String(seo.ogImageHeight) })
  }
  return { title: seo.title, link: [{ rel: 'canonical', href: seo.canonical }], meta,
    script: seo.jsonLd ? [{ key: 'page-schema', id: 'work-article-schema', type: 'application/ld+json', textContent: serializeSchema(seo.jsonLd) }] : [] }
}
