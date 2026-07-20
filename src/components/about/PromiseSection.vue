<script setup>
const promiseList = [
  {
    title: "水電配線指定品牌—太平洋電線（或同等級品牌）",
    image: "/rm-design/img/about/promise-1.png",
    link: "https://blog.rmdesign.com.tw/2021/06/blog-post_99.html",
  },
  {
    title: "水電配線指定年份—3年內",
    image: "/rm-design/img/about/promise-2.png",
    link: "https://blog.rmdesign.com.tw/2021/07/blog-post_11.html",
  },
  {
    title: "插座電線配線指定線徑 2.0mm",
    image: "/rm-design/img/about/promise-3.png",
    link: "https://blog.rmdesign.com.tw/2021/06/20mm.html",
  },
  {
    title: "專用插座電線迴路指定截面積5.5mm",
    image: "/rm-design/img/about/promise-4.png",
    link: "https://blog.rmdesign.com.tw/2021/06/55mm.html",
  },
  {
    title: "全室地板防水層",
    image: "/rm-design/img/about/promise-5.png",
    link: "https://blog.rmdesign.com.tw/2021/07/blog-post_76.html",
  },
  {
    title: "浴廁空間全室五道防水層",
    image: "/rm-design/img/about/promise-6.png",
    link: "https://blog.rmdesign.com.tw/2021/07/blog-post_1.html",
  },
  {
    title: "浴廁空間試水 72 小時",
    image: "/rm-design/img/about/promise-7.png",
    link: "https://blog.rmdesign.com.tw/2021/06/72.html",
  },
  {
    title: "磁磚雙面塗抹黏著劑",
    image: "/rm-design/img/about/promise-8.png",
    link: "https://blog.rmdesign.com.tw/2021/07/blog-post_61.html",
  },
  {
    title: "設置沉澱桶",
    image: "/rm-design/img/about/promise-9.png?ver=2",
    link: "https://blog.rmdesign.com.tw/2023/09/blog-post_44.html",
  },
  {
    title: "鋁窗填灌水泥、防水處理",
    image: "/rm-design/img/about/promise-10.png",
    link: "https://blog.rmdesign.com.tw/2023/10/blog-post_26.html",
  },
];
</script>

<template>
  <section id="about-promise-section">
    <div class="main-container">
      <div class="title-box">
        <p class="sub-title">( 10 STANDARDS WE NEVER COMPROMISE )</p>
        <h3 class="title">十項工程堅持</h3>
      </div>

      <ol class="promise-list">
        <li
          class="promise-item"
          v-for="(item, itemIndex) in promiseList"
          :key="`promise-${itemIndex}`"
        >
          <a :href="item.link" target="_blank" rel="noopener noreferrer">
            <div class="image-box">
              <img :src="item.image" :alt="item.title" />
            </div>
            <p class="promise-title">
              <span>{{ itemIndex + 1 }}.</span> {{ item.title }}
            </p>
          </a>
        </li>
      </ol>
    </div>
  </section>
</template>
