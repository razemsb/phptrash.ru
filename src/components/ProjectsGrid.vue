<script setup lang="ts">
import { projects } from '@/data/projects'

const statusLabel: Record<string, string> = {
  live: 'Live',
  wip: 'В работе',
  soon: 'Скоро',
}
</script>

<template>
  <section id="projects" class="section page">
    <div v-if="projects.length" class="grid">
      <a
        v-for="project in projects"
        :key="project.id"
        :href="project.path"
        class="card glass"
        :target="project.path.startsWith('http') ? '_blank' : undefined"
        :rel="project.path.startsWith('http') ? 'noopener noreferrer' : undefined"
      >
        <div class="head">
          <h3>{{ project.title }}</h3>
          <span class="badge" :data-status="project.status">
            {{ statusLabel[project.status] }}
          </span>
        </div>
        <p>{{ project.blurb }}</p>
        <div class="tags">
          <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
        </div>
      </a>
    </div>

    <div v-else class="empty glass">
      <p>Пока проектов нет — скоро появятся здесь.</p>
    </div>
  </section>
</template>

<style scoped>
.section {
  position: relative;
  z-index: 1;
  padding-top: 0.5rem;
}

.grid {
  display: grid;
  gap: 0.85rem;
}

.card {
  display: grid;
  gap: 0.7rem;
  padding: 1.2rem 1.25rem;
  border-radius: 1.35rem;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  border-color: color-mix(in oklab, var(--accent) 40%, var(--glass-border));
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

h3 {
  margin: 0;
  font-size: 1.15rem;
}

.badge {
  padding: 0.28rem 0.6rem;
  border-radius: 999px;
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border: 1px solid var(--glass-border);
  color: var(--muted);
}

.badge[data-status='live'] {
  color: #041018;
  background: var(--accent);
  border-color: transparent;
}

.card > p {
  margin: 0;
  color: var(--muted);
  line-height: 1.55;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tags span {
  padding: 0.28rem 0.55rem;
  border-radius: 999px;
  font-size: 0.78rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--glass-border);
}

.empty {
  padding: clamp(1.4rem, 3vw, 2rem);
  border-radius: 1.5rem;
  text-align: center;
}

.empty p {
  margin: 0;
  color: var(--muted);
}

@media (min-width: 820px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
