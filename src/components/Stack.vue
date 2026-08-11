<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { techs } from '@/data/techs'
</script>

<template>
  <section id="stack" class="section page" aria-labelledby="stack-title">
    <p class="kicker">02 — Stack</p>
    <h2 id="stack-title" class="section-title">Стек</h2>
    <p class="lead">Инструменты, которыми пользуюсь каждый день.</p>

    <ul class="grid">
      <li v-for="tech in techs" :key="tech.id" class="item glass" :title="tech.name">
        <span class="icon" :style="{ color: tech.color }">
          <FontAwesomeIcon :icon="tech.icon" />
        </span>
        <span class="name">{{ tech.name }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.section {
  position: relative;
  z-index: 1;
}

.grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.95rem 1rem;
  border-radius: 1rem;
}

.item:hover {
  transform: translateY(-2px);
}

.item:hover .icon {
  transform: scale(1.1) rotate(-0.5deg);
}

.icon {
  display: grid;
  place-items: center;
  width: 2.3rem;
  height: 2.3rem;
  font-size: 1.3rem;
  transition: transform 0.25s ease;
  will-change: transform;
}

.name {
  font-weight: 600;
  font-size: 0.95rem;
}

@media (min-width: 760px) {
  .grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
