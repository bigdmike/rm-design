<script setup>
import {useRoute} from "vue-router";
import {computed} from "vue";

const props = defineProps({
    categoryList: {
        type: Array,
        required: true
    },
    baseUrl: {
        type: String,
        default: "/works"
    }
})

const route = useRoute();
const currentCategory = computed(()=>route.query.category || "all")

</script>

<template>
    <aside id="work-list-side-category-nav">
        <div class="category-box">
            <ol>
                <li v-for="category in categoryList" :key="category.id">
                    <router-link :to="`${baseUrl}?category=${category.id}`" 
                    :class="currentCategory == category.id ? 'active' : ''">
                        {{ category.name }} <span>({{ category.count }})</span>
                    </router-link>
                </li>
            </ol>
        </div>
    </aside>
</template>