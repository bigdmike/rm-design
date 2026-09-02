<script setup>
import { imageAttributes } from "../../common/responsiveImage.js";
import {ref} from "vue";
import MainButton from "../MainButton.vue";

const buttonHover = ref(false);
defineProps({ section: { type: Object, required: true } });
</script>

<template>
    <section id="about-contact-section">
        <div class="main-container">
            <h2 class="title">{{ section.content.title }}</h2>
            <p class="content preserve-whitespace">{{ section.content.body_text }}</p>

         
            
            <MainButton type="link" :link="section.content.button_href" color="cream" :text="section.content.button_label" @mouseenter="buttonHover=true" @mouseleave="buttonHover=false" />
        </div>

        <div class="background-box" :class="buttonHover?'hover':''">
            <img v-bind="imageAttributes(section.images.image, { sizes: '(min-width: 768px) 50vw, 100vw' })" />
        </div>
    </section>
</template>
