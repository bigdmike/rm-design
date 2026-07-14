<script setup>
const works = [
  {
    id: 1,
    title: "我住在森林裡",
    location: "台南市",
    thumbnail: "/img/works/works_1.png",
  },
  {
    id: 2,
    title: "Runway",
    location: "新北市",
    thumbnail: "/img/works/works_2.png",
  },
  {
    id: 3,
    title: "Atti 咖啡研究工訪",
    location: "高雄市",
    thumbnail: "/img/works/works_3.png",
  },
  {
    id: 4,
    title: "Runway",
    location: "新北市",
    thumbnail: "/img/works/works_2.png",
  },
  {
    id: 5,
    title: "Atti 咖啡研究工訪",
    location: "高雄市",
    thumbnail: "/img/works/works_3.png",
  },
  {
    id: 6,
    title: "我住在森林裡",
    location: "台南市",
    thumbnail: "/img/works/works_1.png",
  },
  {
    id: 7,
    title: "Atti 咖啡研究工訪",
    location: "高雄市",
    thumbnail: "/img/works/works_3.png",
  },
  {
    id: 8,
    title: "Runway",
    location: "新北市",
    thumbnail: "/img/works/works_2.png",
  },
  {
    id: 9,
    title: "我住在森林裡",
    location: "台南市",
    thumbnail: "/img/works/works_1.png",
  },
];
</script>

<template>
  <section id="work-list-card-list-section">
    <div class="card-list">
      <router-link
        v-for="work in works"
        :key="work.id"
        :to="'/works/' + work.id"
        class="card"
      >
        <div class="thumbnail">
          <div class="cover">
            <div class="text-box">
              <p>VIEW MORE</p>
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.5543 59.4429L60.5543 19.4429"
                  stroke="white"
                  stroke-width="5"
                  stroke-linecap="square"
                  stroke-linejoin="round"
                />
                <mask id="path-2-inside-1_96_231" fill="white">
                  <path d="M15 15L65 15V65" />
                </mask>
                <path
                  d="M15 10H10V20H15V15V10ZM65 15H70C70 12.2386 67.7614 10 65 10V15ZM60 65V70H70V65H65H60ZM15 15V20L65 20V15V10L15 10V15ZM65 15L60 15V65H65H70V15H65Z"
                  fill="white"
                  mask="url(#path-2-inside-1_96_231)"
                />
              </svg>
            </div>
          </div>
          <img :src="work.thumbnail" :alt="work.title" />
        </div>
        <div class="info">
          <h3>{{ work.title }}</h3>
          <p>{{ work.location }}</p>
        </div>
      </router-link>
    </div>
    
  </section>
</template>
