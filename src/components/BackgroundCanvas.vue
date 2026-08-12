<script setup lang="ts">
/**
 * Lightweight starfield — capped particles, low DPR on mobile, no blur.
 */
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { usePrefersReducedMotion } from '@/composables/useReducedMotion'
import { useScrollProgress } from '@/composables/useScrollProgress'
import { usePerfMode } from '@/composables/usePerfMode'

defineProps<{
  theme?: 'dark'
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const reduced = usePrefersReducedMotion()
const { smooth } = useScrollProgress()
const { low, mobile } = usePerfMode()

interface Star {
  x: number
  y: number
  z: number
  s: number
}

let raf = 0
let stars: Star[] = []
let w = 0
let h = 0
let dpr = 1
let t = 0
let scrollP = 0
let last = 0

watch(smooth, (v) => {
  scrollP = v
})

const resize = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  dpr = low.value ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)
  w = Math.max(1, Math.floor(window.innerWidth))
  h = Math.max(1, Math.floor(window.innerHeight))
  canvas.width = Math.floor(w * dpr)
  canvas.height = Math.floor(h * dpr)
  canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0)
  spawn()
}

const spawn = () => {
  const density = low.value ? 22000 : 12000
  const max = low.value ? 80 : 160
  const count = Math.min(max, Math.floor((w * h) / density))
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    z: Math.random(),
    s: Math.random() * 1.3 + 0.25,
  }))
}

const draw = (now: number) => {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!ctx) return

  const targetFps = low.value ? 24 : 36
  const minDelta = 1000 / targetFps
  if (now - last < minDelta) {
    raf = requestAnimationFrame(draw)
    return
  }
  last = now

  t += 0.003 + scrollP * 0.008
  ctx.clearRect(0, 0, w, h)

  const dens = 0.45 + scrollP * 0.55

  for (const star of stars) {
    const speed = (0.2 + star.z) * (1 + scrollP * 1.4)
    const x = star.x
    const y = (star.y + t * speed * 36) % (h + 20)

    const alpha = (0.25 + star.z * 0.55) * dens
    ctx.fillStyle = `rgba(230, 240, 255, ${alpha})`
    ctx.fillRect(x, y, star.s, star.s)
  }

  raf = requestAnimationFrame(draw)
}

onMounted(() => {
  resize()
  scrollP = smooth.value
  if (mobile.value) {
    window.addEventListener('orientationchange', resize)
  } else {
    window.addEventListener('resize', resize)
  }
  if (!reduced.value) raf = requestAnimationFrame(draw)
})

watch([reduced, low], () => {
  cancelAnimationFrame(raf)
  resize()
  if (!reduced.value) raf = requestAnimationFrame(draw)
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resize)
  window.removeEventListener('orientationchange', resize)
})
</script>

<template>
  <canvas ref="canvasRef" class="stars" aria-hidden="true" />
</template>

<style scoped>
.stars {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100svh;
  z-index: -3;
  pointer-events: none;
  opacity: 0.8;
}
</style>
