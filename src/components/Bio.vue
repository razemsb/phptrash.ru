<script setup lang="ts">
import { computed } from 'vue'
import { useTypewriter } from '@/composables/useTypewriter'

const phrases = [
  'не люблю «магические» абстракции ради резюме',
  'сначала рабочий поток, потом красивости',
  'могу и API, и админку, и вёрстку довести',
]

const longest = computed(() =>
  phrases.reduce((a, b) => (a.length >= b.length ? a : b), ''),
)

const { text } = useTypewriter(phrases, {
  typingSpeed: 36,
  pauseMs: 1600,
  deletingSpeed: 22,
})
</script>

<template>
  <section id="bio" class="section page">
    <p class="kicker">01 — Bio</p>
    <h2 class="section-title">Коротко</h2>
    <p class="lead">
      <strong>phptrash</strong>. Fullstack на PHP и Vue — от схемы БД до
      кликабельного UI.
    </p>

    <div class="bio glass">
      <p class="line">
        <span class="prefix">Обычно я</span>
        <span class="typed-wrap">
          <span class="sizer" aria-hidden="true">{{ longest }}</span>
          <span class="typed-row">
            <em class="typed">{{ text }}</em><span class="caret" aria-hidden="true" />
          </span>
        </span>
      </p>
    </div>
  </section>
</template>

<style scoped>
.bio {
  padding: 1.3rem 1.4rem;
  border-radius: 1.25rem;
}

.line {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.35rem 0.45rem;
  font-size: clamp(1.05rem, 2.1vw, 1.28rem);
  line-height: 1.6;
}

.prefix {
  flex: 0 0 auto;
}

.typed-wrap {
  position: relative;
  display: inline-grid;
  vertical-align: baseline;
  flex: 1 1 12rem;
  min-width: 0;
}

.sizer {
  grid-area: 1 / 1;
  visibility: hidden;
  white-space: normal;
  font-style: italic;
  pointer-events: none;
}

.typed-row {
  grid-area: 1 / 1;
  align-self: start;
  justify-self: start;
  max-width: 100%;
}

.typed {
  font-style: italic;
  color: color-mix(in oklab, var(--text) 80%, var(--accent));
  white-space: normal;
}

.caret {
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-left: 1px;
  background: var(--accent);
  vertical-align: -0.12em;
  animation: caret-blink 1s steps(1) infinite;
}

strong {
  font-weight: 700;
}

.section {
  position: relative;
  z-index: 1;
}
</style>
