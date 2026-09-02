import { inject, onBeforeUnmount, provide, shallowRef, watchEffect } from 'vue'
import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'
import { headEntries } from './seo.js'

const routeSeoKey = Symbol('route-seo')

// App is the only head owner. Views publish route-scoped data, never head tags.
export function provideRouteSeo() {
  const entry = shallowRef(null)
  provide(routeSeoKey, entry)
  return entry
}

export function usePageMetaHead(seo) {
  useHead(() => headEntries(seo.value))
}

export function useRouteSeo(resolve) {
  const target = inject(routeSeoKey)
  const route = useRoute()
  const record = route.matched.at(-1)
  const owner = Symbol('page')
  watchEffect(() => {
    if (route.matched.at(-1) !== record) return
    target.value = { owner, key: route.fullPath, seo: resolve() }
  }, { flush: 'sync' })
  onBeforeUnmount(() => { if (target.value?.owner === owner) target.value = null })
}
