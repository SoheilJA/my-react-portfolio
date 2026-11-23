<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import gsap from "gsap";
import { content } from "../data/store";

const { locale } = useI18n();
const root = ref(null);
const visible = ref(false);
const anim = reactive({});
let io;

const items = computed(() =>
  (content.stats || []).map((s) => {
    let target;
    if (s.auto === "certificates") target = content.certificates.length;
    else if (s.auto === "services") target = content.services.length;
    else if (s.auto === "projects") target = content.projects.length;
    else if (s.id === 2) target = content.projects.length;
    else if (s.id === 3) target = content.certificates.length;
    else if (s.id === 4) target = content.services.length;
    else target = s.value;
    return { ...s, target };
  }),
);

const fmt = (n) =>
  new Intl.NumberFormat(locale.value === "fa" ? "fa-IR" : "en-US").format(
    Math.round(n),
  );
const text = (s) => fmt(anim[s.id] ?? 0) + (s.suffix || "");

function run() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  items.value.forEach((s) => {
    if (reduce) {
      anim[s.id] = s.target;
      return;
    }
    anim[s.id] = 0;
    gsap.to(anim, { [s.id]: s.target, duration: 1.8, ease: "power3.out" });
  });
}

onMounted(() => {
  io = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return;
      visible.value = true;
      run();
      io.disconnect();
    },
    { threshold: 0.35 },
  );
  io.observe(root.value);
});

onUnmounted(() => {
  io?.disconnect();
  gsap.killTweensOf(anim);
});
</script>

<template>
  <section ref="root" class="stats">
    <div class="wrap">
      <div class="grid stagger" :class="{ 'in-view': visible }">
        <div v-for="(s, i) in items" :key="s.id" class="stat">
          <div class="n" :class="{ accent: i === 1 }">{{ text(s) }}</div>
          <div class="l">{{ s.label[locale] }}</div>
        </div>
      </div>
    </div>
  </section>
</template>
