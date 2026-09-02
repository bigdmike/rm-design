import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { useContactForm } from '../src/common/useContactForm.js'

const meta = (key = 'original', token = 'token') => ({ submissionKey: key, formToken: token, options: { contactTime: ['平日下午'] } })
const valid = { name: '測試', phone: '0912000000', email: 'test@example.test', contactTime: '平日下午' }
const error = (code, fields) => Object.assign(new Error(code), { code, fields })
async function setup(submit, getForm = async () => meta()) {
  const form = useContactForm({ getForm, submit })
  await form.refreshFormToken(); Object.assign(form.formData.value, valid)
  return form
}

test('client validation rejects empty, whitespace and overlong fields without POST', async () => {
  let calls = 0; const f = await setup(async () => { calls++ })
  f.formData.value.name = ' '; await f.sendFormData(); assert.equal(f.errors.value.name, true)
  f.formData.value.name = '字'.repeat(101); await f.sendFormData(); assert.equal(calls, 0)
})
test('success clears confirmed content and acquires a new submission key', async () => {
  let reads = 0, sent
  const f = await setup(async data => { sent = data; return { success: true, message: '已收到您的詢問。' } }, async () => meta(++reads === 1 ? 'original' : 'next'))
  await f.sendFormData()
  assert.equal(sent.submissionKey, 'original'); assert.equal(sent.website, '')
  assert.equal(f.formConfig.value.submissionKey, 'next'); assert.equal(f.formData.value.email, '')
  assert.equal(f.statusMessage.value, '已收到您的詢問。'); assert.equal(f.sending.value, false)
})
test('confirmed receipt remains success when next form metadata fails; old key cannot be reused', async () => {
  let reads = 0, posts = 0
  const f = await setup(async () => { posts++; return { success: true } }, async () => { if (++reads === 2) throw error('OFFLINE'); return meta(reads === 1 ? 'original' : 'next') })
  await f.sendFormData()
  assert.equal(f.statusMessage.value, '已收到您的詢問。'); assert.equal(f.submitError.value, '')
  assert.equal(f.formConfig.value, null); assert.ok(f.tokenError.value)
  Object.assign(f.formData.value, valid); await f.sendFormData(); assert.equal(posts, 1)
  await f.refreshFormToken(); assert.equal(f.formConfig.value.submissionKey, 'next')
})
test('expired token refresh preserves original key and values; no automatic POST retry', async () => {
  let reads = 0, posts = 0, nextPayload
  const f = await setup(async data => { if (++posts === 1) throw error('FORM_TOKEN_EXPIRED'); nextPayload = data; return { success: true } }, async () => meta('key-' + ++reads, 'token-' + reads))
  await f.sendFormData()
  assert.equal(posts, 1); assert.equal(f.formData.value.email, valid.email)
  assert.equal(f.formConfig.value.submissionKey, 'key-1'); assert.equal(f.formConfig.value.formToken, 'token-2')
  await f.sendFormData(); assert.equal(nextPayload.submissionKey, 'key-1'); assert.equal(nextPayload.formToken, 'token-2')
})
test('failed token refresh is retryable without losing the original key', async () => {
  let reads = 0
  const f = await setup(async () => { throw error('FORM_TOKEN_EXPIRED') }, async () => { if (++reads === 2) throw error('OFFLINE'); return meta('key-' + reads) })
  await f.sendFormData(); assert.ok(f.tokenError.value)
  await f.refreshFormToken(); assert.equal(f.formConfig.value.submissionKey, 'key-1'); assert.equal(f.tokenError.value, '')
})
for (const code of ['REQUEST_TIMEOUT', 'NETWORK_ERROR', 'INTERNAL_ERROR', 'SUBMISSION_CONFLICT', 'RATE_LIMITED', 'FORM_TOO_FAST']) {
  test(code + ' preserves form/key for explicit retry', async () => {
    let posts = 0; const f = await setup(async () => { posts++; throw error(code) })
    await f.sendFormData()
    assert.equal(f.formConfig.value.submissionKey, 'original'); assert.equal(f.formData.value.email, valid.email)
    assert.equal(f.sending.value, false); assert.equal(posts, 1); assert.ok(f.submitError.value)
  })
}
test('double submit is locked until request settles', async () => {
  let resolve, posts = 0
  const f = await setup(() => { posts++; return new Promise(r => { resolve = r }) })
  const first = f.sendFormData(); await f.sendFormData(); assert.equal(posts, 1)
  resolve({ success: true }); await first; assert.equal(f.sending.value, false)
})
test('422 field errors and malformed success never clear unconfirmed data', async () => {
  let f = await setup(async () => { throw error('VALIDATION_ERROR', { email: 'invalid' }) })
  await f.sendFormData(); assert.equal(f.errors.value.email, true); assert.equal(f.formData.value.email, valid.email)
  f = await setup(async () => ({})); await f.sendFormData(); assert.equal(f.formConfig.value.submissionKey, 'original'); assert.equal(f.statusMessage.value, '')
})
test('contact success is promoted to the shared MainDialog while errors remain inline', async () => {
  const source = await readFile(new URL('../src/components/contact/FormSection.vue', import.meta.url), 'utf8')
  assert.match(source, /useUIStore\(\)/)
  assert.match(source, /watch\(statusMessage/)
  assert.match(source, /setMessageDialog\(\{\s*status:\s*true,\s*message\s*\}\)/)
  assert.doesNotMatch(source, /v-if="statusMessage"/)
  assert.match(source, /v-if="submitError"[^>]*role="alert"/)
})
