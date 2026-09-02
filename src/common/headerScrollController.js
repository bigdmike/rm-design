// Geometry is refreshed on layout/content changes, never by ordinary scroll events.
export class HeaderScrollController {
  constructor(rules, defaultStyle, apply, win = window, doc = document) {
    Object.assign(this, { rules, defaultStyle, apply, win, doc, points: [], dirty: true, frame: null, destroyed: false })
    this.scroll = () => this.schedule(false)
    this.layout = () => this.schedule(true)
  }
  measure() {
    const nodes = this.rules.map(rule => ({ rule, node: this.doc.querySelector(rule.selector) })).filter(item => item.node)
    this.points = nodes.map(({ rule, node }) => ({ style: rule.style, y: node.getBoundingClientRect().top + this.win.scrollY - (rule.offset ?? 0) })).sort((a, b) => a.y - b.y)
    const targets = new Set([this.doc.body, ...this.doc.querySelectorAll('main, main > *'), ...nodes.map(item => item.node)])
    // Keep the observed set stable so observe() does not create a measurement loop.
    for (const node of this.observed || []) if (!targets.has(node)) this.resizeObserver?.unobserve(node)
    for (const node of targets) if (!this.observed?.has(node)) this.resizeObserver?.observe(node)
    this.observed = targets
    this.dirty = false
  }
  update() {
    if (this.dirty) this.measure()
    let style = this.defaultStyle
    for (const point of this.points) { if (this.win.scrollY < point.y) break; style = point.style }
    this.apply(style)
  }
  schedule(layout) {
    if (this.destroyed) return
    this.dirty ||= layout
    if (this.frame !== null) return
    this.frame = this.win.requestAnimationFrame(() => { this.frame = null; if (!this.destroyed) this.update() })
  }
  init() {
    if (this.win.ResizeObserver) this.resizeObserver = new this.win.ResizeObserver(this.layout)
    if (this.win.MutationObserver) {
      this.mutationObserver = new this.win.MutationObserver(this.layout)
      this.mutationObserver.observe(this.doc.getElementById('app') || this.doc.body, { childList: true, subtree: true, characterData: true })
    }
    this.update()
    this.win.addEventListener('scroll', this.scroll, { passive: true })
    this.win.addEventListener('resize', this.layout)
    this.doc.addEventListener('load', this.layout, true)
    this.doc.fonts?.addEventListener('loadingdone', this.layout)
    this.doc.fonts?.ready.then(this.layout)
  }
  destroy() {
    this.destroyed = true
    if (this.frame !== null) this.win.cancelAnimationFrame(this.frame)
    this.win.removeEventListener('scroll', this.scroll)
    this.win.removeEventListener('resize', this.layout)
    this.doc.removeEventListener('load', this.layout, true)
    this.doc.fonts?.removeEventListener('loadingdone', this.layout)
    this.resizeObserver?.disconnect()
    this.mutationObserver?.disconnect()
  }
}
