import { getPublicPage, submitContactInquiry } from './publicApi.js';

/** Compatibility wrapper for components that still prefer the composable shape. */
export function useApi() {
  return {
    getSiteData: ({ page }) => getPublicPage(page),
    sendContactForm: (payload) => submitContactInquiry(payload),
  };
}
