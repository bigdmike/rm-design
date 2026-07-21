<script setup>
import MainButton from "../MainButton.vue";
</script>

<template>
  <section id="home-video-section">
    <p class="index-text">( VIDEO )</p>
    <div class="main-container">
      <div class="text-box">
        <h4 class="title">THE MAKING OF RM</h4>

        <MainButton type="link" link="/press" color="white" text="VIEW PRESS" />
      </div>
    </div>
    <div class="video-box">
      <video
        autoplay
        loop
        muted
        playsinline
        src="/videos/官網首頁影片素材 - 阜居空間創意設計.mov"
      ></video>
    </div>
  </section>
</template>
