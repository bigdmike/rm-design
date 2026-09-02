import { onMounted, onBeforeUnmount } from 'vue'

// Recheck visible pages only. Shared TTL deduplicates requests across consumers.
export function useVisibleRefresh(refresh) {
  const run = () => {
    if (document.visibilityState === 'visible') Promise.resolve(refresh()).catch(() => {})
  }
  let timer
  onMounted(() => {
    timer = window.setInterval(run, 15_000)
    window.addEventListener('focus', run)
    document.addEventListener('visibilitychange', run)
  })
  onBeforeUnmount(() => {
    window.clearInterval(timer)
    window.removeEventListener('focus', run)
    document.removeEventListener('visibilitychange', run)
  })
}
