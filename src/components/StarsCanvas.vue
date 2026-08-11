<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let raf = 0
let w = 0
let h = 0
let stars: { x: number; y: number; z: number; s: number }[] = []
let t = 0
let last = 0

const spawn = () => {
  const count = Math.min(140, Math.floor((w * h) / 12000))
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    z: Math.random(),
    s: Math.random() * 1.25 + 0.25,
  }))
}

const resize = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  w = Math.max(1, Math.floor(window.innerWidth))
  h = Math.max(1, Math.floor(window.innerHeight))
  canvas.width = w
  canvas.height = h
  spawn()
}

const draw = (now: number) => {
  const ctx = canvasRef.value?.getContext('2d')
  if (!ctx) return
  if (now - last < 33) {
    raf = requestAnimationFrame(draw)
    return
  }
  last = now
  t += 0.0035
  ctx.clearRect(0, 0, w, h)
  for (const star of stars) {
    const y = (star.y + t * (10 + star.z * 30)) % (h + 12)
    const alpha = 0.18 + star.z * 0.6
    ctx.fillStyle = `rgba(220,235,255,${alpha})`
    ctx.fillRect(star.x, y, star.s, star.s)
  }
  raf = requestAnimationFrame(draw)
}

onMounted(() => {
  resize()
  window.addEventListener('resize', resize)
  raf = requestAnimationFrame(draw)
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resize)
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
  z-index: 0;
  pointer-events: none;
  opacity: 0.8;
}
</style>
