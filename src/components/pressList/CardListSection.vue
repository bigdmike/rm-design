<script setup>
const pressList = [
  {
    id: 1,
    title: "Atti咖啡研究工坊",
    created_at: "2017/05/20",
    thumbnail: "/img/press/1.png",
    link: "https://www.youtube.com/watch?v=DOjHGJ72L5A",
  },
  {
    id: 2,
    title: "住宅空間-新北市-案名：艾格峰上的鐵杉",
    created_at: "2017/08/01",
    thumbnail: "/img/press/2.png",
    link: "https://www.youtube.com/watch?v=B4Cj7p6jE4A",
  },
  {
    id: 3,
    title: "【科P台北好好停】2015公有民生社區地下停車場",
    created_at: "2017/10/10",
    thumbnail: "/img/press/3.png",
    link: "https://www.youtube.com/watch?v=LnDJJLwzjDo",
  },
  {
    id: 4,
    title: "幸福空間採訪 我家住在森林裡",
    created_at: "2018/04/15",
    thumbnail: "/img/press/4.png",
    link: "https://www.youtube.com/watch?v=7l2v9TwMABA",
  },
  {
    id: 5,
    title: "阜居室內設計 中天電視台生活百分百",
    created_at: "2018/04/15",
    thumbnail: "/img/press/5.png",
    link: "https://www.youtube.com/watch?v=OavmwMfqqR4",
  },
  {
    id: 6,
    title: "雅痞王子的遊戲王國",
    created_at: "2018/06/29",
    thumbnail: "/img/press/6.png",
    link: "https://www.youtube.com/watch?v=SbNW5xxf7I0",
  },
  {
    id: 7,
    title: "旅。幾何",
    created_at: "2019/10/08",
    thumbnail: "/img/press/7.png",
    link: "hhttps://www.youtube.com/watch?v=GsK2_xb6PP8",
  },
  {
    id: 8,
    title: "厝",
    created_at: "2020/07/08",
    thumbnail: "/img/press/8.png",
    link: "https://www.youtube.com/watch?v=-g_fniubNT8",
  },
];
</script>

<template>
  <section id="press-list-card-list-section">
    <div class="card-list">
      <a v-for="press in pressList" :key="press.id" :href="press.link" target="_blank" class="card">
        <div class="thumbnail">
          <div class="cover">
              <div class="play-button-box">
                <svg width="11" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5.19629L4.64275e-07 10.3924L9.18537e-07 0.000136459L9 5.19629Z" fill="#CC333A" />
                </svg>
              </div>
          </div>
          <img :src="press.thumbnail" :alt="press.title" />
        </div>
        <div class="info">
          <h3>{{ press.title }}</h3>
          <p>{{ press.created_at }}</p>
        </div>
      </a>
    </div>

  </section>
</template>
