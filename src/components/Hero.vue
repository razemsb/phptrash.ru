<script setup lang="ts"></script>

<template>
  <section id="top" class="hero page">
    <div class="glow" aria-hidden="true" />

    <p class="kicker">projects.phptrash.ru</p>
    <h1>Проекты</h1>
    <p class="pitch">
      Демо и кейсы phptrash. Каждый проект открывается в своей директории на
      этом поддомене.
    </p>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  z-index: 1;
  padding-top: clamp(6.5rem, 14vw, 8.5rem);
  padding-bottom: clamp(1.5rem, 4vw, 2.5rem);
}

.glow {
  position: absolute;
  top: 10%;
  right: -10%;
  width: min(55vw, 420px);
  height: min(55vw, 420px);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(77, 226, 255, 0.16), transparent 68%);
  filter: blur(20px);
  pointer-events: none;
  z-index: -1;
}

h1 {
  margin: 0 0 1rem;
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 7vw, 4rem);
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  line-height: 1.05;
  background: linear-gradient(180deg, #f2f8ff 10%, var(--accent) 90%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.pitch {
  margin: 0;
  max-width: 34rem;
  color: var(--muted);
  font-size: clamp(1rem, 2.2vw, 1.15rem);
  line-height: 1.65;
}
</style>
