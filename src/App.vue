<script setup lang="ts">
import { ref } from 'vue'
import BackgroundCanvas from '@/components/BackgroundCanvas.vue'
import CosmosScroll from '@/components/CosmosScroll.vue'
import CometsCanvas from '@/components/CometsCanvas.vue'
import Navbar from '@/components/Navbar.vue'
import Hero from '@/components/Hero.vue'
import Bio from '@/components/Bio.vue'
import Stack from '@/components/Stack.vue'
import Projects from '@/components/Projects.vue'
import Contacts from '@/components/Contacts.vue'
import Modal from '@/components/Modal.vue'
import { useSmoothScroll } from '@/composables/useSmoothScroll'
import type { Project } from '@/types'

useSmoothScroll()

const selected = ref<Project | null>(null)
const modalOpen = ref(false)

const openProject = (project: Project) => {
  selected.value = project
  modalOpen.value = true
}

const closeProject = () => {
  modalOpen.value = false
}
</script>

<template>
  <div class="shell" itemscope itemtype="https://schema.org/WebPage">
    <CosmosScroll />
    <BackgroundCanvas />
    <CometsCanvas />
    <Navbar />

    <main id="content" aria-label="Основной контент">
      <Hero />
      <Bio />
      <Stack />
      <Projects @open="openProject" />
      <Contacts />
    </main>

    <Modal :open="modalOpen" :project="selected" @close="closeProject" />
  </div>
</template>

<style scoped>
.shell {
  position: relative;
  min-height: 100vh;
  /* isolate: one backdrop root so glass can blur fixed cosmos layers */
  isolation: isolate;
  /* clip instead of hidden — overflow:hidden breaks backdrop-filter in Chromium */
  overflow-x: clip;
  background: transparent;
}

main {
  position: relative;
}
</style>
