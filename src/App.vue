<script setup>
import MainHeader from "./components/MainHeader.vue";
import MainMenu from "./components/MainMenu.vue";
import MainFooter from "./components/MainFooter.vue";
import SitePrivacyDialog from "./components/SitePrivacyDialog.vue";
</script>

<template>
  <MainHeader />
  <MainMenu />
  <router-view />
  <MainFooter />
  <SitePrivacyDialog />
</template>
