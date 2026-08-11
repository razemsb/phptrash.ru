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
    <p class="kicker">Catalog</p>
    <h2 class="section-title">Все проекты</h2>

    <div v-if="projects.length" class="grid">
      <a
        v-for="(project, i) in projects"
        :key="project.id"
        :href="project.path"
        class="card glass"
        :style="{ '--i': i }"
        :target="project.path.startsWith('http') ? '_blank' : undefined"
        :rel="project.path.startsWith('http') ? 'noopener noreferrer' : undefined"
      >
        <div class="preview" aria-hidden="true">
          <span class="orb" />
          <span class="grid-lines" />
          <span class="slug">{{ project.path }}</span>
        </div>
        <div class="body">
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
}

.grid {
  display: grid;
  gap: 0.95rem;
}

.card {
  display: grid;
  overflow: hidden;
  border-radius: 1.4rem;
  padding: 0;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
  animation: rise 0.55s ease both;
  animation-delay: calc(var(--i, 0) * 60ms);
}

.card:hover {
  transform: translateY(-3px);
  border-color: color-mix(in oklab, var(--accent) 45%, var(--glass-border));
  box-shadow:
    0 16px 48px rgba(0, 0, 0, 0.35),
    0 0 0 1px color-mix(in oklab, var(--accent) 18%, transparent);
}

.preview {
  position: relative;
  min-height: 7.5rem;
  background:
    radial-gradient(circle at 78% 30%, rgba(77, 226, 255, 0.22), transparent 42%),
    radial-gradient(circle at 20% 80%, rgba(124, 107, 255, 0.18), transparent 45%),
    linear-gradient(145deg, #07101f, #03060f 60%, #010208);
  overflow: hidden;
}

.orb {
  position: absolute;
  right: 12%;
  top: 18%;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #9af0ff, #4de2ff 45%, #163a78 78%, #020812);
  box-shadow: 0 0 28px rgba(77, 226, 255, 0.28);
}

.grid-lines {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(160, 210, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(160, 210, 255, 0.05) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.55), transparent);
}

.slug {
  position: absolute;
  left: 1rem;
  bottom: 0.85rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.78rem;
  color: rgba(180, 220, 255, 0.7);
}

.body {
  display: grid;
  gap: 0.7rem;
  padding: 1.15rem 1.2rem 1.25rem;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

h3 {
  margin: 0;
  font-size: 1.2rem;
  letter-spacing: 0.01em;
}

.badge {
  padding: 0.28rem 0.6rem;
  border-radius: 999px;
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border: 1px solid var(--glass-border);
  color: var(--muted);
  flex-shrink: 0;
}

.badge[data-status='live'] {
  color: #041018;
  background: var(--accent);
  border-color: transparent;
  box-shadow: 0 0 16px rgba(77, 226, 255, 0.35);
}

.body > p {
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

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 820px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (prefers-reduced-motion: reduce) {
  .card {
    animation: none;
  }
}
</style>
