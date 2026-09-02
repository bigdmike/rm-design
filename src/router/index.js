import { createWebHistory, createRouter } from 'vue-router'
import NotFoundView from '../views/NotFoundView.vue'

const routes = [
  { path: '/index.html', redirect: (to) => ({ path: '/', query: to.query, hash: to.hash }) },
  { path: '/', component: () => import('../views/HomeView.vue'),meta: { title: '首頁', apiPage: 'home' } },
  { path: '/about', component: () => import('../views/AboutView.vue'), meta: { title: '關於我們', apiPage: 'about' } },
  { path: '/works', component: () => import('../views/WorkListView.vue'), meta: { title: '設計案例', apiPage: 'works' } },
  { path: '/works/:id', component: () => import('../views/WorkPageView.vue'), meta: { title: '設計案例', apiPage: 'works' } },
  { path: '/press', component: () => import('../views/PressListView.vue'), meta: { title: '媒體採訪', apiPage: 'press' } },
  { path: '/contact', component: () => import('../views/ContactView.vue'), meta: { title: '聯絡我們', apiPage: 'contact' } },
  { path: '/workflow', component: () => import('../views/WorkflowPage.vue'), meta: { title: '服務流程', apiPage: 'workflow' } },
  { path: '/privacy-policy', component: () => import('../views/TermsPageView.vue'), meta: { title: '隱私政策', apiPage: 'privacy' } },
  { path: '/:pathMatch(.*)*', component: NotFoundView, meta: { title: '找不到頁面' } },
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
