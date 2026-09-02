import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue/client' // 引入 createHead
import './style.css'
import router from './router'

import App from './App.vue'

const pinia = createPinia()
const head = createHead()

const app = createApp(App)
    .use(pinia)
    .use(router)
    .use(head)

router.isReady().then(() => {
  // Keep the correct PHP head until the initial route and its component are ready.
  document.head.querySelectorAll('[data-rm-seo]').forEach((element) => element.remove())
  document.getElementById('app')?.removeAttribute('data-server-rendered')
  app.mount('#app')
})
