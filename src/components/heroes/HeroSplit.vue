<script setup>
import { computed } from 'vue'
import { content } from '../../data/store'
import AbstractArt from '../AbstractArt.vue'

const total = computed(() => content.projects.length)
const codeCount = computed(() => content.projects.filter((p) => p.category === 'code').length)
const wpCount = computed(() => content.projects.filter((p) => p.category === 'wordpress').length)
const stack = ['Django', 'Python', 'Tailwind', 'WordPress', 'Docker']
</script>

<template>
  <section id="hero" class="hero-split">
    <div class="hs-grid wrap">
      <div class="hs-text">
        <div class="marker"><span>{{ $t('hero.marker') }}</span></div>
        <h1 class="display hs-title">
          <span class="line"><span>{{ $t('hero.l1') }}</span></span>
          <span class="line"><span>{{ $t('hero.l2') }}</span></span>
          <span class="line accent"><span>{{ $t('hero.l3a') }} {{ $t('hero.l3b') }}</span></span>
        </h1>
        <p class="hs-sub">
          {{ $t('hero.sub_1') }} <b>{{ $t('hero.name') }}</b>{{ $t('hero.sub_2') }}
        </p>
        <div class="hs-cta">
          <a href="#contact" class="hs-btn primary">{{ $t('hero.cta') }}</a>
          <a href="#projects" class="hs-btn ghost">{{ $t('hero.cta2') }}</a>
        </div>
        <div class="hs-stats">
          <div class="stat">
            <span class="v" dir="ltr">{{ total }}</span>
            <span class="k" dir="ltr">PROJECTS</span>
          </div>
          <div class="stat">
            <span class="v" dir="ltr">{{ codeCount }}</span>
            <span class="k">{{ $t('works.tab_code') }}</span>
          </div>
          <div class="stat">
            <span class="v" dir="ltr">{{ wpCount }}</span>
            <span class="k">{{ $t('works.tab_wp') }}</span>
          </div>
        </div>
      </div>

      <div class="hs-visual" aria-hidden="true">
        <div class="hs-frame">
          <span class="corner tl"></span><span class="corner tr"></span>
          <span class="corner bl"></span><span class="corner br"></span>
          <div class="hs-art"><AbstractArt /></div>
          <div class="hs-mono" dir="ltr">SJ<span>.</span></div>
          <div class="hs-badge">
            <span class="dot"></span><span>{{ $t('hero.status') }}</span>
          </div>
          <div class="hs-cap" dir="ltr">FIG.01 — CORE / 2026</div>
        </div>
      </div>
    </div>

    <div class="hs-ticker" aria-hidden="true">
      <div class="hs-ticker-track">
        <span v-for="n in 2" :key="n" class="hs-ticker-group">
          <span v-for="s in stack" :key="s">{{ s }}</span><em>/</em>
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-split {
  position: relative;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 120px;
  padding-bottom: 96px;
  overflow: hidden;
  background:
    radial-gradient(60% 60% at 82% 18%, rgba(255, 106, 34, 0.1), transparent 60%),
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: auto, 64px 64px, 64px 64px;
}
.hs-grid {
  display: grid;
  gap: 48px;
  align-items: center;
  width: 100%;
}
@media (min-width: 1024px) {
  .hs-grid {
    grid-template-columns: 1.05fr 0.95fr;
  }
}
.hs-text {
  max-width: 660px;
}
.hs-title {
  font-size: clamp(46px, 7vw, 104px);
  margin-bottom: 26px;
}
.hs-title .line {
  display: block;
  overflow: hidden;
}
.hs-title .line > span {
  display: inline-block;
  transform: translateY(105%);
  animation: hsUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.hs-title .line:nth-child(2) > span {
  animation-delay: 0.08s;
}
.hs-title .line:nth-child(3) > span {
  animation-delay: 0.16s;
}
@keyframes hsUp {
  to {
    transform: none;
  }
}
.hs-sub {
  color: var(--fg-dim);
  font-size: clamp(15px, 1.4vw, 18px);
  max-width: 560px;
}
.hs-sub b {
  color: var(--fg);
  font-weight: 600;
}
.hs-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 32px;
}
.hs-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  font-family: var(--f-heading);
  font-size: 14px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transition: all 0.3s;
}
.hs-btn.primary {
  background: var(--accent);
  color: #000;
}
.hs-btn.primary:hover {
  background: var(--accent-bright);
}
.hs-btn.ghost {
  border: 1px solid var(--border-light);
  color: var(--fg);
}
.hs-btn.ghost:hover {
  border-color: var(--accent);
  color: var(--accent);
}
.hs-stats {
  display: flex;
  gap: 32px;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}
.stat {
  display: flex;
  flex-direction: column;
}
.stat .v {
  font-family: var(--f-display);
  font-size: 32px;
  color: var(--fg);
  line-height: 1;
}
.stat .k {
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  color: var(--muted);
  margin-top: 6px;
  text-transform: uppercase;
}
.hs-visual {
  display: flex;
  justify-content: center;
}
@media (min-width: 1024px) {
  .hs-visual {
    justify-content: flex-end;
  }
}
.hs-frame {
  position: relative;
  width: min(460px, 100%);
  aspect-ratio: 1;
  border: 1px solid var(--border);
  background: radial-gradient(circle at 50% 45%, rgba(255, 106, 34, 0.1), transparent 62%);
  overflow: hidden;
}
.hs-art {
  position: absolute;
  inset: 6%;
  color: var(--accent);
  opacity: 0.9;
  animation: hsSpinIn 1.2s ease both;
}
@keyframes hsSpinIn {
  from {
    opacity: 0;
    transform: scale(0.85) rotate(-20deg);
  }
  to {
    opacity: 0.9;
    transform: none;
  }
}
.hs-mono {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--f-display);
  font-size: clamp(90px, 18vw, 200px);
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.1);
}
.hs-mono span {
  color: var(--accent);
  -webkit-text-stroke: 0;
}
.corner {
  position: absolute;
  width: 14px;
  height: 14px;
  border: 1px solid var(--accent);
  z-index: 2;
}
.corner.tl {
  top: -1px;
  left: -1px;
  border-right: 0;
  border-bottom: 0;
}
.corner.tr {
  top: -1px;
  right: -1px;
  border-left: 0;
  border-bottom: 0;
}
.corner.bl {
  bottom: -1px;
  left: -1px;
  border-right: 0;
  border-top: 0;
}
.corner.br {
  bottom: -1px;
  right: -1px;
  border-left: 0;
  border-top: 0;
}
.hs-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  color: var(--fg-dim);
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid var(--border);
}
.hs-badge .dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  animation: hsBlink 1.4s infinite;
}
@keyframes hsBlink {
  50% {
    opacity: 0.3;
  }
}
.hs-cap {
  position: absolute;
  top: 12px;
  left: 12px;
  font-family: var(--f-mono);
  font-size: 9px;
  letter-spacing: 0.2em;
  color: var(--muted);
}
.hs-ticker {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-top: 1px solid var(--border);
  overflow: hidden;
  padding: 12px 0;
  direction: ltr;
}
.hs-ticker-track {
  display: flex;
  width: max-content;
  white-space: nowrap;
  animation: hsMarquee 30s linear infinite;
  font-family: var(--f-display);
  font-size: 22px;
  letter-spacing: 0.16em;
  color: var(--silver-dim);
}
.hs-ticker-group {
  display: flex;
  flex-shrink: 0;
}
.hs-ticker-group span {
  padding: 0 22px;
}
.hs-ticker em {
  font-style: normal;
  color: var(--accent);
}
@keyframes hsMarquee {
  to {
    transform: translateX(-50%);
  }
}
@media (max-width: 1023px) {
  .hero-split {
    padding-top: 100px;
    padding-bottom: 84px;
  }
  .hs-grid {
    gap: 36px;
  }
  .hs-frame {
    width: min(320px, 82%);
  }
}
@media (max-width: 640px) {
  .hs-stats {
    gap: 20px;
  }
  .stat .v {
    font-size: 26px;
  }
}
</style>