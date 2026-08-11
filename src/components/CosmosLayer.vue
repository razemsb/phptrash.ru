<script setup lang="ts"></script>

<template>
  <div class="cosmos" aria-hidden="true">
    <div class="veil" />
    <div class="nebula n1" />
    <div class="nebula n2" />
    <div class="nebula n3" />
    <div class="watermark">PROJECTS</div>
  </div>
</template>

<style scoped>
.cosmos {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.veil {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 55% at 50% 40%, transparent 0%, rgba(0, 0, 0, 0.35) 72%, #000 100%);
}

.nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}

.n1 {
  top: -18%;
  left: -20%;
  width: 55vmax;
  height: 55vmax;
  background: var(--nebula-a);
  animation: drift 28s ease-in-out infinite;
}

.n2 {
  top: 8%;
  right: -24%;
  width: 48vmax;
  height: 48vmax;
  background: var(--nebula-b);
  animation: drift 36s ease-in-out infinite reverse;
}

.n3 {
  bottom: -20%;
  left: 30%;
  width: 40vmax;
  height: 40vmax;
  background: rgba(0, 160, 180, 0.1);
  animation: drift 42s ease-in-out infinite;
}

.watermark {
  position: absolute;
  top: 16%;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-display);
  font-size: clamp(3.2rem, 16vw, 12rem);
  font-weight: 700;
  letter-spacing: 0.08em;
  color: transparent;
  background: linear-gradient(180deg, rgba(180, 220, 255, 0.09), rgba(77, 226, 255, 0.02));
  -webkit-background-clip: text;
  background-clip: text;
  white-space: nowrap;
  user-select: none;
  max-width: 100vw;
  overflow: hidden;
}

@keyframes drift {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(3%, -4%, 0) scale(1.06);
  }
}

@media (max-width: 820px) {
  .nebula {
    filter: blur(48px);
  }

  .n3 {
    display: none;
  }

  .watermark {
    top: 12%;
    font-size: clamp(2.4rem, 14vw, 3.6rem);
    letter-spacing: 0.04em;
    opacity: 0.7;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nebula {
    animation: none;
  }
}
</style>
