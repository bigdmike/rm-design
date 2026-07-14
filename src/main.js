import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import router from './router'
import VueAwesomePaginate from "vue-awesome-paginate";
import "vue-awesome-paginate/dist/style.css";

import App from './App.vue'

const pinia = createPinia()

createApp(App)
    .use(pinia)
    .use(router)
    .use(VueAwesomePaginate)
    .mount('#app')