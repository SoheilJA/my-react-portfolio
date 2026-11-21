<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";

const spin = ref(null);
let tween;

onMounted(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  tween = gsap.to(spin.value, {
    rotation: 360,
    svgOrigin: "200 200",
    duration: 90,
    ease: "none",
    repeat: -1,
  });
});

onUnmounted(() => tween?.kill());
</script>

<template>
  <svg
    viewBox="0 0 400 400"
    class="h-full w-full"
    fill="none"
    aria-hidden="true"
  >
    <circle
      cx="200"
      cy="200"
      r="190"
      stroke="currentColor"
      stroke-opacity="0.15"
      stroke-dasharray="2 8"
    />
    <g ref="spin">
      <ellipse
        v-for="i in 12"
        :key="i"
        cx="200"
        cy="200"
        rx="170"
        ry="62"
        stroke="#ff7138"
        :stroke-opacity="0.15 + i * 0.05"
        :transform="`rotate(${i * 15} 200 200)`"
      />
    </g>
    <circle cx="200" cy="200" r="4" fill="#ff7138" />
  </svg>
</template>
