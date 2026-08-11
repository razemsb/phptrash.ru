<script setup lang="ts">
import StarsCanvas from '@/components/StarsCanvas.vue'
import CosmosLayer from '@/components/CosmosLayer.vue'
import Navbar from '@/components/Navbar.vue'
import Hero from '@/components/Hero.vue'
import ProjectsGrid from '@/components/ProjectsGrid.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <div class="shell">
    <CosmosLayer />
    <StarsCanvas />
    <Navbar />
    <main>
      <Hero />
      <ProjectsGrid />
      <Footer />
    </main>
  </div>
</template>

<style scoped>
.shell {
  position: relative;
  min-height: 100vh;
  isolation: isolate;
  overflow-x: clip;
  background: transparent;
}

main {
  position: relative;
}
</style>
