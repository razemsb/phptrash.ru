<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import BlackHole from '@/components/BlackHole.vue'

const GAP_H = 360

const gapRef = ref<HTMLElement | null>(null)
const y = ref(0)
const opacity = ref(0)
const scale = ref(0.88)

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

const smoothstep = (t: number) => {
  const x = clamp(t, 0, 1)
  return x * x * (3 - 2 * x)
}

const pinLine = (vh: number) => vh * 0.5

const pageMax = () =>
  Math.max(1, document.documentElement.scrollHeight - window.innerHeight)

const gapTopDoc = () => {
  const gap = gapRef.value
  if (!gap) return 0
  const r = gap.getBoundingClientRect()
  return window.scrollY + r.top
}

let scrollRaf = 0
let cachedStackTop = 0
let cachedBioTop = 0
let cachedBioH = 0

const cacheOffsets = () => {
  const stack = document.getElementById('stack')
  const bio = document.getElementById('bio')
  cachedStackTop = stack?.offsetTop ?? 0
  cachedBioTop = bio?.offsetTop ?? 0
  cachedBioH = bio?.offsetHeight ?? 0
}

const update = () => {
  const gap = gapRef.value
  if (!gap) return

  const scrollY = window.scrollY
  const vh = window.innerHeight
  const pinY = pinLine(vh)
  const gapTop = gapTopDoc()
  const maxScroll = pageMax()

  const appearStart = cachedStackTop
    ? cachedStackTop - vh * 0.12
    : cachedBioTop
      ? cachedBioTop + cachedBioH * 0.4
      : maxScroll * 0.32

  const lockStart = gapTop + GAP_H * 0.5 - pinY
  const lockEnd = lockStart + GAP_H
  const fadeSpan = Math.max(vh * 1.2, lockStart - appearStart - vh * 0.15)

  if (scrollY < appearStart) {
    if (opacity.value !== 0) opacity.value = 0
    y.value = vh * 0.38
    scale.value = 0.88
    return
  }

  const enter = smoothstep((scrollY - appearStart) / fadeSpan)
  const fadeIn = enter * enter * (3 - 2 * enter)

  if (scrollY >= lockStart && scrollY <= lockEnd) {
    opacity.value = 1
    scale.value = 1
    y.value = pinY
    return
  }

  if (scrollY > lockEnd) {
    const past = scrollY - lockEnd
    const out = clamp(1 - past / 300, 0, 1)
    opacity.value = out * out * (3 - 2 * out)
    scale.value = 0.94 + opacity.value * 0.06
    y.value = pinY - past * 0.5
    return
  }

  opacity.value = fadeIn
  scale.value = 0.88 + fadeIn * 0.12
  const travelT = smoothstep((scrollY - appearStart) / Math.max(1, lockStart - appearStart))
  y.value = vh * 0.38 + (pinY - vh * 0.38) * travelT
}

const onScroll = () => {
  if (scrollRaf) return
  scrollRaf = requestAnimationFrame(() => {
    scrollRaf = 0
    update()
  })
}

const onResize = () => {
  cacheOffsets()
  update()
}

onMounted(() => {
  cacheOffsets()
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  cancelAnimationFrame(scrollRaf)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <div ref="gapRef" class="cosmos-gap" aria-hidden="true">
    <div class="bh-layer" :style="{ opacity: opacity > 0.004 ? 1 : 0 }">
      <BlackHole fixed :y="y" :intensity="opacity" :scale="scale" />
    </div>
  </div>
</template>

<style scoped>
.cosmos-gap {
  height: 360px;
  position: relative;
  z-index: 0;
  pointer-events: none;
}

.bh-layer {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: visible;
}
</style>
