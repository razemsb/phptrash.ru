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
    <header class="intro">
      <div class="intro-copy">
        <p class="kicker">03 — Projects</p>
        <h2 id="projects-title" class="section-title">Проекты</h2>
        <p class="lead">Избранные работы — открой карточку, чтобы узнать больше.</p>
      </div>
      <a
        href="https://projects.phptrash.ru"
        class="hub-cta"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="/favicon.svg" alt="" width="22" height="22" class="hub-logo" />
        <span>Projects Hub</span>
        <FontAwesomeIcon :icon="['fas', 'arrow-up-right-from-square']" />
      </a>
    </header>

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

.intro {
  display: grid;
  gap: 1rem;
  margin-bottom: 1.75rem;
  align-items: end;
}

.intro-copy .section-title {
  margin-bottom: 0.55rem;
}

.intro-copy .lead {
  margin: 0;
  max-width: 28rem;
}

.hub-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: fit-content;
  min-height: 2.55rem;
  padding: 0.4rem 0.95rem 0.4rem 0.45rem;
  border-radius: 999px;
  border: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.06);
  color: var(--text);
  font-weight: 600;
  font-size: 0.88rem;
  letter-spacing: 0.02em;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.hub-logo {
  display: block;
  width: 1.55rem;
  height: 1.55rem;
  border-radius: 0.4rem;
  flex-shrink: 0;
}

.hub-cta :deep(svg) {
  color: var(--accent);
  font-size: 0.75rem;
  opacity: 0.85;
}

.hub-cta:hover {
  transform: translateY(-1px);
  border-color: color-mix(in oklab, var(--accent) 45%, var(--glass-border));
  background: rgba(77, 226, 255, 0.08);
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
  background: rgba(255, 255, 255, 0.08);
}

@media (min-width: 780px) {
  .intro {
    grid-template-columns: 1fr auto;
    gap: 1.5rem;
  }

  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
