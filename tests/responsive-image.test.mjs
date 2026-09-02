import test from 'node:test';
import assert from 'node:assert/strict';
import { imageAttributes, imageSources } from '../src/common/responsiveImage.js';
import { shouldPlayVideo, staticVideo } from '../src/common/staticVideo.js';

const image = { url: '/full.webp', altText: '作品', width: 2400, height: 1800,
  sources: [480, 960, 1600, 2400].map(width => ({ width, url: width === 2400 ? '/full.webp' : '/w' + width + '.webp' })) };

test('video never auto-plays offscreen, in background, with reduced motion or save-data', () => {
  const base = { near: true, visible: true, hidden: false, reducedMotion: false, saveData: false, manual: false, pausedByUser: false };
  assert.equal(shouldPlayVideo(base), true);
  for (const change of [{ near: false }, { visible: false }, { hidden: true }, { reducedMotion: true }, { saveData: true }, { pausedByUser: true }]) {
    assert.equal(shouldPlayVideo({ ...base, ...change }), false);
  }
  assert.equal(shouldPlayVideo({ ...base, reducedMotion: true, saveData: true, manual: true }), true);
  assert.equal(shouldPlayVideo({ ...base, hidden: true, manual: true }), false);
  assert.ok(staticVideo.src.endsWith('.mp4') && staticVideo.poster.endsWith('.webp'));
});

test('gallery candidates omit full-size image and retain dimensions', () => {
  const attrs = imageAttributes(image, { maxWidth: 1600, sizes: '33vw' });
  assert.equal(attrs.src, '/w960.webp');
  assert.ok(!attrs.srcset.includes('/full.webp'));
  assert.equal(attrs.width, 2400); assert.equal(attrs.height, 1800);
  assert.equal(attrs.sizes, '33vw'); assert.equal(attrs.loading, 'lazy');
});
test('hero retains largest source and explicit priority', () => {
  const attrs = imageAttributes(image, { loading: 'eager', priority: 'high' });
  assert.ok(attrs.srcset.includes('/full.webp 2400w'));
  assert.equal(attrs.fetchpriority, 'high'); assert.equal(attrs.loading, 'eager');
});
test('legacy DTO and small images remain renderable without invented variants', () => {
  assert.deepEqual(imageSources({ url: '/old.webp' }, 1600), [{ url: '/old.webp', width: undefined, height: undefined }]);
  assert.equal(imageAttributes({ url: '/old.webp' }).srcset, undefined);
  assert.equal(imageAttributes({ ...image, sources: [], width: 100 }).src, '/full.webp');
});
test('empty media is safe and source sorting does not mutate API data', () => {
  assert.equal(imageAttributes(null).src, undefined);
  const reversed = { ...image, sources: [...image.sources].reverse() };
  assert.equal(imageSources(reversed)[0].width, 480);
  assert.equal(reversed.sources[0].width, 2400);
});
