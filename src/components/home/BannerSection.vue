<script setup>

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
      <p class="sub-title">( RM DESIGN STUDIO )</p>
      <h1 class="title">阜居空間<span>創意設計</span></h1>
      <i></i>
      <p class="content">
        <span>『</span> 用空間    說故事 <span>』</span>
      </p>
    </div>

    <a @click="scrollToSection('#home-about-section')" class="cta-text">
    ( Scroll to explore )
    </a>

    <div class="background-box">
      <img src="/img/home/banner.jpg" />
      <img src="/img/home/banner-md.png" />
      <img src="/img/home/banner-sm.png" />
    </div>
  </section>
</template>
