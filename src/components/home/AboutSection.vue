<script setup>
  import MainButton from "../MainButton.vue";
</script>

<template>
  <section id="home-about-section">
    <div class="main-container">
      <div class="image-box">
        <img src="/img/home/about.jpg" />
      </div>
      <div class="text-box">
        <p class="sub-title">( ABOUT RM )</p>
        <h2 class="title">
          <span>我們不談風格，聊的是故事</span>
          <span>我們用空間，說業主的故事</span>
        </h2>
        <div class="content">
          在這裏，我們不談風格，
          因為「美」之於設計團隊只是基本功力。
          我們秉持著「形隨機能而生、每個線條融入業主故事」的設計理念，
          使場域與業主形象完美結合。
          
          我們傾聽關於您的回憶與喜好，為您的空間描繪出專屬的輪廓。
          在阜居，我們用空間說著一段又一段的人生故事。

          
        </div>

        <MainButton type="link" link="/about" color="black" text="VIEW ABOUT US" />
      </div>
    </div>
  </section>
</template>
