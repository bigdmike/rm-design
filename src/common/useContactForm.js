import { computed, ref } from 'vue'

const limits = { name: 100, phone: 50, lineID: 100, email: 254, location: 300, houseType: 100, houseAge: 50, budget: 100, contactTime: 50, remarks: 5000 }

// Shared by the actual form and its request-lifecycle tests. No persistence/PII logs.
export function useContactForm({ getForm, submit }) {
  const formData = ref(Object.fromEntries(Object.keys(limits).map(key => [key, ''])))
  const errors = ref(Object.fromEntries(Object.keys(limits).map(key => [key, false])))
  const formConfig = ref(null), sending = ref(false), tokenLoading = ref(false)
  const statusMessage = ref(''), submitError = ref(''), tokenError = ref('')
  const options = computed(() => formConfig.value?.options || { houseType: [], budget: [], contactTime: [] })

  async function refreshFormToken() {
    if (tokenLoading.value) return
    tokenLoading.value = true
    try {
      const next = await getForm()
      if (!next?.formToken || !next?.submissionKey) throw new Error('Invalid form metadata')
      // Token renewal must not replace the idempotency key of an unconfirmed attempt.
      formConfig.value = { ...next, submissionKey: formConfig.value?.submissionKey || next.submissionKey }
      tokenError.value = ''
    } catch (error) {
      tokenError.value = '表單驗證資料載入失敗，請重新載入驗證資料後再試。'
      throw error
    } finally { tokenLoading.value = false }
  }

  function validateForm() {
    for (const [key, max] of Object.entries(limits)) errors.value[key] = [...formData.value[key]].length > max
    for (const key of ['name', 'phone', 'email', 'contactTime']) {
      if (!formData.value[key].trim()) errors.value[key] = true
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.value.email.trim())) errors.value.email = true
    return !Object.values(errors.value).some(Boolean)
  }

  async function sendFormData() {
    if (sending.value || tokenLoading.value) return
    statusMessage.value = ''; submitError.value = ''
    if (!validateForm() || !formConfig.value || tokenError.value) return
    sending.value = true
    try {
      const result = await submit({ ...formData.value, submissionKey: formConfig.value.submissionKey, formToken: formConfig.value.formToken, website: '' })
      if (result?.success !== true) throw new Error('尚無法確認收件結果，請保留原內容後重試。')
      statusMessage.value = result.message || '已收到您的詢問。'
      Object.keys(formData.value).forEach(key => { formData.value[key] = '' })
      // This attempt is confirmed. Invalidate its key before preparing a new inquiry.
      formConfig.value = null
      await refreshFormToken().catch(() => {})
    } catch (error) {
      Object.keys(error.fields || {}).forEach(key => { if (key in errors.value) errors.value[key] = true })
      submitError.value = error.code === 'FORM_TOO_FAST' ? '請稍候幾秒後再送出。' : (error.message || '送出失敗，請稍後重試。')
      if (error.code === 'FORM_TOKEN_EXPIRED') {
        await refreshFormToken().then(() => { submitError.value = '驗證碼已更新，請稍候幾秒後再送出，原填寫內容已保留。' }).catch(() => {})
      }
    } finally { sending.value = false }
  }

  return { formData, errors, formConfig, sending, tokenLoading, statusMessage, submitError, tokenError, options, refreshFormToken, sendFormData, validateForm }
}
