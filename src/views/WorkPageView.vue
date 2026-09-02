<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { MasonryGrid, MasonryGridItem } from 'vue3-masonry-css';
import { useHeaderStyleScrollHandler } from '../common/headerStyleScrollHandler';
import { useRouteSeo } from '../common/usePageMetaHead.js';
import { getInitialState } from '../common/initialState.js';
import { getPublicJson, publicCache } from '../common/publicApi.js';
import { usePublicPage } from '../common/usePublicPage.js';
import { errorSeo } from '../common/seo.js';
import { parsePublicUrl, isMissing, initialNotFound } from '../common/publicUrl.js';
import { useVisibleRefresh } from '../common/useVisibleRefresh.js';
import { latestRequest } from '../common/latestRequest.js';
import { imageAttributes, gallerySizes } from '../common/responsiveImage.js';
import ImageModal from '../components/workPage/ImageModal.vue';
import MainBreadcrumbs from '../components/MainBreadcrumbs.vue';
import { workBreadcrumbs } from '../common/breadcrumbs.js';
import MainButton from '../components/MainButton.vue';
import NotFoundView from './NotFoundView.vue';

const route = useRoute();
const initial = getInitialState();
const origin = initial?.frontendOrigin || window.location.origin;
const { pageData } = usePublicPage('works');
const ImageModalRef = ref(null);
const workData = ref(null);
const notFound = ref(false);
const failed = ref(false);
const url = computed(() => parsePublicUrl(route.fullPath));
const request = latestRequest();
let initialConsumed = false;

useHeaderStyleScrollHandler([
  { selector: '#work-page .cover-image-box .image-box', style: '', offset: 0 },
  { selector: '#work-page .article-header', style: 'black', offset: 0 },
  { selector: '#work-page .article-content', style: 'black', offset: 0 },
  { selector: '#work-page .article-gallery', style: 'black', offset: 0 },
], 'cream');

function loadWork(force = false) {
  const id = url.value?.id;
  if (!id) { request.invalidate(); return; }
  if (!initialConsumed && initialNotFound(initial, route.fullPath)) {
    initialConsumed = true; notFound.value = true; return;
  }
  initialConsumed = true;
  return request.run(async () => (await getPublicJson('/works/' + id, { force })).work, {
    start: () => { workData.value = publicCache.peek('/works/' + id)?.work || null; notFound.value = false; failed.value = false; },
    success: (work) => { workData.value = work; },
    error: (error) => { workData.value = null; notFound.value = isMissing(error); failed.value = !notFound.value; },
  });
}
watch(() => url.value?.id, () => loadWork(), { immediate: true, flush: 'sync' });
useVisibleRefresh(() => notFound.value ? undefined : loadWork());
onBeforeUnmount(() => request.invalidate());

useRouteSeo(() => {
  const siteName = pageData.value?.site?.settings?.siteName || initial?.site?.settings?.siteName;
  if (notFound.value || failed.value) return errorSeo(origin, siteName, notFound.value, notFound.value ? '/404' : url.value?.canonicalPath);
  if (workData.value?.id === url.value?.id) return workData.value.seo;
  // Clear the previous article's schema and sharing image while the next case loads.
  return { title: '設計案例', description: '', canonical: origin + (url.value?.canonicalPath || '/works'), ogType: 'website', ogImage: '', jsonLd: null };
});
const breadcrumbs = computed(() => workData.value ? workBreadcrumbs(url.value.canonicalPath, { id: workData.value.categoryId, name: workData.value.category }, workData.value) : []);
const openImageModal = (index) => ImageModalRef.value?.openModal(index);
</script>

<template>
  <main v-if="workData" id="work-page">
    <article>
      <div class="cover-image-box">
        <figure class="image-box"><img v-bind="imageAttributes(workData.cover || { url: workData.coverImage }, { loading: 'eager', priority: 'high' })" :alt="workData.coverAlt ?? `${workData.title} 封面`" /></figure>
      </div>
      <header class="article-header">
        <div class="main-container">
          <p class="article-sub-title">( WORKS )</p>
          <h1 class="article-title">{{ workData.title }}</h1>
          <p class="article-location">{{ workData.location }}</p>
          <p class="article-slogan">{{ workData.slogan }}</p>
          <MainBreadcrumbs :items="breadcrumbs" />
        </div>
      </header>
      <section class="article-content">
        <div class="main-container"><div class="content-box">
          <div class="content editor-content" v-html="workData.content"></div>
          <div v-if="workData.detailLink" class="button-box"><MainButton type="external" :link="workData.detailLink" color="cream" text="查看設計細節" /></div>
        </div></div>
      </section>
      <section class="article-gallery" aria-label="作品照片集"><div class="image-box">
        <MasonryGrid :columns="{ default: 3, 1024: 3, 768: 2 }" :gutter="{ default: 20, 768: 12, 640: 8 }">
          <MasonryGridItem v-for="(image, index) in workData.imageItems" :key="image.url">
            <img v-bind="imageAttributes(image, { sizes: gallerySizes, maxWidth: 1600 })" :alt="image.altText ?? `${workData.title} 作品照片 ${index + 1}`" role="button" tabindex="0" :aria-label="`放大 ${workData.title} 作品照片 ${index + 1}`" @click="openImageModal(index)" @keydown.enter="openImageModal(index)" @keydown.space.prevent="openImageModal(index)" />
          </MasonryGridItem>
        </MasonryGrid>
      </div></section>
    </article>
    <ImageModal ref="ImageModalRef" :image-list="workData.images" :title="workData.title" />
  </main>
  <NotFoundView v-else-if="notFound" />
  <main v-else-if="failed" class="main-container py-30" role="alert">
    <h1 class="text-4xl mb-5">案例暫時無法載入</h1>
    <p>目前連線或服務暫時發生問題，請稍後再試。</p>
    <button type="button" @click="loadWork(true)">重新載入</button>
  </main>
</template>
