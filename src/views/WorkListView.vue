<script setup>
import { ref,computed } from "vue";
import { useUIStore } from "../store/index";
import { useRoute,useRouter } from "vue-router";
import HeaderSection from "../components/workList/HeaderSection.vue";
import SideCategoryNav from "../components/workList/SideCategoryNav.vue";
import CategoryNav from "../components/workList/CategoryNav.vue";
import CardListSection from "../components/workList/CardListSection.vue";
import MainPagination from "../components/MainPagination.vue";

const uiStore = useUIStore();
uiStore.setHeaderStyle("cream");
const route = useRoute();
const router = useRouter();

const categoryList = [
    {
        name:"全部",
        id:"all",
        count: 99,
    },
    {
        name:"建築設計",
        id:1,
        count: 22,
    },
    {
        name:"住宅空間",
        id:2,
        count: 23,
    },
    {
        name:"商業空間",
        id:3,
        count: 31,
    },
    {
        name:"公共空間",
        id:4,
        count: 23,
    }
]
const currentPage = computed({
  get() {
    return route.query.page ? parseInt(route.query.page) : 1;
  },
  set(value) {
    const query = { ...route.query, page: value };
    router.push({ query });
  },
});
const currentCategory = computed({
    get() {
        return route.query.category ? route.query.category : "all";
    },
    set(value) {
        const query = { ...route.query, category: value, page: 1 };
        router.push({ query });
    },
});
</script>

<template>
    <main id="work-list-page">
        <HeaderSection />
        <div class="main-container">
            <SideCategoryNav :categoryList="categoryList" :baseUrl="`/works`" />
            <CategoryNav :categoryList="categoryList" :baseUrl="`/works`"/>
            <CardListSection/>
            <div class="pagination-box">
                <MainPagination :total-items="50" :items-per-page="5" :max-pages-shown="5" v-model="currentPage"/>
            </div>
            <div class="background-box">
                <img src="/img/home/background.png" class="bg-image" />
            </div>
        </div>
    </main>
</template>