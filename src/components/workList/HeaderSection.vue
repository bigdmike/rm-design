<script setup>

const props = defineProps({
    title: {
        type: String,
        default: '設計案例'
    },
    subTitle: {
        type: String,
        default: '( WORKS )'
    },
    content: {
        type: String,
        default: ''
    }
})

</script>

<template>
    <section id="work-list-header-section" :class="content==''?'no-content':''">
        <div class="main-container">
            <p class="sub-title">{{ subTitle }}</p>
            <h1 class="title">{{ title }}</h1>
            <p class="content" v-html="content"></p>
        </div>
    </section>
</template>