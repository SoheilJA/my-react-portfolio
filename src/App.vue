<script setup>
import { useI18n } from "vue-i18n";
import { setLang } from "./i18n";

const { locale } = useI18n();
</script>

<template>
  <RouterView />
</template>
