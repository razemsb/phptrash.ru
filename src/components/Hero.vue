<script setup lang="ts"></script>

<template>
  <section id="top" class="hero page" itemscope itemtype="https://schema.org/Person">
    <div class="hero-main">
      <h1 itemprop="name">phptrash</h1>
      <p class="role" itemprop="jobTitle">Fullstack developer</p>

      <p class="pitch" itemprop="description">
        Собираю продукты на PHP/Laravel и Vue: от API и БД до интерфейса, который
        удобно трогать руками.
      </p>

      <div class="actions">
        <a href="#projects" class="btn btn-primary">Смотреть проекты</a>
        <a href="#contacts" class="btn btn-ghost">Связаться</a>
      </div>
    </div>

    <aside class="hero-card glass">
      <p class="card-label">Фокус</p>
      <ul>
        <li>Backend на Laravel</li>
        <li>SPA и админки на Vue 3</li>
        <li>Чистая вёрстка под прод</li>
      </ul>
      <div class="tags">
        <span>PHP 8</span>
        <span>Vue 3</span>
        <span>Tailwind</span>
      </div>
    </aside>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 1.5rem;
  padding-top: clamp(5.5rem, 12vw, 7.5rem);
  padding-bottom: clamp(3rem, 7vw, 5rem);
  min-height: calc(100svh - 1rem);
  align-items: end;
}

h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 9vw, 5.6rem);
  line-height: 0.95;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  font-weight: 700;
  background: linear-gradient(180deg, #f2f8ff 10%, var(--accent) 90%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.role {
  margin: 0.9rem 0 0;
  font-size: clamp(1.05rem, 2.2vw, 1.35rem);
  font-weight: 600;
}

.pitch {
  margin: 1rem 0 0;
  max-width: 34rem;
  color: var(--muted);
  line-height: 1.65;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-top: 1.6rem;
}

.hero-card {
  padding: 1.25rem 1.3rem;
  border-radius: 1.35rem;
  display: grid;
  gap: 1rem;
  max-width: 22rem;
}

.card-label {
  margin: 0;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.65rem;
}

li {
  padding-left: 0.8rem;
  border-left: 2px solid var(--accent);
  line-height: 1.4;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tags span {
  font-size: 0.72rem;
  padding: 0.28rem 0.55rem;
  border-radius: 999px;
  border: 1px solid var(--glass-border);
  color: var(--muted);
}

@media (min-width: 900px) {
  .hero {
    grid-template-columns: 1.35fr 0.75fr;
  }

  .hero-card {
    max-width: none;
    align-self: end;
  }
}
</style>
