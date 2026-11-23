<script setup>
const code = [
  [['{', 'p']],
  [['  "name"', 'k'], [': ', 'p'], ['"Soheil Jalal Ahmadi"', 's'], [',', 'p']],
  [['  "role"', 'k'], [': ', 'p'], ['"Web developer & designer"', 's'], [',', 'p']],
  [['  "location"', 'k'], [': ', 'p'], ['"Mashhad, Iran"', 's'], [',', 'p']],
  [['  "stack"', 'k'], [': ', 'p'], ['["Django", "Laravel", "WordPress"]', 's'], [',', 'p']],
  [['  "available"', 'k'], [': ', 'p'], ['true', 'a']],
  [['}', 'p']],
]
const tone = { k: 'text-key', s: 'text-str', p: 'text-punc', a: 'text-val' }
</script>

<template>
  <section id="hero" class="hero-clean">
    <div class="hero-glow" aria-hidden="true"></div>

    <div class="wrap hero-grid">
      <div class="hero-copy">
        <div class="marker hero-marker">
          <span>{{ $t('hero.kicker') }}</span>
        </div>

        <h1 class="hero-title display">
          <span class="line">{{ $t('hero.line1') }}</span>
          <span class="line">{{ $t('hero.line2') }}</span>
          <span class="line line-accent">{{ $t('hero.line3') }}</span>
        </h1>

        <p class="hero-sub">{{ $t('hero.subtitle') }}</p>

        <div class="hero-actions">
          <a href="#contact" class="btn-primary">{{ $t('hero.cta') }}</a>
          <a href="#projects" class="btn-ghost">
            {{ $t('hero.cta2') }}
            <span class="i-arrow">→</span>
          </a>
        </div>

        <div class="hero-status">
          <span class="dot"></span>
          <span>{{ $t('hero.status') }}</span>
          <span class="sep">·</span>
          <span class="loc">{{ $t('hero.marker') }}</span>
        </div>
      </div>

      <div class="hero-visual">
        <div class="win" dir="ltr">
          <div class="win-bar">
            <span v-for="n in 3" :key="n" class="win-dot"></span>
            <span class="win-file">profile.json</span>
            <span class="win-badge">ready</span>
          </div>
          <pre class="win-body"><code><span v-for="(line, i) in code" :key="i" class="code-line"><span class="ln">{{ i + 1 }}</span><span v-for="(t, j) in line" :key="j" :class="tone[t[1]]">{{ t[0] }}</span></span></code></pre>
        </div>

        <div class="hero-foot">
          <span class="foot-label">{{ $t('hero.stack') }}</span>
          <div class="foot-chips" dir="ltr">
            <span>Django</span>
            <span>Laravel</span>
            <span>WordPress</span>
            <span>Tailwind</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-clean {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  padding-top: 120px;
  padding-bottom: 48px;
  overflow: hidden;
  background: radial-gradient(
    60% 55% at 72% 42%,
    rgba(255, 106, 34, 0.09),
    transparent 70%
  );
}

.hero-glow {
  position: absolute;
  top: 8%;
  inset-inline-end: 6%;
  width: 460px;
  height: 460px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 106, 34, 0.12) 0%,
    rgba(255, 106, 34, 0.04) 40%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
}

.hero-grid {
  position: relative;
  z-index: 1;
  display: grid;
  gap: clamp(40px, 5vw, 72px);
  align-items: center;
}
@media (min-width: 1024px) {
  .hero-grid {
    grid-template-columns: 1.05fr 0.95fr;
  }
}

.hero-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
}

.hero-marker {
  margin-bottom: 22px;
  font-size: 12px;
}

.hero-title {
  font-size: clamp(44px, 6.4vw, 96px);
  line-height: 1.02;
  margin: 0;
}
html[lang="fa"] .hero-title {
  line-height: 1.22;
}
.hero-title .line {
  display: block;
  opacity: 0;
  transform: translateY(24px);
  animation: heroUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.hero-title .line:nth-child(1) {
  animation-delay: 0.05s;
}
.hero-title .line:nth-child(2) {
  animation-delay: 0.14s;
}
.hero-title .line:nth-child(3) {
  animation-delay: 0.23s;
}
.hero-title .line-accent {
  color: var(--accent);
}

@keyframes heroUp {
  to {
    opacity: 1;
    transform: none;
  }
}

.hero-sub {
  margin: 24px 0 0;
  max-width: 480px;
  color: var(--fg-dim);
  font-size: clamp(15px, 1.35vw, 17px);
  opacity: 0;
  animation: heroUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.34s forwards;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 34px;
  opacity: 0;
  animation: heroUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.44s forwards;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 30px;
  background: var(--accent);
  color: #000;
  font-family: var(--f-heading);
  font-size: 14px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: background 0.3s;
}
html[lang="fa"] .btn-primary {
  font-family: "Vazirmatn Variable", sans-serif;
  font-size: 15px;
  font-weight: 700;
}
.btn-primary:hover {
  background: var(--accent-bright);
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 26px;
  border: 1px solid var(--border-light);
  color: var(--fg);
  font-family: var(--f-heading);
  font-size: 14px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: all 0.3s;
}
html[lang="fa"] .btn-ghost {
  font-family: "Vazirmatn Variable", sans-serif;
  font-size: 15px;
  font-weight: 700;
}
.btn-ghost:hover {
  border-color: var(--accent);
  color: var(--accent);
}
html[dir="rtl"] .i-arrow {
  transform: scaleX(-1);
}

.hero-status {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 34px;
  font-family: var(--f-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  color: var(--fg-dim);
  text-transform: uppercase;
  opacity: 0;
  animation: heroUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.54s forwards;
}
html[lang="fa"] .hero-status {
  font-family: "Vazirmatn Variable", sans-serif;
  letter-spacing: 0;
  font-size: 13px;
}
.hero-status .dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  animation: heroBlink 1.6s ease-in-out infinite;
}
.hero-status .sep {
  color: var(--silver-dim);
}
.hero-status .loc {
  color: var(--muted);
}

@keyframes heroBlink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}

/* Visual */
.hero-visual {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
  opacity: 0;
  animation: heroUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.36s forwards;
}

.win {
  border: 1px solid var(--border-light);
  background: rgba(15, 15, 15, 0.85);
  backdrop-filter: blur(6px);
  box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.8);
  min-width: 0;
  max-width: 100%;
}

.win-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
}
.win-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--silver-dim);
}
.win-dot:first-child {
  background: var(--accent);
}
.win-file {
  margin-inline-start: 10px;
  font-family: var(--f-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--muted);
}
.win-badge {
  margin-inline-start: auto;
  font-family: var(--f-mono);
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
  border: 1px solid var(--accent-dim);
  padding: 3px 8px;
}

.win-body {
  margin: 0;
  padding: 18px 0 20px;
  overflow-x: auto;
  font-family: var(--f-mono);
  font-size: clamp(12px, 1vw, 13.5px);
  line-height: 1.95;
}
.code-line {
  display: block;
}
.code-line .ln {
  display: inline-block;
  width: 34px;
  text-align: end;
  margin-inline-end: 16px;
  color: var(--silver-dim);
  user-select: none;
}
.text-key {
  color: var(--accent-bright);
}
.text-str {
  color: var(--fg-dim);
}
.text-punc {
  color: var(--silver-dim);
}
.text-val {
  color: var(--accent);
}

.hero-foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
}
.foot-label {
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
}
html[lang="fa"] .foot-label {
  font-family: "Vazirmatn Variable", sans-serif;
  letter-spacing: 0;
  font-size: 12px;
}
.foot-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.foot-chips span {
  font-family: var(--f-mono);
  font-size: 11px;
  letter-spacing: 0.05em;
  color: var(--fg-dim);
  padding: 5px 11px;
  border: 1px solid var(--border-light);
  background: rgba(0, 0, 0, 0.3);
}

@media (prefers-reduced-motion: reduce) {
  .hero-title .line,
  .hero-sub,
  .hero-actions,
  .hero-status,
  .hero-visual {
    opacity: 1;
    transform: none;
    animation: none;
  }
}

@media (max-width: 1023px) {
  .hero-clean {
    padding-top: 104px;
  }
  .hero-visual {
    max-width: 520px;
  }
}
</style>