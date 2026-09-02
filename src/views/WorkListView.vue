<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useUIStore } from '../store/index';
import { useRouteSeo } from '../common/usePageMetaHead.js';
import { getInitialState } from '../common/initialState.js';
import { usePublicPage, loadPublicPage } from '../common/usePublicPage.js';
import { getPublicJson, publicCache, PublicApiError } from '../common/publicApi.js';
import { useWorkCategories, loadWorkCategories } from '../common/useWorkCategories.js';
import { parsePublicUrl, outOfRange, isMissing, initialNotFound } from '../common/publicUrl.js';
import { pageSeo, errorSeo } from '../common/seo.js';
import { useVisibleRefresh } from '../common/useVisibleRefresh.js';
import { latestRequest } from '../common/latestRequest.js';
import MainBreadcrumbs from '../components/MainBreadcrumbs.vue';
import { workBreadcrumbs } from '../common/breadcrumbs.js';
import HeaderSection from '../components/workList/HeaderSection.vue';
import SideCategoryNav from '../components/workList/SideCategoryNav.vue';
import CategoryNav from '../components/workList/CategoryNav.vue';
import CardListSection from '../components/workList/CardListSection.vue';
import MainPagination from '../components/MainPagination.vue';
import NotFoundView from './NotFoundView.vue';

useUIStore().setHeaderStyle('cream');
const route = useRoute();
const initial = getInitialState();
const origin = initial?.frontendOrigin || window.location.origin;
const url = computed(() => parsePublicUrl(route.fullPath));
const { pageData } = usePublicPage('works');
const categoryData = useWorkCategories();
const categoryList = computed(() => [{ name: '全部', id: 'all', count: categoryData.value?.total || 0 }, ...(categoryData.value?.items || [])]);
const activeCategory = computed(() => categoryData.value?.items.find((item) => String(item.id) === url.value?.category));
const breadcrumbs = computed(() => workBreadcrumbs(url.value?.canonicalPath || '/works', activeCategory.value));
const header = computed(() => pageData.value?.sections?.['works.header']);
const listing = ref(null);
const missing = ref(false);
const failed = ref(false);
const request = latestRequest();
let initialConsumed = false;

function load(force = false) {
  const location = url.value;
  if (!location) { request.invalidate(); return; }
  if (!initialConsumed && initialNotFound(initial, route.fullPath)) {
    initialConsumed = true; missing.value = true; return;
  }
  initialConsumed = true;
  const path = '/works?' + new URLSearchParams({ category: location.category, page: String(location.page), per_page: '9' });
  return request.run(async () => {
    const [result, categories] = await Promise.all([
      getPublicJson(path, { force }),
      loadPublicPage('works', { force }).then((page) => page.site.workCategories || loadWorkCategories()),
    ]);
    if ((location.category !== 'all' && !categories.items.some((item) => String(item.id) === location.category)) || outOfRange(result.pagination)) {
      throw new PublicApiError('找不到頁面。', { status: 404 });
    }
    return result;
  }, {
    start: () => { listing.value = publicCache.peek(path); missing.value = false; failed.value = false; },
    success: (result) => { listing.value = result; },
    error: (error) => { listing.value = null; missing.value = isMissing(error); failed.value = !missing.value; },
  });
}
watch(() => url.value?.canonicalPath, () => load(), { immediate: true, flush: 'sync' });
useVisibleRefresh(() => missing.value ? undefined : load());
onBeforeUnmount(() => request.invalidate());
useRouteSeo(() => {
  const name = pageData.value?.site?.settings?.siteName || initial?.site?.settings?.siteName;
  if (missing.value || failed.value) return errorSeo(origin, name, missing.value, missing.value ? '/404' : url.value?.canonicalPath);
  return listing.value && pageData.value ? pageSeo(pageData.value, origin + url.value.canonicalPath, activeCategory.value?.name) : null;
});
</script>

<template>
  <NotFoundView v-if="missing" />
  <main v-else id="work-list-page">
    <HeaderSection v-if="header" :title="header.content.title" :sub-title="header.content.subtitle" :content="header.content.body_text" />
    <div class="main-container">
      <MainBreadcrumbs :items="breadcrumbs" />
      <SideCategoryNav :categoryList="categoryList" baseUrl="/works" />
      <CategoryNav :categoryList="categoryList" baseUrl="/works" />
      <div v-if="failed" role="alert"><p>案例暫時無法載入，請稍後再試。</p><button type="button" @click="load(true)">重新載入</button></div>
      <CardListSection v-else :works="listing?.items || []" />
      <div v-if="listing?.pagination.totalPages > 1" class="pagination-box">
        <MainPagination :total-items="listing.pagination.total" :items-per-page="9" :max-pages-shown="5" :model-value="url.page" />
      </div>
      <div class="background-box"><img src="/img/home/background.png" class="bg-image" alt="" /></div>
    </div>
  </main>
</template>
