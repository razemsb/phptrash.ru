<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { Project } from '@/types'
import { projects } from '@/data/projects'

defineEmits<{
  open: [project: Project]
}>()
</script>

<template>
    <section id="projects" class="section page" aria-labelledby="projects-title">
    <p class="kicker">03 — Projects</p>
    <h2 id="projects-title" class="section-title">Проекты</h2>
    <p class="lead">
      Четыре работы — клик открывает подробности. Живые демо также на
      <a href="https://projects.phptrash.ru" class="hub-link" target="_blank" rel="noopener noreferrer"
        >projects.phptrash.ru</a
      >.
    </p>

    <div class="grid">
      <button
        v-for="project in projects"
        :key="project.id"
        type="button"
        class="card glass"
        @click="$emit('open', project)"
      >
        <img
          :src="project.image"
          :alt="`${project.title} — превью проекта`"
          loading="lazy"
          decoding="async"
          width="800"
          height="500"
          class="thumb"
        />
        <div class="body">
          <div class="head">
            <h3>{{ project.title }}</h3>
            <FontAwesomeIcon :icon="['fas', 'arrow-up-right-from-square']" class="arrow" />
          </div>
          <p>{{ project.description }}</p>
          <div class="tags">
            <span v-for="tech in project.techs" :key="tech">{{ tech }}</span>
          </div>
        </div>
      </button>
    </div>
  </section>
</template>

<style scoped>
.section {
  position: relative;
  z-index: 1;
}

.hub-link {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 0.15em;
}

.grid {
  display: grid;
  gap: 0.9rem;
}

.card {
  overflow: hidden;
  border-radius: 1.35rem;
  text-align: left;
  padding: 0;
  cursor: pointer;
}

.thumb {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
}

.body {
  padding: 1.1rem 1.15rem 1.2rem;
  display: grid;
  gap: 0.65rem;
}

.head {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: start;
}

h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 0.95rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.arrow {
  opacity: 0.45;
  margin-top: 0.15rem;
  font-size: 0.85rem;
  transition: opacity 0.2s ease;
}

.card:hover .arrow {
  opacity: 1;
}

p {
  margin: 0;
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.5;
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
  color: var(--muted);
}

@media (min-width: 780px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
