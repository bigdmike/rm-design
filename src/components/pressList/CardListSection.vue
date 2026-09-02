<script setup>
import { imageAttributes, cardSizes } from "../../common/responsiveImage.js";
defineProps({ pressList: { type: Array, default: () => [] } });
</script>

<template>
  <section id="press-list-card-list-section">
    <div class="card-list">
      <a v-for="(press, index) in pressList" :key="press.id" :href="press.link" target="_blank" class="card">
        <div class="thumbnail">
          <div class="cover">
              <div class="play-button-box">
                <svg width="11" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5.19629L4.64275e-07 10.3924L9.18537e-07 0.000136459L9 5.19629Z" fill="#CC333A" />
                </svg>
              </div>
          </div>
          <img v-bind="imageAttributes(press.thumbnailImage || { url: press.thumbnail }, { sizes: cardSizes, loading: index < 3 ? 'eager' : 'lazy', priority: index === 0 ? 'high' : 'auto' })" :alt="press.thumbnailImage?.altText ?? press.title" />
        </div>
        <div class="info">
          <h2>{{ press.title }}</h2>
          <p>{{ press.created_at }}</p>
        </div>
      </a>
    </div>

  </section>
</template>
