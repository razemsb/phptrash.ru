<script setup lang="ts">
/**
 * Black hole with flat elliptical accretion disk.
 * Canvas paints a circular ring once; CSS flattens (scaleY) + slowly rotates texture.
 * Event horizon is solid opaque black so stars/comets never show through.
 */
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { usePerfMode } from '@/composables/usePerfMode'

withDefaults(
  defineProps<{
    intensity: number
    top?: number
    scale?: number
  }>(),
  { top: 62, scale: 1 },
)

const diskRef = ref<HTMLCanvasElement | null>(null)
const { low } = usePerfMode()

const paintDisk = () => {
  const canvas = diskRef.value
  if (!canvas) return

  const size = Math.min(low.value ? 360 : 520, Math.floor(window.innerWidth * 0.85))
  const dpr = low.value ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)
  canvas.width = Math.floor(size * dpr)
  canvas.height = Math.floor(size * dpr)

  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, size, size)

  const cx = size * 0.5
  const cy = size * 0.5
  const rInner = size * 0.16
  const rOuter = size * 0.48

  const glow = ctx.createRadialGradient(cx, cy, rInner, cx, cy, rOuter)
  glow.addColorStop(0, 'rgba(255,160,60,0.05)')
  glow.addColorStop(0.55, 'rgba(255,120,40,0.22)')
  glow.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.arc(cx, cy, rOuter, 0, Math.PI * 2)
  ctx.fill()

  const wedges = low.value ? 90 : 160
  const bands = low.value ? 7 : 10

  for (let i = 0; i < wedges; i++) {
    const a0 = (i / wedges) * Math.PI * 2
    const a1 = ((i + 1) / wedges) * Math.PI * 2
    const mid = (a0 + a1) * 0.5
    const doppler = 0.5 + 0.5 * Math.cos(mid - 0.35)
    const turb = 0.85 + 0.15 * Math.sin(mid * 7)

    for (let b = 0; b < bands; b++) {
      const t0 = b / bands
      const t1 = (b + 1) / bands
      const r0 = rInner + (rOuter - rInner) * t0
      const r1 = rInner + (rOuter - rInner) * t1
      const heat = (1 - t0) * turb

      const R = Math.min(255, Math.floor((150 + heat * 105) * (0.55 + doppler * 0.7)))
      const G = Math.min(255, Math.floor((55 + heat * 130) * (0.45 + doppler * 0.55)))
      const B = Math.min(255, Math.floor(18 + (1 - doppler) * 40 + heat * 20))
      const A = (0.25 + heat * 0.55) * (0.5 + doppler * 0.5)

      ctx.beginPath()
      ctx.moveTo(cx + Math.cos(a0) * r0, cy + Math.sin(a0) * r0)
      ctx.lineTo(cx + Math.cos(a1) * r0, cy + Math.sin(a1) * r0)
      ctx.lineTo(cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1)
      ctx.lineTo(cx + Math.cos(a0) * r1, cy + Math.sin(a0) * r1)
      ctx.closePath()
      ctx.fillStyle = `rgba(${R},${G},${B},${A})`
      ctx.fill()
    }
  }

  // opaque black core in texture (no destination-out hole → no stars bleed)
  ctx.globalCompositeOperation = 'source-over'
  ctx.fillStyle = '#000'
  ctx.beginPath()
  ctx.arc(cx, cy, rInner * 0.98, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = 'rgba(255,230,180,0.35)'
  ctx.lineWidth = size * 0.008
  ctx.beginPath()
  ctx.arc(cx, cy, rInner * 1.02, 0, Math.PI * 2)
  ctx.stroke()
}

onMounted(() => {
  paintDisk()
  window.addEventListener('orientationchange', paintDisk)
  if (!window.matchMedia('(max-width: 900px), (pointer: coarse)').matches) {
    window.addEventListener('resize', paintDisk)
  }
})

watch(low, paintDisk)

onUnmounted(() => {
  window.removeEventListener('orientationchange', paintDisk)
  window.removeEventListener('resize', paintDisk)
})
</script>

<template>
  <div
    class="bh"
    :class="{ 'is-on': intensity > 0.08 }"
    :style="{
      top: `${top}%`,
      transform: `translate(-50%, -50%) scale(${scale})`,
    }"
    aria-hidden="true"
  >
    <div class="disk-flat" :style="{ opacity: Math.min(1, intensity * 1.25) }">
      <canvas ref="diskRef" class="disk-tex" />
    </div>

    <!-- solid event horizon — always opaque while visible so stars never bleed -->
    <div class="horizon">
      <span class="core" />
      <span class="photon" />
    </div>
  </div>
</template>

<style scoped>
.bh {
  position: absolute;
  left: 50%;
  right: auto;
  margin: 0;
  width: min(78vw, 460px);
  height: min(42vw, 250px);
  pointer-events: none;
  visibility: hidden;
  z-index: 5;
}

.bh.is-on {
  visibility: visible;
}

.disk-flat {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 108%;
  aspect-ratio: 1;
  transform: translate(-50%, -50%) scaleY(0.28);
  transform-origin: center center;
  z-index: 1;
}

.disk-tex {
  display: block;
  width: 100%;
  height: 100%;
  animation: spin 52s linear infinite;
  will-change: transform;
}

.horizon {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 26%;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  z-index: 10;
  isolation: isolate;
}

.core {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #000;
  box-shadow:
    0 0 0 2px #000,
    0 0 18px 6px #000,
    0 0 28px 12px rgba(0, 0, 0, 0.95),
    0 0 32px 10px rgba(255, 130, 40, 0.22);
}

.photon {
  position: absolute;
  inset: -5%;
  border-radius: 50%;
  border: 2px solid rgba(255, 236, 205, 0.95);
  box-shadow:
    0 0 8px rgba(255, 200, 120, 0.85),
    0 0 18px rgba(255, 140, 50, 0.4);
  z-index: 2;
  pointer-events: none;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .disk-tex {
    animation: none;
  }
}

@media (max-width: 820px) {
  .bh {
    width: min(88vw, 360px);
    height: min(48vw, 200px);
  }

  .horizon {
    width: 28%;
  }

  .disk-tex {
    animation-duration: 68s;
  }
}
</style>
