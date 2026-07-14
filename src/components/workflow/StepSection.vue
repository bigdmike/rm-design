<script setup>
import {computed,ref} from "vue";

const props = defineProps({
    workflowList: {
        type: Array,
        required: true
    },
    activeCategory: {
        type: Number,
        required: true
    }
})

const activeWorkflow = computed(()=>{
    return props.workflowList.find(workflow=>workflow.id === props.activeCategory)
})
</script>

<template>
    <section id="workflow-step-section">
        <div class="header-box">
            <p class="sub-title">( {{ activeWorkflow.subTitle }} )</p>
            <h2 class="title">{{ activeWorkflow.title }}</h2>
        </div>

        <div class="step-box" v-for="(item,itemIndex) in activeWorkflow.steps" :key="`step-${itemIndex}`">
            <div class="index-box">
                <p class="index">STEP <span>{{ itemIndex + 1 }}.</span></p>
                <p class="sub-title">{{ item.subTitle }}</p>
            </div>
            <h4 class="title" v-html="item.title"></h4>
            <div class="content editor-content" v-html="item.content"></div>
        </div>
    </section>
</template>