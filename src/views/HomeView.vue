<script setup>
import { computed } from "vue";
import { useHeaderStyleScrollHandler } from "../common/headerStyleScrollHandler";
import { usePublicPage } from "../common/usePublicPage.js";
import BannerSection from "../components/home/BannerSection.vue";
import MarqueeSection from "../components/home/MarqueeSection.vue";
import AboutSection from "../components/home/AboutSection.vue";
import WorkIntroSection from "../components/home/WorkIntroSection.vue";
import WorkSection from "../components/home/WorkSection.vue";
import CoreValueSection from "../components/home/CoreValueSection.vue";
import VideoSection from "../components/home/VideoSection.vue";

const headerScrollRules = [
  { selector: "#home-banner-section", style: "", offset: 0 },
  { selector: "#home-marquee-section", style: "cream", offset: 0 },
  { selector: "#home-work-section", style: "black", offset: 0 },
  { selector: "#home-core-value-section", style: "black", offset: 0 },
  { selector: "#home-video-section", style: "black", offset: 0 },
];



useHeaderStyleScrollHandler(headerScrollRules);
const { pageData, error, reload } = usePublicPage('home');
const sections = computed(() => pageData.value?.sections || {});
const works = computed(() => pageData.value?.data?.homepageFeatures?.items || []);
</script>

<template>
  <main v-if="pageData" id="home-page">
    <BannerSection :section="sections['home.hero']" />
    <MarqueeSection :section="sections['shared.marquee']" />
    <AboutSection :section="sections['home.about_intro']" />
    <WorkIntroSection :section="sections['home.works_intro']" />
    <WorkSection
      v-for="(work, index) in works"
      :key="`home-work-${index}`"
      :index="index"
      :title="work.title"
      :slogan="work.slogan"
      :content="work.content"
      :image="work.image"
      :image-data="work.imageData"
      :category-title="work.categoryTitle"
      :link="work.link"
      :image-alt="work.imageAlt"
    />
    <CoreValueSection :section="sections['shared.core_value']" />
    <VideoSection />
  </main>
  <main v-else-if="error" class="main-container py-30">
    <p>頁面內容暫時無法載入。</p>
    <button type="button" @click="reload">重新載入</button>
  </main>
</template>
