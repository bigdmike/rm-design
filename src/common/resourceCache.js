export const PUBLIC_TTL = 60_000

/** One freshness clock; older requests cannot overwrite a forced refresh. */
export function createResourceCache(fetchResource, now = Date.now) {
  const entries = new Map()
  const entry = (key) => {
    if (!entries.has(key)) entries.set(key, { generation: 0, listeners: new Set() })
    return entries.get(key)
  }
  const notify = (item) => item.listeners.forEach((listener) => listener(item.data))
  return {
    peek: (key) => entry(key).data ?? null,
    savedAt: (key) => entry(key).savedAt,
    subscribe(key, listener) {
      entry(key).listeners.add(listener)
      return () => entry(key).listeners.delete(listener)
    },
    prime(key, data, savedAt = now()) {
      const item = entry(key)
      if (item.savedAt !== undefined && item.savedAt > savedAt) return
      item.generation++
      Object.assign(item, { data, savedAt })
      notify(item)
    },
    get(key, { force = false, maxAge = PUBLIC_TTL } = {}) {
      const item = entry(key)
      if (!force && item.savedAt !== undefined && now() - item.savedAt < maxAge) return Promise.resolve(item.data)
      if (item.pending && (!force || item.forced)) return item.pending
      const generation = ++item.generation
      item.forced = force
      const promise = Promise.resolve().then(() => fetchResource(key, { foreground: item.data == null }))
        .then((data) => {
          if (generation === item.generation) {
            Object.assign(item, { data, savedAt: now() })
            notify(item)
          }
          return data
        }).catch((error) => {
          // Never resurrect a resource that the server has confirmed was removed.
          if (generation === item.generation && [404, 410].includes(error.status)) {
            item.data = null
            item.savedAt = undefined
            notify(item)
          }
          throw error
        }).finally(() => {
          if (item.pending === promise) { item.pending = null; item.forced = false }
        })
      item.pending = promise
      return promise
    },
  }
}
