<script setup>
import MainButton from "../MainButton.vue";
defineProps({ section: { type: Object, required: true } });
</script>

<template>
  <section id="home-work-intro-section">
    <div class="main-container">
      <div class="text-box">
        <!-- <p class="sub-title">( SELECT WORKS )</p> -->
        <div class="content preserve-whitespace">{{ section.content.body_text }}</div>

        <div class="button-box">
          <MainButton type="link" :link="section.content.button_href" color="black" :text="section.content.button_label" />
        </div>
      </div>
    </div>

    <div class="background-box">
      <img src="/img/home/background.png" alt=""/>
    </div>
  </section>
</template>
