<script setup>
import { ref, nextTick, onBeforeUnmount, watch } from 'vue';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

const props = defineProps({ imageList: { type: Array, required: true }, title: { type: String, required: true } });
const modal = ref(null);
const closeButton = ref(null);
const rendered = ref(false);
const modalStatusClass = ref('');
const activeImageIndex = ref(0);
const loading = ref(true);
const failed = ref(false);
let closeTimer;
let returnFocus;
let destroyed = false;
watch(activeImageIndex, () => { loading.value = true; failed.value = false; }, { flush: 'sync' });
const nextImage = () => { activeImageIndex.value = (activeImageIndex.value + 1) % props.imageList.length; };
const prevImage = () => { activeImageIndex.value = (activeImageIndex.value - 1 + props.imageList.length) % props.imageList.length; };
async function openModal(index) {
  if (!props.imageList[index]) return;
  clearTimeout(closeTimer);
  returnFocus = document.activeElement;
  activeImageIndex.value = index;
  loading.value = true; failed.value = false;
  rendered.value = true; modalStatusClass.value = 'open';
  await nextTick();
  if (destroyed || !modal.value) return;
  disableBodyScroll(modal.value);
  closeButton.value?.focus();
}
function closeModal() {
  if (modal.value) enableBodyScroll(modal.value);
  modalStatusClass.value = 'close';
  returnFocus?.focus?.();
  clearTimeout(closeTimer);
  closeTimer = setTimeout(() => { rendered.value = false; }, 320);
}
function keydown(event) {
  if (event.key === 'Escape') { event.preventDefault(); closeModal(); }
  if (event.key === 'ArrowRight') { event.preventDefault(); nextImage(); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); prevImage(); }
  if (event.key === 'Tab') {
    const buttons = [...modal.value.querySelectorAll('button')];
    const first = buttons[0], last = buttons.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
}
onBeforeUnmount(() => {
  destroyed = true;
  clearTimeout(closeTimer);
  if (modal.value) enableBodyScroll(modal.value);
});
defineExpose({ openModal, closeModal });
</script>

<template>
  <div v-if="rendered" id="work-page-image-modal" ref="modal" :class="modalStatusClass" role="dialog" aria-modal="true" :aria-label="title + ' 作品照片'" @keydown="keydown">
    <button ref="closeButton" class="modal-close" type="button" aria-label="關閉照片" @click="closeModal">關閉 ×</button>
    <div class="image-container">
      <button type="button" aria-label="上一張照片" @click="prevImage">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true"><path d="M30 60L50 40L30 20" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
      <div class="image-box" :aria-busy="loading">
        <div v-if="loading" class="modal-image-placeholder" aria-label="照片載入中"></div>
        <p v-if="failed" class="modal-image-error" role="status">照片暫時無法載入，請切換照片或稍後重試。</p>
        <img :key="imageList[activeImageIndex]" :src="imageList[activeImageIndex]" :alt="title + ' 作品照片 ' + (activeImageIndex + 1)" decoding="async" @load="loading = false" @error="loading = false; failed = true" />
      </div>
      <button type="button" aria-label="下一張照片" @click="nextImage">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true"><path d="M30 60L50 40L30 20" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
    </div>
    <div class="background-box" @click="closeModal"></div>
  </div>
</template>
