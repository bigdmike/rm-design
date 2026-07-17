import { defineStore } from 'pinia'
import actions from './actions.js'
import getters from './getters.js'

export const useUIStore = defineStore('ui', {
  state: () => ({
    menuOpen: false,
    headerStyle: "",
    messageDialog: {
      open: false,
      message: "",
    },
    loadingCount: 0,
    themeColumns: [],
    announcementList: [],
    workList: {
      page: 1,
      perPage: 9,
      keyword: "",
      categoryId: "",
      sort: "",
      data: [],
      totalPages: 0,
    },
    workPage: null,
    pressList: {
      page: 1,
      perPage: 9,
      keyword: "",
      categoryId: "",
      sort: "",
      data: [],
      totalPages: 0,
    },
    stepList: [],
    promiseList: [],
    questionList: [],
    pageMeta: [
      {
        "PageTitle": "所有頁面",
        "Title": "阜居空間設計 | RM Design Studio",
        "Content": "在這裏，我們不談風格， 因為「美」之於設計團隊只是基本功力。 我們秉持著「形隨機能而生、每個線條融入業主故事」的設計理念， 使場域與業主形象完美結合。 我們傾聽關於您的回憶與喜好，為您的空間描繪出專屬的輪廓。 在阜居，我們用空間說著一段又一段的人生故事。",
        "Image": "/image/meta_data/1714024596_b16c804af6344a891573.jpg"
      },
      {
        "PageTitle": "首頁",
        "Title": "",
        "Content": "在這裏，我們不談風格， 因為「美」之於設計團隊只是基本功力。 我們秉持著「形隨機能而生、每個線條融入業主故事」的設計理念， 使場域與業主形象完美結合。 我們傾聽關於您的回憶與喜好，為您的空間描繪出專屬的輪廓。 在阜居，我們用空間說著一段又一段的人生故事。",
        "Image": "/image/meta_data/1714024640_60f70d4baa56c0d7faaa.jpg"
      },
      {
        "PageTitle": "關於我們",
        "Title": "關於我們",
        "Content": "在這裏，我們不談風格， 因為「美」之於設計團隊只是基本功力。 我們秉持著「形隨機能而生、每個線條融入業主故事」的設計理念， 使場域與業主形象完美結合。 我們傾聽關於您的回憶與喜好，為您的空間描繪出專屬的輪廓。 在阜居，我們用空間說著一段又一段的人生故事。",
        "Image": "/image/meta_data/1714024649_e6f8dbae3983af9c5a61.jpg"
      },
      {
        "PageTitle": "設計案例",
        "Title": "設計案例",
        "Content": "在這裏，我們不談風格， 因為「美」之於設計團隊只是基本功力。 我們秉持著「形隨機能而生、每個線條融入業主故事」的設計理念， 使場域與業主形象完美結合。 我們傾聽關於您的回憶與喜好，為您的空間描繪出專屬的輪廓。 在阜居，我們用空間說著一段又一段的人生故事。",
        "Image": "/image/meta_data/1714024658_d6a722b1987c71f8bf31.jpg"
      },
      {
        "PageTitle": "媒體採訪",
        "Title": "媒體採訪",
        "Content": "在這裏，我們不談風格， 因為「美」之於設計團隊只是基本功力。 我們秉持著「形隨機能而生、每個線條融入業主故事」的設計理念， 使場域與業主形象完美結合。 我們傾聽關於您的回憶與喜好，為您的空間描繪出專屬的輪廓。 在阜居，我們用空間說著一段又一段的人生故事。",
        "Image": "/image/meta_data/1714024668_88b147092fbbf3569a7d.jpg"
      },
      {
        "PageTitle": "聯絡我們",
        "Title": "聯絡我們",
        "Content": "在這裏，我們不談風格， 因為「美」之於設計團隊只是基本功力。 我們秉持著「形隨機能而生、每個線條融入業主故事」的設計理念， 使場域與業主形象完美結合。 我們傾聽關於您的回憶與喜好，為您的空間描繪出專屬的輪廓。 在阜居，我們用空間說著一段又一段的人生故事。",
        "Image": "/image/meta_data/1714024677_111776f8200a34f25f43.jpg"
      },
      {
        "PageTitle": "服務流程",
        "Title": "服務流程",
        "Content": "在這裏，我們不談風格， 因為「美」之於設計團隊只是基本功力。 我們秉持著「形隨機能而生、每個線條融入業主故事」的設計理念， 使場域與業主形象完美結合。 我們傾聽關於您的回憶與喜好，為您的空間描繪出專屬的輪廓。 在阜居，我們用空間說著一段又一段的人生故事。",
        "Image": "/image/meta_data/1714024698_1ccf314f50b7aee5c8fc.jpg"
      },
      {
        "PageTitle": "隱私政策",
        "Title": "隱私政策",
        "Content": "在這裏，我們不談風格， 因為「美」之於設計團隊只是基本功力。 我們秉持著「形隨機能而生、每個線條融入業主故事」的設計理念， 使場域與業主形象完美結合。 我們傾聽關於您的回憶與喜好，為您的空間描繪出專屬的輪廓。 在阜居，我們用空間說著一段又一段的人生故事。",
        "Image": "/image/meta_data/1714024687_dd377db6e09584832294.jpg"
      }
    ],
  }),
  getters,
  actions
})