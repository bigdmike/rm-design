<script setup>
import { ref } from "vue";
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

// 打開 Modal 時，傳入 Modal 內真正需要滾動的那個 DOM 元素


// 關閉 Modal 時


const props = defineProps({
    imageList: {
        type: Array,
        required: true
    },
    title: {
        type: String,
        required: true
    }
});

const modalStatusClass = ref('');
const activeImageIndex = ref(0);

const nextImage = () => {
    if (activeImageIndex.value < props.imageList.length - 1) {
        activeImageIndex.value++;
    }
    else {
        activeImageIndex.value = 0;
    }
};
const prevImage = () => {
    if (activeImageIndex.value > 0) {
        activeImageIndex.value--;
    }
    else {
        activeImageIndex.value = props.imageList.length - 1;
    }
};
const openModal = (index) => {
    const modalElement = document.querySelector('#work-page-image-modal');
    disableBodyScroll(modalElement);
    activeImageIndex.value = index;
    modalStatusClass.value = 'open';
};
const closeModal = () => {
    const modalElement = document.querySelector('#work-page-image-modal');
    enableBodyScroll(modalElement);
    modalStatusClass.value = 'close';
};

defineExpose({
    openModal,
    closeModal
});

</script>

<template>
    <div id="work-page-image-modal" :class="modalStatusClass">
        <div class="image-container">
            <button :class="activeImageIndex == 0 ? 'opacity-0' : ''" @click="prevImage">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30 60L50 40L30 20" stroke="white" stroke-width="4" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </button>

            <div class="image-box">
                <img :src="imageList[activeImageIndex]" :alt="title" />
            </div>
            <button @click="nextImage">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30 60L50 40L30 20" stroke="white" stroke-width="4" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </button>

        </div>

        <div class="background-box" @click="closeModal"></div>
    </div>
</template>