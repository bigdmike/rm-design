<script setup>
import MainButton from "../MainButton.vue";
</script>

<template>
  <section id="home-core-value-section">
    <div class="main-container">
      <div class="text-box">
        <p class="sub-title">( CORE VALUE )</p>
        <h4 class="title">開啟人生新篇幅</h4>
        <div class="content-box">
          <p class="content">
            我們用空間，說業主的故事。<br />每一個細節都致力於創造專屬美學，提煉您的個人品味。
            <br />準備好開啟人生的新篇幅了嗎？<br />阜居期待與您將故事繼續寫下去...
          </p>

          <MainButton
            type="link"
            link="/workflow"
            color="white"
            text="VIEW SERVICE"
          />
        </div>
      </div>

      <div class="background-box">
        <img src="/img/home/core_value_background.png" />
      </div>
    </div>
  </section>
</template>
