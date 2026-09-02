import test from 'node:test'
import assert from 'node:assert/strict'
import { createResourceCache, PUBLIC_TTL } from '../src/common/resourceCache.js'

const deferred = () => { let resolve, reject; const promise = new Promise((a,b) => { resolve=a; reject=b }); return { promise, resolve, reject } }

test('initial HTML data is synchronous, reused until TTL, and refreshed without resetting its clock', async () => {
  let now=1000, calls=0
  const cache=createResourceCache(async () => ({ revision: ++calls }), () => now)
  cache.prime('/home', { revision: 0 })
  assert.deepEqual(cache.peek('/home'), { revision: 0 })
  now+=PUBLIC_TTL-1
  assert.equal((await cache.get('/home')).revision,0)
  assert.equal(calls,0)
  now++
  assert.equal((await cache.get('/home')).revision,1)
  assert.equal(calls,1)
})
test('concurrent consumers share one network request, first load is foreground', async () => {
  const task=deferred(); let calls=0, foreground
  const cache=createResourceCache((path, options) => { calls++; foreground=options.foreground; return task.promise })
  const a=cache.get('/home'), b=cache.get('/home')
  assert.equal(a,b)
  task.resolve({ value: 1 }); await a
  assert.equal(calls,1); assert.equal(foreground,true)
})
test('stale data remains visible during refresh, subscribers receive the committed response', async () => {
  let now=0, foreground; const task=deferred(), observed=[]
  const cache=createResourceCache((key, options) => { foreground=options.foreground; return task.promise }, () => now)
  cache.prime('/home', 'old')
  const unsubscribe=cache.subscribe('/home', data => observed.push(data))
  now=PUBLIC_TTL
  const pending=cache.get('/home')
  assert.equal(cache.peek('/home'),'old')
  task.resolve('new'); await pending
  assert.equal(foreground,false); assert.deepEqual(observed,['new'])
  unsubscribe(); cache.prime('/home','later'); assert.deepEqual(observed,['new'])
})
test('forced revalidation supersedes older in-flight data and does not duplicate another forced call', async () => {
  const old=deferred(), fresh=deferred(); let calls=0
  const cache=createResourceCache(() => (++calls===1 ? old : fresh).promise)
  const a=cache.get('/home'); await Promise.resolve()
  const b=cache.get('/home',{force:true}), c=cache.get('/home',{force:true})
  assert.equal(b,c)
  fresh.resolve('fresh'); await b
  old.resolve('obsolete'); await a
  assert.equal(cache.peek('/home'),'fresh'); assert.equal(calls,2)
})
test('temporary errors do not renew TTL or poison the next retry', async () => {
  let now=0, calls=0
  const cache=createResourceCache(async () => { if (++calls===1) throw new Error('offline'); return 'new' }, () => now)
  cache.prime('/home','old'); now=PUBLIC_TTL
  await assert.rejects(cache.get('/home'), /offline/)
  assert.equal(cache.peek('/home'),'old'); assert.equal(cache.savedAt('/home'),0)
  assert.equal(await cache.get('/home'),'new')
})
test('confirmed deletion evicts the cached case; a failed late request cannot evict a newer result', async () => {
  const cache=createResourceCache(async () => { throw Object.assign(new Error('missing'),{status:404}) })
  cache.prime('/works/1',{title:'deleted'})
  await assert.rejects(cache.get('/works/1',{force:true}))
  assert.equal(cache.peek('/works/1'),null)
  const old=deferred(), fresh=deferred(); let count=0
  const race=createResourceCache(() => (++count===1?old:fresh).promise)
  const a=race.get('/works/2'); await Promise.resolve()
  const b=race.get('/works/2',{force:true}); fresh.resolve('current'); await b
  old.reject(Object.assign(new Error('late'),{status:404})); await assert.rejects(a)
  assert.equal(race.peek('/works/2'),'current')
})
test('press page snapshots are separate cache keys and server timestamps count toward TTL', async () => {
  let calls=0
  const cache=createResourceCache(async () => ++calls, () => PUBLIC_TTL+5)
  cache.prime('/pages/press?page=2','second page',10)
  assert.equal(await cache.get('/pages/press?page=2'),'second page')
  assert.equal(await cache.get('/pages/press'),1)
  cache.prime('/old-html','expired',0)
  assert.equal(await cache.get('/old-html'),2)
})
