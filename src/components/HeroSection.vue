<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { content } from "../data/store";

const root = ref(null);
const reelEl = ref(null);
const shown = ref(false);
const cur = ref(0);
const progress = ref(0);
const playing = ref(true);
const FRAME_MS = 5000;

const frames = computed(() => content.projects.slice(0, 5));
const pad = (n) => String(n).padStart(2, "0");

const stack = [
  "Django",
  "Python",
  "Tailwind CSS",
  "JavaScript",
  "WordPress",
  "Docker",
];
const ticker = [
  "CLEAN CODE",
  "PIXEL PRECISION",
  "DJANGO FIRST",
  "RTL READY",
  "SHIP IT",
  "NO SHORTCUTS",
];

let raf;
let last = 0;
let visible = true;
let io;

function tick(now) {
  const dt = Math.min(now - last, 100);
  last = now;
  if (playing.value && visible && frames.value.length) {
    progress.value += dt / FRAME_MS;
    if (progress.value >= 1) {
      progress.value = 0;
      cur.value = (cur.value + 1) % frames.value.length;
    }
  }
  raf = requestAnimationFrame(tick);
}

function onScroll() {
  const y = window.scrollY;
  if (y < window.innerHeight && reelEl.value) {
    reelEl.value.style.transform = `translateY(${y * 0.3}px)`;
  }
}

onMounted(() => {
  requestAnimationFrame(() => (shown.value = true));
  last = performance.now();
  raf = requestAnimationFrame(tick);
  io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  io.observe(root.value);
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("scroll", onScroll, { passive: true });
  }
});

onUnmounted(() => {
  cancelAnimationFrame(raf);
  io?.disconnect();
  window.removeEventListener("scroll", onScroll);
});
</script>

<template>
  <section id="hero" ref="root">
    <div id="reel" ref="reelEl" class="reel" :class="{ paused: !playing }">
      <div
        v-for="(p, i) in frames"
        :key="p.id"
        class="reel-frame"
        :class="{ active: i === cur }"
      >
        <img v-if="p.image" :src="p.image" alt="" />
      </div>
    </div>
    <div class="hero-overlay"></div>
    <div class="scan"></div>

    <div class="hero-body wrap">
      <div class="reel-ctrl">
        <div class="rec">
          <span class="rec-dot"></span><span>SHOWREEL · LIVE</span>
        </div>
        <button
          class="play-btn"
          :aria-label="playing ? 'Pause reel' : 'Play reel'"
          @click="playing = !playing"
        >
          <svg class="i"><use :href="playing ? '#i-pause' : '#i-play'" /></svg>
          <span>{{ playing ? "PLAYING" : "PAUSED" }}</span>
        </button>
      </div>

      <div
        class="reveal"
        :class="{ 'in-view': shown }"
        style="max-width: 1100px"
      >
        <div class="marker">
          <span>{{ $t("hero.marker") }}</span>
        </div>
        <h1 class="display hero-title">
          <span class="hl"
            ><span>{{ $t("hero.l1") }}</span></span
          >
          <span class="hl"
            ><span class="stroke">{{ $t("hero.l2") }}</span></span
          >
          <span class="hl">
            <span
              >{{ $t("hero.l3a") }}
              <span class="accent">{{ $t("hero.l3b") }}</span></span
            >
          </span>
        </h1>
        <p class="hero-sub">
          {{ $t("hero.sub_1") }} <b>{{ $t("hero.name") }}</b
          >{{ $t("hero.sub_2") }}
        </p>
      </div>

      <div class="hero-bottom">
        <div>
          <div
            class="mono upper"
            style="
              font-size: 10px;
              letter-spacing: 0.2em;
              color: var(--muted);
              margin-bottom: 10px;
            "
          >
            {{ $t("hero.stack") }}
          </div>
          <div class="chips">
            <span
              v-for="(s, i) in stack"
              :key="s"
              class="chip"
              :class="{ hot: i === 0 }"
            >
              {{ s }}
            </span>
          </div>
        </div>

        <div class="hero-progress">
          <span>{{ pad(cur + 1) }} / {{ pad(frames.length) }}</span>
          <div class="bar">
            <i :style="{ width: progress * 100 + '%' }"></i>
          </div>
          <span class="accent">{{ $t("hero.reel_label") }}</span>
        </div>
      </div>
    </div>

    <div class="ticker">
      <div class="track-m">
        <template v-for="n in 2" :key="n">
          <template v-for="w in ticker" :key="n + w">
            <span>{{ w }}</span
            ><em>/</em>
          </template>
        </template>
      </div>
    </div>
  </section>
</template>