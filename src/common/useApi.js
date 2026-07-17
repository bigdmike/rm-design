// 統一管理後端 Base URL，方便以後修改
const BASE_URL = 'https://api.yourdomain.com'; 

/**
 * 通用的 fetch 封裝
 */
async function http(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  
  // 預設設定
  const defaultOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, defaultOptions);

    // 關鍵：原生 fetch 遇到 4xx/5xx 不會 throw error，必須手動判斷 !response.ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 統一轉成 JSON
    return await response.json();
  } catch (error) {
    console.error('API 請求失敗:', error);
    throw error; // 丟給呼叫端決定要怎麼提示使用者（例如彈出 alert）
  }
}

/**
 * 針對你的需求，只暴露出這兩個極簡方法
 */
export function useApi() {
  
  // 1. 取得網站顯示資料 (GET)
  const getSiteData = () => (payload) => http('/pageData', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  // 2. 發送聯絡資訊 (POST)
  const sendContactForm = (payload) => http('/api/contact', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  return {
    getSiteData,
    sendContactForm
  };
}