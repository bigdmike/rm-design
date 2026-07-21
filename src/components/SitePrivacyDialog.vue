<script setup>
import { ref } from "vue";
import MainButton from "./MainButton.vue";

const accepted = ref(false);
</script>

<template>
  <div id="site-privacy-dialog" :class="accepted ? 'active' : ''">
    <div class="content-box">
      <p>
        我們使用 Cookie
        來確保您在網站上能獲得良好的體驗。如果您繼續使用本網站，我們將認定您接受並理解我們的
        <a href="/terms/site_privacy" aria-current="page">隱私政策</a>。
      </p>
      <div class="button-box">
        <MainButton
          type="button"
          color="primary"
          text="ACCEPT"
          @click="accepted = true"
        />
      </div>
    </div>
  </div>
</template>
