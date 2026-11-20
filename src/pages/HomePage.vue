<script setup>
import SiteHeader from "../components/SiteHeader.vue";
import ScrollProgress from '../components/ScrollProgress.vue'
import HeroSection from "../components/HeroSection.vue";
import MarqueeBand from '../components/MarqueeBand.vue'
import ServicesSection from "../components/ServicesSection.vue";
import ProjectsSection from "../components/ProjectsSection.vue";
import AboutSection from "../components/AboutSection.vue";
import CertificatesSection from "../components/CertificatesSection.vue";
import ContactSection from "../components/ContactSection.vue";
import SiteFooter from "../components/SiteFooter.vue";
import CustomCursor from '../components/CustomCursor.vue'

</script>

<template>
  <CustomCursor />
  <ScrollProgress/>
  <SiteHeader/>
  <main id="main" class="mx-auto max-w-6xl px-6 pt-24">
    <HeroSection/>
    <MarqueeBand/>
    <ServicesSection/>
    <ProjectsSection/>
    <AboutSection/>
    <CertificatesSection/>
    <ContactSection/>
  </main>
  <SiteFooter/>
</template>
