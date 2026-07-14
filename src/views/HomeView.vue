<script setup>
import { ref } from "vue";
import { useHeaderStyleScrollHandler } from "../common/headerStyleScrollHandler";
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
  { selector: "#home-work-section", style: "", offset: 0 },
  { selector: "#home-core-value-section", style: "black", offset: 0 },
  { selector: "#home-video-section", style: "", offset: 0 },
];

useHeaderStyleScrollHandler(headerScrollRules);

const works = ref([
  {
    title: "RUNWAY",
    slogan: "走入生活的伸展台，演繹純粹的日常序曲",
    content:
      "在 RUNWAY 案場中，我們實踐了「形隨機能而生」的核心設計哲學。透過大面積的純白基調與溫潤木質點綴，將垂直與水平的動線梳理得如同伸展台般流暢且具層次感。",
    image: "/rm-design/img/home/work_1.png",
    categoryTitle: "住宅空間",
  },
  {
    title: "我家住在森林裡",
    slogan: "在城市邊陲，為心靈裁製一方綠意",
    content:
      "這不只是一座建築，而是一段關於「尋回生活節奏」的故事 。我們以清水模的質樸基調為畫布，大膽地將自然林意引入生活場域，讓硬朗的建築線條與柔和的植栽景觀交織共生 。",
    image: "/rm-design/img/home/work_2.png",
    categoryTitle: "建築設計",
  },
  {
    title: "ATTI 咖啡研究工坊",
    slogan: "在豆香與磚牆之間，聽見職人的生活節奏",
    content:
      "秉持著「形隨機能而生」的設計理念，我們將原本的紅磚結構與粗獷的工業管線轉化為場域的靈魂，<br/>使建築語彙與業主的職人形象完美結合 。",
    image: "/rm-design/img/home/work_3.png",
    categoryTitle: "商業空間",
  },
]);
</script>

<template>
  <main id="home-page">
    <BannerSection />
    <MarqueeSection />
    <AboutSection />
    <WorkIntroSection />
    <WorkSection
      v-for="(work, index) in works"
      :key="`home-work-${index}`"
      :index="index"
      :title="work.title"
      :slogan="work.slogan"
      :content="work.content"
      :image="work.image"
      :category-title="work.categoryTitle"
    />
    <CoreValueSection />
    <VideoSection />
  </main>
</template>
