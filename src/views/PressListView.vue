<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useUIStore } from '../store/index';
import { usePublicPage, loadPublicPage } from '../common/usePublicPage.js';
import { publicCache, publicPagePath, PublicApiError } from '../common/publicApi.js';
import { getInitialState } from '../common/initialState.js';
import { parsePublicUrl, outOfRange, isMissing, initialNotFound } from '../common/publicUrl.js';
import { pageSeo, errorSeo } from '../common/seo.js';
import { useRouteSeo } from '../common/usePageMetaHead.js';
import { useVisibleRefresh } from '../common/useVisibleRefresh.js';
import { latestRequest } from '../common/latestRequest.js';
import HeaderSection from '../components/workList/HeaderSection.vue';
import CardListSection from '../components/pressList/CardListSection.vue';
import MainPagination from '../components/MainPagination.vue';
import NotFoundView from './NotFoundView.vue';

useUIStore().setHeaderStyle('cream');
const route = useRoute();
const initial = getInitialState();
const origin = initial?.frontendOrigin || window.location.origin;
const url = computed(() => parsePublicUrl(route.fullPath));
const { pageData } = usePublicPage('press', () => url.value?.page || 1);
const header = computed(() => pageData.value?.sections?.['press.header']);
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
  return request.run(async () => {
    const data = await loadPublicPage('press', { force, number: location.page });
    const result = data.data.pressItems;
    if (outOfRange(result.pagination)) throw new PublicApiError('找不到頁面。', { status: 404 });
    return result;
  }, {
    start: () => { listing.value = publicCache.peek(publicPagePath('press', location.page))?.data?.pressItems || null; missing.value = false; failed.value = false; },
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
  return listing.value && pageData.value ? pageSeo(pageData.value, origin + url.value.canonicalPath) : null;
});
</script>

<template>
  <NotFoundView v-if="missing" />
  <main v-else id="press-list-page">
    <HeaderSection v-if="header" :title="header.content.title" :subTitle="header.content.subtitle" :content="header.content.body_text" />
    <div class="main-container">
      <div v-if="failed" role="alert"><p>媒體資料暫時無法載入，請稍後再試。</p><button type="button" @click="load(true)">重新載入</button></div>
      <CardListSection v-else :press-list="listing?.items || []" />
      <div v-if="listing?.pagination.totalPages > 1" class="pagination-box">
        <MainPagination :total-items="listing.pagination.total" :items-per-page="12" :max-pages-shown="5" :model-value="url.page" />
      </div>
    </div>
  </main>
</template>
