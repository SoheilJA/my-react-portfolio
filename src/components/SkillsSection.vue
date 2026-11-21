<script setup>
import { useI18n } from "vue-i18n";
import { content } from "../data/store";
import { useInView } from "../lib/useInView";

const { locale } = useI18n();
const { el, seen } = useInView();
const pad = (n) => String(n).padStart(2, "0");
</script>

<template>
  <section id="skills" ref="el" class="sec">
    <div class="wrap">
      <div class="reveal sec-head" :class="{ 'in-view': seen }">
        <div>
          <div class="marker">
            <span>{{ $t("sk.marker") }}</span>
          </div>
          <h2 class="display sec-title">
            <span>{{ $t("sk.t1") }}</span
            ><br />
            <span class="stroke">{{ $t("sk.t2") }}</span
            ><br />
            <span class="accent">{{ $t("sk.t3") }}</span>
          </h2>
        </div>
        <div>
          <p class="sec-text">{{ $t("sk.text") }}</p>
          <div class="pills">
            <span v-for="s in content.services" :key="s.id" class="pill static">
              {{ s.title[locale] }}
            </span>
          </div>
        </div>
      </div>

      <div class="grid3 stagger" :class="{ 'in-view': seen }">
        <article
          v-for="(p, i) in content.paths"
          :key="p.id"
          class="skill card notch"
        >
          <div class="skill-top">
            <div class="skill-num">{{ pad(i + 1) }}</div>
          </div>
          <div class="skill-body">
            <h3 class="display">{{ p.title[locale] }}</h3>
            <p>{{ p.text[locale] }}</p>
            <div
              class="mono"
              style="
                font-size: 11px;
                color: var(--accent);
                letter-spacing: 0.1em;
                direction: ltr;
                text-align: start;
              "
            >
              {{ p.stack }}
            </div>
            <div v-if="p.level" class="level" :style="{ '--w': p.level + '%' }">
              <i></i>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
