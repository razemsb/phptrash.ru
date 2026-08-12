export interface StackSnippet {
  id: string
  label: string
  lang: 'php' | 'javascript' | 'typescript' | 'css'
  filename: string
  source: string
  caption: string
  code: string
}

/** Real fragments from phptrash.ru + DevGuide (Eguide-backend / EGuide). */
export const stackSnippets: StackSnippet[] = [
  {
    id: 'php',
    label: 'PHP',
    lang: 'php',
    filename: 'SearchParams.php',
    source: 'DevGuide · backend',
    caption: 'Readonly DTO нормализует query string — API получает предсказуемый вход.',
    code: `class SearchParams
{
    public const TYPES = ['all', 'guides', 'roadmaps', 'users', 'tags', 'categories'];

    public function __construct(
        public readonly string $q = '',
        public readonly string $type = 'all',
        public readonly ?string $category = null,
        public readonly ?string $tag = null,
        public readonly int $page = 1,
        public readonly int $limit = 10,
        public readonly string $sort = 'relevance',
        public readonly bool $staffMode = false,
    ) {}

    public static function fromQuery(array $query, bool $staffMode = false): self
    {
        $q = trim((string)($query['q'] ?? $query['search'] ?? ''));
        $type = strtolower(trim((string)($query['type'] ?? 'all')));
        if (!in_array($type, self::TYPES, true)) {
            $type = 'all';
        }

        $page = max(1, (int)($query['page'] ?? 1));
        $limit = min(50, max(1, (int)($query['limit'] ?? 10)));

        return new self($q, $type, null, null, $page, $limit, 'relevance', $staffMode);
    }
}`,
  },
  {
    id: 'laravel',
    label: 'Laravel',
    lang: 'php',
    filename: 'SoftwareController.php',
    source: 'magazine-1c',
    caption: 'Каталог на Eloquent: фильтры, paginate с query string и ajax-пartial для SPA-подгрузки.',
    code: `public function catalog(Request $request)
{
    $query = Software::where('is_active', true);

    if ($request->filled('category') && $request->category !== 'all') {
        $query->where('category', $request->category);
    }

    if ($request->filled('search')) {
        $query->where('title', 'like', '%' . $request->search . '%');
    }

    $items = $query->latest()->paginate(12)->withQueryString();

    if ($request->ajax()) {
        return view('software.partials.items', compact('items'))->render();
    }

    return view('software.catalog', compact('items'));
}

public function show(Software $software): View
{
    return view('software.show', compact('software'));
}`,
  },
  {
    id: 'vue',
    label: 'Vue',
    lang: 'javascript',
    filename: 'useCatalogSearch.js',
    source: 'DevGuide · frontend',
    caption: 'Composable синхронизирует URL и API; устаревшие fetch отменяются через seq.',
    code: `const fetchItems = async () => {
  const seq = ++fetchSeq
  isLoading.value = true
  error.value = null
  try {
    const result = await fetchPage(currentPage.value, buildApiFilters())
    if (!alive || seq !== fetchSeq) return
    items.value = result.items
    totalPages.value = Math.max(1, result.pages || 1)
    totalCount.value = result.total
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value
      if (seq === fetchSeq) {
        syncUrl()
        await fetchItems()
      }
    }
  } catch {
    if (!alive || seq !== fetchSeq) return
    error.value = 'Не удалось загрузить данные'
    items.value = []
  } finally {
    if (alive && seq === fetchSeq) isLoading.value = false
  }
}`,
  },
  {
    id: 'js',
    label: 'JavaScript',
    lang: 'javascript',
    filename: 'searchRelevance.js',
    source: 'DevGuide · frontend',
    caption: 'Клиентский скоринг релевантности — быстрая переупорядочка без лишних запросов.',
    code: `export function scoreGuideRelevance(guide, query) {
  const q = norm(query)
  if (!q || q.length < 1) return 0

  const title = norm(guide?.title)
  const desc = norm(guide?.description || guide?.excerpt || guide?.summary)
  const tags = parseTags(guide?.tags)

  let score = 0

  if (title === q) score += 1000
  else if (title.startsWith(q)) score += 700
  else if (title.includes(q)) score += 500

  if (desc.includes(q)) score += 220

  for (const tag of tags) {
    if (tag === q) score += 350
    else if (tag.includes(q)) score += 180
  }

  return score
}`,
  },
  {
    id: 'ts',
    label: 'TypeScript',
    lang: 'typescript',
    filename: 'useScrollProgress.ts',
    source: 'phptrash.ru',
    caption: 'Сглаженный scroll progress — планеты не дёргаются на мобилке.',
    code: `const tick = () => {
  const diff = target - smooth.value
  if (Math.abs(diff) < 0.0004) {
    smooth.value = target
    looping = false
    return
  }
  const k = mobile.value ? 0.05 : 0.08
  smooth.value += diff * k
  raf = requestAnimationFrame(tick)
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
}`,
  },
  {
    id: 'css',
    label: 'CSS',
    lang: 'css',
    filename: 'glass + motion.css',
    source: 'phptrash.ru · DevGuide',
    caption: 'Glass с fallback и motion-токены с respect prefers-reduced-motion.',
    code: `:root {
  --glass: linear-gradient(165deg, rgba(36, 52, 88, 0.52), rgba(8, 14, 28, 0.58));
  --motion-base: 200ms;
  --motion-ease: cubic-bezier(0.22, 1, 0.36, 1);
}

.glass {
  background: var(--glass);
  backdrop-filter: blur(18px) saturate(1.4);
  border: 1px solid rgba(160, 210, 255, 0.18);
}

@supports not ((backdrop-filter: blur(1px))) {
  .glass {
    background: linear-gradient(165deg, rgba(28, 40, 68, 0.92), rgba(8, 14, 28, 0.88));
  }
}

@media (prefers-reduced-motion: reduce) {
  :root { --motion-base: 1ms; }
  .motion-page-enter-active { transition: none !important; }
}`,
  },
]
