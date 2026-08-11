<script setup lang="ts">
import { computed } from 'vue'
import { useScrollProgress } from '@/composables/useScrollProgress'
import { usePerfMode } from '@/composables/usePerfMode'
import BlackHole from '@/components/BlackHole.vue'
import RingedPlanet from '@/components/RingedPlanet.vue'
import EarthPlanet from '@/components/EarthPlanet.vue'

const { smooth } = useScrollProgress()
const { mobile } = usePerfMode()
const depth = computed(() => smooth.value)

const voidDarken = computed(() => 0.06 + depth.value * 0.75)
const stage = (start: number, fade: number) =>
  Math.min(1, Math.max(0, (depth.value - start) / fade))

/** Never bake vh into mobile transforms — chrome resize recalcs vh and jumps. */
const xf = (tx: number, ty: number, s: number) =>
  mobile.value || (tx === 0 && ty === 0)
    ? `translate3d(-50%, -50%, 0) scale(${s})`
    : `translate3d(calc(-50% + ${tx}vw), calc(-50% + ${ty}vh), 0) scale(${s})`

/** Desktop: soft fly-away. Mobile: FIXED slots — only opacity changes. */
const earth = computed(() => {
  const d = depth.value
  const leave = Math.min(1, d / 0.35)
  const o = Math.max(0, 1 - leave * 1.15)
  if (mobile.value) {
    return { o, x: 16, y: 62, tx: 0, ty: 0, s: 1 }
  }
  return {
    o,
    x: 14,
    y: 58,
    tx: d * -10,
    ty: d * -28,
    s: 1 - leave * 0.25,
  }
})

const gas = computed(() => {
  const d = depth.value
  const o = stage(0.1, 0.14) * Math.max(0, 1 - stage(0.45, 0.25))
  if (mobile.value) {
    return { o, x: 82, y: 22, tx: 0, ty: 0, s: 1 }
  }
  return {
    o,
    x: 74,
    y: 22,
    tx: 4 + d * 12,
    ty: -8 + d * -30,
    s: 1 - d * 0.12,
  }
})

const rock = computed(() => {
  const d = depth.value
  const o = stage(0.22, 0.14) * Math.max(0, 1 - stage(0.55, 0.22))
  if (mobile.value) {
    return { o, x: 18, y: 40, tx: 0, ty: 0, s: 0.95 }
  }
  return {
    o,
    x: 18,
    y: 42,
    tx: d * -4,
    ty: d * -32,
    s: 0.95 - d * 0.1,
  }
})

const saturn = computed(() => {
  const d = depth.value
  const o = stage(0.36, 0.14) * Math.max(0, 1 - stage(0.68, 0.2))
  if (mobile.value) {
    return { o, x: 78, y: 48, tx: 0, ty: 0, s: 1 }
  }
  return {
    o,
    x: 70,
    y: 50,
    tx: d * 8,
    ty: d * -26,
    s: 1 - d * 0.1,
  }
})

const bh = computed(() => {
  const o = stage(0.52, 0.18)
  if (mobile.value) {
    return { o, top: 64, scale: 1 }
  }
  return {
    o,
    top: 64 - Math.max(0, depth.value - 0.52) * 10,
    scale: 0.9 + depth.value * 0.18,
  }
})
</script>

<template>
  <div class="cosmos" :class="{ 'is-mobile': mobile }" aria-hidden="true">
    <div class="void-veil" :style="{ opacity: voidDarken }" />

    <div class="nebula n1" />
    <div class="nebula n2" />

    <EarthPlanet
      :opacity="earth.o"
      :left="earth.x"
      :top="earth.y"
      :scale="earth.s"
      :shift-x="earth.tx"
      :shift-y="earth.ty"
    />

    <div
      class="planet gas"
      :style="{
        opacity: gas.o,
        left: `${gas.x}%`,
        top: `${gas.y}%`,
        transform: xf(gas.tx, gas.ty, gas.s),
      }"
    >
      <span class="atmos" />
      <span class="body" />
      <span class="bands" />
      <span class="shade" />
      <span class="rim" />
    </div>

    <div
      class="planet rock"
      :style="{
        opacity: rock.o,
        left: `${rock.x}%`,
        top: `${rock.y}%`,
        transform: xf(rock.tx, rock.ty, rock.s),
      }"
    >
      <span class="atmos cool" />
      <span class="body" />
      <span class="craters" />
      <span class="shade" />
      <span class="rim" />
      <span class="orbit" aria-hidden="true">
        <span class="moon" />
      </span>
    </div>

    <RingedPlanet
      :opacity="saturn.o"
      :left="saturn.x"
      :top="saturn.y"
      :scale="saturn.s"
      :shift-x="saturn.tx"
      :shift-y="saturn.ty"
    />

    <BlackHole :intensity="bh.o" :top="bh.top" :scale="bh.scale" />
  </div>
</template>

<style scoped>
.cosmos {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  /* always svh — mobile URL bar must not reflow planet % positions */
  height: 100svh;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}

.void-veil {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 55% at 50% 45%, transparent 0%, rgba(0, 0, 0, 0.5) 72%, #000 100%);
}

.nebula {
  position: absolute;
  width: 55vmax;
  height: 55vmax;
  border-radius: 50%;
  filter: blur(90px);
}

.n1 {
  top: -12%;
  left: -16%;
  background: var(--nebula-a);
}

.n2 {
  top: 0%;
  right: -22%;
  background: var(--nebula-b);
}

.planet {
  position: absolute;
  will-change: opacity;
}

.is-mobile .planet,
.is-mobile :deep(.earth-wrap),
.is-mobile :deep(.saturn),
.is-mobile :deep(.bh) {
  will-change: opacity;
  /* no CSS opacity transition — fights RAF smooth and looks like jumps */
  transition: none;
}

.is-mobile .rock .orbit {
  animation: none;
  will-change: auto;
}


.planet .body,
.planet .atmos,
.planet .shade,
.planet .rim,
.planet .bands,
.planet .craters {
  position: absolute;
  inset: 0;
  border-radius: 50%;
}

.gas {
  width: min(22vw, 180px);
  height: min(22vw, 180px);
}

.gas .body {
  background:
    radial-gradient(circle at 32% 28%, #dff4ff 0%, #5ec8ff 24%, #3a6fd0 52%, #1a2a68 80%, #0a1028 100%);
}

.gas .bands {
  background:
    repeating-linear-gradient(
      180deg,
      transparent 0 10px,
      rgba(180, 230, 255, 0.12) 10px 14px,
      transparent 14px 22px,
      rgba(20, 40, 90, 0.2) 22px 26px
    );
  mix-blend-mode: soft-light;
  opacity: 0.85;
}

.rock {
  width: min(14vw, 110px);
  height: min(14vw, 110px);
}

.rock .body {
  background:
    radial-gradient(circle at 30% 28%, #e8d7c0, #a88868 40%, #5a4030 78%, #241812 100%);
}

.rock .craters {
  background:
    radial-gradient(circle at 62% 38%, rgba(0, 0, 0, 0.28) 0 6%, transparent 7%),
    radial-gradient(circle at 40% 62%, rgba(0, 0, 0, 0.22) 0 4%, transparent 5%),
    radial-gradient(circle at 70% 70%, rgba(0, 0, 0, 0.2) 0 5%, transparent 6%);
}

.rock .orbit {
  position: absolute;
  inset: -28%;
  border-radius: 50%;
  animation: moon-orbit 14s linear infinite;
  will-change: transform;
}

.rock .moon {
  position: absolute;
  top: 8%;
  left: 50%;
  width: 18%;
  height: 18%;
  margin-left: -9%;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #efe6d8, #8a7a68 70%);
  box-shadow: 0 0 8px rgba(255, 230, 200, 0.2);
}

.atmos {
  transform: scale(1.12);
  background: radial-gradient(circle, rgba(80, 190, 255, 0.22), transparent 68%);
  filter: blur(6px);
}

.atmos.cool {
  background: radial-gradient(circle, rgba(180, 210, 255, 0.18), transparent 68%);
}

.shade {
  background: radial-gradient(circle at 28% 30%, transparent 35%, rgba(0, 0, 0, 0.55) 100%);
}

.rim {
  box-shadow: inset -10px -8px 22px rgba(0, 0, 0, 0.35);
  background: radial-gradient(circle at 22% 20%, rgba(255, 255, 255, 0.18), transparent 32%);
}

@keyframes moon-orbit {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .rock .orbit {
    animation: none;
  }
}

@media (max-width: 820px) {
  .nebula {
    filter: blur(60px);
  }

  .atmos {
    filter: blur(3px);
  }
}
</style>
