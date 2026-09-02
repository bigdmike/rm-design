<script setup>
import { computed } from "vue";
import { useHeaderStyleScrollHandler } from "../common/headerStyleScrollHandler";
import { usePublicPage } from "../common/usePublicPage.js";
import CoverSection from '../components/about/CoverSection.vue'
import MarqueeSection from "../components/home/MarqueeSection.vue";
import ContentSection from "../components/about/ContentSection.vue";
import QualitySection from "../components/about/QualitySection.vue";
import CoreValueSection from "../components/home/CoreValueSection.vue";
import VideoSection from "../components/home/VideoSection.vue";
import ContactSection from "../components/about/ContactSection.vue";

const headerScrollRules = [
    { selector: "#about-cover-section", style: "", offset: 0 },
    { selector: "#about-content-section", style: "cream", offset: 0 },
    { selector: "#about-quality-section", style: "black", offset: 0 },
    { selector: "#home-core-value-section", style: "black", offset: 0 },
    { selector: "#home-video-section", style: "black", offset: 0 },
    { selector: "#about-contact-section", style: "black", offset: 0 },
];

useHeaderStyleScrollHandler(headerScrollRules);
const { pageData, error, reload } = usePublicPage('about');
const sections = computed(() => pageData.value?.sections || {});
</script>

<template>
    <main v-if="pageData" id="about-page">
        <CoverSection :section="sections['about.cover']" />
        <MarqueeSection :section="sections['shared.marquee']" />
        <ContentSection :section="sections['about.content']" />
        <QualitySection :section="sections['shared.quality']" />
        <CoreValueSection :section="sections['shared.core_value']" />
        <VideoSection />
        <ContactSection :section="sections['shared.contact_cta']" />
    </main>
    <main v-else-if="error" class="main-container py-30"><p>頁面內容暫時無法載入。</p><button type="button" @click="reload">重新載入</button></main>
</template>
