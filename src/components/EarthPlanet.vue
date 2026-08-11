<script setup lang="ts">
/**
 * Earth painted once on canvas — recognizable oceans/continents/ice.
 * Moon orbits via CSS around the planet.
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
let size = 220

const paint = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = low.value ? 1 : Math.min(window.devicePixelRatio || 1, 1.75)
  size = Math.min(low.value ? 170 : 240, Math.floor(window.innerWidth * 0.32))
  canvas.width = Math.floor(size * dpr)
  canvas.height = Math.floor(size * dpr)
  // display size via CSS only — no inline width (avoids jump on mobile chrome)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, size, size)

  const cx = size * 0.5
  const cy = size * 0.5
  const r = size * 0.42

  // atmosphere halo
  const atmos = ctx.createRadialGradient(cx, cy, r * 0.85, cx, cy, r * 1.28)
  atmos.addColorStop(0, 'rgba(100,180,255,0)')
  atmos.addColorStop(0.7, 'rgba(90,170,255,0.18)')
  atmos.addColorStop(1, 'rgba(60,140,255,0)')
  ctx.fillStyle = atmos
  ctx.beginPath()
  ctx.arc(cx, cy, r * 1.28, 0, Math.PI * 2)
  ctx.fill()

  // clip sphere
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.clip()

  // ocean
  const ocean = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.3, r * 0.1, cx, cy, r)
  ocean.addColorStop(0, '#3d9be0')
  ocean.addColorStop(0.45, '#1a6fb8')
  ocean.addColorStop(1, '#0b3d6e')
  ctx.fillStyle = ocean
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2)

  const fillPoly = (pts: Array<[number, number]>, fill: string) => {
    if (pts.length < 3) return
    ctx.beginPath()
    ctx.moveTo(cx + pts[0][0] * r, cy + pts[0][1] * r)
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(cx + pts[i][0] * r, cy + pts[i][1] * r)
    }
    ctx.closePath()
    ctx.fillStyle = fill
    ctx.fill()
  }

  const fillBlob = (draw: () => void, fill: string) => {
    ctx.beginPath()
    draw()
    ctx.fillStyle = fill
    ctx.fill()
  }

  // --- Eurasia (dominant face): Europe → Siberia → China → India → Arabia ---
  fillPoly(
    [
      // Iberia
      [-0.26, -0.22],
      [-0.2, -0.3],
      // France / Britain area
      [-0.14, -0.36],
      [-0.08, -0.42],
      [-0.02, -0.48],
      // Scandinavia
      [0.04, -0.55],
      [0.1, -0.5],
      // Arctic Russia
      [0.22, -0.56],
      [0.38, -0.5],
      [0.52, -0.42],
      // Far East
      [0.66, -0.28],
      [0.7, -0.14],
      [0.62, -0.02],
      // China coast / Korea
      [0.55, 0.06],
      // Indochina
      [0.48, 0.14],
      [0.4, 0.1],
      // India peninsula (key silhouette)
      [0.34, 0.06],
      [0.3, 0.18],
      [0.24, 0.32],
      [0.16, 0.28],
      [0.18, 0.12],
      [0.16, 0.02],
      // Arabia (key silhouette)
      [0.1, 0.0],
      [0.08, 0.14],
      [0.0, 0.2],
      [-0.06, 0.1],
      [-0.08, 0.0],
      // Anatolia / Balkans
      [-0.12, -0.06],
      [-0.16, -0.1],
      // Italy bump
      [-0.18, -0.04],
      [-0.2, -0.12],
      [-0.24, -0.16],
    ],
    '#348a42',
  )

  // inland darker band (Urals / Central Asia)
  fillPoly(
    [
      [0.05, -0.38],
      [0.25, -0.42],
      [0.4, -0.3],
      [0.32, -0.18],
      [0.12, -0.2],
      [0.02, -0.28],
    ],
    '#2a6f36',
  )

  // British Isles
  fillBlob(() => {
    ctx.ellipse(cx - r * 0.18, cy - r * 0.38, r * 0.04, r * 0.065, -0.25, 0, Math.PI * 2)
  }, '#3f9a4f')

  // Japan hint
  fillBlob(() => {
    ctx.ellipse(cx + r * 0.72, cy - r * 0.08, r * 0.025, r * 0.07, 0.5, 0, Math.PI * 2)
  }, '#3f9a4f')

  // --- Africa ---
  fillPoly(
    [
      // Maghreb
      [-0.22, -0.08],
      [-0.28, 0.02],
      [-0.24, 0.16],
      // West Africa bulge
      [-0.26, 0.28],
      [-0.18, 0.4],
      // Southern tip
      [-0.06, 0.52],
      [0.04, 0.48],
      [0.08, 0.34],
      // East Africa
      [0.1, 0.2],
      // Horn
      [0.18, 0.12],
      [0.12, 0.04],
      [0.02, -0.04],
      [-0.08, -0.1],
    ],
    '#c2a052',
  )

  // Sahara wash
  fillPoly(
    [
      [-0.2, -0.02],
      [-0.02, -0.06],
      [0.08, 0.04],
      [-0.02, 0.12],
      [-0.16, 0.1],
    ],
    '#d8bc6e',
  )

  // Madagascar
  fillBlob(() => {
    ctx.ellipse(cx + r * 0.16, cy + r * 0.36, r * 0.032, r * 0.075, 0.2, 0, Math.PI * 2)
  }, '#3f9a4f')

  // --- Americas (left limb) ---
  fillPoly(
    [
      [-0.58, -0.4],
      [-0.7, -0.35],
      [-0.68, -0.15],
      [-0.62, 0.0],
      [-0.66, 0.1],
      [-0.55, 0.02],
      [-0.52, -0.2],
      [-0.5, -0.35],
    ],
    '#3a9a48',
  )
  fillPoly(
    [
      [-0.6, 0.14],
      [-0.7, 0.22],
      [-0.62, 0.42],
      [-0.52, 0.55],
      [-0.45, 0.42],
      [-0.5, 0.25],
      [-0.54, 0.16],
    ],
    '#4aaa58',
  )

  // Australia
  fillPoly(
    [
      [0.4, 0.26],
      [0.55, 0.22],
      [0.62, 0.32],
      [0.55, 0.44],
      [0.42, 0.4],
      [0.36, 0.32],
    ],
    '#5a9a48',
  )

  // Greenland ice land
  fillPoly(
    [
      [-0.3, -0.52],
      [-0.2, -0.68],
      [-0.06, -0.62],
      [-0.12, -0.5],
      [-0.24, -0.48],
    ],
    '#e8f2fa',
  )

  // polar ice
  const iceN = ctx.createRadialGradient(cx, cy - r * 0.78, 0, cx, cy - r * 0.55, r * 0.4)
  iceN.addColorStop(0, 'rgba(255,255,255,0.95)')
  iceN.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = iceN
  ctx.beginPath()
  ctx.ellipse(cx, cy - r * 0.78, r * 0.55, r * 0.28, 0, 0, Math.PI * 2)
  ctx.fill()

  const iceS = ctx.createRadialGradient(cx, cy + r * 0.82, 0, cx, cy + r * 0.6, r * 0.38)
  iceS.addColorStop(0, 'rgba(245,250,255,0.9)')
  iceS.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = iceS
  ctx.beginPath()
  ctx.ellipse(cx, cy + r * 0.82, r * 0.5, r * 0.26, 0, 0, Math.PI * 2)
  ctx.fill()

  // soft clouds (lighter — don't hide continents)
  ctx.fillStyle = 'rgba(255,255,255,0.12)'
  ctx.beginPath()
  ctx.ellipse(cx - r * 0.05, cy + r * 0.08, r * 0.2, r * 0.05, -0.35, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx + r * 0.28, cy - r * 0.12, r * 0.16, r * 0.045, 0.25, 0, Math.PI * 2)
  ctx.fill()

  // terminator / shade
  const shade = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, r * 0.15, cx + r * 0.2, cy + r * 0.25, r * 1.15)
  shade.addColorStop(0, 'rgba(0,0,0,0)')
  shade.addColorStop(1, 'rgba(0,0,0,0.45)')
  ctx.fillStyle = shade
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2)

  // specular highlight
  const spec = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.35, 0, cx - r * 0.3, cy - r * 0.35, r * 0.35)
  spec.addColorStop(0, 'rgba(255,255,255,0.28)')
  spec.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = spec
  ctx.beginPath()
  ctx.arc(cx - r * 0.3, cy - r * 0.35, r * 0.35, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()

  // thin limb
  ctx.strokeStyle = 'rgba(160,210,255,0.35)'
  ctx.lineWidth = Math.max(1.5, size * 0.008)
  ctx.beginPath()
  ctx.arc(cx, cy, r - 0.5, 0, Math.PI * 2)
  ctx.stroke()
}

onMounted(() => {
  paint()
  window.addEventListener('orientationchange', paint)
  // Desktop only — mobile chrome resize must not reflow planet canvases
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
    class="earth-wrap"
    :style="{
      opacity,
      left: `${left}%`,
      top: `${top}%`,
      transform: transform(),
    }"
    aria-hidden="true"
  >
    <canvas ref="canvasRef" class="earth-canvas" />
    <span class="orbit">
      <span class="moon" />
    </span>
  </div>
</template>

<style scoped>
.earth-wrap {
  position: absolute;
  width: min(30vw, 240px);
  height: min(30vw, 240px);
  pointer-events: none;
}

.earth-canvas {
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}

.orbit {
  position: absolute;
  inset: -30%;
  border-radius: 50%;
  animation: moon-orbit 18s linear infinite;
  will-change: transform;
  z-index: 2;
}

.moon {
  position: absolute;
  top: 8%;
  left: 50%;
  width: 15%;
  height: 15%;
  margin-left: -7.5%;
  border-radius: 50%;
  background: radial-gradient(circle at 32% 28%, #f4f1ea, #9a958c 60%, #5a5650 100%);
  box-shadow: 0 0 10px rgba(220, 230, 255, 0.28);
}

@keyframes moon-orbit {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .orbit {
    animation: none;
  }
}

@media (max-width: 820px) {
  .earth-wrap {
    width: min(44vw, 170px);
    height: min(44vw, 170px);
  }
}
</style>
