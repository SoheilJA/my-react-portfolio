<script setup>
import { computed } from 'vue'
import { content } from '../data/store'
import { useInView } from '../lib/useInView'
import { socialIcon } from '../lib/socialIcon'

const { el, seen } = useInView(0.1)
const socials = computed(() => content.contact.socials.filter((s) => s.url))
const tel = computed(() => 'tel:' + content.contact.phone.replace(/\s/g, ''))
</script>

<template>
  <section id="contact" ref="el" class="sec">
    <div class="wrap">
      <div
        class="reveal sec-head"
        :class="{ 'in-view': seen }"
        style="grid-template-columns: 1fr"
      >
        <div>
          <div class="marker"><span>{{ $t('ct.marker') }}</span></div>
          <h2 class="display sec-title" style="font-size: clamp(46px, 8vw, 120px)">
            <span>{{ $t('ct.t1') }}</span><br />
            <span class="accent">{{ $t('ct.t2') }}</span>
            <span>{{ $t('ct.t3') }}</span>
          </h2>
        </div>
      </div>

      <div
        class="reveal contact-box"
        :class="{ 'in-view': seen }"
        style="--delay: 0.1s"
      >
        <div class="frame">
          <div class="kicker">{{ $t('ct.kicker') }}</div>
          <h3 class="display">{{ $t('ct.cta_t') }}</h3>
          <p class="lead">{{ $t('ct.cta_p') }}</p>

          <a :href="tel" class="phone-link">
            <svg class="i"><use href="#i-phone" /></svg>
            <span class="num" dir="ltr">{{ content.contact.phone }}</span>
          </a>

          <div v-if="socials.length" class="socials">
            <a
              v-for="s in socials"
              :key="s.id"
              class="soc"
              :href="s.url"
              target="_blank"
              rel="noopener"
              :aria-label="s.name"
            >
              <svg class="i"><use :href="'#' + socialIcon(s.name)" /></svg>
            </a>
          </div>

          <p class="note">{{ $t('ct.note') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>