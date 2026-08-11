<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { contacts } from '@/data/contacts'
</script>

<template>
  <footer id="contacts" class="section page" aria-labelledby="contacts-title">
    <div class="box glass">
      <p class="kicker">04 — Contacts</p>
      <h2 id="contacts-title" class="section-title">Связь</h2>
      <p class="lead">Пишите в Telegram или на почту — отвечаю без театра.</p>

      <div class="links">
        <a
          v-for="item in contacts"
          :key="item.id"
          :href="item.href"
          class="link glass"
          :target="item.id === 'email' ? undefined : '_blank'"
          :rel="item.id === 'email' ? undefined : 'me noopener noreferrer'"
        >
          <FontAwesomeIcon :icon="item.icon" />
          <span>{{ item.label }}</span>
        </a>
        <a
          href="https://projects.phptrash.ru"
          class="link glass"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Projects Hub</span>
        </a>
      </div>

      <p class="mail">maxim1xxx363@gmail.com</p>
    </div>
  </footer>
</template>

<style scoped>
.section {
  position: relative;
  z-index: 1;
  padding-bottom: 3rem;
}

.box {
  padding: clamp(1.3rem, 3vw, 2rem);
  border-radius: 1.6rem;
}

.links {
  display: grid;
  gap: 0.65rem;
}

.link {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.95rem 1.05rem;
  border-radius: 1rem;
  font-weight: 600;
}

.link:hover {
  transform: translateY(-2px);
}

.mail {
  margin: 1.25rem 0 0;
  color: var(--muted);
  font-size: 0.92rem;
}

@media (min-width: 680px) {
  .links {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 900px) {
  .links {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
