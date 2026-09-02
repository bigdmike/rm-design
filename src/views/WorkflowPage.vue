<script setup>
import { computed, ref, watch } from 'vue';
import { useHeaderStyleScrollHandler } from '../common/headerStyleScrollHandler';
import { usePublicPage } from '../common/usePublicPage.js';
import CoverSection from '../components/workflow/CoverSection.vue';
import SideCategoryNav from '../components/workflow/SideCategoryNav.vue';
import CategoryNav from '../components/workflow/CategoryNav.vue';
import PromiseSection from '../components/about/PromiseSection.vue';
import QualitySection from '../components/about/QualitySection.vue';
import ContactSection from '../components/about/ContactSection.vue';
import StepSection from '../components/workflow/StepSection.vue';
import QuestionSection from '../components/workflow/QuestionSection.vue';

const { pageData, error, reload } = usePublicPage('workflow');
const sections = computed(() => pageData.value?.sections || {});
const workflowList = computed(() => pageData.value?.data?.serviceTypes || []);
const questionList = computed(() => pageData.value?.data?.faqs || []);
const promiseList = computed(() => pageData.value?.data?.engineeringCommitments || []);
const categoryList = computed(() => workflowList.value.map((workflow) => ({
  name: workflow.title,
  id: workflow.id,
  count: `${workflow.steps.length} STEPS`,
})));
const activeCategory = ref(0);

watch(categoryList, (items) => {
  if (items.length && !items.some((item) => item.id === activeCategory.value)) activeCategory.value = items[0].id;
}, { immediate: true });

useHeaderStyleScrollHandler([
  { selector: '#about-cover-section', style: '', offset: 0 },
  { selector: '#workflow-step-section', style: 'cream', offset: 0 },
  { selector: '#about-quality-section', style: 'black', offset: 0 },
  { selector: '#workflow-question-section', style: 'cream', offset: 0 },
  { selector: '#about-promise-section', style: 'cream', offset: 0 },
  { selector: '#about-contact-section', style: 'black', offset: 0 },
]);
</script>

<template>
  <main v-if="pageData" id="workflow-page">
    <CoverSection :section="sections['workflow.cover']" />
    <div class="main-container">
      <SideCategoryNav :category-list="categoryList" v-model="activeCategory" />
      <CategoryNav :category-list="categoryList" v-model="activeCategory" />
      <StepSection :workflow-list="workflowList" :active-category="activeCategory" />
    </div>
    <PromiseSection :promise-list="promiseList" :section="sections['shared.engineering']" />
    <QuestionSection :question-list="questionList" :section="sections['workflow.faq_intro']" />
    <QualitySection :section="sections['shared.quality']" />
    <ContactSection :section="sections['shared.contact_cta']" />
  </main>
  <main v-else-if="error" class="main-container py-30">
    <p>頁面內容暫時無法載入。</p>
    <button type="button" @click="reload">重新載入</button>
  </main>
</template>
