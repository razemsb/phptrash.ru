<script setup lang="ts"></script>

<template>
  <footer id="contact" class="section page">
    <div class="box glass">
      <div class="links">
        <a href="https://t.me/phptrash" class="link" target="_blank" rel="me noopener noreferrer">
          Telegram
        </a>
        <a href="https://github.com/razemsb" class="link" target="_blank" rel="me noopener noreferrer">
          GitHub
        </a>
        <a href="mailto:maxim1xxx363@gmail.com" class="link">Email</a>
        <a href="https://www.phptrash.ru" class="link" target="_blank" rel="noopener noreferrer">
          phptrash.ru
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.section {
  position: relative;
  padding-top: 1.5rem;
  padding-bottom: 2.25rem;
}

.box {
  padding: 0.75rem;
  border-radius: 1.2rem;
}

.links {
  display: grid;
  gap: 0.5rem;
}

.link {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  padding: 0.8rem 1rem;
  border-radius: 0.95rem;
  font-weight: 600;
  border: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.08);
  transition: transform 0.2s ease;
}

@media (hover: hover) {
  .link:hover {
    transform: translateY(-2px);
    border-color: color-mix(in oklab, var(--accent) 35%, var(--glass-border));
  }
}

@media (min-width: 680px) {
  .section {
    padding-bottom: 3rem;
  }

  .box {
    padding: 1rem;
    border-radius: 1.4rem;
  }

  .links {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.65rem;
  }
}
</style>
