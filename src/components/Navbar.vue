<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const open = ref(false)
const scrolled = ref(false)

const links = [
  { href: '#bio', label: 'Bio' },
  { href: '#stack', label: 'Stack' },
  { href: '#projects', label: 'Projects' },
  { href: '#contacts', label: 'Contacts' },
]

const onScroll = () => {
  scrolled.value = window.scrollY > 8
}

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
  <header class="nav-wrap">
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
  /* solid-ish fallback if backdrop-filter fails */
  background: rgba(8, 14, 28, 0.72);
  backdrop-filter: blur(18px) saturate(1.35);
  -webkit-backdrop-filter: blur(18px) saturate(1.35);
  border: 1px solid var(--glass-border);
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 var(--glass-shine);
}

.nav.is-scrolled {
  background: rgba(8, 14, 28, 0.86);
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
  background: rgba(8, 14, 28, 0.86);
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
