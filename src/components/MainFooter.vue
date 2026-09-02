<script setup>
import { computed, ref } from "vue";
const props = defineProps({
  categories: { type: Array, default: () => [] },
  settings: { type: Object, default: null },
  locations: { type: Array, default: () => [] },
});
const linkGroup = computed(() => [
  {
    title: "( CATEGORIES )",
    links: props.categories.length ? props.categories : [{ name: '全部案例', link: '/works' }],
  },
  {
    title: "( SITEMAP )",
    links: [
      {
        name: "關於我們",
        link: "/about",
      },
      {
        name: "作品列表",
        link: "/works",
      },
      {
        name: "服務流程",
        link: "/workflow",
      },
      {
        name: "媒體採訪",
        link: "/press",
      },
    ],
  },
]);
const fallbackContactInfo = [
  {
    subTitle: "( TAIPEI )",
    title: "台北",
    content: [
      {
        type: "address",
        value: "台北市中山區南京東路二路111號6樓",
      },
      {
        type: "email",
        value: "rmdesigntw@gmail.com",
      },
      {
        type: "phone",
        value: "+886-2-2517-3011",
      },
    ],
  },
  {
    subTitle: "( TAICHUNG )",
    title: "台中",
    content: [
      {
        type: "address",
        value: "台中市潭子區興華一路353號",
      },
      {
        type: "email",
        value: "rmdesigntw@gmail.com",
      },
      {
        type: "phone",
        value: "+886-4-2535-7811",
      },
    ],
  },
  {
    subTitle: "( Kaohsiung )",
    title: "遇域空間設計",
    content: [
      {
        type: "address",
        value: "高雄市三民區陽明路207巷36號2樓",
      },
      {
        type: "instagram",
        value: "yuyu_design_tw",
      },
      {
        type: "phone",
        value: "+886-972528501  # 101967",
      },
    ],
  },
];
const contactInfo = computed(() => props.locations.length ? props.locations.map((location) => ({
  subTitle: `( ${location.subtitle || location.code.toUpperCase()} )`,
  title: location.name,
  content: [
    location.address && { type: 'address', value: location.address, href: location.mapUrl },
    location.email && { type: 'email', value: location.email, href: `mailto:${location.email}` },
    location.instagramLabel && { type: 'instagram', value: location.instagramLabel, href: location.instagramUrl },
    location.phone && { type: 'phone', value: location.phone, href: location.phoneHref },
  ].filter(Boolean),
})) : fallbackContactInfo)
const subMenuOpen = ref(false);
</script>

<template>
  <footer id="main-footer">
    <div class="main-container">
      <div class="title-box">
        <p class="title"><span>{{ settings?.footerTitleAccent || '阜居' }}</span>{{ settings?.footerTitleMain || '空間創意設計' }}</p>
        <img src="/img/home/core_value_background.png" alt="" loading="lazy" decoding="async" />
      </div>

      <div class="menu-box">
        <p class="title">( SITEMAP )</p>
        <ol>
          <li>
            <router-link to="/about">
              <span>關於我們</span>
            </router-link>
          </li>
          <li>
            <p @click="subMenuOpen = !subMenuOpen">
              <span>作品列表</span>
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  :class="subMenuOpen ? 'hidden' : ''"
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
            </p>
            <div class="sub-link-box" :class="subMenuOpen ? 'active' : ''">
              <router-link v-for="category in categories" :key="category.id" :to="category.link"><span>{{ category.name }}</span></router-link>
              <router-link v-if="!categories.length" to="/works"><span>全部案例</span></router-link>
            </div>
          </li>
          <li>
            <router-link to="/workflow">
              <span>服務流程</span>
            </router-link>
          </li>
          <li>
            <router-link to="/press">
              <span>媒體採訪</span>
            </router-link>
          </li>
        </ol>
      </div>

      <div class="link-list-box">
        <div
          class="link-box"
          v-for="(group, groupIndex) in linkGroup"
          :key="`link-group-${groupIndex}`"
        >
          <p class="title">{{ group.title }}</p>
          <ol>
            <li
              v-for="(link, linkIndex) in group.links"
              :key="`link-${linkIndex}`"
            >
              <a
                :href="link.link"
                v-if="link.external"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{{ link.name }}</span>
                <span>{{ link.name }}</span>
                <svg
                  v-if="groupIndex == 2"
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.5543 59.4429L60.5543 19.4429"
                    stroke="currentColor"
                    stroke-width="5"
                    stroke-linecap="square"
                    stroke-linejoin="round"
                  />
                  <mask id="path-2-inside-1_96_231" fill="currentColor">
                    <path d="M15 15L65 15V65" />
                  </mask>
                  <path
                    d="M15 10H10V20H15V15V10ZM65 15H70C70 12.2386 67.7614 10 65 10V15ZM60 65V70H70V65H65H60ZM15 15V20L65 20V15V10L15 10V15ZM65 15L60 15V65H65H70V15H65Z"
                    fill="currentColor"
                    mask="url(#path-2-inside-1_96_231)"
                  />
                </svg>
              </a>
              <router-link :to="link.link" v-else>
                <span>{{ link.name }}</span>
                <span>{{ link.name }}</span>
                <svg
                  v-if="groupIndex == 2"
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.5543 59.4429L60.5543 19.4429"
                    stroke="currentColor"
                    stroke-width="5"
                    stroke-linecap="square"
                    stroke-linejoin="round"
                  />
                  <mask id="path-2-inside-1_96_231" fill="currentColor">
                    <path d="M15 15L65 15V65" />
                  </mask>
                  <path
                    d="M15 10H10V20H15V15V10ZM65 15H70C70 12.2386 67.7614 10 65 10V15ZM60 65V70H70V65H65H60ZM15 15V20L65 20V15V10L15 10V15ZM65 15L60 15V65H65H70V15H65Z"
                    fill="currentColor"
                    mask="url(#path-2-inside-1_96_231)"
                  />
                </svg>
              </router-link>
            </li>
          </ol>
        </div>

        <div class="link-box">
          <p class="title">( CONNECT )</p>
          <ol>
            <li>
              <a
                :href="settings?.blogUrl || 'https://blog.rmdesign.com.tw'"
                aria-label="部落格"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor">
                  <path
                    d="M288 88C288 74.7 298.7 64 312 64C457.8 64 576 182.2 576 328C576 341.3 565.3 352 552 352C538.7 352 528 341.3 528 328C528 208.7 431.3 112 312 112C298.7 112 288 101.3 288 88zM144 160C170.5 160 192 181.5 192 208L192 432C192 458.5 213.5 480 240 480C266.5 480 288 458.5 288 432C288 405.5 266.5 384 240 384C231.2 384 224 376.8 224 368L224 304C224 295.2 231.2 288 240 288C319.5 288 384 352.5 384 432C384 511.5 319.5 576 240 576C160.5 576 96 511.5 96 432L96 208C96 181.5 117.5 160 144 160zM312 160C404.8 160 480 235.2 480 328C480 341.3 469.3 352 456 352C442.7 352 432 341.3 432 328C432 261.7 378.3 208 312 208C298.7 208 288 197.3 288 184C288 170.7 298.7 160 312 160z"
                  />
                </svg>
              </a>
            </li>

            <li>
              <a
                :href="settings?.instagramUrl || 'https://www.instagram.com/rmdesigntw/'"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
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
            </li>

            <li>
              <a
                :href="settings?.facebookUrl || 'https://zh-tw.facebook.com/rxmdesign'"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
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
            </li>

            <li>
              <a
                href="https://www.youtube.com/channel/UCyh_r5QT0oz4kWqhF_0yUUg"
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
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
            </li>
          </ol>
        </div>
      </div>

      <div class="info-list-box">
        <div
          class="info-box"
          v-for="(info, infoIndex) in contactInfo"
          :key="`info-group-${infoIndex}`"
        >
          <p class="sub-title">{{ info.subTitle }}</p>
          <p class="title">{{ info.title }}</p>
          <ol>
            <li
              v-for="(content, contentIndex) in info.content"
              :key="`info-content-${contentIndex}`"
            >
              <a
                v-if="content.type === 'address'"
                class="preserve-whitespace"
                :href="content.href || `https://www.google.com/maps/place/${content.value}`"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_444_9006)">
                    <path
                      d="M19.3637 12.8636C19.3637 18.5909 12.0001 23.5 12.0001 23.5C12.0001 23.5 4.63647 18.5909 4.63647 12.8636C4.63647 10.9107 5.41228 9.03771 6.79323 7.65676C8.17418 6.27581 10.0472 5.5 12.0001 5.5C13.9531 5.5 15.826 6.27581 17.207 7.65676C18.5879 9.03771 19.3637 10.9107 19.3637 12.8636Z"
                      fill="#CC333A"
                      stroke="black"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12.0002 15.3183C13.3558 15.3183 14.4547 14.2193 14.4547 12.8637C14.4547 11.5081 13.3558 10.4092 12.0002 10.4092C10.6446 10.4092 9.54565 11.5081 9.54565 12.8637C9.54565 14.2193 10.6446 15.3183 12.0002 15.3183Z"
                      fill="#CC333A"
                      stroke="black"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_444_9006">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                {{ content.value }}
              </a>
              <a
                v-else-if="content.type === 'email'"
                :href="content.href || `mailto:${content.value}`"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.8 4.7998H19.2C20.19 4.7998 21 5.6098 21 6.5998V17.3998C21 18.3898 20.19 19.1998 19.2 19.1998H4.8C3.81 19.1998 3 18.3898 3 17.3998V6.5998C3 5.6098 3.81 4.7998 4.8 4.7998Z"
                    fill="#CC333A"
                    stroke="black"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path d="M21 6.59961L12 12.8996L3 6.59961" fill="#CC333A" />
                  <path
                    d="M21 6.59961L12 12.8996L3 6.59961"
                    stroke="black"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                {{ content.value }}
              </a>
              <a
                v-else-if="content.type === 'phone'"
                :href="content.href || `tel:${content.value}`"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.9818 16.4765V19.1862C20.9829 19.4377 20.9313 19.6867 20.8306 19.9172C20.7298 20.1477 20.582 20.3546 20.3966 20.5247C20.2113 20.6947 19.9924 20.8242 19.7541 20.9048C19.5158 20.9854 19.2633 21.0153 19.0128 20.9927C16.2334 20.6907 13.5635 19.7409 11.2178 18.2197C9.03541 16.8329 7.18513 14.9827 5.79835 12.8003C4.27185 10.4439 3.32188 7.76107 3.0254 4.96915C3.00283 4.71938 3.03251 4.46764 3.11256 4.22996C3.19261 3.99229 3.32127 3.77389 3.49036 3.58866C3.65944 3.40343 3.86524 3.25544 4.09465 3.15411C4.32406 3.05278 4.57206 3.00032 4.82285 3.00009H7.53258C7.97092 2.99577 8.39589 3.151 8.72825 3.43683C9.06062 3.72267 9.27771 4.11961 9.33906 4.55366C9.45343 5.42084 9.66554 6.27229 9.97133 7.09177C10.0929 7.41507 10.1192 7.76642 10.0471 8.1042C9.97508 8.44198 9.80772 8.75203 9.56487 8.99761L8.41775 10.1447C9.70357 12.406 11.5759 14.2784 13.8372 15.5642L14.9843 14.4171C15.2299 14.1742 15.54 14.0069 15.8777 13.9348C16.2155 13.8628 16.5669 13.8891 16.8902 14.0106C17.7096 14.3164 18.5611 14.5285 19.4283 14.6429C19.867 14.7048 20.2677 14.9258 20.5542 15.2639C20.8406 15.6019 20.9928 16.0335 20.9818 16.4765Z"
                    fill="#CC333A"
                  />
                </svg>
                {{ content.value }}
              </a>
              <a
                v-else-if="content.type === 'instagram'"
                :href="content.href || `https://www.instagram.com/${content.value}`"
                target="_blank"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.0008 3C9.55657 3 9.24982 3.01069 8.28981 3.05438C7.33167 3.09825 6.67766 3.24994 6.10541 3.4725C5.51346 3.70238 5.01133 4.00988 4.51108 4.51031C4.01045 5.01056 3.70294 5.51269 3.47232 6.10444C3.24919 6.67687 3.09731 7.33106 3.05419 8.28881C3.01125 9.24881 3 9.55575 3 12C3 14.4443 3.01088 14.7501 3.05438 15.7101C3.09844 16.6682 3.25013 17.3222 3.47251 17.8944C3.70257 18.4864 4.01007 18.9885 4.51052 19.4888C5.01058 19.9894 5.51271 20.2976 6.10428 20.5275C6.67691 20.7501 7.33111 20.9018 8.28905 20.9456C9.24906 20.9893 9.55563 21 11.9997 21C14.4442 21 14.75 20.9893 15.71 20.9456C16.6681 20.9018 17.3229 20.7501 17.8955 20.5275C18.4873 20.2976 18.9887 19.9894 19.4887 19.4888C19.9894 18.9885 20.2969 18.4864 20.5275 17.8946C20.7487 17.3222 20.9006 16.668 20.9456 15.7103C20.9888 14.7503 21 14.4443 21 12C21 9.55575 20.9888 9.249 20.9456 8.289C20.9006 7.33087 20.7487 6.67687 20.5275 6.10462C20.2969 5.51269 19.9894 5.01056 19.4887 4.51031C18.9881 4.00969 18.4875 3.70219 17.895 3.4725C17.3212 3.24994 16.6668 3.09825 15.7087 3.05438C14.7487 3.01069 14.4431 3 11.998 3H12.0008ZM11.1935 4.62187C11.4331 4.6215 11.7005 4.62187 12.0008 4.62187C14.4039 4.62187 14.6887 4.6305 15.6376 4.67363C16.5151 4.71375 16.9914 4.86038 17.3086 4.98356C17.7287 5.14669 18.0281 5.34169 18.3429 5.65669C18.6579 5.97169 18.8529 6.27169 19.0164 6.69169C19.1396 7.00856 19.2864 7.48481 19.3264 8.36231C19.3695 9.31106 19.3789 9.59606 19.3789 11.9979C19.3789 14.3998 19.3695 14.6848 19.3264 15.6336C19.2862 16.5111 19.1396 16.9873 19.0164 17.3042C18.8533 17.7242 18.6579 18.0233 18.3429 18.3381C18.0279 18.6531 17.7288 18.8481 17.3086 19.0112C16.9918 19.1349 16.5151 19.2812 15.6376 19.3213C14.6889 19.3644 14.4039 19.3738 12.0008 19.3738C9.59763 19.3738 9.31282 19.3644 8.36406 19.3213C7.48655 19.2808 7.01029 19.1342 6.69285 19.011C6.27285 18.8479 5.97284 18.6529 5.65784 18.3379C5.34284 18.0229 5.14783 17.7236 4.98433 17.3034C4.86114 16.9866 4.71433 16.5103 4.67439 15.6328C4.63127 14.6841 4.62264 14.3991 4.62264 11.9957C4.62264 9.59231 4.63127 9.30881 4.67439 8.36006C4.71452 7.48256 4.86114 7.00631 4.98433 6.68906C5.14746 6.26906 5.34284 5.96906 5.65784 5.65406C5.97284 5.33906 6.27285 5.14406 6.69285 4.98056C7.0101 4.85681 7.48655 4.71056 8.36406 4.67025C9.19431 4.63275 9.51607 4.6215 11.1935 4.61963V4.62187ZM16.805 6.11625C16.2088 6.11625 15.725 6.59944 15.725 7.19587C15.725 7.79212 16.2088 8.27588 16.805 8.27588C17.4013 8.27588 17.885 7.79212 17.885 7.19587C17.885 6.59962 17.4013 6.11588 16.805 6.11588V6.11625ZM12.0008 7.37812C9.44838 7.37812 7.37892 9.44756 7.37892 12C7.37892 14.5524 9.44838 16.6209 12.0008 16.6209C14.5533 16.6209 16.622 14.5524 16.622 12C16.622 9.44756 14.5533 7.37812 12.0008 7.37812ZM12.0008 9C13.6576 9 15.0009 10.3431 15.0009 12C15.0009 13.6567 13.6576 15 12.0008 15C10.3439 15 9.00081 13.6567 9.00081 12C9.00081 10.3431 10.3439 9 12.0008 9Z"
                    fill="#CC333A"
                  />
                </svg>
                {{ content.value }}</a
              >
            </li>
          </ol>
        </div>
      </div>

      <div class="slogan-box">
        <i></i>
        <p>
          <span>『</span>
          用空間 說故事
          <span>』</span>
        </p>
      </div>

      <div class="copyright-box">
        <p class="copyright-text">{{ settings?.copyrightText || 'RM Design Co., Ltd © 2026' }}</p>
        <div class="link-box">
          <router-link to="/privacy-policy">隱私權政策</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>
