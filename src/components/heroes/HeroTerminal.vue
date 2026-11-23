<script setup>
</script>

<template>
  <section id="hero" class="hero-term">
    <div class="ht-grid wrap">
      <div class="ht-intro">
        <div class="marker"><span>{{ $t('hero.marker') }}</span></div>
        <h1 class="display ht-title">
          <span>{{ $t('hero.line1') }}</span>
          <span>{{ $t('hero.line2') }}</span>
          <span class="accent">{{ $t('hero.line3') }}</span>
        </h1>
        <p class="ht-sub">{{ $t('hero.subtitle') }}</p>
        <div class="ht-cta">
          <a href="#projects" class="hs-btn primary">{{ $t('hero.cta2') }}</a>
          <a href="#contact" class="hs-btn ghost">{{ $t('hero.cta') }}</a>
        </div>
      </div>

      <div class="ht-term" dir="ltr">
        <div class="ht-bar">
          <span class="d r"></span><span class="d y"></span><span class="d g"></span>
          <span class="ht-bar-title">soheil@portfolio: ~</span>
        </div>
        <div class="ht-body">
          <p class="ht-line"><span class="pfx">$</span> whoami</p>
          <p class="ht-out">Soheil — Django developer &amp; web designer</p>
          <p class="ht-line"><span class="pfx">$</span> cat stack.json</p>
          <pre class="ht-json">{
  <span class="k">"backend"</span>: <span class="s">"Django / Python"</span>,
  <span class="k">"frontend"</span>: <span class="s">"Tailwind / JS"</span>,
  <span class="k">"cms"</span>: <span class="s">"WordPress"</span>
}</pre>
          <p class="ht-line"><span class="pfx">$</span> status --now</p>
          <p class="ht-out ok"><span class="ok-dot"></span>available for freelance</p>
          <p class="ht-line"><span class="pfx">$</span> <span class="ht-cursor"></span></p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-term {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  padding-top: 120px;
  padding-bottom: 80px;
  overflow: hidden;
  background:
    radial-gradient(50% 50% at 50% 0%, rgba(255, 106, 34, 0.08), transparent 60%),
    var(--bg-darker);
}
.hero-term::before {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent 0 3px,
    rgba(0, 0, 0, 0.25) 3px 4px
  );
  pointer-events: none;
  opacity: 0.5;
}
.ht-grid {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 48px;
  align-items: center;
}
@media (min-width: 1024px) {
  .ht-grid {
    grid-template-columns: 1fr 1fr;
  }
}
.ht-title {
  font-size: clamp(40px, 6vw, 88px);
  margin-bottom: 24px;
}
.ht-title span {
  display: block;
  overflow: hidden;
}
.ht-title span > span,
.ht-title > span {
  animation: htUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.ht-title > span:nth-child(2) {
  animation-delay: 0.08s;
}
.ht-title > span:nth-child(3) {
  animation-delay: 0.16s;
}
@keyframes htUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.ht-sub {
  color: var(--fg-dim);
  max-width: 520px;
  font-size: clamp(15px, 1.4vw, 18px);
}
.ht-cta {
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
.ht-term {
  border: 1px solid var(--border-light);
  background: #0b0b0b;
  box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.85);
  font-family: var(--f-mono);
}
.ht-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  background: #101010;
}
.ht-bar .d {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.ht-bar .r {
  background: #ff5f56;
}
.ht-bar .y {
  background: #ffbd2e;
}
.ht-bar .g {
  background: #27c93f;
}
.ht-bar-title {
  margin-left: 12px;
  font-size: 11px;
  color: var(--muted);
}
.ht-body {
  padding: 22px;
  font-size: clamp(12px, 1.1vw, 14px);
  line-height: 1.9;
  color: var(--fg-dim);
}
.ht-line {
  color: var(--fg);
}
.ht-line .pfx {
  color: var(--accent);
  margin-right: 6px;
}
.ht-out {
  color: var(--fg-dim);
  padding-inline-start: 16px;
  margin-bottom: 10px;
}
.ht-out.ok {
  color: var(--accent);
}
.ht-json {
  color: var(--fg-dim);
  padding-inline-start: 16px;
  margin-bottom: 10px;
  white-space: pre-wrap;
}
.ht-json .k {
  color: var(--accent-bright);
}
.ht-json .s {
  color: var(--silver);
}
.ok-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  margin-right: 8px;
  animation: htBlink 1.4s infinite;
}
.ht-cursor {
  display: inline-block;
  width: 8px;
  height: 1em;
  background: var(--accent);
  vertical-align: text-bottom;
  animation: htCaret 1s steps(1) infinite;
}
@keyframes htCaret {
  50% {
    opacity: 0;
  }
}
@keyframes htBlink {
  50% {
    opacity: 0.3;
  }
}
</style>