import { stripAppBase, withAppBase } from '~/utils/siteUrl'

export type SearchHit = {
  id: string
  title: string
  description: string
  href: string
  group: 'Baza wiedzy' | 'FAQ' | 'Aktualności' | 'Strony'
}

/** Quick links when the query is empty (not from Pagefind). */
const QUICK_LINKS: SearchHit[] = [
  {
    id: 'page-kb',
    title: 'Baza wiedzy',
    description: 'Artykuły i poradniki dla studentów EiTI.',
    href: '/baza-wiedzy',
    group: 'Strony',
  },
  {
    id: 'page-faq',
    title: 'FAQ',
    description: 'Najczęstsze pytania o samorząd.',
    href: '/faq',
    group: 'Strony',
  },
  {
    id: 'page-news',
    title: 'Aktualności',
    description: 'Ogłoszenia i informacje z WRS.',
    href: '/aktualnosci',
    group: 'Strony',
  },
  {
    id: 'page-sklad',
    title: 'Skład samorządu',
    description: 'Osoby i przedstawiciele samorządu WEiTI.',
    href: '/sklad',
    group: 'Strony',
  },
  {
    id: 'page-dokumenty',
    title: 'Dokumenty',
    description: 'Regulaminy, uchwały i protokoły.',
    href: '/dokumenty',
    group: 'Strony',
  },
  {
    id: 'page-kontakt',
    title: 'Kontakt',
    description: 'Jak zgłosić sprawę do samorządu.',
    href: '/#kontakt',
    group: 'Strony',
  },
]

type PagefindSubResult = {
  title: string
  url: string
  excerpt?: string
  plain_excerpt?: string
}

type PagefindResultData = {
  url: string
  excerpt?: string
  plain_excerpt?: string
  meta?: Record<string, string | undefined>
  sub_results?: PagefindSubResult[]
}

type PagefindSearchApi = {
  options: (opts: Record<string, unknown>) => Promise<void>
  search: (
    query: string,
  ) => Promise<{ results: Array<{ id: string; data: () => Promise<PagefindResultData> }> }>
  init?: () => Promise<void>
}

const GROUP_ORDER: SearchHit['group'][] = [
  'Baza wiedzy',
  'FAQ',
  'Aktualności',
  'Strony',
]

const MAX_HITS = 24

function plainText(htmlOrText: string | undefined): string {
  if (!htmlOrText) return ''
  return htmlOrText
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeHref(url: string, baseURL: string): string {
  try {
    if (/^https?:\/\//i.test(url)) {
      const parsed = new URL(url)
      url = parsed.pathname + parsed.hash
    }
  } catch {
    // keep as-is
  }
  const [pathPart, hash = ''] = url.split('#')
  const path = stripAppBase(pathPart || '/', baseURL) || '/'
  // Drop trailing slash except for root (Nuxt routes are slash-free).
  const cleaned =
    path.length > 1 && path.endsWith('/') ? path.replace(/\/+$/, '') : path
  return hash ? `${cleaned}#${hash}` : cleaned
}

function groupFromMeta(
  meta: PagefindResultData['meta'],
  href: string,
): SearchHit['group'] {
  const raw = (meta?.group || '').trim()
  if (
    raw === 'Baza wiedzy' ||
    raw === 'FAQ' ||
    raw === 'Aktualności' ||
    raw === 'Strony'
  ) {
    return raw
  }
  if (href.startsWith('/baza-wiedzy')) return 'Baza wiedzy'
  if (href.startsWith('/faq')) return 'FAQ'
  if (href.startsWith('/aktualnosci')) return 'Aktualności'
  return 'Strony'
}

function hitsFromPage(page: PagefindResultData, baseURL: string): SearchHit[] {
  const group = groupFromMeta(page.meta, normalizeHref(page.url, baseURL))
  const pageTitle = page.meta?.title?.trim() || 'Bez tytułu'
  const pageHref = normalizeHref(page.url, baseURL)

  // FAQ: prefer anchored sub-results (questions / sections) over the whole page.
  if (group === 'FAQ' && page.sub_results?.length) {
    const anchored = page.sub_results.filter((sr) => sr.url.includes('#'))
    if (anchored.length) {
      return anchored.slice(0, 8).map((sr, i) => {
        const href = normalizeHref(sr.url, baseURL)
        return {
          id: `pf-${href}-${i}`,
          title: sr.title || pageTitle,
          description: plainText(sr.plain_excerpt || sr.excerpt) || pageTitle,
          href,
          group,
        }
      })
    }
  }

  // Other pages: one hit; use best matching sub-result excerpt when present.
  const bestSub = page.sub_results?.find((sr) => sr.url.includes('#'))
  const href = bestSub ? normalizeHref(bestSub.url, baseURL) : pageHref
  const title = bestSub?.title && group !== 'Aktualności' ? bestSub.title : pageTitle
  const description =
    plainText(
      bestSub?.plain_excerpt ||
        bestSub?.excerpt ||
        page.plain_excerpt ||
        page.excerpt,
    ) || (page.meta?.summary || '')

  return [
    {
      id: `pf-${href}`,
      title,
      description,
      href,
      group,
    },
  ]
}

export function useSearch() {
  const open = useState('wrs-search-open', () => false)
  const query = useState('wrs-search-query', () => '')
  const activeIndex = useState('wrs-search-active', () => 0)
  const results = useState<SearchHit[]>('wrs-search-results', () => [...QUICK_LINKS])
  const status = useState<'idle' | 'loading' | 'ready' | 'missing' | 'error'>(
    'wrs-search-status',
    () => 'idle',
  )

  const config = useRuntimeConfig()
  const baseURL = config.app.baseURL || '/'

  let pagefindApi: PagefindSearchApi | null = null
  let pagefindPromise: Promise<PagefindSearchApi | null> | null = null
  let searchSeq = 0
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  async function loadPagefind(): Promise<PagefindSearchApi | null> {
    if (!import.meta.client) return null
    if (pagefindApi) return pagefindApi
    if (pagefindPromise) return pagefindPromise

    pagefindPromise = (async () => {
      // Absolute URL + Function import so Vite/Rollup do not try to bundle the
      // generate-time Pagefind artifact (missing in `nuxt dev` until generate).
      const scriptUrl = new URL(
        withAppBase('/pagefind/pagefind.js', baseURL),
        window.location.href,
      ).href
      try {
        const dynamicImport = new Function(
          'u',
          'return import(u)',
        ) as (u: string) => Promise<PagefindSearchApi>
        const mod = await dynamicImport(scriptUrl)
        await mod.options({
          baseUrl: baseURL,
          excerptLength: 28,
          excerptEllipsis: '…',
        })
        if (typeof mod.init === 'function') await mod.init()
        pagefindApi = mod
        status.value = 'ready'
        return mod
      } catch {
        status.value = 'missing'
        pagefindApi = null
        return null
      }
    })()

    return pagefindPromise
  }

  async function runSearch(rawQuery: string) {
    const q = rawQuery.trim()
    const seq = ++searchSeq

    if (!q) {
      results.value = [...QUICK_LINKS]
      activeIndex.value = 0
      return
    }

    status.value = status.value === 'missing' ? 'missing' : 'loading'
    const api = await loadPagefind()
    if (seq !== searchSeq) return

    if (!api) {
      results.value = []
      activeIndex.value = 0
      return
    }

    try {
      const response = await api.search(q)
      if (seq !== searchSeq) return

      const loaded = await Promise.all(
        response.results.slice(0, 12).map((r) => r.data()),
      )
      if (seq !== searchSeq) return

      const mapped = loaded.flatMap((page) => hitsFromPage(page, baseURL))
      // Dedupe by href, keep order.
      const seen = new Set<string>()
      const unique: SearchHit[] = []
      for (const hit of mapped) {
        if (seen.has(hit.href)) continue
        seen.add(hit.href)
        unique.push(hit)
        if (unique.length >= MAX_HITS) break
      }

      results.value = unique
      activeIndex.value = 0
      status.value = 'ready'
    } catch {
      if (seq !== searchSeq) return
      results.value = []
      status.value = 'error'
    }
  }

  function scheduleSearch(value: string) {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      void runSearch(value)
    }, 140)
  }

  watch(
    query,
    (value) => {
      scheduleSearch(value)
    },
  )

  const grouped = computed(() => {
    const map = new Map<SearchHit['group'], SearchHit[]>()
    for (const group of GROUP_ORDER) map.set(group, [])
    for (const hit of results.value) {
      const list = map.get(hit.group) ?? []
      list.push(hit)
      map.set(hit.group, list)
    }
    return GROUP_ORDER.filter((g) => (map.get(g)?.length ?? 0) > 0).map(
      (group) => ({ group, items: map.get(group) ?? [] }),
    )
  })

  function openPalette() {
    open.value = true
    query.value = ''
    activeIndex.value = 0
    results.value = [...QUICK_LINKS]
    void loadPagefind()
  }

  function closePalette() {
    open.value = false
    query.value = ''
    activeIndex.value = 0
    results.value = [...QUICK_LINKS]
  }

  function togglePalette() {
    if (open.value) closePalette()
    else openPalette()
  }

  function moveActive(delta: number) {
    const len = results.value.length
    if (!len) {
      activeIndex.value = 0
      return
    }
    activeIndex.value = (activeIndex.value + delta + len) % len
  }

  function activeHit(): SearchHit | null {
    return results.value[activeIndex.value] ?? null
  }

  watch(results, () => {
    if (activeIndex.value >= results.value.length) {
      activeIndex.value = Math.max(0, results.value.length - 1)
    }
  })

  /** Call once from the default layout so Ctrl/⌘ K is not double-bound. */
  function bindGlobalHotkeys() {
    if (!import.meta.client) return

    const onKeydown = (event: KeyboardEvent) => {
      const isModK = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k'
      if (isModK) {
        event.preventDefault()
        togglePalette()
        return
      }

      if (!open.value) return

      if (event.key === 'Escape') {
        event.preventDefault()
        closePalette()
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        moveActive(1)
        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        moveActive(-1)
        return
      }

      if (event.key === 'Enter') {
        const hit = activeHit()
        if (!hit) return
        event.preventDefault()
        closePalette()
        navigateTo(hit.href)
      }
    }

    onMounted(() => {
      window.addEventListener('keydown', onKeydown)
    })
    onBeforeUnmount(() => {
      window.removeEventListener('keydown', onKeydown)
      if (debounceTimer) clearTimeout(debounceTimer)
    })
  }

  return {
    open: computed(() => open.value),
    query,
    activeIndex,
    results: computed(() => results.value),
    grouped,
    status: computed(() => status.value),
    openPalette,
    closePalette,
    togglePalette,
    moveActive,
    activeHit,
    bindGlobalHotkeys,
  }
}
