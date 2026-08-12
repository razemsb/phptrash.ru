<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useCodeHighlight } from '@/composables/useCodeHighlight'
import { stackSnippets } from '@/data/stack-snippets'
import { techs } from '@/data/techs'

import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/cyrillic-400.css'

const activeId = ref(stackSnippets[0]?.id ?? 'php')
const tabsRef = ref<HTMLElement | null>(null)
const tabEls = ref<Record<string, HTMLElement>>({})

const indicator = ref({ left: 0, width: 0 })

const active = computed(() => stackSnippets.find((s) => s.id === activeId.value) ?? stackSnippets[0]!)

const codeRef = computed(() => active.value.code)
const langRef = computed(() => active.value.lang)

const { html, loading } = useCodeHighlight(codeRef, langRef)

const lineCount = computed(() => active.value.code.split('\n').length)

const setTabRef = (id: string, el: unknown) => {
  if (el instanceof HTMLElement) {
    tabEls.value[id] = el
  }
}

const updateIndicator = async () => {
  await nextTick()
  const container = tabsRef.value
  const tab = tabEls.value[activeId.value]
  if (!container || !tab) return

  indicator.value = {
    left: tab.offsetLeft,
    width: tab.offsetWidth,
  }

  tab.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'nearest',
  })
}

const selectTab = (id: string) => {
  if (activeId.value === id) return
  activeId.value = id
}

watch(activeId, updateIndicator)

onMounted(() => {
  updateIndicator()
  window.addEventListener('resize', updateIndicator, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIndicator)
})
</script>

<template>
  <section id="stack" class="section page" aria-labelledby="stack-title">
    <p class="kicker">02 — Stack</p>
    <h2 id="stack-title" class="section-title">Как пишу код</h2>
    <p class="lead">
      Не витрина логотипов — куски из реальных проектов: DevGuide, magazine-1c и этот сайт.
    </p>

    <div class="stage glass">
      <header class="chrome">
        <div class="dots" aria-hidden="true">
          <span /><span /><span />
        </div>
        <Transition name="meta" mode="out-in">
          <div :key="activeId" class="file">
            <span class="path">{{ active.filename }}</span>
            <span class="source">{{ active.source }}</span>
          </div>
        </Transition>
        <Transition name="meta" mode="out-in">
          <span :key="`${activeId}-lines`" class="lines">{{ lineCount }} ln</span>
        </Transition>
      </header>

      <div class="editor" :class="{ 'is-loading': loading }">
        <Transition name="code-swap" mode="out-in">
          <div :key="activeId" class="editor-pane">
            <div
              v-if="html"
              class="code shiki-wrap"
              v-html="html"
            />
            <pre v-else class="code fallback"><code>{{ active.code }}</code></pre>
          </div>
        </Transition>
      </div>

      <Transition name="caption" mode="out-in">
        <p :key="activeId" class="caption">{{ active.caption }}</p>
      </Transition>

      <div ref="tabsRef" class="tabs" role="tablist" aria-label="Языки">
        <span
          class="tab-indicator"
          aria-hidden="true"
          :style="{
            width: `${indicator.width}px`,
            transform: `translateX(${indicator.left}px)`,
          }"
        />
        <button
          v-for="snippet in stackSnippets"
          :key="snippet.id"
          :ref="(el) => setTabRef(snippet.id, el)"
          type="button"
          class="tab"
          role="tab"
          :aria-selected="activeId === snippet.id"
          :class="{ active: activeId === snippet.id }"
          @click="selectTab(snippet.id)"
        >
          {{ snippet.label }}
        </button>
      </div>
    </div>

    <ul class="tech-row" aria-label="Ещё в стеке">
      <li v-for="tech in techs" :key="tech.id" class="tech" :title="tech.name">
        <FontAwesomeIcon :icon="tech.icon" :style="{ color: tech.color }" />
        <span>{{ tech.name }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.section {
  position: relative;
}

.stage {
  border-radius: 1.35rem;
  overflow: hidden;
  display: grid;
  animation: stage-in 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes stage-in {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chrome {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.9rem;
  border-bottom: 1px solid var(--line);
  background: rgba(0, 0, 0, 0.22);
}

.dots {
  display: flex;
  gap: 0.35rem;
  flex-shrink: 0;
}

.dots span {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: rgba(160, 210, 255, 0.22);
}

.dots span:nth-child(1) {
  background: rgba(255, 100, 100, 0.55);
}

.dots span:nth-child(2) {
  background: rgba(255, 200, 80, 0.55);
}

.dots span:nth-child(3) {
  background: rgba(100, 220, 120, 0.55);
}

.file {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.35rem 0.6rem;
}

.path {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.78rem;
  color: var(--text);
}

.source {
  font-size: 0.72rem;
  color: var(--muted);
  letter-spacing: 0.04em;
}

.lines {
  font-size: 0.72rem;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}

.editor {
  position: relative;
  min-height: 14rem;
  max-height: min(22rem, 52vh);
  overflow: hidden;
  background: rgba(0, 0, 0, 0.28);
}

.editor-pane {
  min-height: 14rem;
  max-height: min(22rem, 52vh);
  overflow: auto;
  padding: 0.85rem 0.2rem 0.85rem 0;
}

.editor.is-loading .editor-pane {
  opacity: 0.72;
  transition: opacity 0.25s ease;
}

.code {
  margin: 0;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: clamp(0.72rem, 2.2vw, 0.82rem);
  line-height: 1.55;
}

.fallback {
  padding: 0 1rem;
  color: var(--text);
  white-space: pre;
  overflow-x: auto;
}

.caption {
  margin: 0;
  padding: 0.75rem 1rem 0;
  font-size: 0.88rem;
  color: var(--muted);
  line-height: 1.5;
}

.tabs {
  position: relative;
  display: flex;
  gap: 0.35rem;
  padding: 0.65rem 0.75rem 0.75rem;
  overflow-x: auto;
  scrollbar-width: none;
  border-top: 1px solid var(--line);
  background: rgba(0, 0, 0, 0.18);
}

.tabs::-webkit-scrollbar {
  display: none;
}

.tab-indicator {
  position: absolute;
  top: 0.65rem;
  left: 0;
  height: 2.25rem;
  border-radius: 999px;
  background: rgba(77, 226, 255, 0.1);
  border: 1px solid color-mix(in oklab, var(--accent) 32%, var(--glass-border));
  box-shadow: 0 0 20px rgba(77, 226, 255, 0.08);
  transition:
    transform 0.42s cubic-bezier(0.22, 1, 0.36, 1),
    width 0.42s cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;
  z-index: 0;
}

.tab {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  min-height: 2.25rem;
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: var(--muted);
  transition: color 0.28s ease;
}

.tab:hover {
  color: var(--text);
}

.tab.active {
  color: var(--accent);
}

/* content transitions */
.code-swap-enter-active,
.code-swap-leave-active,
.caption-enter-active,
.caption-leave-active,
.meta-enter-active,
.meta-leave-active {
  transition:
    opacity 0.32s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}

.code-swap-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.code-swap-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.caption-enter-from,
.meta-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.caption-leave-to,
.meta-leave-to {
  opacity: 0;
  transform: translateY(-3px);
}

.tech-row {
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tech {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.28rem 0.55rem;
  border-radius: 999px;
  border: 1px solid var(--line);
  font-size: 0.72rem;
  color: var(--muted);
  background: rgba(255, 255, 255, 0.04);
  transition:
    transform 0.25s ease,
    border-color 0.25s ease;
}

.tech:hover {
  transform: translateY(-1px);
  border-color: color-mix(in oklab, var(--accent) 25%, var(--line));
}

.tech svg {
  font-size: 0.85rem;
}

@media (min-width: 760px) {
  .editor,
  .editor-pane {
    min-height: 16rem;
  }

  .chrome {
    padding-inline: 1rem;
  }

  .caption {
    padding-inline: 1.1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .stage {
    animation: none;
  }

  .tab-indicator {
    transition: none;
  }

  .code-swap-enter-active,
  .code-swap-leave-active,
  .caption-enter-active,
  .caption-leave-active,
  .meta-enter-active,
  .meta-leave-active {
    transition: opacity 0.15s ease;
  }

  .code-swap-enter-from,
  .code-swap-leave-to,
  .caption-enter-from,
  .caption-leave-to,
  .meta-enter-from,
  .meta-leave-to {
    transform: none;
  }
}
</style>

<style>
/* Shiki output — unscoped because v-html */
.stage .shiki-wrap pre {
  margin: 0;
  padding: 0 1rem !important;
  background: transparent !important;
  overflow-x: auto;
}

.stage .shiki-wrap code {
  font-family: 'JetBrains Mono', ui-monospace, monospace !important;
  font-size: inherit;
  line-height: inherit;
}
</style>
