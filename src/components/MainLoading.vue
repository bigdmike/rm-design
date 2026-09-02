<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useUIStore } from "../store/index.js";

const uiStore = useUIStore();
const route = useRoute();
const isLoading = computed(() => uiStore.pageLoadingCount !== 0);
const skeletonType = computed(() => {
  if (route.path === "/") return "home";
  if (route.path === "/about") return "about";
  if (route.path === "/works") return "works";
  if (/^\/works\/[^/]+$/.test(route.path)) return "work-detail";
  if (route.path === "/press") return "press";
  if (route.path === "/contact") return "contact";
  if (route.path === "/workflow") return "workflow";
  if (route.path === "/privacy-policy") return "privacy";
  return "content";
});
</script>

<template>
  <div v-if="uiStore.loadingCount !== 0 && !isLoading" id="background-loading" role="status" aria-label="資料更新中"></div>
  <Transition name="skeleton-fade">
    <div
      v-if="isLoading"
      id="main-loading"
      :class="`type-${skeletonType}`"
      role="status"
      aria-live="polite"
      aria-label="頁面載入中"
    >
      <span class="loading-accessible-text">頁面載入中</span>

      <template v-if="skeletonType === 'home'">
        <section class="skeleton-home-hero">
          <div class="skeleton-copy skeleton-copy-centered">
            <i class="skeleton-block skeleton-eyebrow"></i>
            <i class="skeleton-block skeleton-title skeleton-title-wide"></i>
            <i class="skeleton-block skeleton-line"></i>
            <i class="skeleton-block skeleton-text"></i>
          </div>
        </section>
        <section class="skeleton-section">
          <div class="skeleton-section-heading skeleton-block"></div>
          <div class="skeleton-card-grid">
            <i v-for="item in 3" :key="item" class="skeleton-card skeleton-block"></i>
          </div>
        </section>
      </template>

      <template v-else-if="skeletonType === 'about'">
        <section class="skeleton-visual-cover">
          <div class="skeleton-cover-content">
            <div class="skeleton-copy">
              <i class="skeleton-block skeleton-title"></i>
            </div>
            <div class="skeleton-cover-description">
              <i v-for="item in 3" :key="item" class="skeleton-block skeleton-text"></i>
            </div>
          </div>
        </section>
        <section class="skeleton-about-intro skeleton-page-container">
          <div class="skeleton-copy">
            <i class="skeleton-block skeleton-eyebrow"></i>
            <i class="skeleton-block skeleton-heading"></i>
            <i class="skeleton-block skeleton-heading skeleton-heading-short"></i>
          </div>
          <div class="skeleton-paragraphs">
            <i v-for="item in 5" :key="item" class="skeleton-block skeleton-text"></i>
          </div>
        </section>
      </template>

      <template v-else-if="skeletonType === 'works'">
        <section class="skeleton-standard-heading skeleton-page-container">
          <i class="skeleton-block skeleton-title"></i>
          <i class="skeleton-block skeleton-text skeleton-text-medium"></i>
        </section>
        <section class="skeleton-list-layout skeleton-page-container">
          <aside class="skeleton-side-nav">
            <i v-for="item in 5" :key="item" class="skeleton-block"></i>
          </aside>
          <div class="skeleton-card-grid skeleton-work-grid">
            <article v-for="item in 6" :key="item" class="skeleton-card-item">
              <i class="skeleton-card skeleton-work-card skeleton-block"></i>
              <i class="skeleton-block skeleton-card-title"></i>
              <i class="skeleton-block skeleton-card-meta"></i>
            </article>
          </div>
        </section>
      </template>

      <template v-else-if="skeletonType === 'work-detail'">
        <section class="skeleton-work-detail-cover skeleton-block"></section>
        <section class="skeleton-work-detail-copy">
          <div class="skeleton-page-container">
            <i class="skeleton-block skeleton-eyebrow"></i>
            <i class="skeleton-block skeleton-heading"></i>
            <i class="skeleton-block skeleton-card-title"></i>
            <i class="skeleton-block skeleton-text skeleton-text-medium"></i>
          </div>
        </section>
      </template>

      <template v-else-if="skeletonType === 'press'">
        <section class="skeleton-standard-heading skeleton-page-container skeleton-heading-compact">
          <i class="skeleton-block skeleton-title"></i>
          <i class="skeleton-block skeleton-text skeleton-text-medium"></i>
        </section>
        <section class="skeleton-page-container">
          <div class="skeleton-card-grid skeleton-press-grid">
            <article v-for="item in 6" :key="item" class="skeleton-card-item">
              <i class="skeleton-card skeleton-press-card skeleton-block"></i>
              <i class="skeleton-block skeleton-card-title"></i>
              <i class="skeleton-block skeleton-card-meta"></i>
            </article>
          </div>
        </section>
      </template>

      <template v-else-if="skeletonType === 'contact'">
        <section class="skeleton-standard-heading skeleton-page-container skeleton-contact-heading">
          <i class="skeleton-block skeleton-title"></i>
        </section>
        <section class="skeleton-form skeleton-page-container">
          <div v-for="item in 2" :key="`half-${item}`" class="skeleton-field skeleton-field-half">
            <i class="skeleton-block skeleton-label"></i><i class="skeleton-block skeleton-input"></i>
          </div>
          <div v-for="item in 2" :key="`half-b-${item}`" class="skeleton-field skeleton-field-half">
            <i class="skeleton-block skeleton-label"></i><i class="skeleton-block skeleton-input"></i>
          </div>
          <div v-for="item in 3" :key="`third-${item}`" class="skeleton-field skeleton-field-third">
            <i class="skeleton-block skeleton-label"></i><i class="skeleton-block skeleton-input"></i>
          </div>
          <div class="skeleton-field skeleton-field-two-thirds">
            <i class="skeleton-block skeleton-label"></i><i class="skeleton-block skeleton-input"></i>
          </div>
        </section>
      </template>

      <template v-else-if="skeletonType === 'workflow'">
        <section class="skeleton-visual-cover">
          <div class="skeleton-cover-content">
            <div class="skeleton-copy">
              <i class="skeleton-block skeleton-title"></i>
            </div>
            <div class="skeleton-cover-description">
              <i v-for="item in 3" :key="item" class="skeleton-block skeleton-text"></i>
            </div>
          </div>
        </section>
        <section class="skeleton-workflow-layout skeleton-page-container">
          <aside class="skeleton-side-nav">
            <i v-for="item in 4" :key="item" class="skeleton-block"></i>
          </aside>
          <div class="skeleton-steps">
            <div class="skeleton-step-heading"><i class="skeleton-block skeleton-heading"></i></div>
            <article v-for="item in 4" :key="item" class="skeleton-step">
              <i class="skeleton-block skeleton-step-index"></i>
              <i class="skeleton-block skeleton-card-title"></i>
              <div class="skeleton-step-copy"><i class="skeleton-block skeleton-text"></i><i class="skeleton-block skeleton-text skeleton-text-short"></i></div>
            </article>
          </div>
        </section>
      </template>

      <template v-else-if="skeletonType === 'privacy'">
        <section class="skeleton-privacy skeleton-page-container">
          <i class="skeleton-block skeleton-eyebrow"></i>
          <i class="skeleton-block skeleton-title"></i>
          <div class="skeleton-paragraphs skeleton-privacy-copy">
            <i v-for="item in 12" :key="item" class="skeleton-block skeleton-text" :class="{ 'skeleton-text-short': item % 4 === 0 }"></i>
          </div>
        </section>
      </template>

      <section v-else class="skeleton-standard-heading skeleton-page-container">
        <i class="skeleton-block skeleton-title"></i>
        <i class="skeleton-block skeleton-text skeleton-text-medium"></i>
      </section>
    </div>
  </Transition>
</template>
