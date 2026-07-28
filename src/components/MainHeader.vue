<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useUIStore } from "../store/index";
import MainButton from "./MainButton.vue";
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
        <li class="project-menu-item" ref="projectMenuRef">
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
              <RouterLink
                to="/works?category=1"
                @click="projectDropdownOpen = false"
              >
                <p>
                  <span>住宅空間</span>
                  <span>RESIDENTIAL</span>
                </p>
              </RouterLink>
              <RouterLink
                to="/works?category=2"
                @click="projectDropdownOpen = false"
              >
                <p>
                  <span>建築設計</span>
                  <span>ARCHITECTURE</span>
                </p>
              </RouterLink>
              <RouterLink
                to="/works?category=3"
                @click="projectDropdownOpen = false"
              >
                <p>
                  <span>商業空間</span>
                  <span>COMMERCIAL</span>
                </p>
              </RouterLink>
              <RouterLink
                to="/works?category=4"
                @click="projectDropdownOpen = false"
              >
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

      <div class="social-box">
        <a href="https://zh-tw.facebook.com/rxmdesign" target="_blank">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            fill="currentColor"
          >
            <path
              d="M160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L258.2 544L258.2 398.2L205.4 398.2L205.4 320L258.2 320L258.2 286.3C258.2 199.2 297.6 158.8 383.2 158.8C399.4 158.8 427.4 162 438.9 165.2L438.9 236C432.9 235.4 422.4 235 409.3 235C367.3 235 351.1 250.9 351.1 292.2L351.1 320L434.7 320L420.3 398.2L351 398.2L351 544L480 544C515.3 544 544 515.3 544 480L544 160C544 124.7 515.3 96 480 96L160 96z"
            />
          </svg>
        </a>
        <a href="https://www.instagram.com/rmdesigntw/" target="_blank">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            fill="currentColor"
          >
            <path
              d="M320.3 205C256.8 204.8 205.2 256.2 205 319.7C204.8 383.2 256.2 434.8 319.7 435C383.2 435.2 434.8 383.8 435 320.3C435.2 256.8 383.8 205.2 320.3 205zM319.7 245.4C360.9 245.2 394.4 278.5 394.6 319.7C394.8 360.9 361.5 394.4 320.3 394.6C279.1 394.8 245.6 361.5 245.4 320.3C245.2 279.1 278.5 245.6 319.7 245.4zM413.1 200.3C413.1 185.5 425.1 173.5 439.9 173.5C454.7 173.5 466.7 185.5 466.7 200.3C466.7 215.1 454.7 227.1 439.9 227.1C425.1 227.1 413.1 215.1 413.1 200.3zM542.8 227.5C541.1 191.6 532.9 159.8 506.6 133.6C480.4 107.4 448.6 99.2 412.7 97.4C375.7 95.3 264.8 95.3 227.8 97.4C192 99.1 160.2 107.3 133.9 133.5C107.6 159.7 99.5 191.5 97.7 227.4C95.6 264.4 95.6 375.3 97.7 412.3C99.4 448.2 107.6 480 133.9 506.2C160.2 532.4 191.9 540.6 227.8 542.4C264.8 544.5 375.7 544.5 412.7 542.4C448.6 540.7 480.4 532.5 506.6 506.2C532.8 480 541 448.2 542.8 412.3C544.9 375.3 544.9 264.5 542.8 227.5zM495 452C487.2 471.6 472.1 486.7 452.4 494.6C422.9 506.3 352.9 503.6 320.3 503.6C287.7 503.6 217.6 506.2 188.2 494.6C168.6 486.8 153.5 471.7 145.6 452C133.9 422.5 136.6 352.5 136.6 319.9C136.6 287.3 134 217.2 145.6 187.8C153.4 168.2 168.5 153.1 188.2 145.2C217.7 133.5 287.7 136.2 320.3 136.2C352.9 136.2 423 133.6 452.4 145.2C472 153 487.1 168.1 495 187.8C506.7 217.3 504 287.3 504 319.9C504 352.5 506.7 422.6 495 452z"
            />
          </svg>
        </a>
        <a href="https://www.youtube.com/channel/UCyh_r5QT0oz4kWqhF_0yUUg" target="_blank">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            fill="currentColor"
          >
            <path
              d="M581.7 188.1C575.5 164.4 556.9 145.8 533.4 139.5C490.9 128 320.1 128 320.1 128C320.1 128 149.3 128 106.7 139.5C83.2 145.8 64.7 164.4 58.4 188.1C47 231 47 320.4 47 320.4C47 320.4 47 409.8 58.4 452.7C64.7 476.3 83.2 494.2 106.7 500.5C149.3 512 320.1 512 320.1 512C320.1 512 490.9 512 533.5 500.5C557 494.2 575.5 476.3 581.8 452.7C593.2 409.8 593.2 320.4 593.2 320.4C593.2 320.4 593.2 231 581.8 188.1zM264.2 401.6L264.2 239.2L406.9 320.4L264.2 401.6z"
            />
          </svg>
        </a>
      </div>

      <div class="button-box">
        <MainButton
          type="link"
          link="/contact"
          :class="{ 'opacity-0 pointer-events-none': menuStatus }"
          :color="contactColor"
          text="CONTACT US"
        />

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
    </div>
  </nav>
</template>
