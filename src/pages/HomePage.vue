<script setup>
import IconSprite from '../components/IconSprite.vue'
import GrainOverlay from '../components/GrainOverlay.vue'
import ScrollProgress from '../components/ScrollProgress.vue'
import CustomCursor from '../components/CustomCursor.vue'
import SiteHeader from '../components/SiteHeader.vue'
import HeroSection from '../components/HeroSection.vue'
</script>

<template>
  <IconSprite />
  <GrainOverlay />
  <ScrollProgress />
  <CustomCursor />
  <SiteHeader />
  <main id="main">
    <HeroSection />
  </main>
</template>