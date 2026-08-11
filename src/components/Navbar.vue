<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const open = ref(false)
const scrolled = ref(false)
const rootRef = ref<HTMLElement | null>(null)

const onScroll = () => {
  scrolled.value = window.scrollY > 8
}

onClickOutside(rootRef, () => {
  open.value = false
})

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header ref="rootRef" class="nav-wrap">
    <div class="nav" :class="{ 'is-scrolled': scrolled }">
      <a href="#top" class="brand" @click="open = false">
        <img src="/logo.svg" alt="" width="32" height="32" class="brand-mark" />
        <span>projects</span>
      </a>

      <nav class="links" aria-label="Навигация">
        <a href="#projects" class="link">Проекты</a>
        <a href="https://www.phptrash.ru" class="link home" target="_blank" rel="noopener noreferrer">
          phptrash.ru
        </a>
      </nav>

      <button
        type="button"
        class="burger"
        :aria-expanded="open"
        aria-label="Меню"
        @click="open = !open"
      >
        <span /><span />
      </button>
    </div>

    <div v-show="open" class="mobile">
      <a href="#projects" class="mobile-link" @click="open = false">Проекты</a>
      <a
        href="https://www.phptrash.ru"
        class="mobile-link"
        target="_blank"
        rel="noopener noreferrer"
        @click="open = false"
      >
        phptrash.ru
      </a>
    </div>
  </header>
</template>

<style scoped>
.nav-wrap {
  position: fixed;
  top: 0.85rem;
  left: 0;
  right: 0;
  z-index: 60;
  width: min(1100px, calc(100% - 1.25rem));
  margin-inline: auto;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 3.5rem;
  padding: 0.45rem 0.7rem 0.45rem 1rem;
  border-radius: 999px;
  background: rgba(10, 16, 32, 0.38);
  backdrop-filter: blur(18px) saturate(1.35);
  -webkit-backdrop-filter: blur(18px) saturate(1.35);
  border: 1px solid var(--glass-border);
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 var(--glass-shine);
}

.nav.is-scrolled {
  background: rgba(10, 16, 32, 0.52);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.brand-mark {
  width: 2rem;
  height: 2rem;
  border-radius: 0.55rem;
}

.links {
  display: none;
  align-items: center;
  gap: 0.2rem;
}

.link {
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  color: var(--muted);
  font-size: 0.88rem;
  font-weight: 500;
}

.link:hover,
.link.home {
  color: var(--text);
}

.link.home {
  color: var(--accent);
}

.burger {
  width: 2.3rem;
  height: 2.3rem;
  display: inline-grid;
  place-content: center;
  gap: 0.3rem;
  border-radius: 999px;
  border: 1px solid var(--glass-border);
}

.burger span {
  display: block;
  width: 1rem;
  height: 1.5px;
  background: var(--text);
}

.mobile {
  margin-top: 0.55rem;
  padding: 0.55rem;
  border-radius: 1.25rem;
  display: grid;
  gap: 0.2rem;
  background: rgba(10, 16, 32, 0.55);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid var(--glass-border);
}

.mobile-link {
  padding: 0.8rem 0.9rem;
  border-radius: 0.9rem;
  font-weight: 600;
}

@media (min-width: 820px) {
  .links {
    display: flex;
  }

  .burger,
  .mobile {
    display: none !important;
  }
}
</style>
