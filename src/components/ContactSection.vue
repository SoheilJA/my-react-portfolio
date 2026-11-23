<script setup>
import { computed } from 'vue'
import { content } from '../data/store'
import { useInView } from '../lib/useInView'

const { el, seen } = useInView(0.1)
const socials = computed(() => content.contact.socials.filter((s) => s.url))
const tel = computed(() => 'tel:' + content.contact.phone.replace(/\s/g, ''))
const iconFor = (n) => (/github/i.test(n) ? 'i-github' : 'i-globe')
</script>

<template>
  <section id="contact" ref="el" class="sec">
    <div class="wrap">
      <div class="reveal sec-head" :class="{ 'in-view': seen }" style="grid-template-columns: 1fr">
        <div>
          <div class="marker"><span>{{ $t('ct.marker') }}</span></div>
          <h2 class="display sec-title" style="font-size: clamp(46px, 8vw, 120px)">
            <span>{{ $t('ct.t1') }}</span><br />
            <span class="accent">{{ $t('ct.t2') }}</span>
            <span>{{ $t('ct.t3') }}</span>
          </h2>
        </div>
      </div>

      <div class="contact-grid">
        <div class="reveal" :class="{ 'in-view': seen }">
          <div class="frame">
            <div class="kicker">{{ $t('ct.kicker') }}</div>
            <h3 class="display">{{ $t('ct.cta_t') }}</h3>
            <p class="lead">{{ $t('ct.cta_p') }}</p>

            <a :href="'mailto:' + content.contact.email" class="cta pulse">
              <span>{{ $t('ct.btn') }}</span>
              <svg class="i flip-arrow"><use href="#i-arrow" /></svg>
            </a>
            <a :href="tel" class="cta-ghost">
              <svg class="i"><use href="#i-phone" /></svg>
              <span>{{ $t('ct.call') }}</span>
            </a>
            <p class="note">{{ $t('ct.note') }}</p>
          </div>
        </div>

        <div class="reveal" :class="{ 'in-view': seen }" style="--delay: 0.2s">
          <div class="card info">
            <div class="kicker">{{ $t('ct.loc_k') }}</div>
            <h4 class="display">{{ $t('ct.loc_t') }}</h4>
            <div class="row">
              <svg class="i"><use href="#i-pin" /></svg>
              <b style="font-weight: 500">{{ $t('contact.location') }}</b>
            </div>
            <div class="row" style="color: var(--fg-dim)">
              <svg class="i"><use href="#i-globe" /></svg>
              <b style="font-weight: 400">{{ $t('ct.langs') }}</b>
            </div>
          </div>

          <div class="card info">
            <div class="kicker">{{ $t('ct.con_k') }}</div>
            <h4 class="display">{{ $t('ct.con_t') }}</h4>
            <a class="row" :href="tel">
              <svg class="i"><use href="#i-phone" /></svg>
              <span>{{ content.contact.phone }}</span>
            </a>
            <a class="row" :href="'mailto:' + content.contact.email">
              <svg class="i"><use href="#i-mail" /></svg>
              <span>{{ content.contact.email }}</span>
            </a>
            <a
              v-for="s in socials"
              :key="s.id"
              class="row"
              :href="s.url"
              target="_blank"
              rel="noopener"
            >
              <svg class="i"><use :href="'#' + iconFor(s.name)" /></svg>
              <span>{{ s.name }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>