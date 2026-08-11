import { onMounted, onUnmounted, ref } from 'vue'
import { usePerfMode } from '@/composables/usePerfMode'

export function useScrollProgress() {
  const progress = ref(0)
  /** Smoothed 0..1 — use for planet motion to avoid mobile jitter */
  const smooth = ref(0)
  const y = ref(0)

  const { mobile } = usePerfMode()

  let raf = 0
  let pending = false
  let looping = false
  let target = 0
  /** Locked viewport height — ignore URL-bar resize jitter on mobile */
  let viewH = 0

  const lockView = () => {
    viewH = window.innerHeight
  }

  const maxScroll = () => {
    const h = viewH || window.innerHeight
    return Math.max(1, document.documentElement.scrollHeight - h)
  }

  const read = () => {
    pending = false
    y.value = window.scrollY
    target = Math.min(1, Math.max(0, window.scrollY / maxScroll()))
    progress.value = target
    if (!looping) {
      looping = true
      raf = requestAnimationFrame(tick)
    }
  }

  const tick = () => {
    const diff = target - smooth.value
    if (Math.abs(diff) < 0.0004) {
      smooth.value = target
      looping = false
      return
    }
    // slower ease — less jumpy when touch scroll settles
    const k = mobile.value ? 0.05 : 0.08
    smooth.value += diff * k
    raf = requestAnimationFrame(tick)
  }

  const update = () => {
    if (pending) return
    pending = true
    requestAnimationFrame(read)
  }

  const onResize = () => {
    // Mobile: don't recompute progress on chrome show/hide — only orientation
    if (mobile.value) return
    lockView()
    update()
  }

  const onOrient = () => {
    lockView()
    update()
  }

  onMounted(() => {
    lockView()
    read()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onOrient)
  })

  onUnmounted(() => {
    cancelAnimationFrame(raf)
    window.removeEventListener('scroll', update)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('orientationchange', onOrient)
  })

  return { progress, smooth, y }
}
