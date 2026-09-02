<script setup>
import { imageAttributes } from "../../common/responsiveImage.js";
import MainButton from "../MainButton.vue";
defineProps({ section: { type: Object, required: true } });
</script>

<template>
  <section id="home-core-value-section">
    <div class="main-container">
      <div class="text-box">
        <h2 class="title">{{ section.content.title }}</h2>
        <div class="content-box">
          <p class="content preserve-whitespace">{{ section.content.body_text }}</p>

          <MainButton
            type="link"
            :link="section.content.button_href"
            color="white"
            :text="section.content.button_label"
          />
        </div>
      </div>

      <div class="background-box">
        <img v-bind="imageAttributes(section.images.background)" />
      </div>
    </div>
  </section>
</template>
