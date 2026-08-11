<script setup lang="ts">
/**
 * Saturn — paint once. Position via CSS only (no scroll-driven repaint).
 */
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { usePerfMode } from '@/composables/usePerfMode'

const props = withDefaults(
  defineProps<{
    opacity: number
    left: number
    top: number
    scale: number
    shiftX?: number
    shiftY?: number
  }>(),
  { shiftX: 0, shiftY: 0 },
)

const transform = () =>
  props.shiftX === 0 && props.shiftY === 0
    ? `translate3d(-50%, -50%, 0) scale(${props.scale})`
    : `translate3d(calc(-50% + ${props.shiftX}vw), calc(-50% + ${props.shiftY}vh), 0) scale(${props.scale})`

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { low } = usePerfMode()

let size = 200

const paint = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = low.value ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)
  size = Math.min(low.value ? 160 : 220, Math.floor(window.innerWidth * 0.26))
  canvas.width = Math.floor(size * dpr)
  canvas.height = Math.floor(size * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, size, size)

  const cx = size * 0.5
  const cy = size * 0.52
  const pr = size * 0.2
  const tilt = 0.32
  const spin = -0.4

  const haze = ctx.createRadialGradient(cx, cy, pr * 0.2, cx, cy, pr * 2.4)
  haze.addColorStop(0, 'rgba(100, 170, 255, 0.18)')
  haze.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = haze
  ctx.fillRect(0, 0, size, size)

  const drawRings = (a0: number, a1: number, alphaMul: number) => {
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(spin)
    ctx.scale(1, tilt)
    const bands = [1.55, 1.75, 1.95, 2.15, 2.35]
    for (let i = 0; i < bands.length; i++) {
      ctx.beginPath()
      ctx.arc(0, 0, pr * bands[i], a0, a1)
      ctx.strokeStyle =
        i === 2 ? `rgba(255,236,210,${0.45 * alphaMul})` : `rgba(180,210,255,${0.28 * alphaMul})`
      ctx.lineWidth = i % 2 === 0 ? 2.2 : 1.2
      ctx.stroke()
    }
    ctx.restore()
  }

  drawRings(Math.PI, Math.PI * 2, 0.55)

  const body = ctx.createRadialGradient(cx - pr * 0.3, cy - pr * 0.35, pr * 0.1, cx, cy, pr)
  body.addColorStop(0, '#eef4ff')
  body.addColorStop(0.4, '#8aa0d8')
  body.addColorStop(1, '#1a2048')
  ctx.fillStyle = body
  ctx.beginPath()
  ctx.arc(cx, cy, pr, 0, Math.PI * 2)
  ctx.fill()

  drawRings(0, Math.PI, 1)
}

onMounted(() => {
  paint()
  window.addEventListener('orientationchange', paint)
  if (!window.matchMedia('(max-width: 900px), (pointer: coarse)').matches) {
    window.addEventListener('resize', paint)
  }
})

watch(low, paint)

onUnmounted(() => {
  window.removeEventListener('orientationchange', paint)
  window.removeEventListener('resize', paint)
})
</script>

<template>
  <div
    class="saturn"
    :style="{
      opacity,
      left: `${left}%`,
      top: `${top}%`,
      transform: transform(),
    }"
    aria-hidden="true"
  >
    <canvas ref="canvasRef" />
  </div>
</template>

<style scoped>
.saturn {
  position: absolute;
  width: min(26vw, 220px);
  height: min(26vw, 220px);
  pointer-events: none;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
