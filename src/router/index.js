import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/', component: () => import('../views/HomeView.vue') },
  { path: '/about', component: () => import('../views/AboutView.vue') },
  { path: '/works', component: () => import('../views/WorkListView.vue') },
  { path: '/works/:id', component: () => import('../views/WorkPageView.vue') },
  { path: '/press', component: () => import('../views/PressListView.vue') },
  { path: '/contact', component: () => import('../views/ContactView.vue') },
  { path: '/workflow', component: () => import('../views/WorkflowPage.vue') },
  { path: '/privacy-policy', component: () => import('../views/TermsPageView.vue') },
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