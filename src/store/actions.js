// import { post } from "@/common/request.js";

export default {
  toggleMenu(action) {
    this.menuOpen = action !== undefined ? action : !this.menuOpen;
  },
  setHeaderStyle(style) {
    this.headerStyle = style;
  },
  // getPageData({ commit }, params) {
  //   return new Promise((resolve, reject) => {
  //     post("/pageData", params)
  //       .then((response) => {
  //         commit("setPageData", response);
  //         resolve(response);
  //       })
  //       .catch((error) => {
  //         reject(error);
  //       });
  //   });
  // },
  // sendContactMessage({commit},data){
  //   return new Promise((resolve, reject) => {
  //     post("/contact", data)
  //       .then((response) => {
  //         commit("setMessageDialog", {status:true, message:"信件已送出，感謝您的聯絡，我們會儘快回覆您！"});
  //         resolve(response);
  //       })
  //       .catch((error) => {
  //         commit("setMessageDialog", {status:true, message:"信件送出失敗，請稍後再試或聯絡客服人員！"});
  //         reject(error);
  //       });
  //   });
  // },
  //   getBasePageData(state) {
  //   Object.keys(window.base_page_data).forEach((key) => {
  //     // 需要將key值轉換成駝峰式
  //     const camelCaseKey = key.replace(/_([a-z])/g, (match, letter) =>
  //       letter.toUpperCase()
  //     );

  //     if (
  //       ["videoList", "newsList", "productList"].indexOf(camelCaseKey) != -1
  //     ) {
  //       // 需要將key值轉換成陣列形式
  //       state[camelCaseKey].data = window.base_page_data[key].data;
  //       state[camelCaseKey].page = window.base_page_data[key].page;
  //       state[camelCaseKey].perPage = window.base_page_data[key].perPage;
  //       state[camelCaseKey].total = window.base_page_data[key].total;
  //       state[camelCaseKey].totalPages = window.base_page_data[key].totalPages;

  //       //檢查query
  //       state[camelCaseKey].category = window.page_query.category ?? "";
  //       state[camelCaseKey].keywords = window.page_query.keywords ?? "";

  //       if (camelCaseKey == "productList") {
  //         state[camelCaseKey].scooters = window.page_query.scooters ?? [];
  //       }
  //     } else {
  //       state[camelCaseKey] = window.base_page_data[key];
  //     }
  //   });
  // },
  // setPageData(state, data) {
  //   Object.keys(data).forEach((key) => {
  //     // 將key改為駝峰式
  //     const camelCaseKey = key.replace(/_([a-z])/g, (match, letter) =>
  //       letter.toUpperCase()
  //     );

  //     if (camelCaseKey == "themeColumns") {
  //       //合併元有資料
  //       state[camelCaseKey] = state[camelCaseKey].concat(data[key]);
  //       //去除重複資料
  //       state[camelCaseKey] = Array.from(new Set(state[camelCaseKey]));
  //     } else if (data[key] != null) {
  //       state[camelCaseKey] = data[key];
  //     } else if (state[camelCaseKey].data) {
  //       state[camelCaseKey].data = [];
  //     } else if (
  //       ["productPage", "videoPage", "newsPage"].indexOf(camelCaseKey) != -1
  //     ) {
  //       state[camelCaseKey] = null;
  //     } else {
  //       state[camelCaseKey] = [];
  //     }
  //   });
  // },
};
