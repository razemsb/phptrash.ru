<script setup lang="ts">
/**
 * M87* / EHT documentary look:
 * thick fuzzy crescent ring, painted once; slow elegant spin via CSS.
 */
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { usePerfMode } from '@/composables/usePerfMode'

withDefaults(
  defineProps<{
    intensity: number
    top?: number
    scale?: number
    fixed?: boolean
    y?: number
    pinned?: boolean
  }>(),
  { top: 62, scale: 1, fixed: false, y: 0, pinned: false },
)

/** Event-horizon shadow diameter as fraction of canvas. */
const SHADOW_FRAC = 0.36

const ringRef = ref<HTMLCanvasElement | null>(null)
const { low } = usePerfMode()

let reduced = false

/** Nearly even brightness around the ring (subtle M87 hint only). */
const beaming = (_angle: number) => 0.92

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/** Photo palette: deep red → orange → yellow-white peak. */
const diskColor = (heat: number): [number, number, number] => {
  const t = Math.min(1, Math.max(0, heat))
  if (t > 0.82) {
    const u = (t - 0.82) / 0.18
    return [255, Math.floor(210 + u * 45), Math.floor(110 + u * 100)]
  }
  if (t > 0.5) {
    const u = (t - 0.5) / 0.32
    return [255, Math.floor(110 + u * 100), Math.floor(20 + u * 90)]
  }
  if (t > 0.22) {
    const u = (t - 0.22) / 0.28
    return [Math.floor(190 + u * 65), Math.floor(40 + u * 70), Math.floor(8 + u * 12)]
  }
  const u = t / 0.22
  return [Math.floor(70 + u * 120), Math.floor(10 + u * 30), Math.floor(4 + u * 4)]
}

const paintRing = () => {
  const canvas = ringRef.value
  if (!canvas) return

  const sizeCss = Math.min(low.value ? 280 : 380, Math.floor(window.innerWidth * 0.72))
  const dpr = low.value ? 1 : Math.min(window.devicePixelRatio || 1, 1.35)
  const blur = low.value ? 7 : 12
  const pad = blur * 3
  const render = low.value ? Math.floor(sizeCss * 0.75) : Math.floor(sizeCss * 0.9)
  const total = render + pad * 2

  canvas.width = Math.floor(sizeCss * dpr)
  canvas.height = Math.floor(sizeCss * dpr)

  const ctx = canvas.getContext('2d', { alpha: true })
  if (!ctx) return
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, sizeCss, sizeCss)

  const off = document.createElement('canvas')
  off.width = total
  off.height = total
  const o = off.getContext('2d', { alpha: true })
  if (!o) return

  const cx = render * 0.5 + pad
  const cy = render * 0.5 + pad
  const rMax = render * 0.49
  const rShadow = render * SHADOW_FRAC * 0.5
  const shadowN = rShadow / rMax
  const img = o.createImageData(total, total)
  const data = img.data
  const step = low.value ? 2 : 1

  for (let py = 0; py < total; py += step) {
    for (let px = 0; px < total; px += step) {
      const dx = px - cx
      const dy = py - cy
      const dist = Math.hypot(dx, dy)
      const r = dist / rMax
      if (r > 1.2) continue

      const beam = beaming(0)

      /* Wider ring + long outer tail into space */
      const ringPeak = 0.42
      const sigma = 0.175
      const ring = Math.exp(-Math.pow((r - ringPeak) / sigma, 2))
      const outerHaze = Math.exp(-Math.pow((r - 0.58) / 0.38, 2)) * 0.28
      const farGlow = Math.exp(-Math.pow((r - 0.78) / 0.28, 2)) * 0.1

      /* Soft fade from horizon → ring (long inner limb) */
      const innerLimb = smoothstep(shadowN * 0.55, shadowN + 0.22, r)
      /* Soft fade from ring → cosmos */
      const outerLimb = 1 - smoothstep(0.72, 1.12, r)

      let heat = (ring * 0.9 + outerHaze + farGlow) * beam * innerLimb * outerLimb
      heat = Math.min(1, Math.pow(heat, 0.85))
      if (heat < 0.004) continue

      const [R, G, B] = diskColor(heat)
      const A = Math.min(255, Math.floor(heat * 240))

      for (let sy = 0; sy < step; sy++) {
        for (let sx = 0; sx < step; sx++) {
          const x = px + sx
          const y = py + sy
          if (x >= total || y >= total) continue
          const i = (y * total + x) * 4
          data[i] = R
          data[i + 1] = G
          data[i + 2] = B
          data[i + 3] = A
        }
      }
    }
  }

  /* Warm soft fill bridging horizon → ring */
  for (let py = 0; py < total; py += step) {
    for (let px = 0; px < total; px += step) {
      const dx = px - cx
      const dy = py - cy
      const dist = Math.hypot(dx, dy)
      if (dist > rShadow * 1.45 || dist < rShadow * 0.35) continue

      const t = (dist - rShadow * 0.35) / (rShadow * 1.1)
      const fall = Math.pow(Math.min(1, Math.max(0, t)), 0.85)
      const edge = 1 - Math.abs(fall - 0.55) * 1.4
      const glow = Math.max(0, edge) * 0.45
      if (glow < 0.015) continue

      for (let sy = 0; sy < step; sy++) {
        for (let sx = 0; sx < step; sx++) {
          const x = px + sx
          const y = py + sy
          if (x >= total || y >= total) continue
          const i = (y * total + x) * 4
          const a = data[i + 3] / 255
          const mix = glow * (1 - a * 0.35)
          data[i] = Math.min(255, Math.floor(data[i] + 185 * mix))
          data[i + 1] = Math.min(255, Math.floor(data[i + 1] + 55 * mix))
          data[i + 2] = Math.min(255, Math.floor(data[i + 2] + 12 * mix))
          data[i + 3] = Math.min(255, Math.floor(data[i + 3] + mix * 110))
        }
      }
    }
  }

  o.putImageData(img, 0, 0)

  /* Soft centered bloom — helps outer fade into space */
  o.globalCompositeOperation = 'screen'
  const bloom = o.createRadialGradient(cx, cy, rShadow * 0.35, cx, cy, rMax * 1.08)
  bloom.addColorStop(0, 'rgba(255,160,50,0.08)')
  bloom.addColorStop(0.35, 'rgba(255,100,25,0.1)')
  bloom.addColorStop(0.65, 'rgba(160,40,8,0.06)')
  bloom.addColorStop(1, 'rgba(0,0,0,0)')
  o.fillStyle = bloom
  o.beginPath()
  o.arc(cx, cy, rMax * 1.08, 0, Math.PI * 2)
  o.arc(cx, cy, rShadow * 0.55, 0, Math.PI * 2, true)
  o.fill('evenodd')
  o.globalCompositeOperation = 'source-over'

  /* Blur on oversized buffer — never blur onto final canvas edges (white square) */
  const blurred = document.createElement('canvas')
  blurred.width = total
  blurred.height = total
  const bctx = blurred.getContext('2d', { alpha: true })
  if (!bctx) return
  bctx.filter = `blur(${blur}px)`
  bctx.drawImage(off, 0, 0)
  bctx.filter = 'none'

  ctx.clearRect(0, 0, sizeCss, sizeCss)
  ctx.drawImage(blurred, pad, pad, render, render, 0, 0, sizeCss, sizeCss)

  /* Soft circular alpha — kills any remaining square fringe */
  ctx.globalCompositeOperation = 'destination-in'
  const clip = ctx.createRadialGradient(
    sizeCss * 0.5,
    sizeCss * 0.5,
    sizeCss * 0.28,
    sizeCss * 0.5,
    sizeCss * 0.5,
    sizeCss * 0.5,
  )
  clip.addColorStop(0, 'rgba(0,0,0,1)')
  clip.addColorStop(0.72, 'rgba(0,0,0,1)')
  clip.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = clip
  ctx.fillRect(0, 0, sizeCss, sizeCss)
  ctx.globalCompositeOperation = 'source-over'
}

const rebuild = () => paintRing()
const onOrient = () => rebuild()
const onResize = () => rebuild()

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  rebuild()
  window.addEventListener('orientationchange', onOrient)
  if (!window.matchMedia('(max-width: 900px), (pointer: coarse)').matches) {
    window.addEventListener('resize', onResize)
  }
})

watch(low, rebuild)

onUnmounted(() => {
  window.removeEventListener('orientationchange', onOrient)
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <div
    class="bh"
    :class="{
      'bh--fixed': fixed,
      'bh--pinned': pinned,
      'bh--live': intensity > 0.004 && !reduced,
    }"
    :style="
      fixed
        ? {
            transform: `translate(-50%, ${y}px) translateY(-50%) scale(${scale})`,
            opacity: intensity,
            '--shadow': `${SHADOW_FRAC * 100}%`,
          }
        : pinned
          ? {
              transform: `scale(${scale})`,
              opacity: intensity,
              '--shadow': `${SHADOW_FRAC * 100}%`,
            }
          : {
              top: `${top}%`,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity: intensity,
              '--shadow': `${SHADOW_FRAC * 100}%`,
            }
    "
    aria-hidden="true"
  >
    <div class="disk">
      <canvas ref="ringRef" class="ring" />
      <span class="haze" />
    </div>

    <div class="horizon">
      <span class="horizon-core" />
    </div>
  </div>
</template>

<style scoped>
.bh {
  --shadow: 36%;
  position: absolute;
  left: 50%;
  width: min(58vw, 300px);
  aspect-ratio: 1;
  pointer-events: none;
  z-index: 0;
  opacity: 0;
  border: none;
  outline: none;
  background: transparent;
  border-radius: 50%;
  overflow: hidden;
  will-change: opacity, transform;
}

.bh--fixed {
  position: fixed;
  left: 50%;
  top: 0;
  z-index: 0;
  transition: none;
}

.bh--pinned {
  position: relative;
  left: auto;
  top: auto;
  width: 100%;
  height: 100%;
  transform-origin: center center;
  transition: none;
}

.disk {
  position: absolute;
  inset: 0;
  transform-origin: center;
  border-radius: 50%;
  overflow: hidden;
}

.bh--live .disk {
  animation: disk-spin 72s linear infinite;
}

.ring {
  display: block;
  width: 100%;
  height: 100%;
  background: transparent;
  border: 0;
  outline: 0;
  box-shadow: none;
}

.haze {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(
    circle,
    transparent 28%,
    rgba(255, 140, 40, 0.1) 40%,
    rgba(180, 55, 12, 0.06) 52%,
    transparent 70%
  );
  /* avoid screen blend — can flash white on edges */
  opacity: 0.85;
  filter: blur(12px);
}

.bh--live .haze {
  animation: haze-breathe 6.5s ease-in-out infinite;
}

.horizon {
  position: absolute;
  left: 50%;
  top: 50%;
  width: var(--shadow);
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  z-index: 10;
  pointer-events: none;
  /* Feathered black — soft edge into the energy ring */
  -webkit-mask-image: radial-gradient(circle, #000 0 58%, transparent 100%);
  mask-image: radial-gradient(circle, #000 0 58%, transparent 100%);
}

.horizon-core {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle, #000 0 62%, rgba(0, 0, 0, 0.75) 82%, transparent 100%);
  border: none;
  outline: none;
  box-shadow: none;
}

@keyframes disk-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes haze-breathe {
  0%,
  100% {
    opacity: 0.55;
  }
  50% {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bh--live .disk,
  .bh--live .haze {
    animation: none;
  }
}

@media (max-width: 820px) {
  .bh {
    width: min(64vw, 260px);
  }

  .bh--live .disk {
    animation-duration: 90s;
  }
}
</style>
