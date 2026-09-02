<script setup>
import ResponsivePicture from "../ResponsivePicture.vue";
defineProps({ section: { type: Object, required: true } });
</script>

<template>
    <section id="about-quality-section">
        <div class="main-container">
            <div class="text-box">
            <h2 class="title">{{ section.content.title }}</h2>
            <div class="content"><p class="preserve-whitespace">{{ section.content.body_text }}</p></div>
            </div>
        </div>

        <div class="background-box">
            <ResponsivePicture :desktop="section.images.image_desktop" :tablet="section.images.image_tablet" :mobile="section.images.image_mobile" />
        </div>
    </section>
</template>
