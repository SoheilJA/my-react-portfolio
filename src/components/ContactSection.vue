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
      <div class="reveal sec-head" :class="{ 'in-view': seen }">
        <div>
          <div class="marker"><span>{{ $t('ct.marker') }}</span></div>
          <h2 class="display sec-title">
            <span>{{ $t('ct.t1') }}</span><br />
            <span class="accent">{{ $t('ct.t2') }}</span>
            <span>{{ $t('ct.t3') }}</span>
          </h2>
        </div>
        <div>
          <h3 class="display contact-cta">{{ $t('ct.cta_t') }}</h3>
          <p class="sec-text">{{ $t('ct.cta_p') }}</p>
        </div>
      </div>

      <div
        class="reveal contact-band"
        :class="{ 'in-view': seen }"
        style="--delay: 0.1s"
      >
        <div class="contact-main">
          <div class="kicker">{{ $t('ct.kicker') }}</div>
          <a :href="tel" class="phone-link">
            <svg class="i"><use href="#i-phone" /></svg>
            <span class="num" dir="ltr">{{ content.contact.phone }}</span>
          </a>
          <p class="note">{{ $t('ct.note') }}</p>
        </div>

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
      </div>
    </div>
  </section>
</template>