<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let raf = 0
let w = 0
let h = 0
let stars: { x: number; y: number; z: number; s: number }[] = []
let t = 0

const spawn = () => {
  const count = Math.min(120, Math.floor((w * h) / 14000))
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    z: Math.random(),
    s: Math.random() * 1.2 + 0.3,
  }))
}

const resize = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  w = Math.floor(window.innerWidth)
  h = Math.floor(window.innerHeight)
  canvas.width = w
  canvas.height = h
  spawn()
}

const draw = () => {
  const ctx = canvasRef.value?.getContext('2d')
  if (!ctx) return
  t += 0.004
  ctx.clearRect(0, 0, w, h)
  for (const star of stars) {
    const y = (star.y + t * (12 + star.z * 28)) % (h + 10)
    ctx.fillStyle = `rgba(220,235,255,${0.2 + star.z * 0.55})`
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
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.75;
}
</style>
