<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useUIStore } from "../store/index";
const uiStore = useUIStore();

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

const handleClickOutside = (event) => {
  if (!projectMenuRef.value) return;
  if (!projectMenuRef.value.contains(event.target)) {
    closeProjectDropdown();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <nav id="main-header" :class="headerStyle">
    <RouterLink to="/" class="logo-box">
      <img src="/img/nav_logo.svg" />
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
      <li class="project-menu-item active" ref="projectMenuRef">
        <button
          type="button"
          class="project-dropdown-trigger"
          :class="projectDropdownOpen ? 'active' : ''"
          :aria-expanded="projectDropdownOpen"
          aria-haspopup="true"
          @click.stop="toggleProjectDropdown"
        >
          <i></i>
          <p>
            <span>設計案例</span>
            <span>PROJECT</span>
          </p>
        </button>

        <div
          class="project-dropdown"
          :class="projectDropdownOpen ? 'open' : ''"
        >
          <div class="image-box">
            <img src="/img/img-wrap.png" />
          </div>
          <div class="link-box">
            <p class="sub-title">( WORKS )</p>
            <RouterLink to="/works?category=1" @click="projectDropdownOpen = false">
              <p>
                <span>住宅空間</span>
                <span>RESIDENTIAL</span>
              </p>
            </RouterLink>
            <RouterLink to="/works?category=2" @click="projectDropdownOpen = false">
              <p>
                <span>建築設計</span>
                <span>ARCHITECTURE</span>
              </p>
            </RouterLink>
            <RouterLink to="/works?category=3" @click="projectDropdownOpen = false">
              <p>
                <span>商業空間</span>
                <span>COMMERCIAL</span>
              </p>
            </RouterLink>
            <RouterLink to="/works?category=4" @click="projectDropdownOpen = false">
              <p>
                <span>公共空間</span>
                <span>PUBLIC</span>
              </p>
            </RouterLink>
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
        <a href="https://blog.rmdesign.com.tw" target="_blank">
          <i></i>
          <p>
            <span>部落格</span>
            <span>BLOG</span>
          </p>
        </a>
      </li>
    </ol>

    <div class="button-box">
      <RouterLink
        to="/contact"
        class="main-btn cream"
        :class="{
          'opacity-0 pointer-events-none': menuStatus,
          cream: headerStyle === 'black' || headerStyle === '',
          primary: headerStyle === 'cream',
        }"
      >
        <p>
          <span>CONTACT US</span>
          <span>CONTACT US</span>
        </p>
        <i></i>
        <i></i>
      </RouterLink>

      <button
        class="menu-btn"
        :class="menuStatus ? 'active' : ''"
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
  </nav>
</template>
