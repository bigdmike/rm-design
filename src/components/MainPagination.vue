<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  totalItems: {
    type: Number,
    required: true,
    default: 50,
  },
  itemsPerPage: {
    type: Number,
    required: true,
    default: 5,
  },
  maxPagesShown: {
    type: Number,
    required: true,
    default: 5,
  },
  modelValue: {
    type: Number,
    required: true,
    default: 1,
  },
});
const emit = defineEmits(["update:modelValue"]);
const currentPage = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>

<template>
  <div id="main-pagination">
  <vue-awesome-paginate
    :total-items="props.totalItems"
    :items-per-page="props.itemsPerPage"
    :max-pages-shown="props.maxPagesShown"
    :hide-prev-next-when-ends="true"
    :hide-prev-next="true"
    v-model="currentPage"
  />
  </div>
</template>
