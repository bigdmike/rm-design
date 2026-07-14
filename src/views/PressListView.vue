<script setup>
import { ref,computed } from "vue";
import { useUIStore } from "../store/index";
import { useRoute,useRouter } from "vue-router";
import HeaderSection from '../components/workList/HeaderSection.vue'
import CardListSection from '../components/pressList/CardListSection.vue'
import MainPagination from '../components/MainPagination.vue'

const uiStore = useUIStore();
uiStore.setHeaderStyle("cream");
const route = useRoute();
const router = useRouter();

const currentPage = computed({
  get() {
    return route.query.page ? parseInt(route.query.page) : 1;
  },
  set(value) {
    const query = { ...route.query, page: value };
    router.push({ query });
  },
});

</script>

<template>
    <main id="press-list-page">
        <HeaderSection title="媒體採訪" subTitle="( PRESS )" content="" />
        <div class="main-container">
            <CardListSection />
            <div class="pagination-box">
                <MainPagination :total-items="50" :items-per-page="5" :max-pages-shown="5" v-model="currentPage" />
            </div>
        </div>
    </main>
</template>