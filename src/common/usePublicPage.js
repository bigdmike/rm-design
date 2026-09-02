import { computed, readonly, ref, toValue, watch } from 'vue'
import { publicCache, getPublicPage, publicPagePath } from './publicApi.js'
import { useVisibleRefresh } from './useVisibleRefresh.js'

const entries = new Map()
function entryFor(page, number = 1) {
  const path = publicPagePath(page, number)
  if (!entries.has(path)) {
    const entry = { data: ref(publicCache.peek(path)), loading: ref(false), error: ref(null), version: 0 }
    publicCache.subscribe(path, (data) => { entry.data.value = data })
    entries.set(path, entry)
  }
  return entries.get(path)
}
export function publicPageData(page, number = 1) { return readonly(entryFor(page, number).data) }

export async function loadPublicPage(page, { force = false, number = 1 } = {}) {
  const entry = entryFor(page, number)
  const version = ++entry.version
  entry.loading.value = true
  try {
    const data = await getPublicPage(page, { force, number })
    if (version === entry.version) entry.error.value = null
    return data
  } catch (error) {
    if (version === entry.version) entry.error.value = error
    throw error
  } finally {
    if (version === entry.version) entry.loading.value = false
  }
}

export function usePublicPage(page, number = 1) {
  const entry = computed(() => toValue(page) ? entryFor(toValue(page), toValue(number)) : null)
  const load = (force = false) => toValue(page)
    ? loadPublicPage(toValue(page), { force, number: toValue(number) }) : Promise.resolve(null)
  watch([() => toValue(page), () => toValue(number)], () => load().catch(() => {}), { immediate: true })
  useVisibleRefresh(() => load())
  return {
    pageData: computed(() => entry.value?.data.value ?? null),
    loading: computed(() => entry.value?.loading.value ?? false),
    error: computed(() => entry.value?.error.value ?? null),
    reload: () => load(true),
  }
}
