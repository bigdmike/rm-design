<script setup>
const props = defineProps({
  index: Number,
  title: String,
  slogan: String,
  content: String,
  image: String,
  categoryTitle: String,
});
</script>

<template>
  <section id="home-work-section">
    <div class="main-container">
      <p class="index-text">( {{ props.index + 1 }}. SELECTED WORKS )</p>
      <div class="text-box">
        <p class="sub-title">{{ props.categoryTitle }}</p>
        <router-link :to="`/works/${props.index}`" class="title-box">
          <h4 class="title">{{ props.title }}</h4>
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.5543 59.4429L60.5543 19.4429"
              stroke="currentColor"
              stroke-width="5"
              stroke-linecap="square"
              stroke-linejoin="round"
            />
            <mask id="path-2-inside-1_96_231" fill="white">
              <path d="M15 15L65 15V65" />
            </mask>
            <path
              d="M15 10H10V20H15V15V10ZM65 15H70C70 12.2386 67.7614 10 65 10V15ZM60 65V70H70V65H65H60ZM15 15V20L65 20V15V10L15 10V15ZM65 15L60 15V65H65H70V15H65Z"
              fill="currentColor"
              mask="url(#path-2-inside-1_96_231)"
            />
          </svg>
        </router-link>

        <p class="slogan">{{ props.slogan }}</p>
        <p class="content" v-html="props.content"></p>
      </div>
    </div>
    <div class="background-box">
      <div class="image-box">
        <img :src="props.image" />
      </div>
    </div>
  </section>
</template>
