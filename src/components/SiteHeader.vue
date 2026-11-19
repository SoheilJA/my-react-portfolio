<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { setLang } from "../i18n";

const { locale } = useI18n();
const open = ref(false);
const links = ["home", "services", "works", "about", "contact"];
</script>

<template>
  <header class="fixed top-0 z-40 w-full bg-bg/90 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
      <a href="#home" class="font-bold text-white">
        <span class="text-accent">#</span>soheil
      </a>

      <nav class="hidden items-center gap-8 md:flex">
        <a v-for="l in links" :key="l" :href="'#' + l" class="hover:text-white">
          <span class="text-accent">#</span>{{ $t("nav." + l) }}
        </a>
        <button
          class="hover:text-white"
          @click="setLang(locale === 'fa' ? 'en' : 'fa')"
        >
          {{ locale === "fa" ? "EN" : "FA" }}
        </button>
      </nav>

      <button class="text-2xl text-white md:hidden" @click="open = !open">
        {{ open ? "✕" : "☰" }}
      </button>
    </div>

    <nav v-if="open" class="flex flex-col gap-6 px-6 pb-8 text-2xl md:hidden">
      <a
        v-for="l in links"
        :key="l"
        :href="'#' + l"
        class="hover:text-white"
        @click="open = false"
      >
        <span class="text-accent">#</span>{{ $t("nav." + l) }}
      </a>
      <button
        class="w-fit hover:text-white"
        @click="setLang(locale === 'fa' ? 'en' : 'fa')"
      >
        {{ locale === "fa" ? "EN" : "FA" }}
      </button>
    </nav>
  </header>
</template>
