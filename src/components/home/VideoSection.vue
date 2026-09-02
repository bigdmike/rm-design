<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import MainButton from '../MainButton.vue';
import { staticVideo, shouldPlayVideo } from '../../common/staticVideo.js';

const section = ref(null);
const video = ref(null);
const source = ref(null);
const poster = ref(null);
const playing = ref(false);
const failed = ref(false);
let near = false, visible = false, manual = false, pausedByUser = false, destroyed = false;
let nearObserver, visibilityObserver, motion, connection;
let attempt = 0;
async function syncPlayback() {
  const current = ++attempt;
  const permitted = shouldPlayVideo({
    near, visible, hidden: document.hidden, reducedMotion: motion?.matches,
    saveData: connection?.saveData, manual, pausedByUser,
  });
  if (!permitted) { video.value?.pause(); playing.value = false; return; }
  if (!source.value) source.value = staticVideo.src;
  await nextTick();
  if (destroyed || current !== attempt || !video.value) return;
  try {
    await video.value.play();
    // A visibility/user change may happen while play() is pending.
    if (current !== attempt || destroyed) return;
    playing.value = true;
  } catch {
    if (current === attempt) { playing.value = false; pausedByUser = true; }
  }
}
function togglePlayback() {
  if (playing.value) { pausedByUser = true; }
  else { manual = true; near = true; visible = true; pausedByUser = false; failed.value = false; }
  syncPlayback();
}
function videoError() { failed.value = true; playing.value = false; pausedByUser = true; }
onMounted(() => {
  motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  connection = navigator.connection;
  motion.addEventListener('change', syncPlayback);
  connection?.addEventListener('change', syncPlayback);
  document.addEventListener('visibilitychange', syncPlayback);
  if ('IntersectionObserver' in window) {
    nearObserver = new IntersectionObserver(([entry]) => {
      near = entry.isIntersecting;
      if (near) poster.value = staticVideo.poster;
      syncPlayback();
    }, { rootMargin: '300px' });
    visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    });
    nearObserver.observe(section.value);
    visibilityObserver.observe(section.value);
  } else {
    // No observation support: show the poster and wait for explicit play.
    near = true; visible = true; pausedByUser = true; poster.value = staticVideo.poster;
  }
});
onBeforeUnmount(() => {
  destroyed = true; ++attempt;
  nearObserver?.disconnect(); visibilityObserver?.disconnect();
  motion?.removeEventListener('change', syncPlayback);
  connection?.removeEventListener('change', syncPlayback);
  document.removeEventListener('visibilitychange', syncPlayback);
  if (video.value) { video.value.pause(); video.value.removeAttribute('src'); video.value.load(); }
});
</script>

<template>
  <section id="home-video-section" ref="section">
    <div class="main-container">
      <div class="text-box">
        <h2 class="title">THE MAKING OF RM</h2>
        <MainButton type="link" link="/press" color="white" text="VIEW PRESS" />
        <button class="video-playback" type="button" :aria-label="playing ? '暫停影片' : '播放影片'" @click="togglePlayback">
          {{ playing ? '暫停影片' : '播放影片' }}
        </button>
        <p v-if="failed" class="video-error" role="status">影片暫時無法播放。</p>
      </div>
    </div>
    <div class="video-box">
      <video ref="video" loop muted playsinline preload="none" :poster="poster" :src="source" width="1920" height="1080" aria-label="阜居空間創意設計品牌影片" @error="videoError" @pause="playing = false" @playing="playing = true"></video>
    </div>
  </section>
</template>
