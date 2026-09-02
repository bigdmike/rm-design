<script setup>
import { imageAttributes } from "../../common/responsiveImage.js";
defineProps({
  promiseList: { type: Array, default: () => [] },
  section: { type: Object, default: null },
});
</script>

<template>
  <section id="about-promise-section">
    <div class="main-container">
      <div class="title-box">
        <!-- <p class="sub-title">( 10 STANDARDS WE NEVER COMPROMISE )</p> -->
        <h2 class="title">{{ section?.content?.title || '工程堅持' }}</h2>
      </div>

      <ol class="promise-list">
        <li
          class="promise-item"
          v-for="(item, itemIndex) in promiseList"
          :key="`promise-${itemIndex}`"
        >
          <a :href="item.link" target="_blank" rel="noopener noreferrer">
            <div class="image-box">
              <img v-bind="imageAttributes(item.imageData || { url: item.image }, { sizes: '(min-width: 768px) 33vw, 100vw' })" :alt="item.imageAlt ?? item.title" />
            </div>
            <p class="promise-title">
              <span>{{ itemIndex + 1 }}.</span> {{ item.title }}
            </p>
          </a>
        </li>
      </ol>
    </div>
  </section>
</template>
