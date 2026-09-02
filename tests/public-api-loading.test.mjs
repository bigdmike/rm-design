import test from 'node:test'
import assert from 'node:assert/strict'
import { createPinia, setActivePinia } from 'pinia'
import { useUIStore } from '../src/store/index.js'

globalThis.document={getElementById:()=>({textContent:JSON.stringify({apiOrigin:'http://localhost:8081',requestPath:'/'})})}
const timers=new Map(); let timerId=0
globalThis.window={setTimeout:callback=>{timers.set(++timerId,callback);return timerId},clearTimeout:id=>timers.delete(id)}
const api=await import('../src/common/publicApi.js')
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b});return {promise,resolve,reject}}
const json=data=>new Response(JSON.stringify(data),{headers:{'Content-Type':'application/json'}})

test('foreground public requests deduplicate, increment once, and always clear both loading counts',async()=>{
  setActivePinia(createPinia()); const ui=useUIStore(), task=deferred(); let calls=0
  globalThis.fetch=()=>{calls++;return task.promise}
  const a=api.getPublicJson('/pages/foreground'),b=api.getPublicJson('/pages/foreground')
  await Promise.resolve()
  assert.equal(ui.loadingCount,1); assert.equal(ui.pageLoadingCount,1)
  task.resolve(json({page:'foreground'})); await Promise.all([a,b])
  assert.equal(calls,1); assert.equal(ui.loadingCount,0);assert.equal(ui.pageLoadingCount,0);assert.equal(timers.size,0)
})
test('private form token, submit and background refresh never activate the whole-page skeleton',async()=>{
  setActivePinia(createPinia()); const ui=useUIStore()
  for(const run of [()=>api.getContactForm(),()=>api.submitContactInquiry({name:'test'}),()=>api.getPublicJson('/pages/foreground',{force:true})]) {
    const task=deferred();globalThis.fetch=()=>task.promise
    const pending=run();await Promise.resolve()
    assert.equal(ui.loadingCount,1);assert.equal(ui.pageLoadingCount,0)
    task.resolve(json({ok:true}));await pending
    assert.equal(ui.loadingCount,0);assert.equal(timers.size,0)
  }
})
test('network and API errors clear loading counts without automatically resending',async()=>{
  setActivePinia(createPinia());const ui=useUIStore();let calls=0
  globalThis.fetch=async()=>{calls++;throw new Error('offline')}
  await assert.rejects(api.getPublicJson('/pages/network-error'),/offline/)
  assert.equal(calls,1);assert.equal(ui.loadingCount,0);assert.equal(ui.pageLoadingCount,0)
  globalThis.fetch=async()=>new Response(JSON.stringify({error:{code:'NOT_FOUND',message:'missing'}}),{status:404})
  await assert.rejects(api.getPublicJson('/pages/missing'),error=>error.status===404)
  assert.equal(ui.loadingCount,0);assert.equal(ui.pageLoadingCount,0);assert.equal(timers.size,0)
})
test('15-second request timeout releases loading; uncertain submissions are not retried',async()=>{
  setActivePinia(createPinia());const ui=useUIStore();let calls=0
  globalThis.fetch=(url,{signal})=>{calls++;return new Promise((resolve,reject)=>signal.addEventListener('abort',()=>reject(new Error('aborted'))))}
  const pending=api.submitContactInquiry({name:'test'})
  const rejection=assert.rejects(pending,error=>error.code==='REQUEST_TIMEOUT' && error.message.includes('請勿連續重複送出'))
  for(const callback of timers.values()) callback()
  await rejection
  assert.equal(calls,1);assert.equal(ui.loadingCount,0);assert.equal(ui.pageLoadingCount,0);assert.equal(timers.size,0)
})
