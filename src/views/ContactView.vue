<script setup>
import { computed } from 'vue';
import { useUIStore } from "../store/index";
import { usePublicPage } from '../common/usePublicPage.js';
import HeaderSection from '../components/workList/HeaderSection.vue';
import FormSection from '../components/contact/FormSection.vue';

const uiStore = useUIStore();
uiStore.setHeaderStyle("cream");
const { pageData, error, reload } = usePublicPage('contact');
const header = computed(() => pageData.value?.sections?.['contact.header']);
</script>

<template>
    <main v-if="pageData && header" id="contact-page">
        <HeaderSection :title="header.content.title" :subTitle="header.content.subtitle" :content="header.content.body_text" class="text-center" />
        <FormSection />
    </main>
    <main v-else-if="error" class="main-container py-30"><p>頁面內容暫時無法載入。</p><button type="button" @click="reload">重新載入</button></main>
</template>
