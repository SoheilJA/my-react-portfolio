<script setup>
import { useI18n } from "vue-i18n";
import { setLang } from "../i18n";

const { locale } = useI18n();
</script>

<template>
  <div class="p-8">
    <h1 class="text-4xl font-bold text-white">
      <span class="text-accent">#</span>home
    </h1>
    <p class="mt-4">{{ $t("hero.tagline") }}</p>
    <button
      class="mt-4 border border-accent px-4 py-2"
      @click="setLang(locale === 'fa' ? 'en' : 'fa')"
    >
      {{ locale === "fa" ? "EN" : "FA" }}
    </button>
  </div>
</template>
