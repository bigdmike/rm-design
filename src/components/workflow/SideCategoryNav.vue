<script setup>

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

</script>

<template>
    <aside id="workflow-side-category-nav">
        <div class="category-box">
            <ol>
                <li v-for="category in categoryList" :key="category.id">
                    <button @click="$emit('update:modelValue', category.id)"
                    :class="modelValue == category.id ? 'active' : ''">
                        {{ category.name }} <span>({{ category.count }})</span>
                    </button>
                </li>
            </ol>
        </div>
    </aside>
</template>