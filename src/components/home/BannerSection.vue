<script setup>
import ResponsivePicture from "../ResponsivePicture.vue";
defineProps({ section: { type: Object, required: true } });

const scrollToSection = (sectionId) => {
  const section = document.querySelector(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};

</script>

<template>
  <section id="home-banner-section">
    <div class="text-box">
      <!-- <p class="sub-title">( RM DESIGN STUDIO )</p> -->
      <h1 class="title">{{ section.content.title_parts.main }}<span>{{ section.content.title_parts.accent }}</span></h1>
      <i></i>
      <p class="content preserve-whitespace">
        {{ section.content.body_text }}
      </p>
    </div>

    <button type="button" @click="scrollToSection('#home-about-section')" class="cta-text">
    ( {{ section.content.cta_label }} )
    </button>

    <div class="background-box">
      <ResponsivePicture :desktop="section.images.hero_desktop" :tablet="section.images.hero_tablet" :mobile="section.images.hero_mobile" loading="eager" priority="high" />
    </div>
  </section>
</template>
