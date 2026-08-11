<script setup lang="ts">
/**
 * Comets — parabolic streaks. On mobile: locked viewport size (no URL-bar
 * resize jumps), smoother unlock, lower FPS, ignore chrome resize.
 */
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { usePrefersReducedMotion } from '@/composables/useReducedMotion'
import { useScrollProgress } from '@/composables/useScrollProgress'
import { usePerfMode } from '@/composables/usePerfMode'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const reduced = usePrefersReducedMotion()
const { smooth } = useScrollProgress()
const { low, mobile } = usePerfMode()

interface Comet {
  u: number
  speed: number
  a: number
  h: number
  k: number
  x0: number
  x1: number
  unlock: number
  len: number
  pause: number
  unlocked: boolean
}

let raf = 0
let w = 0
let h = 0
let scrollP = 0
let last = 0
let scrolling = false
let scrollIdleTimer = 0

const comets: Comet[] = [
  {
    u: 0,
    speed: 0.07,
    a: 0.55,
    h: 0.42,
    k: 0.18,
    x0: -0.12,
    x1: 1.15,
    unlock: 0.12,
    len: 120,
    pause: 0,
    unlocked: false,
  },
  {
    u: 0.4,
    speed: 0.055,
    a: -0.4,
    h: 0.58,
    k: 0.62,
    x0: 1.12,
    x1: -0.15,
    unlock: 0.48,
    len: 140,
    pause: 0,
    unlocked: false,
  },
]

watch(smooth, (v) => {
  scrollP = v
})

const lockSize = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  // layout-ish size; do NOT follow visualViewport chrome toggles on mobile
  w = Math.max(1, Math.floor(window.innerWidth))
  h = Math.max(1, Math.floor(window.innerHeight))
  canvas.width = w
  canvas.height = h
}

const pointOn = (c: Comet, u: number) => {
  const xN = c.x0 + (c.x1 - c.x0) * u
  const yN = c.a * (xN - c.h) ** 2 + c.k
  return { x: xN * w, y: yN * h }
}

const tick = (now: number) => {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!ctx) return

  // while finger is scrolling on mobile — freeze frame (no jump/stutter)
  if (mobile.value && scrolling) {
    raf = requestAnimationFrame(tick)
    return
  }

  const minDelta = mobile.value ? 66 : low.value ? 50 : 33
  if (now - last < minDelta) {
    raf = requestAnimationFrame(tick)
    return
  }
  // fixed step — avoids dt spikes that make trails hitch
  const dt = minDelta / 1000
  last = now
  ctx.clearRect(0, 0, w, h)

  for (const c of comets) {
    // one comet only on phones
    if (mobile.value && c.unlock > 0.3) continue
    if (low.value && !mobile.value && c.unlock > 0.4) continue

    if (!c.unlocked) {
      if (scrollP < c.unlock) continue
      c.unlocked = true
    }

    if (c.pause > 0) {
      c.pause -= dt
      if (c.pause <= 0) c.u = 0
      continue
    }

    c.u += c.speed * dt
    if (c.u >= 1) {
      c.u = 1
      c.pause = mobile.value ? 5 + Math.random() * 4 : 3.5 + Math.random() * 3
      continue
    }

    const edge = Math.min(c.u, 1 - c.u)
    const alpha = Math.min(1, edge * 4)
    if (alpha < 0.02) continue

    const { x, y } = pointOn(c, c.u)
    const p0 = pointOn(c, Math.max(0, c.u - 0.01))
    const p1 = pointOn(c, Math.min(1, c.u + 0.01))
    const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x)

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(angle)
    ctx.globalAlpha = alpha
    const len = mobile.value ? c.len * 0.75 : c.len
    const grad = ctx.createLinearGradient(-len, 0, 0, 0)
    grad.addColorStop(0, 'rgba(77,226,255,0)')
    grad.addColorStop(1, 'rgba(255,255,255,0.85)')
    ctx.strokeStyle = grad
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(-len, 0)
    ctx.lineTo(0, 0)
    ctx.stroke()
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(0, 0, 2.4, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  raf = requestAnimationFrame(tick)
}

const onScroll = () => {
  if (!mobile.value) return
  scrolling = true
  window.clearTimeout(scrollIdleTimer)
  scrollIdleTimer = window.setTimeout(() => {
    scrolling = false
  }, 120)
}

onMounted(() => {
  lockSize()
  scrollP = smooth.value
  last = performance.now()

  if (mobile.value) {
    window.addEventListener('orientationchange', lockSize)
    window.addEventListener('scroll', onScroll, { passive: true })
  } else {
    window.addEventListener('resize', lockSize)
  }

  if (!reduced.value) raf = requestAnimationFrame(tick)
})

watch(reduced, (v) => {
  cancelAnimationFrame(raf)
  if (!v) {
    last = performance.now()
    raf = requestAnimationFrame(tick)
  }
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  window.clearTimeout(scrollIdleTimer)
  window.removeEventListener('resize', lockSize)
  window.removeEventListener('orientationchange', lockSize)
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <canvas ref="canvasRef" class="comets" aria-hidden="true" />
</template>

<style scoped>
.comets {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100svh;
  z-index: 0;
  pointer-events: none;
}
</style>
