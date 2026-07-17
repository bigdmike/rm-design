<script setup>
import { useRoute } from "vue-router";
import { useUIStore } from "./store/index.js";
import { usePageMetaHead } from "./common/usePageMetaHead.js";
import MainHeader from "./components/MainHeader.vue";
import MainMenu from "./components/MainMenu.vue";
import MainFooter from "./components/MainFooter.vue";
import SitePrivacyDialog from "./components/SitePrivacyDialog.vue";
import MainDialog from "./components/MainDialog.vue";
import MainLoading from "./components/MainLoading.vue";

const uiStore = useUIStore();
const route = useRoute();

usePageMetaHead({ uiStore, route });
</script>

<template>
  <MainHeader />
  <MainMenu />
  <router-view />
  <MainFooter />
  <SitePrivacyDialog />
  <MainDialog />
  <MainLoading />
</template>
