<script setup>
import { ref } from "vue";
import MainButton from "./MainButton.vue";

const accepted = ref(false);
defineProps({ content: { type: Object, default: null } });
</script>

<template>
  <div v-if="content" id="site-privacy-dialog" :class="accepted ? 'active' : ''">
    <div class="content-box">
      <p class="preserve-whitespace">
        {{ content?.body_text }}
        <router-link to="/privacy-policy">{{ content?.link_label || '隱私政策' }}</router-link>
      </p>
      <div class="button-box">
        <MainButton
          type="button"
          color="primary"
          :text="content?.button_label || 'ACCEPT'"
          @click="accepted = true"
        />
      </div>
    </div>
  </div>
</template>
