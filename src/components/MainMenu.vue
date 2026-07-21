<script setup>
import { computed, ref, watch } from "vue";
import { useUIStore } from "../store/index";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import MainButton from "./MainButton.vue";
const uiStore = useUIStore();

const toggleMenu = () => {
  uiStore.toggleMenu();
};
const menuStatus = computed(() => uiStore.menuOpen);
const menuStatusClass = ref("");
const subMenuStatus = ref(false);
const headerStyleTmp = ref(uiStore.headerStyle);

const linkList = [
  {
    name: "部落格",
    link: "/blog",
  },
  {
    name: "Instagram",
    link: "https://www.instagram.com/rmdesigntw/",
  },
  {
    name: "Facebook",
    link: "https://zh-tw.facebook.com/rxmdesign",
  },
  {
    name: "YouTube",
    link: "https://www.youtube.com/channel/UCyh_r5QT0oz4kWqhF_0yUUg",
  },
  {
    name: "Pinterest",
    link: "https://pin.it/6lILgPi",
  },
];

watch(menuStatus, (newValue) => {
  if (newValue) {
    menuStatusClass.value = "open";
    headerStyleTmp.value = uiStore.headerStyle;

    const modalElement = document.querySelector("#main-menu .menu-container");
    disableBodyScroll(modalElement);
    uiStore.setHeaderStyle("black");
  } else {
    subMenuStatus.value = false;
    menuStatusClass.value = "close";

    const modalElement = document.querySelector("#main-menu .menu-container");
    enableBodyScroll(modalElement);
    uiStore.setHeaderStyle(headerStyleTmp.value);
  }
});
</script>

<template>
  <aside id="main-menu" :class="menuStatusClass">
    <div class="menu-container">
      <ol class="menu-list">
        <li>
          <router-link to="/about" class="menu-item" @click="toggleMenu">
            <p>關於我們</p>
            <span>ABOUT RM</span>
          </router-link>
        </li>
        <li>
          <div class="menu-item" @click="subMenuStatus = !subMenuStatus">
            <p>作品列表</p>
            <span>WORKS</span>

            <svg
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              :class="subMenuStatus ? 'active' : ''"
            >
              <path
                d="M20 13V27"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13 20H27"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>

          <div class="sub-menu-list" :class="subMenuStatus ? 'open' : ''">
            <router-link to="/works?category=1" @click="toggleMenu">
              <p>住宅空間</p>
              <span>RESIDENTIAL</span>
            </router-link>
            <router-link to="/works?category=2" @click="toggleMenu">
              <p>建築設計</p>
              <span>ARCHITECTURE</span>
            </router-link>
            <router-link to="/works?category=3" @click="toggleMenu">
              <p>商業空間</p>
              <span>COMMERCIAL</span>
            </router-link>
            <router-link to="/works?category=4" @click="toggleMenu">
              <p>公共空間</p>
              <span>PUBLIC</span>
            </router-link>
          </div>
        </li>
        <li>
          <router-link to="/workflow" class="menu-item" @click="toggleMenu">
            <p>服務流程</p>
            <span>WORKFLOW</span>
          </router-link>
        </li>
        <li>
          <router-link to="/press" class="menu-item" @click="toggleMenu">
            <p>媒體採訪</p>
            <span>PRESS</span>
          </router-link>
        </li>
        <li>
          <a
            href="https://blog.rmdesign.com.tw"
            target="_blank"
            class="menu-item"
          >
            <p>部落格</p>
            <span>BLOG</span>
          </a>
        </li>
      </ol>
      <div class="contact-box">
         <MainButton
          type="link"
          link="/contact"
          color="cream"
          text="CONTACT US"
          @click="toggleMenu"
        />
      </div>
      <div class="connect-box">
        <p>( CONNECT )</p>
        <ol class="link-list">
          <li v-for="(item, index) in linkList" :key="index">
            <a :href="item.link" target="_blank" rel="noopener noreferrer">
              <span>{{ item.name }}</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.3335 11.6671L11.9335 2.06714"
                  stroke="white"
                  stroke-width="1.33333"
                  stroke-linecap="square"
                  stroke-linejoin="round"
                />
                <mask id="path-2-inside-1_431_8030" fill="white">
                  <path d="M1.00024 1L13.0002 1V13" />
                </mask>
                <path
                  d="M1.00024 -0.333333H-0.333089V2.33333H1.00024V1V-0.333333ZM13.0002 1H14.3336C14.3336 0.26362 13.7366 -0.333333 13.0002 -0.333333V1ZM11.6669 13V14.3333H14.3336V13H13.0002H11.6669ZM1.00024 1V2.33333L13.0002 2.33333V1V-0.333333L1.00024 -0.333333V1ZM13.0002 1H11.6669V13H13.0002H14.3336V1H13.0002Z"
                  fill="white"
                  mask="url(#path-2-inside-1_431_8030)"
                />
              </svg>
            </a>
          </li>
        </ol>
      </div>
    </div>
    <div class="background-box"></div>
  </aside>
</template>
