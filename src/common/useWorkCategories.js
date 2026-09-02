import { ref, readonly } from 'vue'
import { getPublicJson, publicCache } from './publicApi.js'

const data = ref(publicCache.peek('/work-categories'))
publicCache.subscribe('/work-categories', (result) => { data.value = result })
export function loadWorkCategories() { return getPublicJson('/work-categories') }
export function useWorkCategories() {
  // Page bundles carry the shared navigation categories.
  return readonly(data)
}

export function categoryLinks(data) {
  const labels = { residential: 'RESIDENTIAL', architecture: 'ARCHITECTURE', architectural: 'ARCHITECTURE', commercial: 'COMMERCIAL', public: 'PUBLIC' }
  return (data?.items || []).map((item) => ({ ...item, link: `/works?category=${item.id}`, english: labels[item.code] || item.code.toUpperCase() }))
}
