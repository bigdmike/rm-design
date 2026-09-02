<script setup>
defineProps({ section: { type: Object, required: true } });
</script>

<template>
    <section id="about-content-section">
        <div class="main-container">
            <div class="title-box">
                <h2 class="title" style="white-space: pre-line" v-text="section.content.title"></h2>
            </div>
            <div class="content editor-content" v-html="section.content.body_html"></div>
        </div>
    </section>
</template>
