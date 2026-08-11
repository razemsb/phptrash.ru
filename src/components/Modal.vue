<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { onKeyStroke } from '@vueuse/core'
import { watch } from 'vue'
import type { Project } from '@/types'

const props = defineProps<{
  project: Project | null
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

watch(
  () => props.open,
  (value) => {
    document.body.style.overflow = value ? 'hidden' : ''
  },
)

onKeyStroke('Escape', () => {
  if (props.open) emit('close')
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open && project"
        class="overlay"
        role="dialog"
        aria-modal="true"
        :aria-label="project.title"
      >
        <button type="button" class="backdrop" aria-label="Закрыть" @click="emit('close')" />

        <article class="panel glass">
          <img :src="project.image" :alt="project.title" loading="lazy" class="cover" />
          <div class="content">
            <div class="top">
              <h3>{{ project.title }}</h3>
              <button type="button" class="close" @click="emit('close')">Закрыть</button>
            </div>
            <p>{{ project.longDescription }}</p>
            <div class="tags">
              <span v-for="tech in project.techs" :key="tech">{{ tech }}</span>
            </div>
            <a
              :href="project.link"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-primary"
            >
              GitHub
              <FontAwesomeIcon :icon="['fas', 'arrow-up-right-from-square']" />
            </a>
          </div>
        </article>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: end;
  justify-content: center;
  padding: 0.75rem;
}

.backdrop {
  position: absolute;
  inset: 0;
  background: rgba(3, 6, 14, 0.62);
  backdrop-filter: blur(6px);
}

.panel {
  position: relative;
  z-index: 1;
  width: min(640px, 100%);
  max-height: 90vh;
  overflow: auto;
  border-radius: 1.5rem;
}

.cover {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  display: block;
}

.content {
  padding: 1.2rem 1.25rem 1.4rem;
  display: grid;
  gap: 0.9rem;
}

.top {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: start;
}

h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.close {
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  border: 1px solid var(--glass-border);
  font-size: 0.85rem;
}

p {
  margin: 0;
  color: var(--muted);
  line-height: 1.6;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.tags span {
  font-size: 0.72rem;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  border: 1px solid var(--line);
}

.btn {
  width: fit-content;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.28s ease;
}

.modal-enter-active .panel,
.modal-leave-active .panel {
  transition:
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.35s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .panel,
.modal-leave-to .panel {
  opacity: 0;
  transform: translateY(24px);
}

@media (min-width: 640px) {
  .overlay {
    align-items: center;
    padding: 1.25rem;
  }
}
</style>
