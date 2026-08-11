import { onMounted, onUnmounted, ref } from 'vue'

export function useScrollCosmos() {
  const progress = ref(0)
  const velocity = ref(0)
  const y = ref(0)

  let lastY = 0
  let lastT = 0
  let raf = 0
  let targetProgress = 0
  let targetVelocity = 0

  const measure = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    const current = window.scrollY
    const now = performance.now()
    const dt = Math.max(16, now - lastT)
    const rawV = Math.abs(current - lastY) / dt

    targetProgress = Math.min(1, Math.max(0, current / max))
    targetVelocity = Math.min(1, rawV * 18)
    lastY = current
    lastT = now
    y.value = current
  }

  const tick = () => {
    progress.value += (targetProgress - progress.value) * 0.08
    velocity.value += (targetVelocity - velocity.value) * 0.12
    targetVelocity *= 0.92
    raf = requestAnimationFrame(tick)
  }

  onMounted(() => {
    lastT = performance.now()
    measure()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    raf = requestAnimationFrame(tick)
  })

  onUnmounted(() => {
    cancelAnimationFrame(raf)
    window.removeEventListener('scroll', measure)
    window.removeEventListener('resize', measure)
  })

  return { progress, velocity, y }
}
