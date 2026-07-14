<script setup>
import { computed, onBeforeUnmount, onMounted, watch,ref } from "vue";
import { useRoute } from "vue-router";
import { MasonryGrid, MasonryGridItem } from 'vue3-masonry-css';
import { useHeaderStyleScrollHandler } from "../common/headerStyleScrollHandler";
import ImageModal from "../components/workPage/ImageModal.vue";

const route = useRoute();
const ImageModalRef = ref(null);

const headerScrollRules = [
    { selector: "#work-page .cover-image-box .image-box", style: "", offset: 0 },
    { selector: "#work-page .article-header", style: "black", offset: 0 },
    { selector: "#work-page .article-content", style: "black", offset: 0 },
    { selector: "#work-page .article-gallery", style: "black", offset: 0 },
];

useHeaderStyleScrollHandler(headerScrollRules,"cream");

const works = {
    "1": {
        title: "我家住在森林裡",
        location: "台南",
        slogan: "在城市邊陲，為心靈裁製一方綠意",
        category: "建築設計",
        authorName: "RM DESIGN",
        publisherName: "RM DESIGN",
        description:
            "以清水模與自然植栽交織，打造一座可與心靈對話的私人森林住宅，重拾生活節奏與光影日常。",
        content:
            "這是一段關於尋回生活節奏的故事。我們以清水模的質樸基調為畫布，大膽地將自然林意引入生活場域，讓建築線條與柔和的植栽景觀交織共生。我們使場域與業主的形象相結合，在城市的邊陲裁製出一方專屬的綠意。<br/>無論是靜謐的午后閱讀，或是與光影共處的瞬間，家，就是一座能與心靈對話的私人森林。",
        publishDate: "2026-06-28",
        modifiedDate: "2026-06-28",
        coverImage: "/img/works/1/03-台南邱公館67.jpg",
        images: [
            "/img/works/1/00-平面合成圖.jpg",
            "/img/works/1/01-外觀合成圖.jpg",
            "/img/works/1/02-台南邱公館01（s）.jpg",
            "/img/works/1/03-台南邱公館67.jpg",
            "/img/works/1/04-台南邱公館06（s）.jpg",
            "/img/works/1/05-台南邱公館81.jpg",
            "/img/works/1/06-台南邱公館80.jpg",
            "/img/works/1/07-台南邱公館155.jpg",
            "/img/works/1/08-台南邱公館484.jpg",
            "/img/works/1/09-台南邱公館471.jpg",
            "/img/works/1/10-台南邱公館497.jpg",
            "/img/works/1/11-台南邱公館11（s）.jpg",
            "/img/works/1/12-台南邱公館12（s）.jpg",
            "/img/works/1/13-台南邱公館63.jpg",
            "/img/works/1/14-台南邱公館14（s）.jpg",
            "/img/works/1/15-台南邱公館15（s）.jpg",
            "/img/works/1/16-台南邱公館03（s）.jpg",
            "/img/works/1/17-台南邱公館05（s）.jpg",
            "/img/works/1/18-台南邱公館08（s）.jpg",
            "/img/works/1/19-台南邱公館136.jpg",
            "/img/works/1/20-台南邱公館148.jpg",
            "/img/works/1/21-台南邱公館272.jpg",
            "/img/works/1/22-台南邱公館275.jpg",
            "/img/works/1/23-台南邱公館644.jpg",
            "/img/works/1/24-台南邱公館112.jpg",
            "/img/works/1/25-台南邱公館117.jpg",
            "/img/works/1/26-台南邱公館209.jpg",
            "/img/works/1/27-台南邱公館265.jpg",
            "/img/works/1/28-台南邱公館255.jpg",
            "/img/works/1/29-台南邱公館642.jpg",
            "/img/works/1/30-台南邱公館628.jpg",
            "/img/works/1/31-台南邱公館02（小檔）.jpg",
            "/img/works/1/32-台南邱公館205.jpg",
            "/img/works/1/33-台南邱公館108.jpg",
            "/img/works/1/34-台南邱公館206.jpg",
            "/img/works/1/35-台南邱公館290.jpg",
            "/img/works/1/36-台南邱公館438.jpg",
            "/img/works/1/37-台南邱公館652.jpg",
            "/img/works/1/38-台南邱公館09（小檔）.jpg",
            "/img/works/1/39-台南邱公館10（小檔）.jpg",
            "/img/works/1/40-台南邱公館13（小檔）.jpg",
            "/img/works/1/41-台南邱公館91.jpg",
            "/img/works/1/42-台南邱公館96.jpg",
            "/img/works/1/43-台南邱公館97.jpg",
            "/img/works/1/44-台南邱公館445.jpg",
            "/img/works/1/45-台南邱公館670.jpg",
            "/img/works/1/46-台南邱公館682.jpg",
            "/img/works/1/47-台南邱公館683.jpg",
            "/img/works/1/48-台南邱公館18.jpg",
            "/img/works/1/49-台南邱公館04（s）.jpg",
            "/img/works/1/50-台南邱公館07（s）.jpg",
            "/img/works/1/51-台南邱公館167.jpg",
            "/img/works/1/52-台南邱公館396.jpg",
            "/img/works/1/53-台南邱公館616.jpg",
            "/img/works/1/54-台南邱公館620.jpg",
            "/img/works/1/55-台南邱公館361.jpg",
            "/img/works/1/56-台南邱公館376.jpg",
            "/img/works/1/57-台南邱公館603.jpg",
            "/img/works/1/58-台南邱公館367.jpg",
            "/img/works/1/59-台南邱公館613.jpg",
            "/img/works/1/60-台南邱公館20.jpg",
            "/img/works/1/61-台南邱公館618.jpg",
            "/img/works/1/62-台南邱公館17.jpg",
            "/img/works/1/63-台南邱公館160.jpg",
            "/img/works/1/64-台南邱公館164.jpg",
            "/img/works/1/65-台南邱公館335.jpg",
            "/img/works/1/66-台南邱公館713.jpg",
            "/img/works/1/67-台南邱公館56.jpg",
            "/img/works/1/68-台南邱公館163.jpg",
            "/img/works/1/69-台南邱公館321.jpg",
            "/img/works/1/70-台南邱公館55.jpg",
            "/img/works/1/71-台南邱公館345.jpg",
        ],
    },
};

const workId = computed(() => String(route.params.id || "1"));
const workData = computed(() => works[workId.value] || works["1"]);
const paragraphs = computed(() =>
    workData.value.content
        .split("<br/>")
        .map((text) => text.trim())
        .filter(Boolean),
);
const baseUrl = computed(() => {
    if (typeof window === "undefined") return "";
    return window.location.origin;
});

const toAbsoluteUrl = (path) => {
    if (!path) return "";
    if (/^https?:\/\//.test(path)) return path;
    return `${baseUrl.value}${path}`;
};

const articleUrl = computed(() => `${baseUrl.value}/works/${workId.value}`);

const articleSchema = computed(() => ({
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
        "@type": "WebPage",
        "@id": articleUrl.value,
    },
    headline: workData.value.title,
    description: workData.value.description,
    image: workData.value.images.slice(0, 10).map((imagePath) => toAbsoluteUrl(imagePath)),
    datePublished: workData.value.publishDate,
    dateModified: workData.value.modifiedDate,
    articleSection: workData.value.category,
    author: {
        "@type": "Organization",
        name: workData.value.authorName,
    },
    publisher: {
        "@type": "Organization",
        name: workData.value.publisherName,
    },
    articleBody: paragraphs.value.join("\n\n"),
}));

let schemaElement = null;

const renderSchema = () => {
    if (!schemaElement) return;
    schemaElement.textContent = JSON.stringify(articleSchema.value);
};
const openImageModal = (index) => {
    if (ImageModalRef.value) {
        ImageModalRef.value.openModal(index);
    }
};

onMounted(() => {
    schemaElement = document.createElement("script");
    schemaElement.type = "application/ld+json";
    schemaElement.id = "work-article-schema";
    document.head.appendChild(schemaElement);
    renderSchema();
});

watch(articleSchema, () => {
    renderSchema();
});

onBeforeUnmount(() => {
    if (schemaElement?.parentNode) {
        schemaElement.parentNode.removeChild(schemaElement);
    }
});
</script>

<template>
    <main id="work-page">
        <article>
            <div class="cover-image-box">
                <figure class="image-box">
                    <img :src="workData.coverImage" :alt="`${workData.title} 封面`" />
                </figure>
            </div>

            <header class="article-header">
                <div class="main-container">
                    <p class="article-sub-title">( WORKS )</p>
                    <h1 class="article-title">{{ workData.title }}</h1>
                    <p class="article-location">{{ workData.location }}</p>
                    <p class="article-slogan">{{ workData.slogan }}</p>
                </div>
            </header>

            <section class="article-content">
                <div class="main-container">
                    <div class="content-box">
                        <p class="content" v-html="workData.content"></p>
                        <div class="button-box">
                            <a class="main-btn cream" href="https://blog.rmdesign.com.tw/" target="_blank">
                                <p>
                                    <span>查看設計細節</span>
                                    <span>查看設計細節</span>
                                </p>
                                <i></i>
                                <i></i>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section class="article-gallery" aria-label="作品照片集">
                <div class="image-box">
                    <MasonryGrid :columns="{ default: 3, 1024: 3, 768: 2 }" :gutter="{ default: 20, 768: 12, 640: 8 }">
                        <MasonryGridItem v-for="(image, index) in workData.images" :key="`gallery-image-${index}`">
                            <img :src="image" :alt="`${workData.title} 作品照片 ${index + 1}`" loading="lazy" @click="openImageModal(index)" />
                        </MasonryGridItem>
                    </MasonryGrid>
                </div>
            </section>
        </article>

        <ImageModal ref="ImageModalRef" :image-list="workData.images" :title="workData.title" />
    </main>
</template>