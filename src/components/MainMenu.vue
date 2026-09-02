<script setup>
import { computed, ref, watch, nextTick, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { useUIStore } from "../store/index";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import MainButton from "./MainButton.vue";
const uiStore = useUIStore();
const props = defineProps({ categories: { type: Array, default: () => [] }, settings: { type: Object, default: null } });

const toggleMenu = () => {
  uiStore.toggleMenu();
};
const menuStatus = computed(() => uiStore.menuOpen);
const menuStatusClass = ref("");
const subMenuStatus = ref(false);
const headerStyleTmp = ref(uiStore.headerStyle);
const menuElement = ref(null);
const route = useRoute();
let previousFocus;
let desktopQuery;

const closeMenu = () => { if (menuStatus.value) uiStore.toggleMenu(); };
const focusableMenuItems = () => [document.querySelector('#site-menu-toggle'), ...menuElement.value.querySelectorAll('a, button')]
  .filter(el => el && !el.closest('[inert]') && el.getClientRects().length);
const menuKeydown = (event) => {
  if (!menuStatus.value) return;
  if (event.key === 'Escape') { event.preventDefault(); closeMenu(); return; }
  if (event.key !== 'Tab') return;
  const items = focusableMenuItems();
  const first = items[0], last = items.at(-1);
  if (!first) return;
  if (event.shiftKey && (document.activeElement === first || !items.includes(document.activeElement))) {
    event.preventDefault(); last.focus();
  } else if (!event.shiftKey && (document.activeElement === last || !items.includes(document.activeElement))) {
    event.preventDefault(); first.focus();
  }
};
const desktopChanged = (event) => { if (event.matches) closeMenu(); };
watch(() => route.fullPath, closeMenu);
onMounted(() => {
  document.addEventListener('keydown', menuKeydown);
  desktopQuery = window.matchMedia('(min-width: 1280px)');
  desktopQuery.addEventListener('change', desktopChanged);
});
onBeforeUnmount(() => {
  document.removeEventListener('keydown', menuKeydown);
  desktopQuery?.removeEventListener('change', desktopChanged);
  const target = menuElement.value?.querySelector('.menu-container');
  if (target) enableBodyScroll(target);
});

const linkList = computed(() => [
  {
    name: "部落格",
    link: props.settings?.blogUrl || 'https://blog.rmdesign.com.tw',
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
]);

watch(menuStatus, (newValue) => {
  if (newValue) {
    previousFocus = document.activeElement;
    menuStatusClass.value = "open";
    headerStyleTmp.value = uiStore.headerStyle;

    const modalElement = document.querySelector("#main-menu .menu-container");
    disableBodyScroll(modalElement);
    uiStore.setHeaderStyle("black");
    nextTick(() => {
      if (menuStatus.value) menuElement.value?.querySelector('a')?.focus();
    });
  } else {
    subMenuStatus.value = false;
    menuStatusClass.value = "close";

    const modalElement = document.querySelector("#main-menu .menu-container");
    enableBodyScroll(modalElement);
    uiStore.setHeaderStyle(headerStyleTmp.value);
    if (menuElement.value?.contains(document.activeElement)) {
      const trigger = document.querySelector('#site-menu-toggle');
      if (trigger?.getClientRects().length) trigger.focus();
      else if (previousFocus?.isConnected && previousFocus.getClientRects().length) previousFocus.focus();
    }
  }
});
</script>

<template>
  <aside id="main-menu" ref="menuElement" :class="menuStatusClass" :inert="!menuStatus" :aria-hidden="!menuStatus" aria-label="網站選單">
    <div class="menu-container">
      <ol class="menu-list">
        <li>
          <router-link to="/about" class="menu-item" @click="toggleMenu">
            <p>關於我們</p>
            <span>ABOUT RM</span>
          </router-link>
        </li>
        <li>
          <button type="button" class="menu-item menu-disclosure" :aria-expanded="subMenuStatus" aria-controls="mobile-category-links" @click="subMenuStatus = !subMenuStatus">
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
          </button>

          <div id="mobile-category-links" class="sub-menu-list" :class="subMenuStatus ? 'open' : ''" :inert="!subMenuStatus" :aria-hidden="!subMenuStatus">
            <router-link v-for="category in categories" :key="category.id" :to="category.link" @click="toggleMenu">
              <p>{{ category.name }}</p>
              <span>{{ category.english }}</span>
            </router-link>
            <router-link v-if="!categories.length" to="/works" @click="toggleMenu"><p>全部案例</p></router-link>
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
            :href="settings?.blogUrl || 'https://blog.rmdesign.com.tw'"
            target="_blank"
            rel="noopener noreferrer"
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
