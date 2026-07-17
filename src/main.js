import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue/client' // 引入 createHead
import './style.css'
import router from './router'
import VueAwesomePaginate from "vue-awesome-paginate";
import "vue-awesome-paginate/dist/style.css";

import App from './App.vue'

const pinia = createPinia()
const head = createHead()

createApp(App)
    .use(pinia)
    .use(router)
    .use(VueAwesomePaginate)
    .use(head)
    .mount('#app')