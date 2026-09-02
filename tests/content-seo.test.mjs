import test from 'node:test'
import assert from 'node:assert/strict'
import { workBreadcrumbs, breadcrumbSchema } from '../src/common/breadcrumbs.js'
import { pageSchema, errorSeo, headEntries } from '../src/common/seo.js'
import { HeaderScrollController } from '../src/common/headerScrollController.js'

test('breadcrumb navigation and schema preserve categories, pagination and actual case titles', () => {
  const origin = 'https://example.test'
  const category = { id: 2, name: '住宅空間' }
  const detail = workBreadcrumbs('/works/6', category, { title: '光 & 家' })
  assert.deepEqual(detail.map(item => item.path), ['/', '/works', '/works?category=2', '/works/6'])
  assert.deepEqual(breadcrumbSchema(detail, origin).itemListElement.map(item => [item.position, item.name, item.item]), detail.map((item, i) => [i + 1, item.name, origin + item.path]))
  const schema = pageSchema(null, origin + '/works?category=2&page=3', category.name)
  assert.equal(schema.itemListElement.at(-1).item, origin + '/works?category=2&page=3')
  assert.equal(schema.itemListElement.at(-1).name, '住宅空間')
  assert.equal(pageSchema(null, origin + '/works').itemListElement.length, 2)
})

test('home, about and contact identify the same truthful organization, without invented business facts', () => {
  const page = { site: { settings: { siteName: '阜居空間設計', publicEmail: 'hello@example.test', facebookUrl: 'https://www.facebook.com/example', instagramUrl: null } } }
  const home = pageSchema(page, 'https://example.test/')
  assert.deepEqual(home, pageSchema(page, 'https://example.test/about'))
  assert.deepEqual(home, pageSchema(page, 'https://example.test/contact'))
  assert.equal(home.logo, 'https://example.test/img/nav_logo.svg')
  assert.deepEqual(home.sameAs, ['https://www.facebook.com/example'])
  for (const field of ['address', 'openingHours', 'review', 'aggregateRating']) assert.equal(field in home, false)
  assert.equal(pageSchema(page, 'https://example.test/workflow'), null)
  assert.equal(pageSchema({}, 'https://example.test/'), null)
  assert.deepEqual(headEntries(errorSeo('https://example.test')).script, [])
})

function fixture() {
  const frames = new Map(), listeners = new Map(), observed = new Set()
  let id = 0, reads = 0, queries = 0, updates = 0, style, top = 500, present = true
  const win = { scrollY: 0, requestAnimationFrame: fn => { frames.set(++id, fn); return id }, cancelAnimationFrame: id => frames.delete(id), addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: name => listeners.delete(name) }
  class ResizeObserver { constructor(fn) { this.fn = fn } observe(node) { observed.add(node) } unobserve(node) { observed.delete(node) } disconnect() { observed.clear() } }
  class MutationObserver { constructor(fn) { this.fn = fn } observe() {} disconnect() {} }
  Object.assign(win, { ResizeObserver, MutationObserver })
  const node = { getBoundingClientRect: () => { reads++; return { top: top - win.scrollY } } }
  const doc = { body: {}, getElementById: () => null, querySelector: () => { queries++; return present ? node : null }, querySelectorAll: () => [], addEventListener() {}, removeEventListener() {} }
  const controller = new HeaderScrollController([{ selector: '#content', style: 'black', offset: 20 }], 'cream', value => { style = value; updates++ }, win, doc)
  const flush = () => { const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn()) }
  return { controller, win, frames, listeners, observed, flush, state: () => ({ reads, queries, updates, style }), top: value => { top = value }, present: value => { present = value } }
}

test('100 scroll events coalesce to one update with zero additional layout reads', () => {
  const f = fixture(); f.controller.init()
  const initial = f.state()
  for (let i = 0; i < 100; i++) { f.win.scrollY = i * 10; f.controller.scroll() }
  assert.equal(f.frames.size, 1); f.flush()
  assert.deepEqual(f.state(), { ...initial, style: 'black', updates: initial.updates + 1 })
  f.win.scrollY = 0; f.controller.scroll(); f.flush()
  assert.equal(f.state().style, 'cream')
  f.controller.destroy()
})

test('async content, resized sections and removal refresh geometry; destroy cancels queued work', () => {
  const f = fixture(); f.present(false); f.controller.init()
  f.present(true); f.win.scrollY = 490; f.controller.mutationObserver.fn(); f.flush()
  assert.equal(f.state().style, 'black')
  f.top(800); f.controller.resizeObserver.fn(); f.flush()
  assert.equal(f.state().style, 'cream')
  f.present(false); f.controller.mutationObserver.fn(); f.flush()
  assert.equal(f.observed.size, 1)
  f.controller.layout(); const before = f.state(); f.controller.destroy(); f.flush(); f.controller.layout()
  assert.deepEqual(f.state(), before)
  assert.equal(f.frames.size, 0); assert.equal(f.listeners.size, 0); assert.equal(f.observed.size, 0)
})
