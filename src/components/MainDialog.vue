<script setup>
import { ref, watch, computed } from "vue";
import { useUIStore } from "../store/index.js";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

const uiStore = useUIStore();
const modalStatusClass = ref("");
const message = computed(() => uiStore.messageDialog.message);

const openModal = () => {
  const modalElement = document.querySelector("#main-dialog .dialog-box");
  disableBodyScroll(modalElement);
  modalStatusClass.value = "open";
};
const closeModal = () => {
  const modalElement = document.querySelector("#main-dialog .dialog-box");
  enableBodyScroll(modalElement);
  modalStatusClass.value = "close";
};
const close = () =>{
    uiStore.setMessageDialog({status:false, message:message.value});
}

watch(
  () => uiStore.messageDialog.open,
  (newVal) => {
    if (newVal) {
      openModal();
    } else {
      closeModal();
    }
  },
);
</script>

<template>
  <div id="main-dialog" :class="modalStatusClass">
    <div class="dialog-box">
      <p class="content">{{ message }}</p>

      <button class="main-btn primary" @click="close">
        <p>
          <span>CLOSE</span>
          <span>CLOSE</span>
        </p>
        <i></i>
        <i></i>
      </button>
    </div>

    <div class="background-box" @click="close"></div>
  </div>
</template>
