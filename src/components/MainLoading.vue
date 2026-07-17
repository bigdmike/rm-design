<script setup>
import { ref, watch, computed } from "vue";
import { useUIStore } from "../store/index.js";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

const uiStore = useUIStore();
const modalStatusClass = ref("");

const openModal = () => {
  const modalElement = document.querySelector("#main-loading");
  disableBodyScroll(modalElement);
  modalStatusClass.value = "open";
};
const closeModal = () => {
  const modalElement = document.querySelector("#main-loading");
  enableBodyScroll(modalElement);
  modalStatusClass.value = "close";
};

watch(
  () => uiStore.loadingCount,
  (newVal,oldVal) => {
    if (newVal!=0 && oldVal==0) {
      openModal();
    } else if (newVal==0 && oldVal!=0) {
      closeModal();
    }
  },
);

</script>

<template>
  <div id="main-loading" :class="modalStatusClass">
    <div class="loading-box">
      <svg
        class="size-15 animate-spin text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          fill="#cc333a"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p>LOADING</p>
    </div>

    <div class="background-box"></div>
  </div>
</template>
