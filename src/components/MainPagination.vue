<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { listingPath, parsePublicUrl, paginationPages } from '../common/publicUrl.js';

const props = defineProps({
  totalItems: { type: Number, required: true },
  itemsPerPage: { type: Number, required: true },
  maxPagesShown: { type: Number, default: 5 },
  modelValue: { type: Number, default: 1 },
});
const route = useRoute();
const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage));
const pages = computed(() => paginationPages(props.modelValue, totalPages.value, props.maxPagesShown));
const href = (page) => listingPath(route.path, page, parsePublicUrl(route.fullPath)?.category || 'all');
</script>

<template>
  <nav id="main-pagination" aria-label="分頁" v-if="pages.length">
    <ol class="pagination-container">
      <li v-for="page in pages" :key="page">
        <RouterLink :to="href(page)" class="paginate-buttons number-buttons" :class="{ 'active-page': page === modelValue }"
          :aria-current="page === modelValue ? 'page' : undefined" :aria-label="'第 ' + page + ' 頁'">{{ page }}</RouterLink>
      </li>
    </ol>
  </nav>
</template>
