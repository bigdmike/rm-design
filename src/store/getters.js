export default {
  themeColumn: (state) => (key) => {
    const column = state.themeColumns.find((item) => item.column_key === key);
    return column ? column.content : "";
  },
  fullThemeColumn: (state) => (key) => {
    const column = state.themeColumns.find((item) => item.column_key === key);
    return column ? column : { content: "" };
  },
  imageUrl: () => (key) => {
    if (key == "") {
      return "";
    }
    return import.meta.env.VITE_API_URL + "/" + key;
  },
};
