<script setup>
const marqueeTextList = [
  "晶鯤鵬國際設計大獎・優秀獎",
  "亞太地區十大傑出設計機構",
  "中國地區年度精英設計師獎",
  "永續城市綠建築都市改造計畫・生態社區創構想",
];
</script>

<template>
  <section id="home-marquee-section">
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

  </section>
</template>
