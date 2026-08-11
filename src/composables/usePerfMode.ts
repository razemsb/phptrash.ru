import { onMounted, onUnmounted, ref } from 'vue'

function detect() {
  if (typeof window === 'undefined') {
    return { mobile: false, low: false }
  }
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const narrow = window.matchMedia('(max-width: 900px)').matches
  const touch = navigator.maxTouchPoints > 0
  const saveData =
    'connection' in navigator &&
    Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)
  const cores = navigator.hardwareConcurrency || 4
  const mobile = coarse || narrow || touch
  const low = Boolean(saveData) || cores <= 4 || mobile
  return { mobile, low }
}

/** Lightweight device/perf flags for throttling space FX. */
export function usePerfMode() {
  const initial = detect()
  const low = ref(initial.low)
  const mobile = ref(initial.mobile)

  onMounted(() => {
    const apply = () => {
      const next = detect()
      mobile.value = next.mobile
      low.value = next.low
    }
    apply()
    const mq = window.matchMedia('(max-width: 900px)')
    mq.addEventListener('change', apply)
    onUnmounted(() => mq.removeEventListener('change', apply))
  })

  return { low, mobile }
}
