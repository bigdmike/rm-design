<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useUIStore } from "../store/index";
import MainButton from "./MainButton.vue";
const uiStore = useUIStore();
defineProps({ categories: { type: Array, default: () => [] }, settings: { type: Object, default: null } });

const toggleMenu = () => {
  uiStore.toggleMenu();
};
const menuStatus = computed(() => uiStore.menuOpen);
const headerStyle = computed(() => uiStore.headerStyle);

const projectDropdownOpen = ref(false);
const projectMenuRef = ref(null);

const toggleProjectDropdown = () => {
  projectDropdownOpen.value = !projectDropdownOpen.value;
};

const closeProjectDropdown = () => {
  projectDropdownOpen.value = false;
};

const dismissProjectDropdown = (event) => {
  if (!projectDropdownOpen.value) return;
  event.preventDefault();
  event.stopPropagation();
  closeProjectDropdown();
  projectMenuRef.value?.querySelector('button')?.focus();
};

const leaveProjectDropdown = (event) => {
  if (!projectMenuRef.value?.contains(event.relatedTarget)) closeProjectDropdown();
};

const handleClickOutside = (event) => {
  if (!projectMenuRef.value) return;
  if (!projectMenuRef.value.contains(event.target)) {
    closeProjectDropdown();
  }
};

const contactColor = computed(() => {
  if (headerStyle.value === "cream") {
    return "primary";
  } else if (headerStyle.value === "black" || headerStyle.value === "") {
    return "cream";
  }
  return ""; // Default color if none of the conditions match
});

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <nav id="main-header" :class="headerStyle">
    <div class="main-container">
      <RouterLink to="/" class="logo-box">
        <img src="/img/nav_logo.svg" :alt="settings?.siteName || '阜居空間設計'" />
      </RouterLink>

      <ol class="menu-list">
        <li>
          <RouterLink to="/about">
            <i></i>
            <p>
              <span>關於我們</span>
              <span>ABOUT RM</span>
            </p>
          </RouterLink>
        </li>
        <li class="project-menu-item" ref="projectMenuRef" @keydown.esc="dismissProjectDropdown" @focusout="leaveProjectDropdown">
          <button
            type="button"
            class="project-dropdown-trigger"
            :class="projectDropdownOpen ? 'active' : ''"
            :aria-expanded="projectDropdownOpen"
            aria-controls="project-category-links"
            @click.stop="toggleProjectDropdown"
          >
            <i></i>
            <p>
              <span>設計案例</span>
              <span>PROJECT</span>
            </p>
          </button>

          <div
            id="project-category-links"
            class="project-dropdown"
            :class="projectDropdownOpen ? 'open' : ''"
            :inert="!projectDropdownOpen"
            :aria-hidden="!projectDropdownOpen"
          >
            <div class="image-box">
              <img src="/img/img-wrap.png" alt="" loading="lazy" decoding="async" />
            </div>
            <div class="link-box">
              <p class="sub-title">( WORKS )</p>
              <RouterLink
                v-for="category in categories"
                :key="category.id"
                :to="category.link"
                @click="projectDropdownOpen = false"
              >
                <p>
                  <span>{{ category.name }}</span>
                  <span>{{ category.english }}</span>
                </p>
              </RouterLink>
              <RouterLink v-if="!categories.length" to="/works" @click="projectDropdownOpen = false"><p>全部案例</p></RouterLink>
            </div>
          </div>
        </li>
        <li>
          <RouterLink to="/workflow">
            <i></i>
            <p>
              <span>服務流程</span>
              <span>WORK FLOW</span>
            </p>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/press">
            <i></i>
            <p>
              <span>媒體採訪</span>
              <span>PRESS</span>
            </p>
          </RouterLink>
        </li>
        <li>
          <a :href="settings?.blogUrl || 'https://blog.rmdesign.com.tw'" target="_blank" rel="noopener noreferrer">
            <i></i>
            <p>
              <span>部落格</span>
              <span>BLOG</span>
            </p>
          </a>
        </li>
        <li>
          <RouterLink to="/contact">
            <i></i>
            <p>
              <span>聯絡我們</span>
              <span>CONTACT</span>
            </p>
          </RouterLink>
        </li>
      </ol>

      <div class="button-box">
        <!-- <MainButton
          type="link"
          link="/contact"
          :class="{ 'opacity-0 pointer-events-none': menuStatus }"
          :color="contactColor"
          text="CONTACT US"
        /> -->

        <button
          id="site-menu-toggle"
          type="button"
          class="menu-btn"
          :class="menuStatus ? 'active' : ''"
          :aria-label="menuStatus ? '關閉網站選單' : '開啟網站選單'"
          :aria-expanded="menuStatus"
          aria-controls="main-menu"
          @click="toggleMenu"
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 20H30"
              :stroke="headerStyle === 'cream' ? '#000' : '#fff'"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M10 13.3334H30"
              :stroke="headerStyle === 'cream' ? '#000' : '#fff'"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M10 26.6667H30"
              :stroke="headerStyle === 'cream' ? '#000' : '#fff'"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>
