<script setup>

const promiseList = [
    {
        title:"水電配線指定品牌—太平洋電線（或同等級品牌）",
        image:"/img/about/promise-1.png",
    },
    {
        title:"水電配線指定年份—3年內",
        image:"/img/about/promise-2.png",
    },
    {
        title:"插座電線配線指定線徑 2.0mm",
        image:"/img/about/promise-3.png",
    },
    {
        title:"專用插座電線迴路指定截面積5.5mm",
        image:"/img/about/promise-4.png",
    },
    {
        title:"全室地板防水層",
        image:"/img/about/promise-5.png",
    },
    {
        title:"浴廁空間全室五道防水層",
        image:"/img/about/promise-6.png",
    },
    {
        title:"浴廁空間試水 72 小時",
        image:"/img/about/promise-7.png",
    },
    {
        title:"磁磚雙面塗抹黏著劑",
        image:"/img/about/promise-8.png",
    },
    {
        title:"設置沉澱桶",
        image:"/img/about/promise-9.png",
    },
    {
        title:"鋁窗填灌水泥、防水處理",
        image:"/img/about/promise-10.png",
    }
]

</script>


<template>
    <section id="about-promise-section">
        <div class="main-container">
            <div class="title-box">
                <p class="sub-title">( 10 STANDARDS WE NEVER COMPROMISE )</p>
                <h3 class="title">十項工程堅持</h3>
            </div>

            <ol class="promise-list">
                <li class="promise-item" v-for="(item,itemIndex) in promiseList" :key="`promise-${itemIndex}`">
                <div class="image-box">
                    <img :src="item.image" :alt="item.title" />
                </div>
                <p class="promise-title"><span>{{itemIndex + 1}}.</span> {{ item.title }}</p>
                </li>
            </ol>
        </div>
    </section>
</template>

