export type PriorityNavItem = {
  id: string
  label: string
  href: string
  /** Section anchors on home; page links otherwise. */
  kind: 'section' | 'page'
  external?: boolean
}

/**
 * Priority+: hide overflowing items from the end (pages first) into overflow.
 * Measures against a flex row; call `measure()` after mount / resize / font load.
 */
export function usePriorityNav(allItems: MaybeRefOrGetter<PriorityNavItem[]>) {
  // Start with everything visible until the first measure() pass.
  const visibleIds = ref<string[]>(toValue(allItems).map((i) => i.id))
  const overflowIds = ref<string[]>([])
  const measuring = ref(false)

  watch(
    () => toValue(allItems).map((i) => i.id).join('|'),
    () => {
      // Reset on nav set change (home ↔ subpage); measure() will refine.
      visibleIds.value = toValue(allItems).map((i) => i.id)
      overflowIds.value = []
    },
  )

  const visibleItems = computed(() => {
    const items = toValue(allItems)
    const set = new Set(visibleIds.value)
    return items.filter((i) => set.has(i.id))
  })

  const overflowItems = computed(() => {
    const items = toValue(allItems)
    const set = new Set(overflowIds.value)
    return items.filter((i) => set.has(i.id))
  })

  /**
   * Hide from the end. Prefer hiding `page` items before `section` items
   * when choosing which end items to drop (design: subpages first).
   */
  function orderForHiding(items: PriorityNavItem[]): PriorityNavItem[] {
    // Build hide order: last page, previous page, … then last section, …
    const pages = items.filter((i) => i.kind === 'page')
    const sections = items.filter((i) => i.kind === 'section')
    return [...pages].reverse().concat([...sections].reverse())
  }

  function measure(navEl: HTMLElement | null, moreEl: HTMLElement | null) {
    if (!import.meta.client || !navEl) return

    const items = toValue(allItems)
    if (!items.length) {
      visibleIds.value = []
      overflowIds.value = []
      return
    }

    measuring.value = true

    // Reset: show everything to measure natural widths.
    visibleIds.value = items.map((i) => i.id)
    overflowIds.value = []

    nextTick(() => {
      const available = navEl.clientWidth
      const children = Array.from(
        navEl.querySelectorAll<HTMLElement>('[data-nav-item]'),
      )

      const widths = new Map<string, number>()
      for (const child of children) {
        const id = child.dataset.navItem
        if (!id) continue
        widths.set(id, child.getBoundingClientRect().width)
      }

      const gap = parseFloat(getComputedStyle(navEl).columnGap || getComputedStyle(navEl).gap || '0') || 0
      const moreWidth = moreEl
        ? Math.ceil(moreEl.getBoundingClientRect().width) || 88
        : 88

      // Separator between sections and pages (incl. margins) — present only
      // when both kinds stay visible.
      const sepEl = navEl.querySelector<HTMLElement>('[data-nav-sep]')
      const sepWidth = sepEl
        ? sepEl.getBoundingClientRect().width
          + parseFloat(getComputedStyle(sepEl).marginLeft || '0')
          + parseFloat(getComputedStyle(sepEl).marginRight || '0')
          + gap
        : 0
      const kindOf = new Map(items.map((i) => [i.id, i.kind]))

      const sumVisible = (ids: string[]) => {
        let total = 0
        ids.forEach((id, index) => {
          total += widths.get(id) ?? 0
          if (index > 0) total += gap
        })
        const kinds = new Set(ids.map((id) => kindOf.get(id)))
        if (kinds.has('section') && kinds.has('page')) total += sepWidth
        return total
      }

      let visible = items.map((i) => i.id)
      let overflow: string[] = []

      const fits = (ids: string[], withMore: boolean) => {
        const used = sumVisible(ids) + (withMore ? gap + moreWidth : 0)
        return used <= available + 0.5
      }

      if (!fits(visible, false)) {
        const hideOrder = orderForHiding(items)
        for (const item of hideOrder) {
          if (fits(visible, overflow.length > 0)) break
          if (!visible.includes(item.id)) continue
          visible = visible.filter((id) => id !== item.id)
          overflow = [item.id, ...overflow]
          if (fits(visible, true)) break
        }
      }

      // Keep relative order of originals in overflow.
      const orderIndex = new Map(items.map((i, idx) => [i.id, idx]))
      overflow.sort((a, b) => (orderIndex.get(a) ?? 0) - (orderIndex.get(b) ?? 0))

      visibleIds.value = visible
      overflowIds.value = overflow
      measuring.value = false
    })
  }

  return {
    visibleItems,
    overflowItems,
    visibleIds,
    overflowIds,
    measuring,
    measure,
  }
}
