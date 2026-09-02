// Read-only checks against the built local site; no business fixtures are written.
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { staticVideo } from '../src/common/staticVideo.js';
const front = process.env.TEST_FRONT_ORIGIN || 'http://127.0.0.1:8080';
const api = process.env.TEST_API_ORIGIN || 'http://127.0.0.1:8081';
const asset = readdirSync(new URL('../dist/assets/', import.meta.url)).find(name => /^index-.*\.js$/.test(name));
const work = (await (await fetch(api + '/api/v1/works/6')).json()).work;
assert.ok(work?.imageItems?.[0]?.sources?.length > 1, 'local fixture needs backfilled case 6 images');
const gallery = work.imageItems[0];
const imagePath = new URL(gallery.sources[0].url).pathname;
for (const url of [front + '/assets/' + asset, front + staticVideo.src, front + staticVideo.poster, api + imagePath]) {
  const response = await fetch(url, { method: 'HEAD', headers: { 'Accept-Encoding': 'identity' } });
  assert.equal(response.status, 200, url);
  assert.match(response.headers.get('cache-control'), /max-age=31536000, immutable/);
  const validator = response.headers.get('etag') ? { 'If-None-Match': response.headers.get('etag') } : { 'If-Modified-Since': response.headers.get('last-modified') };
  assert.ok(response.headers.get('etag') || response.headers.get('last-modified'));
  const conditional = await fetch(url, { method: 'HEAD', headers: { 'Accept-Encoding': 'identity', ...validator } });
  assert.equal(conditional.status, 304);
  assert.match(conditional.headers.get('cache-control'), /immutable/);
  console.log('PASS immutable / conditional 304:', new URL(url).pathname);
}
const range = await fetch(front + staticVideo.src, { headers: { Range: 'bytes=0-1023' } });
assert.equal(range.status, 206); assert.match(range.headers.get('content-range'), /^bytes 0-1023\//);
assert.equal((await range.arrayBuffer()).byteLength, 1024);
assert.match(range.headers.get('content-type'), /^video\/mp4/);
const manifest = await fetch(api + new URL(gallery.url).pathname + '.responsive.json');
assert.equal(manifest.status, 403, 'private sidecar metadata must not be served as public media');
for (const url of [front + '/', api + '/api/v1/works/999999', api + '/uploads/works/6/gallery/' + 'a'.repeat(32) + '.webp']) {
  const response = await fetch(url, { method: 'HEAD' });
  assert.ok(!response.headers.get('cache-control')?.includes('immutable'));
  assert.match(response.headers.get('x-robots-tag'), /noindex/);
}
const original = await fetch(api + new URL(gallery.url).pathname, { method: 'HEAD' });
const small = await fetch(api + imagePath, { method: 'HEAD' });
assert.ok(Number(small.headers.get('content-length')) < Number(original.headers.get('content-length')));
console.log('PASS Range, private manifests, original/variant bytes, noindex, no long cache on HTML/errors.');
