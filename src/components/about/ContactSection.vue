<script setup>
import {ref} from "vue";
import MainButton from "../MainButton.vue";

const buttonHover = ref(false);
</script>

<template>
    <section id="about-contact-section">
        <div class="main-container">
            <p class="sub-title">( GET STARTED )</p>
            <h3 class="title">從一通電話開始，讓我們聽您說</h3>
            <p class="content">
                不論是空間或建築，第一次的會勘與方向討論完全免費。
            </p>

         
            
            <MainButton type="link" link="/contact" color="cream" text="CONTACT US" @mouseenter="buttonHover=true" @mouseleave="buttonHover=false" />
        </div>

        <div class="background-box" :class="buttonHover?'hover':''">
            <img src="/img/contact/image 2.png" />
            <img src="/img/contact/hover-bg.png" />
            <img src="/img/contact/hover-bg (1).png" />
        </div>
    </section>
</template>