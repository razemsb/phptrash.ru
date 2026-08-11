import { onMounted, ref } from 'vue'

export function usePrefersReducedMotion() {
  const reduced = ref(false)

  onMounted(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduced.value = mq.matches
    const handler = (event: MediaQueryListEvent) => {
      reduced.value = event.matches
    }
    mq.addEventListener('change', handler)
  })

  return reduced
}
