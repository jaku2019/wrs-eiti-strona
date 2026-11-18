/**
 * Scroll-spy: active section via IntersectionObserver.
 * rootMargin matches design system: -35% top / -60% bottom.
 * Pass `stateKey` when multiple spies coexist (navbar vs KB TOC).
 */
export function useScrollSpy(
  sectionIds: MaybeRefOrGetter<string[]>,
  options?: {
    enabled?: MaybeRefOrGetter<boolean>
    stateKey?: string
  },
) {
  const activeId = useState<string | null>(
    options?.stateKey ?? 'wrs-scroll-spy-active',
    () => null,
  )

  onMounted(() => {
    if (!import.meta.client) return

    let observer: IntersectionObserver | null = null

    const teardown = () => {
      observer?.disconnect()
      observer = null
    }

    const setup = () => {
      teardown()
      const enabled = toValue(options?.enabled ?? true)
      const ids = toValue(sectionIds)
      if (!enabled || !ids.length) {
        activeId.value = null
        return
      }

      const elements = ids
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => !!el)

      if (!elements.length) {
        activeId.value = null
        return
      }

      const visible = new Map<string, number>()

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const id = entry.target.id
            if (entry.isIntersecting) {
              visible.set(id, entry.intersectionRatio)
            } else {
              visible.delete(id)
            }
          }

          if (!visible.size) {
            // Above the first section (hero): nothing active — as in the mockup.
            const first = elements[0]
            if (first && first.getBoundingClientRect().top > window.innerHeight * 0.35) {
              activeId.value = null
            }
            return
          }

          // Prefer the topmost matching section among currently intersecting.
          let best: string | null = null
          let bestTop = Infinity
          for (const id of visible.keys()) {
            const el = document.getElementById(id)
            if (!el) continue
            const top = el.getBoundingClientRect().top
            if (top < bestTop) {
              bestTop = top
              best = id
            }
          }
          if (best) activeId.value = best
        },
        {
          root: null,
          rootMargin: '-35% 0px -60% 0px',
          threshold: [0, 0.1, 0.25, 0.5, 1],
        },
      )

      for (const el of elements) observer.observe(el)

      // Initial: first section near viewport top, else none.
      const firstVisible = elements.find((el) => {
        const rect = el.getBoundingClientRect()
        return rect.top < window.innerHeight * 0.55 && rect.bottom > window.innerHeight * 0.2
      })
      activeId.value = firstVisible?.id ?? null
    }

    setup()

    watch(
      () => [toValue(sectionIds), toValue(options?.enabled ?? true)] as const,
      () => setup(),
      { deep: true },
    )

    onBeforeUnmount(teardown)
  })

  return {
    activeId: computed(() => activeId.value),
  }
}
