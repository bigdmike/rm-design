<script setup>
import { imageAttributes, cardSizes } from "../../common/responsiveImage.js";
defineProps({ works: { type: Array, required: true } });
</script>

<template>
  <section id="work-list-card-list-section">
    <div class="card-list">
      <router-link
        v-for="(work, index) in works"
        :key="work.id"
        :to="'/works/' + work.id"
        class="card"
      >
        <div class="thumbnail">
          <div class="cover">
            <div class="text-box">
              <p>VIEW MORE</p>
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.5543 59.4429L60.5543 19.4429"
                  stroke="white"
                  stroke-width="5"
                  stroke-linecap="square"
                  stroke-linejoin="round"
                />
                <mask id="path-2-inside-1_96_231" fill="white">
                  <path d="M15 15L65 15V65" />
                </mask>
                <path
                  d="M15 10H10V20H15V15V10ZM65 15H70C70 12.2386 67.7614 10 65 10V15ZM60 65V70H70V65H65H60ZM15 15V20L65 20V15V10L15 10V15ZM65 15L60 15V65H65H70V15H65Z"
                  fill="white"
                  mask="url(#path-2-inside-1_96_231)"
                />
              </svg>
            </div>
          </div>
          <img v-bind="imageAttributes(work.thumbnailImage || { url: work.thumbnail }, { sizes: cardSizes, loading: index < 3 ? 'eager' : 'lazy', priority: index === 0 ? 'high' : 'auto' })" :alt="work.thumbnailImage?.altText ?? work.title" />
        </div>
        <div class="info">
          <h2>{{ work.title }}</h2>
          <p>{{ work.location }}</p>
        </div>
      </router-link>
    </div>
    
  </section>
</template>
