import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/', component: () => import('../views/HomeView.vue'),meta: { title: '首頁' } },
  { path: '/about', component: () => import('../views/AboutView.vue'), meta: { title: '關於我們' } },
  { path: '/works', component: () => import('../views/WorkListView.vue'), meta: { title: '設計案例' } },
  { path: '/works/:id', component: () => import('../views/WorkPageView.vue'), meta: { title: '設計案例' } },
  { path: '/press', component: () => import('../views/PressListView.vue'), meta: { title: '媒體採訪' } },
  { path: '/contact', component: () => import('../views/ContactView.vue'), meta: { title: '聯絡我們' } },
  { path: '/workflow', component: () => import('../views/WorkflowPage.vue'), meta: { title: '服務流程' } },
  { path: '/privacy-policy', component: () => import('../views/TermsPageView.vue'), meta: { title: '隱私政策' } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    return { top: 0, left: 0 }
  },
})

export default router