<script setup>
import { onMounted, watch } from 'vue';
import MainButton from "../MainButton.vue";
import { getContactForm, submitContactInquiry } from '../../common/publicApi.js';
import { useContactForm } from '../../common/useContactForm.js';
import { useUIStore } from '../../store/index.js';

const uiStore = useUIStore();
const { formData, errors, formConfig, sending, tokenLoading, statusMessage, submitError, tokenError, options, refreshFormToken, sendFormData } = useContactForm({ getForm: getContactForm, submit: submitContactInquiry });
onMounted(() => { refreshFormToken().catch(() => {}); });
watch(statusMessage, (message) => {
    if (message) uiStore.setMessageDialog({ status: true, message });
});

</script>


<template>
    <section id="contact-page-form-section">
        <div class="main-container">
            <form @submit.prevent="sendFormData">
                <div class="form-group group-2">
                    <label for="name">姓名*</label>
                    <input type="text" id="name" name="name" required maxlength="100" :disabled="sending" placeholder="您的姓名" v-model="formData.name" />
                    <p v-if="errors.name" class="error-message">請輸入姓名</p>
                </div>
                <div class="form-group group-2">
                    <label for="phone">連絡電話*</label>
                    <input type="tel" id="phone" name="phone" required maxlength="50" :disabled="sending" placeholder="您的連絡電話" v-model="formData.phone" />
                    <p v-if="errors.phone" class="error-message">請輸入連絡電話</p>
                </div>

                <div class="form-group group-2">
                    <label for="lineID">LINE ID</label>
                    <input type="text" id="lineID" name="lineID" maxlength="100" :disabled="sending" placeholder="您的LINE ID" v-model="formData.lineID" />
                    <p v-if="errors.lineID" class="error-message">請輸入LINE ID</p>
                </div>
                <div class="form-group group-2">
                    <label for="email">Email*</label>
                    <input type="email" id="email" name="email" required maxlength="254" :disabled="sending" placeholder="您的Email"
                        v-model="formData.email" />
                    <p v-if="errors.email" class="error-message">請輸入Email</p>
                </div>

                <div class="form-group group-3">
                    <label for="location">物件位置</label>
                    <input type="text" id="location" name="location" maxlength="300" :disabled="sending" placeholder="您的物件位置" v-model="formData.location" />
                    <p v-if="errors.location" class="error-message">請輸入物件位置</p>
                </div>
                <div class="form-group group-3">
                    <label for="houseType">空間類型</label>
                    <div class="select-box">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 9L12 15L18 9" stroke="black" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>

                        <select id="houseType" name="houseType" :disabled="sending" v-model="formData.houseType">
                            <option value="">請選擇空間類型</option>
                            <option v-for="option in options.houseType" :key="option" :value="option">{{ option }}</option>
                        </select>
                    </div>
                    <p v-if="errors.houseType" class="error-message">請輸入空間類型</p>
                </div>
                <div class="form-group group-3">
                    <label for="houseAge">屋齡</label>
                    <input type="text" id="houseAge" name="houseAge" maxlength="50" :disabled="sending" placeholder="您的屋齡" v-model="formData.houseAge" />
                    <p v-if="errors.houseAge" class="error-message">請輸入屋齡</p>
                </div>

                <div class="form-group group-3">
                    <label for="budget">預算</label>
                    <div class="select-box">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 9L12 15L18 9" stroke="black" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>

                        <select id="budget" name="budget" :disabled="sending" v-model="formData.budget">
                            <option value="">請選擇預算範圍</option>
                            <option v-for="option in options.budget" :key="option" :value="option">{{ option }}</option>
                        </select>
                    </div>
                    <p v-if="errors.budget" class="error-message">請輸入預算範圍</p>
                </div>
                <div class="form-group group-4">
                    <label for="contactTime">方便連絡時段*</label>
                    <div class="select-box">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 9L12 15L18 9" stroke="black" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>

                        <select id="contactTime" name="contactTime" :disabled="sending" v-model="formData.contactTime">
                            <option value="">請選擇方便連絡時段</option>
                            <option v-for="option in options.contactTime" :key="option" :value="option">{{ option }}</option>
                        </select>
                    </div>
                    <p v-if="errors.contactTime" class="error-message">請輸入方便連絡時段</p>
                </div>

                <div class="form-group">
                    <label for="remarks">備註</label>
                    <input type="text" id="remarks" name="remarks" maxlength="5000" :disabled="sending" placeholder="您的備註" v-model="formData.remarks" />
                    <p v-if="errors.remarks" class="error-message">請輸入備註</p>
                </div>

                <div class="button-box">
                        <MainButton type="button" color="black" :disabled="sending || tokenLoading || !formConfig || !!tokenError" :text="sending ? 'SENDING…' : 'SEND'" @click="sendFormData" />
                </div>
                <p v-if="tokenLoading" class="col-span-6 text-center" role="status">正在準備表單，您可以先填寫聯絡資料。</p>
                <button v-else-if="!formConfig || tokenError" type="button" class="col-span-6 text-center" @click="refreshFormToken().catch(() => {})">重新載入表單驗證</button>
                <p v-if="tokenError" class="col-span-6 text-center error-message" role="alert">{{ tokenError }}</p>
                <p v-if="submitError" class="col-span-6 text-center error-message" role="alert">{{ submitError }}</p>
            </form>
        </div>
    </section>
</template>
