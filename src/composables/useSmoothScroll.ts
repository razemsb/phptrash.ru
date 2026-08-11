import { onMounted, onUnmounted, watch } from 'vue'
import Lenis from 'lenis'
import { usePrefersReducedMotion } from '@/composables/useReducedMotion'
import { usePerfMode } from '@/composables/usePerfMode'

let lenis: Lenis | null = null

export function useSmoothScroll() {
  const reduced = usePrefersReducedMotion()
  const { mobile } = usePerfMode()

  const start = () => {
    lenis?.destroy()
    lenis = null
    if (reduced.value || mobile.value) return

    lenis = new Lenis({
      autoRaf: true,
      duration: 1.05,
      smoothWheel: true,
      touchMultiplier: 1,
      anchors: {
        offset: 92,
      },
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
  }

  onMounted(() => {
    requestAnimationFrame(start)
  })

  watch([reduced, mobile], start)

  onUnmounted(() => {
    lenis?.destroy()
    lenis = null
  })
}

export function getLenis() {
  return lenis
}
