<script setup>
import { ref } from "vue";
const props = defineProps({
  text: {
    type: String,
    default: "VIEW ABOUT US",
  },
  color: {
    type: String,
    default: "white",
  },
  type: {
    type: String,
    default: "button",
  },
  link: {
    type: String,
    default: "/",
  },
});
const emits = defineEmits(["click","mouseenter","mouseleave"]);
const mainBtnRef = ref(null);

const getMainBtnElement = () => {
  const refValue = mainBtnRef.value;
  if (!refValue) return null;

  if (refValue instanceof Element) return refValue;
  if (refValue.$el instanceof Element) return refValue.$el;

  return null;
};

const hoverEvent = () => {
  const btn = getMainBtnElement();
  const bgDot = btn.querySelector("i:nth-of-type(1)");
  bgDot.style.scale = ((btn.offsetWidth - 27) * 2) / 6;
  emits("mouseenter");
};
const resetEvent = () => {
  const btn = getMainBtnElement();
  const bgDot = btn.querySelector("i:nth-of-type(1)");
  bgDot.style.scale = 1;
  emits("mouseleave");
};
</script>

<template>
  <button
    v-if="type == 'button'"
    id="main-btn"
    ref="mainBtnRef"
    :class="color"
    @mouseenter="hoverEvent"
    @mouseleave="resetEvent"
    @click="$emit('click')"
  >
    <p>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
    </p>
    <i></i>
    <i></i>
  </button>

  <router-link
    v-else-if="type == 'link'"
    :to="link"
    id="main-btn"
    ref="mainBtnRef"
    :class="color"
    @mouseenter="hoverEvent"
    @mouseleave="resetEvent"
    @click="$emit('click')"
  >
    <p>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
    </p>
    <i></i>
    <i></i>
  </router-link>

  <a
    v-else-if="type == 'external'"
    :href="link"
    target="_blank"
    id="main-btn"
    ref="mainBtnRef"
    :class="color"
    @mouseenter="hoverEvent"
    @mouseleave="resetEvent"
    @click="$emit('click')"
  >
    <p>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
    </p>
    <i></i>
    <i></i>
  </a>
</template>
