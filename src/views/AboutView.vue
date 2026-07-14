<script setup>
import { useHeaderStyleScrollHandler } from "../common/headerStyleScrollHandler";
import CoverSection from '../components/about/CoverSection.vue'
import MarqueeSection from "../components/home/MarqueeSection.vue";
import ContentSection from "../components/about/ContentSection.vue";
import QualitySection from "../components/about/QualitySection.vue";
import PromiseSection from "../components/about/PromiseSection.vue";
import CoreValueSection from "../components/home/CoreValueSection.vue";
import VideoSection from "../components/home/VideoSection.vue";
import ContactSection from "../components/about/ContactSection.vue";

const headerScrollRules = [
    { selector: "#about-cover-section", style: "", offset: 0 },
    { selector: "#about-content-section", style: "cream", offset: 0 },
    { selector: "#about-quality-section", style: "", offset: 0 },
    { selector: "#about-promise-section", style: "cream", offset: 0 },
    { selector: "#home-core-value-section", style: "black", offset: 0 },
    { selector: "#home-video-section", style: "", offset: 0 },
    { selector: "#about-contact-section", style: "black", offset: 0 },
];

useHeaderStyleScrollHandler(headerScrollRules);
</script>

<template>
    <main id="about-page">
        <CoverSection />
        <MarqueeSection />
        <ContentSection />
        <QualitySection />
        <PromiseSection />
        <CoreValueSection />
        <VideoSection />
        <ContactSection />
    </main>
</template>