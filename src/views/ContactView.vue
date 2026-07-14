<script setup>
import { useUIStore } from "../store/index";
import HeaderSection from '../components/workList/HeaderSection.vue';
import FormSection from '../components/contact/FormSection.vue';

const uiStore = useUIStore();
uiStore.setHeaderStyle("cream");
</script>

<template>
    <main id="contact-page">
        <HeaderSection title="聯絡我們" subTitle="( CONTACT US )" content="" class="text-center" />
        <FormSection />
    </main>
</template>