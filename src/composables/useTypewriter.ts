import { onUnmounted, ref, watch, type Ref } from 'vue'

export function useTypewriter(
  phrases: Ref<string[]> | string[],
  options: { typingSpeed?: number; pauseMs?: number; deletingSpeed?: number } = {},
) {
  const { typingSpeed = 42, pauseMs = 1800, deletingSpeed = 28 } = options
  const text = ref('')
  const isTyping = ref(true)
  let phraseIndex = 0
  let charIndex = 0
  let deleting = false
  let timer: ReturnType<typeof setTimeout> | undefined

  const getPhrases = () => (Array.isArray(phrases) ? phrases : phrases.value)

  const tick = () => {
    const list = getPhrases()
    if (!list.length) return

    const current = list[phraseIndex % list.length]

    if (!deleting) {
      charIndex += 1
      text.value = current.slice(0, charIndex)
      isTyping.value = true

      if (charIndex >= current.length) {
        deleting = true
        timer = setTimeout(tick, pauseMs)
        return
      }
      timer = setTimeout(tick, typingSpeed)
      return
    }

    charIndex -= 1
    text.value = current.slice(0, charIndex)
    isTyping.value = true

    if (charIndex <= 0) {
      deleting = false
      phraseIndex = (phraseIndex + 1) % list.length
      timer = setTimeout(tick, 320)
      return
    }

    timer = setTimeout(tick, deletingSpeed)
  }

  const start = () => {
    clearTimeout(timer)
    phraseIndex = 0
    charIndex = 0
    deleting = false
    text.value = ''
    timer = setTimeout(tick, 400)
  }

  watch(
    () => getPhrases().join('|'),
    () => start(),
    { immediate: true },
  )

  onUnmounted(() => clearTimeout(timer))

  return { text, isTyping }
}
