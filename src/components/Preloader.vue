<script setup>
import {ref, onMounted} from "vue";
import gsap from "gsap";

const emit = defineEmits(['done', 'leaving'])
const root = ref(null);
const name = ref(null);
const counter = ref(null);
const bar = ref(null);

onMounted(() => {
  const num = {value: 0};
  gsap.set(bar.value, {scaleX: 0});

  const tl = gsap.timeline({onComplete: () => emit("done")});

  tl.from(name.value.children, {
    y: 40,
    opacity: 0,
    stagger: 0.06,
    duration: 0.7,
    ease: "power3.out",
  })
      .to(
          num,
          {
            value: 100,
            duration: 2,
            ease: "power2.inOut",
            onUpdate: () => {
              counter.value.textContent = Math.round(num.value);
            },
          },
          0.2,
      )
      .to(bar.value, {scaleX: 1, duration: 2, ease: "power2.inOut"}, 0.2)
      .to(name.value.children, {
        y: -40,
        opacity: 0,
        stagger: 0.04,
        duration: 0.4,
      }).add(() => emit('leaving'))
      .to(root.value, {yPercent: -100, duration: 0.9, ease: "power4.inOut"});
});
</script>
<template>
  <div
      ref="root"
      class="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-bg"
  >
    <div class="bg-grid fade-mask absolute inset-0 opacity-60"></div>
    <div class="bg-glow absolute inset-0"></div>

    <div
        ref="name"
        dir="ltr"
        class="relative flex font-display text-5xl font-bold tracking-tight text-ink md:text-8xl"
    >
      <span v-for="(c, i) in 'SOHEIL'" :key="i">{{ c }}</span>
      <span class="text-accent">.</span>
    </div>

    <div dir="ltr" class="label absolute bottom-8 left-8 hidden md:block">
      Portfolio — 2026
    </div>
    <div
        dir="ltr"
        class="absolute bottom-8 right-8 font-display text-5xl font-bold text-ink md:text-7xl"
    >
      <span ref="counter">0</span><span class="text-accent">%</span>
    </div>

    <div
        ref="bar"
        class="absolute bottom-0 left-0 h-1 w-full origin-left bg-accent"
    ></div>
  </div>
</template>