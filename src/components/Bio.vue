<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTypewriter } from '@/composables/useTypewriter'

const principles = [
  {
    id: 'flow',
    title: 'Сначала поток',
    text: 'Рабочий сценарий важнее красивой архитектуры на слайде. Если пользователь не проходит путь — рефакторим.',
  },
  {
    id: 'edge',
    title: 'Края в проде',
    text: 'Ошибки, пустые состояния, мобилка и деплой — не «потом». Это часть фичи, а не бонус.',
  },
  {
    id: 'honest',
    title: 'Без магии',
    text: 'Не тащу абстракции ради резюме. Стек должен быть понятен через полгода — мне и тому, кто откроет код.',
  },
]

const modes = [
  {
    id: 'backend',
    label: 'Backend',
    lead: 'API, БД, авторизация, очереди.',
    body: 'Laravel / PHP: схемы, миграции, валидация, кэш. Делаю так, чтобы фронт не гадал, а контракт держался.',
    tags: ['PHP 8', 'Laravel', 'MySQL', 'API'],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    lead: 'Vue SPA и админки, которые не разваливаются.',
    body: 'Компоненты, состояние, роутинг, аккуратная вёрстка. UI должен быть быстрым на телефоне и читаемым в проде.',
    tags: ['Vue 3', 'TypeScript', 'Tailwind', 'Vite'],
  },
  {
    id: 'ship',
    label: 'Ship',
    lead: 'Довести до продакшена, а не до демо.',
    body: 'Сборка, окружения, логи, мелочи после деплоя. Фича считается готовой, когда ей пользуются, а не когда «на localhost ок».',
    tags: ['CI', 'Linux', 'Nginx', 'FTP/Git'],
  },
] as const

type ModeId = (typeof modes)[number]['id']

const activeId = ref<ModeId>('backend')
const active = computed(() => modes.find((m) => m.id === activeId.value) ?? modes[0])

const phrases = [
  'собираю целый продукт, а не кусок',
  'чиню то, что ломается после деплоя',
  'могу и API, и админку довести',
]

const longest = computed(() =>
  phrases.reduce((a, b) => (a.length >= b.length ? a : b), ''),
)

const { text } = useTypewriter(phrases, {
  typingSpeed: 34,
  pauseMs: 1700,
  deletingSpeed: 20,
})
</script>

<template>
  <section id="bio" class="section page" aria-labelledby="bio-title">
    <p class="kicker">01 — Bio</p>
    <h2 id="bio-title" class="section-title">Как работаю</h2>
    <p class="lead">
      Fullstack на PHP и Vue. Не витрина навыков — принципы, по которым собираю сервисы.
    </p>

    <div class="layout">
      <ol class="manifest">
        <li v-for="(item, i) in principles" :key="item.id" class="principle">
          <span class="num" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
          <div class="principle-body">
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </div>
        </li>
      </ol>

      <div class="signal glass">
        <div class="modes" role="tablist" aria-label="Режим работы">
          <button
            v-for="mode in modes"
            :key="mode.id"
            type="button"
            role="tab"
            class="mode"
            :class="{ 'is-active': activeId === mode.id }"
            :aria-selected="activeId === mode.id"
            @click="activeId = mode.id"
          >
            {{ mode.label }}
          </button>
        </div>

        <Transition name="signal" mode="out-in">
          <div :key="activeId" class="panel" role="tabpanel">
            <p class="panel-lead">{{ active.lead }}</p>
            <p class="panel-body">{{ active.body }}</p>
            <div class="tags">
              <span v-for="tag in active.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
        </Transition>

        <p class="line" aria-live="polite">
          <span class="prefix">Обычно я</span>
          <span class="typed-wrap">
            <span class="sizer" aria-hidden="true">{{ longest }}</span>
            <span class="typed-row">
              <em class="typed">{{ text }}</em><span class="caret" aria-hidden="true" />
            </span>
          </span>
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section {
  position: relative;
}

.layout {
  display: grid;
  gap: 1.75rem;
}

.manifest {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1.35rem;
}

.principle {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.85rem 1rem;
  align-items: start;
}

.num {
  font-family: var(--font-display);
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  color: var(--accent);
  opacity: 0.85;
  padding-top: 0.35rem;
}

.principle-body h3 {
  margin: 0 0 0.4rem;
  font-family: var(--font-display);
  font-size: clamp(0.95rem, 2vw, 1.1rem);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-weight: 700;
}

.principle-body p {
  margin: 0;
  max-width: 34rem;
  color: var(--muted);
  line-height: 1.65;
  font-size: 0.95rem;
}

.signal {
  padding: 1.15rem 1.15rem 1.2rem;
  border-radius: 1.35rem;
  display: grid;
  gap: 1.1rem;
}

.modes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.mode {
  min-height: 2.2rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.03);
  color: var(--muted);
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.mode:hover {
  color: var(--text);
  border-color: color-mix(in oklab, var(--accent) 30%, var(--line));
}

.mode.is-active {
  color: var(--text);
  border-color: color-mix(in oklab, var(--accent) 45%, var(--glass-border));
  background: rgba(77, 226, 255, 0.1);
}

.panel-lead {
  margin: 0 0 0.55rem;
  font-size: clamp(1.05rem, 2vw, 1.2rem);
  font-weight: 600;
  line-height: 1.4;
}

.panel-body {
  margin: 0;
  color: var(--muted);
  line-height: 1.65;
  font-size: 0.94rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.95rem;
}

.tags span {
  font-size: 0.72rem;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  border: 1px solid var(--line);
  color: var(--muted);
  background: rgba(255, 255, 255, 0.05);
}

.line {
  margin: 0;
  padding-top: 0.85rem;
  border-top: 1px solid var(--line);
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.35rem 0.45rem;
  font-size: clamp(0.95rem, 1.8vw, 1.08rem);
  line-height: 1.55;
}

.prefix {
  flex: 0 0 auto;
  color: var(--muted);
}

.typed-wrap {
  position: relative;
  display: inline-grid;
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

.signal-enter-active,
.signal-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.signal-enter-from,
.signal-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

@media (min-width: 900px) {
  .layout {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    gap: 2.25rem;
    align-items: start;
  }

  .signal {
    position: sticky;
    top: 6rem;
  }
}
</style>
