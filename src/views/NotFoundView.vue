<script setup>
import { useHeaderStyleScrollHandler } from "../common/headerStyleScrollHandler";
import MainButton from "../components/MainButton.vue";

// A recovered list can reuse its parent view; do not erase its header theme.
useHeaderStyleScrollHandler([], "cream", { resetOnUnmount: false });
</script>

<template>
  <main id="not-found-page" aria-labelledby="not-found-title">
    <div class="main-container not-found-container">
      <section class="not-found-layout">
        <div class="not-found-art" aria-hidden="true">
          <div class="not-found-coordinate"><span>RM DESIGN</span><span>SPACE / 404</span></div>
          <span class="not-found-code">404</span>
          <div class="not-found-art-caption"><span class="not-found-dot"></span><span>A NEW DIRECTION.</span><span>↗</span></div>
        </div>

        <div class="not-found-copy">
          <p class="not-found-eyebrow">( PAGE NOT FOUND )</p>
          <h1 id="not-found-title">頁面不在這裡，<br>靈感繼續。</h1>
          <p class="not-found-description">您尋找的頁面可能已移動，或連結有誤。<br>不妨回到首頁，或從設計案例發現新的空間靈感。</p>
          <div class="not-found-actions">
            <MainButton type="link" link="/" color="primary" text="返回首頁" aria-label="返回首頁" />
            <MainButton type="link" link="/works" color="black" text="瀏覽設計案例" aria-label="瀏覽設計案例" />
          </div>
        </div>
      </section>

      <nav class="not-found-explore" aria-label="繼續探索網站">
        <p>換個方向，找到理想的生活。</p>
        <div class="not-found-links">
          <RouterLink to="/about">關於我們 <span aria-hidden="true">↗</span></RouterLink>
          <RouterLink to="/workflow">服務流程 <span aria-hidden="true">↗</span></RouterLink>
          <RouterLink to="/contact">聯絡我們 <span aria-hidden="true">↗</span></RouterLink>
        </div>
      </nav>
    </div>
  </main>
</template>
