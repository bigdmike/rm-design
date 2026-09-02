// Keep old URL fields usable while existing installations backfill their sidecars.
export function imageSources(image, maxWidth = Infinity) {
  const candidates = (image?.sources || []).filter(item => item.url && item.width > 0 && item.width <= maxWidth);
  if (!candidates.length) return image?.url ? [{ url: image.url, width: image.width, height: image.height }] : [];
  return [...candidates].sort((a, b) => a.width - b.width);
}

export function imageAttributes(image, { sizes = '100vw', maxWidth = Infinity, loading = 'lazy', priority = 'auto' } = {}) {
  const sources = imageSources(image, maxWidth);
  const fallback = sources.find(item => item.width >= 960) || sources.at(-1);
  return {
    src: fallback?.url || image?.url,
    srcset: sources.filter(item => item.width > 0).map(item => `${item.url} ${item.width}w`).join(', ') || undefined,
    sizes,
    width: image?.width || undefined,
    height: image?.height || undefined,
    alt: image?.altText || '',
    loading,
    decoding: 'async',
    fetchpriority: priority,
  };
}

export const cardSizes = '(min-width: 1600px) 427px, (min-width: 1024px) calc((100vw - 320px) / 3), (min-width: 768px) calc((100vw - 280px) / 2), (min-width: 640px) calc((100vw - 100px) / 2), calc(100vw - 40px)';
export const gallerySizes = '(min-width: 769px) calc((100vw - 80px) / 3), calc((100vw - 36px) / 2)';
