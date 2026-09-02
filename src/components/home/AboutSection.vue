<script setup>
import { imageAttributes } from "../../common/responsiveImage.js";
  import MainButton from "../MainButton.vue";
  defineProps({ section: { type: Object, required: true } });
</script>

<template>
  <section id="home-about-section">
    <div class="main-container">
      <div class="image-box">
        <img v-bind="imageAttributes(section.images.image, { sizes: '(min-width: 768px) 50vw, 100vw' })" />
      </div>
      <div class="text-box">
        <!-- <p class="sub-title">( ABOUT RM )</p> -->
        <h2 class="title">
          <span>{{ section.content.title_parts.main }}</span>
          <span>{{ section.content.title_parts.accent }}</span>
        </h2>
        <div class="content preserve-whitespace">{{ section.content.body_text }}</div>

        <MainButton type="link" :link="section.content.button_href" color="black" :text="section.content.button_label" />
      </div>
    </div>
  </section>
</template>
