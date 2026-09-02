<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
const props = defineProps({ section: { type: Object, required: true } });
const marqueeTextList = computed(() => Object.values(props.section.content));
const sectionElement = ref(null);
const visible = ref(false);
const pageVisible = ref(true);
let observer;
const visibilityChanged = () => { pageVisible.value = !document.hidden; };
onMounted(() => {
  visibilityChanged();
  document.addEventListener('visibilitychange', visibilityChanged);
  if ('IntersectionObserver' in window) {
    // isIntersecting can remain true at a zero-area, edge-adjacent intersection.
    observer = new IntersectionObserver(entries => { visible.value = entries[0].intersectionRatio >= 0.01; }, { threshold: 0.01 });
    observer.observe(sectionElement.value);
  } else visible.value = true;
});
onBeforeUnmount(() => {
  observer?.disconnect();
  document.removeEventListener('visibilitychange', visibilityChanged);
});
</script>

<template>
  <section id="home-marquee-section" ref="sectionElement" :class="{ 'is-paused': !visible || !pageVisible }">
    <div class="marquee-box">
      <div
        v-for="(item, index) in marqueeTextList"
        :key="`marquee_1_${index}`"
        class="marquee-item"
      >
        <p>{{ item }}</p>
        <i></i>
      </div>
    </div>

    <div class="marquee-box" aria-hidden="true">
      <div
        v-for="(item, index) in marqueeTextList"
        :key="`marquee_1_${index}`"
        class="marquee-item"
      >
        <p>{{ item }}</p>
        <i></i>
      </div>
    </div>

  </section>
</template>
