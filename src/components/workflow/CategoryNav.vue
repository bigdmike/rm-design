<script setup>
import {useRoute} from "vue-router";
import {computed} from "vue";

const props = defineProps({
    categoryList: {
        type: Array,
        required: true
    },
    modelValue: {
        type: [String, Number],
        default: "all"
    }
})

const route = useRoute();
const currentCategory = computed(()=>route.query.category || "all")

</script>

<template>
    <nav id="workflow-category-nav">
        <ol>
            <li v-for="category in categoryList" :key="category.id">
                <button @click="$emit('update:modelValue', category.id)"
                :class="modelValue == category.id ? 'active' : ''">
                    {{ category.name }} <span>({{ category.count }})</span>
                </button>
            </li>
        </ol>
    </nav>
</template>