<script setup>
import { computed } from 'vue';
import { useUIStore } from '../store/index';
import { usePublicPage } from '../common/usePublicPage.js';

const uiStore = useUIStore();
uiStore.setHeaderStyle('cream');
const { pageData, error, reload } = usePublicPage('privacy');
const section = computed(() => pageData.value?.sections?.['privacy.content']);
</script>

<template>
  <main v-if="section" id="terms-page">
    <div class="main-container">
      <div class="title-box">
        <p class="sub-title">( {{ section.content.subtitle }} )</p>
        <h1 class="title">{{ section.content.title }}</h1>
      </div>
      <div class="content editor-content" v-html="section.content.body_html"></div>
    </div>
  </main>
  <main v-else-if="error" class="main-container py-30">
    <p>隱私權政策暫時無法載入。</p>
    <button type="button" @click="reload">重新載入</button>
  </main>
</template>
