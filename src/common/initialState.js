let cached
export function getInitialState() {
  if (cached !== undefined) return cached
  const element = document.getElementById('rm-initial-state')
  if (!element) return (cached = null)
  try { cached = JSON.parse(element.textContent || 'null') } catch { cached = null }
  return cached
}
