<script setup>
import { computed } from 'vue';
import { imageAttributes } from '../common/responsiveImage.js';

const props = defineProps({
  desktop: { type: Object, required: true },
  tablet: Object,
  mobile: Object,
  loading: { type: String, default: 'lazy' },
  priority: { type: String, default: 'auto' },
});
const attributes = computed(() => imageAttributes(props.desktop, { loading: props.loading, priority: props.priority }));
const sourceSet = image => imageAttributes(image).srcset || image?.url;
</script>

<template>
  <picture class="responsive-picture">
    <source v-if="mobile" media="(width < 640px)" :srcset="sourceSet(mobile)" sizes="100vw" :width="mobile.width" :height="mobile.height" />
    <source v-if="tablet" media="(width < 768px)" :srcset="sourceSet(tablet)" sizes="100vw" :width="tablet.width" :height="tablet.height" />
    <img v-bind="attributes" />
  </picture>
</template>
