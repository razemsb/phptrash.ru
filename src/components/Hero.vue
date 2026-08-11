<script setup lang="ts"></script>

<template>
  <section id="top" class="hero page">
    <div class="glow a" aria-hidden="true" />
    <div class="glow b" aria-hidden="true" />

    <div class="hero-main">
      <p class="kicker">projects.phptrash.ru</p>
      <h1>Проекты</h1>
      <p class="pitch">
        Демо и кейсы phptrash. Каждый проект открывается в своей директории на
        этом поддомене.
      </p>
    </div>

    <aside class="hero-card glass">
      <p class="card-label">Сейчас</p>
      <ul>
        <li>Живые демо на /slug/</li>
        <li>Стек PHP · Laravel · Vue</li>
        <li>Связка с www.phptrash.ru</li>
      </ul>
      <div class="tags">
        <span>Hub</span>
        <span>Demos</span>
        <span>Prod</span>
      </div>
    </aside>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 1.15rem;
  padding-top: clamp(5.6rem, 18vw, 8.5rem);
  padding-bottom: clamp(1.4rem, 4vw, 3.5rem);
  align-items: end;
}

.glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: -1;
  filter: blur(28px);
}

.glow.a {
  top: 8%;
  right: -8%;
  width: min(48vw, 380px);
  height: min(48vw, 380px);
  background: radial-gradient(circle, rgba(77, 226, 255, 0.2), transparent 70%);
}

.glow.b {
  bottom: -10%;
  left: -12%;
  width: min(42vw, 300px);
  height: min(42vw, 300px);
  background: radial-gradient(circle, rgba(124, 107, 255, 0.16), transparent 70%);
}

.kicker {
  overflow-wrap: anywhere;
  word-break: break-word;
  line-height: 1.4;
}

h1 {
  margin: 0 0 0.85rem;
  font-family: var(--font-display);
  font-size: clamp(2rem, 11vw, 4.4rem);
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  line-height: 1.05;
  background: linear-gradient(180deg, #f2f8ff 8%, var(--accent) 92%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.pitch {
  margin: 0;
  max-width: 34rem;
  color: var(--muted);
  font-size: clamp(0.95rem, 3.6vw, 1.15rem);
  line-height: 1.6;
}

.hero-card {
  padding: 1rem 1.05rem 1.1rem;
  border-radius: 1.2rem;
}

.card-label {
  margin: 0 0 0.65rem;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}

ul {
  margin: 0 0 0.85rem;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.5rem;
}

li {
  position: relative;
  padding-left: 0.85rem;
  color: var(--text);
  font-size: 0.92rem;
  line-height: 1.4;
}

li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.35rem;
  width: 3px;
  height: 0.85rem;
  border-radius: 999px;
  background: linear-gradient(180deg, var(--accent), var(--accent-2));
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.tags span {
  padding: 0.28rem 0.55rem;
  border-radius: 999px;
  font-size: 0.75rem;
  border: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.04);
}

@media (max-width: 819px) {
  .glow.b {
    display: none;
  }

  .glow.a {
    width: min(70vw, 260px);
    height: min(70vw, 260px);
    top: 0;
    right: -18%;
    opacity: 0.85;
  }
}

@media (min-width: 900px) {
  .hero {
    grid-template-columns: 1.35fr 0.75fr;
    gap: 2rem;
  }

  .hero-card {
    padding: 1.15rem 1.2rem 1.25rem;
    border-radius: 1.35rem;
  }
}
</style>
