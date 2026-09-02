<script setup>
import ResponsivePicture from "../ResponsivePicture.vue";
defineProps({ section: { type: Object, required: true } });
</script>

<template>
    <section id="about-cover-section">
        <div class="main-container">
            <div class="title-box">
                <!-- <p class="sub-title">( WORKFLOW )</p> -->
                <h1 class="title">{{ section.content.title }}</h1>
            </div>
            <div class="content preserve-whitespace">{{ section.content.body_text }}</div>
        </div>

        <div class="image-box">
            <ResponsivePicture :desktop="section.images.hero_desktop" :tablet="section.images.hero_tablet" :mobile="section.images.hero_mobile" loading="eager" priority="high" />
        </div>
    </section>
</template>
