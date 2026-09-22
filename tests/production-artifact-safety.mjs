const localOriginPattern = /(?:https?:)?\/\/(?:[a-z0-9-]+\.)*localhost(?::\d+)?(?:[/?#]|$)|(?:https?:)?\/\/127(?:\.\d{1,3}){3}(?::\d+)?(?:[/?#]|$)|(?:https?:)?\/\/\[::1\](?::\d+)?(?:[/?#]|$)/i

export function containsLocalOrigin(value) {
  return localOriginPattern.test(value)
}
