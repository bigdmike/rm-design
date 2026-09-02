// Read-only HTTP checks; never submits a contact inquiry or changes admin data.
import assert from 'node:assert/strict'
const base=process.argv[2]||'http://127.0.0.1:8081'
assert.ok(['localhost','127.0.0.1','rm-api.localhost'].includes(new URL(base).hostname))
let count=0
for(const page of ['home','about','works','workflow','press','contact','privacy']) {
  const response=await fetch(base+'/api/v1/pages/'+page)
  assert.equal(response.status,200)
  assert.match(response.headers.get('cache-control'),/max-age=60, must-revalidate/)
  assert.equal(response.headers.get('set-cookie'),null)
  const data=await response.json()
  assert.ok(data.site.workCategories.items)
  assert.equal(data.sections['shared.video'],undefined)
  if(page==='about') assert.equal(data.data.engineeringCommitments,undefined)
  const etag=response.headers.get('etag')
  const conditional=await fetch(base+'/api/v1/pages/'+page,{headers:{'If-None-Match':etag}})
  assert.equal(conditional.status,304)
  assert.match(conditional.headers.get('cache-control'),/must-revalidate/)
  count++
}
const second=await fetch(base+'/api/v1/pages/press?page=2')
assert.equal(second.status,200)
assert.equal((await second.json()).data.pressItems.pagination.page,2)
for(const path of ['/pages/home?page=2','/pages/press?page=0','/pages/press?page[]=2','/pages/press?page=2&page=1','/pages/press?page=01']) {
  const response=await fetch(base+'/api/v1'+path)
  assert.equal(response.status,422,path)
  assert.match(response.headers.get('cache-control'),/no-store/)
  count++
}
const token=await fetch(base+'/api/v1/contact-form',{headers:{Origin:'http://localhost:8080'}})
assert.equal(token.status,200)
assert.match(token.headers.get('cache-control'),/no-store/)
assert.equal(token.headers.get('etag'),null)
await token.arrayBuffer() // Consume without logging the private token.
console.log(`PASS ${count+2} public bundle / ETag / query / private form cache checks.`)
