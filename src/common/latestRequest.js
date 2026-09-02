// Ignore obsolete responses without aborting a request shared by other callers.
export function latestRequest() {
  let version = 0
  return {
    invalidate() { version++ },
    async run(task, { start, success, error, settled } = {}) {
      const current = ++version
      start?.()
      try {
        const result = await task()
        if (version === current) success?.(result)
      } catch (cause) {
        if (version === current) error?.(cause)
      } finally {
        if (version === current) settled?.()
      }
    },
  }
}
