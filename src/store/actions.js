import { useApi } from "../common/useApi.js";
const { getSiteData, sendContactForm } = useApi();

export default {
  toggleMenu(action) {
    this.menuOpen = action !== undefined ? action : !this.menuOpen;
  },
  setHeaderStyle(style) {
    this.headerStyle = style;
  },
  async getPageData(params) {
    try {
      const response = await getSiteData(params);
      this.setPageData(response);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  async sendContactMessage(data){
    try{
      const response = await sendContactForm(data);
      this.setMessageDialog({status:true, message:"信件已送出，感謝您的聯絡，我們會儘快回覆您！"})
    }
    catch(error){
      console.error(error);
      this.setMessageDialog({status:true, message:"信件送出失敗，請稍後再試！"})
    }
  },
  getBasePageData(state) {
    Object.keys(window.base_page_data).forEach((key) => {
      // 需要將key值轉換成駝峰式
      const camelCaseKey = key.replace(/_([a-z])/g, (match, letter) =>
        letter.toUpperCase()
      );

      if (
        ["workList", "pressList"].indexOf(camelCaseKey) != -1
      ) {
        // 需要將key值轉換成陣列形式
        state[camelCaseKey].data = window.base_page_data[key].data;
        state[camelCaseKey].page = window.base_page_data[key].page;
        state[camelCaseKey].perPage = window.base_page_data[key].perPage;
        state[camelCaseKey].total = window.base_page_data[key].total;
        state[camelCaseKey].totalPages = window.base_page_data[key].totalPages;

        //檢查query
        state[camelCaseKey].category = window.page_query.category ?? "";
        state[camelCaseKey].keywords = window.page_query.keywords ?? "";
      } else {
        state[camelCaseKey] = window.base_page_data[key];
      }
    });
  },
  setPageData(data) {
    Object.keys(data).forEach((key) => {
      // 將key改為駝峰式
      const camelCaseKey = key.replace(/_([a-z])/g, (match, letter) =>
        letter.toUpperCase()
      );

      if (camelCaseKey == "themeColumns") {
        //合併元有資料
        this[camelCaseKey] = this[camelCaseKey].concat(data[key]);
        //去除重複資料
        this[camelCaseKey] = Array.from(new Set(this[camelCaseKey]));
      } else if (data[key] != null) {
        this[camelCaseKey] = data[key];
      } else if (this[camelCaseKey].data) {
        this[camelCaseKey].data = [];
      } else if (
        ["workPage"].indexOf(camelCaseKey) != -1
      ) {
        this[camelCaseKey] = null;
      } else {
        this[camelCaseKey] = [];
      }
    });
  },
  setMessageDialog(payload) {
    this.messageDialog.open = payload.status;
    this.messageDialog.message = payload.message;
  },
  setLoadingCount(count) {
    const nextCount = this.loadingCount + count;
    this.loadingCount = nextCount < 0 ? 0 : nextCount;
  }
};
