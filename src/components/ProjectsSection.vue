<script setup>
import {ref, computed} from "vue";
import {useI18n} from "vue-i18n";
import {content} from "../data/store";
import ProjectModal from './ProjectModal.vue'

const {locale} = useI18n();
const tab = ref("code");
const showAll = ref(false);
const selected = ref(null)

const inTab = computed(() =>
    content.projects.filter((p) => p.category === tab.value),
);
const list = computed(() =>
    showAll.value ? inTab.value : inTab.value.filter((p) => p.featured),
);
const hasMore = computed(
    () => inTab.value.length > inTab.value.filter((p) => p.featured).length,
);

function setTab(t) {
  tab.value = t;
  showAll.value = false;
}
</script>

<template>
  <section id="works" class="py-16">
    <h2 v-reveal class="text-3xl font-bold text-white">
      <span class="text-accent">#</span>{{ $t("nav.works") }}
    </h2>

    <div class="mt-8 flex gap-4">
      <button
          v-for="t in ['code', 'wordpress']"
          :key="t"
          class="border px-4 py-2 transition"
          :class="
          tab === t
            ? 'border-accent text-white'
            : 'border-muted/40 hover:border-accent'
        "
          @click="setTab(t)"
      >
        {{ $t(t === "code" ? "works.tab_code" : "works.tab_wp") }}
      </button>
    </div>

    <div class="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <article
          v-reveal
          v-for="p in list"
          :key="p.id"
          class="border border-muted/40 transition hover:border-accent cursor-pointer"
          @click="selected = p"
      >
        <img
            v-if="p.image"
            :src="p.image"
            class="aspect-video w-full object-cover"
        />
        <div
            v-else
            class="flex aspect-video items-center justify-center bg-muted/10 text-3xl text-accent"
        >
          {{ p.title.en.slice(0, 2) }}
        </div>
        <div class="border-y border-muted/40 px-3 py-2 text-sm">
          {{ p.tech.join(" ") }}
        </div>
        <h3 class="p-4 text-lg font-bold text-white">{{ p.title[locale] }}</h3>
      </article>
    </div>

    <button
        v-if="hasMore"
        class="mt-8 border border-accent px-5 py-3 text-white transition hover:bg-accent/20"
        @click="showAll = !showAll"
    >
      {{ showAll ? $t("works.less") : $t("works.more") }}
    </button>
    <ProjectModal :project="selected" @close="selected = null"/>
  </section>
</template>
