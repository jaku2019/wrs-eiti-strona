export type SearchHit = {
  id: string
  title: string
  description: string
  href: string
  group: 'Baza wiedzy' | 'FAQ' | 'Aktualności' | 'Strony'
}

/** Static placeholder hits until Pagefind (A5). */
const STATIC_HITS: SearchHit[] = [
  {
    id: 'kb-wniosek',
    title: 'Przykładowy wniosek',
    description: 'TODO(treść): artykuł z bazy wiedzy — przykład CMS.',
    href: '/baza-wiedzy',
    group: 'Baza wiedzy',
  },
  {
    id: 'faq-wrs',
    title: 'Czym jest WRS?',
    description: 'TODO(treść): krótkie wyjaśnienie roli samorządu.',
    href: '/faq',
    group: 'FAQ',
  },
  {
    id: 'news-przyklad',
    title: 'Przykładowa aktualność',
    description: 'TODO(treść): zajawka przykładowego wpisu.',
    href: '/aktualnosci',
    group: 'Aktualności',
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

function normalize(text: string) {
  return text
    .toLocaleLowerCase('pl')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

export function useSearch() {
  const open = useState('wrs-search-open', () => false)
  const query = useState('wrs-search-query', () => '')
  const activeIndex = useState('wrs-search-active', () => 0)

  const results = computed(() => {
    const q = normalize(query.value.trim())
    if (!q) return STATIC_HITS
    return STATIC_HITS.filter((hit) => {
      const hay = normalize(`${hit.title} ${hit.description} ${hit.group}`)
      return hay.includes(q)
    })
  })

  const grouped = computed(() => {
    const map = new Map<SearchHit['group'], SearchHit[]>()
    for (const hit of results.value) {
      const list = map.get(hit.group) ?? []
      list.push(hit)
      map.set(hit.group, list)
    }
    return [...map.entries()].map(([group, items]) => ({ group, items }))
  })

  function openPalette() {
    open.value = true
    query.value = ''
    activeIndex.value = 0
  }

  function closePalette() {
    open.value = false
    query.value = ''
    activeIndex.value = 0
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
    })
  }

  return {
    open: computed(() => open.value),
    query,
    activeIndex,
    results,
    grouped,
    openPalette,
    closePalette,
    togglePalette,
    moveActive,
    activeHit,
    bindGlobalHotkeys,
    /** Exposed for A5 — swap static list for Pagefind. */
    staticHits: STATIC_HITS,
  }
}
