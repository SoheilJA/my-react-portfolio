<script setup>
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { content } from '../data/store'
import { useInView } from '../lib/useInView'

const { locale } = useI18n()
const { el, seen } = useInView()
const flipped = reactive({})
const pad = (n) => String(n).padStart(2, '0')

function toggle(id, force = false) {
  if (force || matchMedia('(hover: none)').matches) flipped[id] = !flipped[id]
}
</script>

<template>
  <section id="experience" ref="el" class="sec">
    <div class="wrap">
      <div class="reveal sec-head" :class="{ 'in-view': seen }">
        <div>
          <div class="marker"><span>{{ $t('ex.marker') }}</span></div>
          <h2 class="display sec-title">
            <span>{{ $t('ex.t1') }}</span> <span class="accent">{{ $t('ex.t2') }}</span><br />
            <span>{{ $t('ex.t3') }}</span> <span>{{ $t('ex.t4') }}</span>
          </h2>
        </div>
        <div><p class="sec-text">{{ $t('ex.text') }}</p></div>
      </div>

      <div class="exp-grid stagger" :class="{ 'in-view': seen }">
        <div
          v-for="(e, i) in content.experience"
          :key="e.id"
          class="flip"
          :class="{ flipped: flipped[e.id] }"
          tabindex="0"
          @click="toggle(e.id)"
          @keydown.enter="toggle(e.id, true)"
        >
          <div class="flip-in">
            <div class="face front card">
              <div class="exp-art">
                <div class="big">{{ pad(i + 1) }}</div>
                <span class="tag idx" style="inset-inline-start: 14px">/ {{ pad(i + 1) }}</span>
                <span class="tag type" style="inset-inline-end: 14px">{{ e.tag[locale] }}</span>
                <div class="bot" style="direction: ltr; text-align: start">{{ e.period }}</div>
              </div>
              <div class="exp-info">
                <div>
                  <h3 class="display">{{ e.company[locale] }}</h3>
                  <p class="role">{{ e.role[locale] }}</p>
                </div>
                <div class="exp-foot">
                  <span style="direction: ltr">{{ e.stack.split(' · ')[0] }}</span>
                  <b>{{ $t('ex.hover') }}</b>
                </div>
              </div>
            </div>

            <div class="face back card">
              <div class="lab">/ {{ e.company[locale] }}</div>
              <h4 class="display">{{ $t('ex.highlights') }}</h4>
              <ul>
                <li v-for="p in e.points[locale]" :key="p">
                  <svg class="i"><use href="#i-check" /></svg>
                  <span>{{ p }}</span>
                </li>
              </ul>
              <div class="sig">
                <div class="k">{{ $t('ex.milestone') }}</div>
                <div class="v">{{ e.sig[locale] }}</div>
                <div
                  class="mono"
                  style="font-size: 10px; color: var(--muted); margin-top: 8px; direction: ltr; text-align: start"
                >
                  {{ e.stack }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>