<script setup>
import IconSprite from "../components/IconSprite.vue";
import GrainOverlay from "../components/GrainOverlay.vue";
import ScrollProgress from "../components/ScrollProgress.vue";
import CustomCursor from "../components/CustomCursor.vue";
import SiteHeader from "../components/SiteHeader.vue";
import HeroSection from "../components/HeroSection.vue";
import StatsSection from "../components/StatsSection.vue";
import SkillsSection from "../components/SkillsSection.vue";
import ProjectsSection from "../components/ProjectsSection.vue";
import ExperienceSection from '../components/ExperienceSection.vue'
import CertificatesSection from '../components/CertificatesSection.vue'
import ContactSection from '../components/ContactSection.vue'
import SiteFooter from '../components/SiteFooter.vue'
</script>

<template>
  <IconSprite />
  <GrainOverlay />
  <ScrollProgress />
  <CustomCursor />
  <SiteHeader />
  <main id="main">
    <HeroSection />
    <StatsSection />
    <SkillsSection />
    <ProjectsSection />
    <ExperienceSection/>
    <CertificatesSection />
    <ContactSection />
  </main>
  <SiteFooter />
</template>
