<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const open = ref(false)
const scrolled = ref(false)
const rootRef = ref<HTMLElement | null>(null)

const links = [
  { href: '#bio', label: 'Bio' },
  { href: '#stack', label: 'Stack' },
  { href: '#projects', label: 'Projects' },
  { href: '#contacts', label: 'Contacts' },
]

const hubUrl = 'https://projects.phptrash.ru'

const onScroll = () => {
  scrolled.value = window.scrollY > 8
}

onClickOutside(rootRef, () => {
  open.value = false
})

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  document.documentElement.dataset.theme = 'dark'
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header ref="rootRef" class="nav-wrap">
    <div class="nav" :class="{ 'is-scrolled': scrolled }">
      <a href="#top" class="brand" @click="open = false">
        <img src="/logo.svg" alt="phptrash" width="32" height="32" class="brand-mark" />
        <span>phptrash</span>
      </a>

      <nav class="links" aria-label="Основная навигация">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="link"
        >
          {{ link.label }}
        </a>
        <a
          :href="hubUrl"
          class="link hub"
          target="_blank"
          rel="noopener noreferrer"
        >
          Hub
        </a>
      </nav>

      <div class="actions">
        <button
          type="button"
          class="burger"
          :aria-expanded="open"
          aria-label="Меню"
          @click="open = !open"
        >
          <span />
          <span />
        </button>
      </div>
    </div>

    <div v-show="open" class="mobile">
      <a
        v-for="link in links"
        :key="`m-${link.href}`"
        :href="link.href"
        class="mobile-link"
        @click="open = false"
      >
        {{ link.label }}
      </a>
      <a
        :href="hubUrl"
        class="mobile-link hub"
        target="_blank"
        rel="noopener noreferrer"
        @click="open = false"
      >
        Hub
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
  /* no transform here — it kills backdrop-filter on many prod browsers */
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
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.brand-mark {
  display: block;
  width: 2rem;
  height: 2rem;
  border-radius: 0.55rem;
  flex-shrink: 0;
}

.links {
  display: none;
  align-items: center;
  gap: 0.25rem;
}

.link {
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  color: var(--muted);
  font-size: 0.88rem;
  font-weight: 500;
  transition:
    color 0.2s ease,
    background-color 0.2s ease;
}

.link:hover {
  color: var(--text);
  background: color-mix(in oklab, white 8%, transparent);
}

.link.hub {
  color: var(--accent);
}

.actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
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
  backdrop-filter: blur(18px) saturate(1.35);
  -webkit-backdrop-filter: blur(18px) saturate(1.35);
  border: 1px solid var(--glass-border);
}

.mobile-link {
  padding: 0.8rem 0.9rem;
  border-radius: 0.9rem;
  font-weight: 600;
}

.mobile-link:hover {
  background: color-mix(in oklab, white 8%, transparent);
}

.mobile-link.hub {
  color: var(--accent);
}

@media (min-width: 820px) {
  .links {
    display: flex;
  }

  .burger,
  .mobile {
    display: none !important;
  }

  .actions {
    display: none;
  }
}
</style>
