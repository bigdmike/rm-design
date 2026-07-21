<script setup>
import { ref } from 'vue';
import MainButton from "../MainButton.vue";

const formData = ref({
    name: '',
    phone: '',
    lineID: '',
    email: '',
    location: '',
    houseType: '',
    houseAge: '',
    budget: '',
    contactTime: '',
    remarks: ''
});

const errors = ref({
    name: false,
    phone: false,
    lineID: false,
    email: false,
    location: false,
    houseType: false,
    houseAge: false,
    budget: false,
    contactTime: false,
    remarks: false
});

const validateForm = () => {
    let isValid = true;

    // Reset errors
    for (const key in errors.value) {
        errors.value[key] = false;
    }

    // Validate required fields
    if (!formData.value.name) {
        errors.value.name = true;
        isValid = false;
    }
    if (!formData.value.phone) {
        errors.value.phone = true;
        isValid = false;
    }
    if (!formData.value.email || !/\S+@\S+\.\S+/.test(formData.value.email)) {
        errors.value.email = true;
        isValid = false;
    }
    if (!formData.value.contactTime) {
        errors.value.contactTime = true;
        isValid = false;
    }

    return isValid;
};

const sendFormData = async () => {
    if (validateForm()) {
        // Here you can send the formData to your server or API
        console.log('Form data is valid:', formData.value);
    } else {
        console.log('Form data is invalid:', errors.value);
    }
};

</script>


<template>
    <section id="contact-page-form-section">
        <div class="main-container">
            <form>
                <div class="form-group group-2">
                    <label for="name">姓名*</label>
                    <input type="text" id="name" name="name" required placeholder="您的姓名" v-model="formData.name" />
                    <p v-if="errors.name" class="error-message">請輸入姓名</p>
                </div>
                <div class="form-group group-2">
                    <label for="phone">連絡電話*</label>
                    <input type="tel" id="phone" name="phone" required placeholder="您的連絡電話" v-model="formData.phone" />
                    <p v-if="errors.phone" class="error-message">請輸入連絡電話</p>
                </div>

                <div class="form-group group-2">
                    <label for="lineID">LINE ID</label>
                    <input type="text" id="lineID" name="lineID" placeholder="您的LINE ID" v-model="formData.lineID" />
                    <p v-if="errors.lineID" class="error-message">請輸入LINE ID</p>
                </div>
                <div class="form-group group-2">
                    <label for="email">Email*</label>
                    <input type="email" id="email" name="email" required placeholder="您的Email"
                        v-model="formData.email" />
                    <p v-if="errors.email" class="error-message">請輸入Email</p>
                </div>

                <div class="form-group group-3">
                    <label for="location">物件位置</label>
                    <input type="text" id="location" name="location" placeholder="您的物件位置" v-model="formData.location" />
                    <p v-if="errors.location" class="error-message">請輸入物件位置</p>
                </div>
                <div class="form-group group-3">
                    <label for="houseType">空間類型</label>
                    <div class="select-box">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 9L12 15L18 9" stroke="black" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>

                        <select id="houseType" name="houseType" v-model="formData.houseType">
                            <option value="">請選擇空間類型</option>
                            <option>自地自建 (別墅/廠房/門市)</option>
                            <option>住宅空間</option>
                            <option>商業空間</option>
                            <option>公共空間</option>
                            <option>展場規劃設計/櫃位規畫設計</option>
                        </select>
                    </div>
                    <p v-if="errors.houseType" class="error-message">請輸入空間類型</p>
                </div>
                <div class="form-group group-3">
                    <label for="houseAge">屋齡</label>
                    <input type="text" id="houseAge" name="houseAge" placeholder="您的屋齡" v-model="formData.houseAge" />
                    <p v-if="errors.houseAge" class="error-message">請輸入屋齡</p>
                </div>

                <div class="form-group group-3">
                    <label for="houseType">預算</label>
                    <div class="select-box">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 9L12 15L18 9" stroke="black" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>

                        <select id="budget" name="budget" v-model="formData.budget">
                            <option value="">請選擇預算範圍</option>
                            <option>200 萬 ~ 300 萬</option>
                            <option>300 萬 ~ 400 萬</option>
                            <option>400 萬 ~ 500 萬</option>
                            <option>500 萬 ~ 700 萬</option>
                            <option>700 萬 ~ 1000 萬</option>
                            <option>1000 萬以上</option>
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

                        <select id="contactTime" name="contactTime" v-model="formData.contactTime">
                            <option value="">請選擇方便連絡時段</option>
                            <option>平日上午</option>
                            <option>平日中午</option>
                            <option>平日下午</option>
                            <option>平日晚上</option>
                            <option>週末上午</option>
                            <option>週末下午</option>
                            <option>週末晚上</option>
                        </select>
                    </div>
                    <p v-if="errors.contactTime" class="error-message">請輸入方便連絡時段</p>
                </div>

                <div class="form-group">
                    <label for="remarks">備註</label>
                    <input type="text" id="remarks" name="remarks" placeholder="您的備註" v-model="formData.remarks" />
                    <p v-if="errors.remarks" class="error-message">請輸入備註</p>
                </div>

                <div class="button-box">
                   

                        <MainButton type="button" color="black" text="SEND" @click="sendFormData" />
                </div>
            </form>
        </div>
    </section>
</template>