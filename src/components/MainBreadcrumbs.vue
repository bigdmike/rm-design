<script setup>
defineProps({ items: { type: Array, required: true } });
</script>

<template>
  <nav class="main-breadcrumbs" aria-label="麵包屑導覽">
    <ol><li v-for="(item, index) in items" :key="item.path">
      <RouterLink v-if="index < items.length - 1" :to="item.path">{{ item.name }}</RouterLink>
      <span v-else aria-current="page">{{ item.name }}</span>
    </li></ol>
  </nav>
</template>
