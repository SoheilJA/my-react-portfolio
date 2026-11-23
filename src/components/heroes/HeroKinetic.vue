<script setup>
const words = ['hero.l1', 'hero.l2', 'hero.l3b', 'hero.tagline']
</script>

<template>
  <section id="hero" class="hero-kin">
    <div class="hk-top wrap">
      <div class="marker"><span>{{ $t('hero.marker') }}</span></div>
      <div class="hk-status">
        <span class="dot"></span><span>{{ $t('hero.status') }}</span>
      </div>
    </div>

    <div class="hk-stage wrap">
      <div class="hk-fill display">{{ $t('hero.name') }}</div>
      <div class="hk-outline display">{{ $t('hero.tagline') }}</div>
      <div class="hk-accent display">{{ $t('hero.l3a') }} {{ $t('hero.l3b') }}</div>
    </div>

    <div class="hk-foot wrap">
      <p>{{ $t('hero.sub_2') }}</p>
      <div class="hk-actions">
        <a href="#projects" class="hk-cta">{{ $t('hero.cta2') }}</a>
        <a href="#skills" class="hk-scroll">
          {{ $t('hero.scroll') }} <span>↓</span>
        </a>
      </div>
    </div>

    <div class="hk-marquee" aria-hidden="true">
      <div class="hk-marquee-track">
        <span v-for="n in 2" :key="n" class="hk-marquee-group">
          <span v-for="w in words" :key="w">{{ $t(w) }}</span><em>✦</em>
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-kin {
  position: relative;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 120px;
  overflow: hidden;
  background:
    radial-gradient(70% 60% at 50% 38%, rgba(255, 106, 34, 0.08), transparent 65%),
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: auto, 80px 80px, 80px 80px;
}
.hk-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.hk-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.16em;
  color: var(--fg-dim);
  text-transform: uppercase;
}
.hk-status .dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  animation: hkBlink 1.4s infinite;
}
.hk-stage {
  padding: 10px 0;
}
.hk-fill {
  font-size: clamp(52px, 13vw, 190px);
  color: var(--fg);
  line-height: 0.95;
  animation: hkUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.hk-outline {
  font-size: clamp(38px, 10vw, 150px);
  color: transparent;
  -webkit-text-stroke: 1px var(--silver-dim);
  line-height: 0.95;
  animation: hkUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.08s both;
}
.hk-accent {
  font-size: clamp(28px, 6vw, 72px);
  color: var(--accent);
  line-height: 1;
  margin-top: 10px;
  animation: hkUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.16s both;
}
@keyframes hkUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.hk-foot {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  padding-bottom: 40px;
}
.hk-foot p {
  max-width: 520px;
  color: var(--fg-dim);
  font-size: clamp(14px, 1.3vw, 16px);
}
.hk-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}
.hk-cta {
  background: var(--accent);
  color: #000;
  padding: 13px 22px;
  font-family: var(--f-heading);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transition: background 0.3s;
}
.hk-cta:hover {
  background: var(--accent-bright);
}
.hk-scroll {
  font-family: var(--f-mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  color: var(--fg-dim);
  text-transform: uppercase;
  display: inline-flex;
  gap: 8px;
  align-items: center;
}
.hk-scroll span {
  color: var(--accent);
  animation: hkBob 1.6s ease-in-out infinite;
}
.hk-marquee {
  border-top: 1px solid var(--border);
  overflow: hidden;
  padding: 16px 0;
  direction: ltr;
}
.hk-marquee-track {
  display: flex;
  width: max-content;
  white-space: nowrap;
  animation: hkMarquee 26s linear infinite;
  font-family: var(--f-display);
  font-size: clamp(24px, 4vw, 48px);
  letter-spacing: 0.08em;
  color: var(--silver-dim);
}
.hk-marquee-group {
  display: flex;
  flex-shrink: 0;
}
.hk-marquee-group span {
  padding: 0 24px;
}
.hk-marquee em {
  color: var(--accent);
  font-style: normal;
}
@keyframes hkMarquee {
  to {
    transform: translateX(-50%);
  }
}
@keyframes hkBlink {
  50% {
    opacity: 0.3;
  }
}
@keyframes hkBob {
  50% {
    transform: translateY(4px);
  }
}
@media (max-width: 767px) {
  .hk-foot {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    padding-bottom: 28px;
  }
}
</style>