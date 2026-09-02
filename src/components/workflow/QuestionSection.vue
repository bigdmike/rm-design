<script setup>
import { ref } from "vue";
const props = defineProps({
    questionList: {
        type: Array,
        default: () => []
    },
    section: { type: Object, default: null }
})
const openList = ref([])

const openQuestion = (index) => {
    if (openList.value.includes(index)) {
        openList.value = openList.value.filter(i => i !== index)
    } else {
        openList.value.push(index)
    }
}
</script>

<template>
    <section id="workflow-question-section">
        <div class="main-container">
            <div class="header-box">
                <!-- <p class="sub-title">( FAQ )</p> -->
                <h2 class="title" style="white-space: pre-line" v-text="section?.content?.title || '常見問題'"></h2>
            </div>

            <div class="question-box">
                <ol>
                    <li v-for="(question, index) in questionList" :key="`question-${index}`" :class="openList.includes(index)?'active':''">
                        <div class="title-box" @click="openQuestion(index)">
                            <span>Q{{ index + 1 }}.</span>
                            <h3>{{ question.title }}</h3>
                            <svg width="30" height="30" viewBox="0 0 40 40" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path :class="openList.includes(index) ? 'hidden' : ''" d="M20 13V27" stroke="black"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M13 20H27" stroke="black" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>
                        <div class="content-box">
                            <div class="content editor-content" v-html="question.content"></div>
                        </div>
                    </li>
                </ol>
            </div>
        </div>
    </section>
</template>
