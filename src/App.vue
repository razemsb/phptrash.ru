<script setup lang="ts">
import StarsCanvas from '@/components/StarsCanvas.vue'
import Navbar from '@/components/Navbar.vue'
import Hero from '@/components/Hero.vue'
import ProjectsGrid from '@/components/ProjectsGrid.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <div class="shell">
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
}

main {
  position: relative;
  z-index: 1;
}
</style>
