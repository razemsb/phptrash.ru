import { ref, watch, type Ref } from 'vue'
import { createHighlighter, type Highlighter } from 'shiki'

const LANGS = ['php', 'javascript', 'typescript', 'css'] as const
type StackLang = (typeof LANGS)[number]

let highlighter: Highlighter | null = null
let loadingHighlighter: Promise<Highlighter> | null = null
const cache = new Map<string, string>()

async function getHighlighter() {
  if (highlighter) return highlighter
  if (!loadingHighlighter) {
    loadingHighlighter = createHighlighter({
      themes: ['material-theme-darker'],
      langs: [...LANGS],
    }).then((h) => {
      highlighter = h
      return h
    })
  }
  return loadingHighlighter
}

export function useCodeHighlight(code: Ref<string>, lang: Ref<StackLang>) {
  const html = ref('')
  const loading = ref(false)
  const error = ref<string | null>(null)

  watch(
    [code, lang],
    async ([nextCode, nextLang]) => {
      const key = `${nextLang}:${nextCode}`
      if (cache.has(key)) {
        html.value = cache.get(key)!
        error.value = null
        return
      }

      loading.value = true
      error.value = null

      try {
        const h = await getHighlighter()
        const result = h.codeToHtml(nextCode, {
          lang: nextLang,
          theme: 'material-theme-darker',
        })
        cache.set(key, result)
        html.value = result
      } catch (e) {
        error.value = e instanceof Error ? e.message : 'highlight failed'
        html.value = ''
      } finally {
        loading.value = false
      }
    },
    { immediate: true },
  )

  return { html, loading, error }
}
