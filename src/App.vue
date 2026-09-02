<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { usePageMetaHead, provideRouteSeo } from "./common/usePageMetaHead.js";
import { getInitialState } from './common/initialState.js';
import { parsePublicUrl } from './common/publicUrl.js';
import { pageSeo, errorSeo } from './common/seo.js';
import { useWorkCategories, categoryLinks } from './common/useWorkCategories.js';
import { usePublicPage } from "./common/usePublicPage.js";
import MainHeader from "./components/MainHeader.vue";
import MainMenu from "./components/MainMenu.vue";
import MainFooter from "./components/MainFooter.vue";
import SitePrivacyDialog from "./components/SitePrivacyDialog.vue";
import MainDialog from "./components/MainDialog.vue";
import MainLoading from "./components/MainLoading.vue";
import NotFoundView from './views/NotFoundView.vue';

const route = useRoute();
const initial = getInitialState();
const location = computed(() => parsePublicUrl(route.fullPath));
const apiPage = computed(() => location.value ? route.meta.apiPage || null : null);
const { pageData: sharedPageData, error: pageError } = usePublicPage(apiPage, () => location.value?.page || 1);
const categoryData = useWorkCategories();
const navigationCategories = computed(() => categoryLinks(categoryData.value));
const site = computed(() => sharedPageData.value?.site || initial?.site);
const origin = initial?.frontendOrigin || window.location.origin;
const override = provideRouteSeo();
const pageFailed = computed(() => Boolean(pageError.value));

const seo = computed(() => {
  const url = location.value;
  const siteName = site.value?.settings?.siteName || 'RM Design';
  if (!url) return errorSeo(origin, siteName);
  const viewSeo = override.value?.key === route.fullPath ? override.value.seo : null;
  const category = categoryData.value?.items.find((item) => String(item.id) === url.category);
  const loadedPage = sharedPageData.value?.page === apiPage.value ? sharedPageData.value : null;
  let resolved = viewSeo;
  if (!resolved && !loadedPage && initial?.canonical === origin + url.canonicalPath && initial?.seo) resolved = initial.seo;
  if (!resolved) resolved = pageSeo(loadedPage || { site: site.value }, origin + url.canonicalPath, url.key === 'works' ? category?.name : null);
  if (pageFailed.value && !viewSeo) resolved = errorSeo(origin, siteName, false, url.canonicalPath);
  return { ...resolved, robots: resolved.robots || (initial?.indexable === true ? 'index,follow' : 'noindex,nofollow') };
});
usePageMetaHead(seo);
</script>

<template>
  <MainHeader :categories="navigationCategories" :settings="site?.settings" />
  <MainMenu :categories="navigationCategories" :settings="site?.settings" />
  <router-view v-if="location" />
  <NotFoundView v-else />
  <MainFooter :categories="navigationCategories" :settings="site?.settings" :locations="site?.locations" />
  <SitePrivacyDialog :content="sharedPageData?.sections?.['shared.privacy_notice']?.content" />
  <MainDialog />
  <MainLoading />
</template>
