export function workBreadcrumbs(canonicalPath, category = null, work = null) {
  const items = [{ name: '首頁', path: '/' }, { name: '設計案例', path: '/works' }]
  if (category) items.push({ name: category.name, path: `/works?category=${category.id}` })
  if (work) items.push({ name: work.title, path: canonicalPath })
  // The current listing can be a later page; never point its final item at page one.
  items[items.length - 1] = { ...items.at(-1), path: canonicalPath }
  return items
}

export function breadcrumbSchema(items, origin) {
  return { '@type': 'BreadcrumbList', itemListElement: items.map((item, index) => ({
    '@type': 'ListItem', position: index + 1, name: item.name, item: origin + item.path,
  })) }
}
