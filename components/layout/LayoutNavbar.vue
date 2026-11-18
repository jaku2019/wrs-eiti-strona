<script setup lang="ts">
import type { PriorityNavItem } from '~/composables/usePriorityNav'

const route = useRoute()
const { openPalette } = useSearch()

const isHome = computed(() => route.path === '/' || route.path === '')

const router = useRouter()

const sectionItems = computed<PriorityNavItem[]>(() => {
  const hashHref = (id: string) => {
    // Respect NUXT_APP_BASE_URL on GitHub Pages.
    if (isHome.value) return `#${id}`
    return router.resolve({ path: '/', hash: `#${id}` }).href
  }
  return [
    { id: 'baza', label: 'Baza wiedzy', href: hashHref('baza'), kind: 'section' },
    { id: 'aktualnosci', label: 'Aktualności', href: hashHref('aktualnosci'), kind: 'section' },
    { id: 'kalendarz', label: 'Kalendarz', href: hashHref('kalendarz'), kind: 'section' },
    { id: 'kontakt', label: 'Kontakt', href: hashHref('kontakt'), kind: 'section' },
  ]
})

const pageItems: PriorityNavItem[] = [
  { id: 'sklad', label: 'Skład', href: '/sklad', kind: 'page' },
  { id: 'dokumenty', label: 'Dokumenty', href: '/dokumenty', kind: 'page' },
  { id: 'faq', label: 'FAQ', href: '/faq', kind: 'page' },
]

/** Sections + pages everywhere (as in the mockup); on subpages sections link to `/#…`. */
const navItems = computed<PriorityNavItem[]>(() => [...sectionItems.value, ...pageItems])

const sectionIds = computed(() =>
  isHome.value ? sectionItems.value.map((i) => i.id) : [],
)

const { activeId: spyId } = useScrollSpy(sectionIds, { enabled: isHome })

const {
  visibleItems,
  overflowItems,
  measure,
} = usePriorityNav(navItems)

const navEl = ref<HTMLElement | null>(null)
const moreWrap = ref<{ moreBtn?: HTMLButtonElement | null | { value?: HTMLButtonElement | null } } | null>(null)
const indicatorEl = ref<HTMLElement | null>(null)
const isMobile = ref(false)
const mobileOpen = ref(false)
const moreOpen = ref(false)

const activeHref = computed(() => {
  if (isHome.value && spyId.value) {
    return `#${spyId.value}`
  }
  return route.path
})

function itemIsActive(item: PriorityNavItem) {
  if (item.kind === 'section') {
    return isHome.value && spyId.value === item.id
  }
  return route.path === item.href || route.path.startsWith(`${item.href}/`)
}

/** Active target for the underline indicator (visible item or „Więcej”). */
const indicatorTarget = computed(() => {
  const activeVisible = visibleItems.value.find(itemIsActive)
  if (activeVisible) return { kind: 'item' as const, id: activeVisible.id }
  if (overflowItems.value.some(itemIsActive)) return { kind: 'more' as const, id: 'more' }
  if (!isHome.value) {
    const page = pageItems.find(itemIsActive)
    if (page && visibleItems.value.some((i) => i.id === page.id)) {
      return { kind: 'item' as const, id: page.id }
    }
    if (page && overflowItems.value.some((i) => i.id === page.id)) {
      return { kind: 'more' as const, id: 'more' }
    }
  }
  return null
})

function updateIndicator() {
  if (!import.meta.client || !navEl.value || !indicatorEl.value) return
  const target = indicatorTarget.value
  if (!target || isMobile.value) {
    indicatorEl.value.style.opacity = '0'
    return
  }

  let el: HTMLElement | null = null
  if (target.kind === 'item') {
    el = navEl.value.querySelector(`[data-nav-item="${target.id}"]`)
  } else {
    el = navEl.value.querySelector('[data-nav-more]')
  }

  if (!el) {
    indicatorEl.value.style.opacity = '0'
    return
  }

  const navRect = navEl.value.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  // Underline width = text width (not full hit area for page links with icon).
  const textEl = el.querySelector('[data-nav-label]') ?? el
  const textRect = textEl.getBoundingClientRect()
  const left = textRect.left - navRect.left
  const width = textRect.width

  indicatorEl.value.style.width = `${width}px`
  indicatorEl.value.style.transform = `translateX(${left}px)`
  indicatorEl.value.style.opacity = '1'
}

function remasure() {
  if (!import.meta.client) return
  isMobile.value = window.matchMedia('(max-width: 640px)').matches
  if (isMobile.value) {
    // All items go to mobile sheet; Priority+ unused.
    return
  }
  const rawMore = moreWrap.value?.moreBtn
  const moreBtn =
    rawMore && typeof rawMore === 'object' && 'value' in rawMore
      ? rawMore.value ?? null
      : (rawMore as HTMLButtonElement | null | undefined) ?? null
  measure(navEl.value, moreBtn)
  nextTick(updateIndicator)
}

function onSectionShortcut(event: KeyboardEvent) {
  if (!isHome.value || isMobile.value) return
  if (event.metaKey || event.ctrlKey || event.altKey) return
  const tag = (event.target as HTMLElement | null)?.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || (event.target as HTMLElement)?.isContentEditable) {
    return
  }
  const map: Record<string, string> = {
    '1': 'baza',
    '2': 'aktualnosci',
    '3': 'kalendarz',
    '4': 'kontakt',
  }
  const id = map[event.key]
  if (!id) return
  event.preventDefault()
  const el = document.getElementById(id)
  el?.scrollIntoView({ behavior: 'smooth' })
}

let ro: ResizeObserver | null = null

onMounted(() => {
  remasure()
  // Initial measure can run before layout/fonts settle — re-measure whenever
  // the row's available space changes.
  const row = navEl.value?.parentElement
  if (row && 'ResizeObserver' in window) {
    let last = 0
    ro = new ResizeObserver(([entry]) => {
      const w = Math.round(entry?.contentRect.width ?? 0)
      if (w === last) return
      last = w
      remasure()
    })
    ro.observe(row)
  }
  window.addEventListener('resize', remasure)
  window.addEventListener('keydown', onSectionShortcut)
  // Fonts can shift widths.
  document.fonts?.ready?.then(() => remasure())
})

onBeforeUnmount(() => {
  ro?.disconnect()
  window.removeEventListener('resize', remasure)
  window.removeEventListener('keydown', onSectionShortcut)
})

watch([indicatorTarget, visibleItems, overflowItems, () => route.fullPath], () => {
  nextTick(updateIndicator)
})

watch(isHome, () => nextTick(remasure))

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
    moreOpen.value = false
  },
)

const mobileMenuItems = computed(() => navItems.value)
</script>

<template>
  <header class="navbar">
    <div class="container navbar__inner">
      <NuxtLink to="/" class="brand" aria-label="WRS WEiTI — strona główna">
        <img
          class="brand__mark brand__mark--light"
          src="/brand/wrs-mark-color.svg"
          alt=""
          width="40"
          height="40"
        >
        <img
          class="brand__mark brand__mark--dark"
          src="/brand/wrs-mark-dark.svg"
          alt=""
          width="40"
          height="40"
        >
        <span class="brand__text">
          <strong>WRS</strong>
          <span>WEiTI</span>
        </span>
      </NuxtLink>

      <nav
        v-show="!isMobile"
        ref="navEl"
        class="navbar__nav"
        aria-label="Główna"
      >
        <template v-for="(item, index) in visibleItems" :key="item.id">
          <span
            v-if="index > 0 && visibleItems[index - 1]?.kind === 'section' && item.kind === 'page'"
            class="navbar__sep"
            data-nav-sep
            aria-hidden="true"
          />
          <NuxtLink
            v-if="item.kind === 'page'"
            :to="item.href"
            class="navbar__link navbar__link--page"
            :data-nav-item="item.id"
            :aria-current="itemIsActive(item) ? 'page' : undefined"
          >
            <span data-nav-label>{{ item.label }}</span>
            <UiIcon name="arrowUpRight" :size="14" />
          </NuxtLink>
          <a
            v-else
            :href="item.href"
            class="navbar__link"
            :data-nav-item="item.id"
            :aria-current="itemIsActive(item) ? 'true' : undefined"
          >
            <span data-nav-label>{{ item.label }}</span>
          </a>
        </template>

        <LayoutMoreMenu
          v-show="overflowItems.length > 0"
          ref="moreWrap"
          :items="overflowItems"
          :active-href="activeHref"
          v-model:open="moreOpen"
        />

        <span ref="indicatorEl" class="navbar__indicator" aria-hidden="true" />
      </nav>

      <div class="navbar__actions">
        <UiButton
          variant="icon"
          icon="search"
          tip="Szukaj · Ctrl K"
          aria-label="Szukaj (Ctrl K)"
          @click="openPalette()"
        />
        <LayoutThemeToggle />
        <LayoutMoreMenu
          v-if="isMobile"
          :items="mobileMenuItems"
          mobile
          :active-href="activeHref"
          v-model:open="mobileOpen"
        />
      </div>
    </div>
  </header>
</template>

<style scoped>
/* mockup: header.nav */
.navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  overflow-x: clip;
  border-bottom: 1px solid var(--line);
  background: color-mix(in oklab, var(--bg) 82%, transparent);
  backdrop-filter: blur(14px) saturate(1.3);
  -webkit-backdrop-filter: blur(14px) saturate(1.3);
  view-transition-name: site-navbar;
}

.navbar__inner {
  display: flex;
  align-items: center;
  gap: 28px;
  height: 68px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: var(--heading);
  text-decoration: none;
  flex-shrink: 0;
}

.brand__mark {
  width: 40px;
  height: 40px;
}

.brand__mark--dark {
  display: none;
}

:root[data-theme='dark'] .brand__mark--light {
  display: none;
}

:root[data-theme='dark'] .brand__mark--dark {
  display: block;
}

.brand__text {
  display: grid;
  line-height: 1.1;
  font-size: 11.5px;
  font-weight: 500;
  color: var(--muted);
}

.brand__text strong {
  font: 600 20px / 1 var(--font-display);
  color: var(--heading);
}

.navbar__nav {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  gap: 2px;
  overflow: hidden;
}

.navbar__link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 36px;
  padding: 0 12px;
  color: var(--muted);
  text-decoration: none;
  font-size: 14.5px;
  font-weight: 500;
  white-space: nowrap;
  border-radius: var(--r-sm);
  flex-shrink: 0;
  transition:
    color 0.2s,
    background 0.2s;
}

.navbar__link:hover {
  color: var(--heading);
  background: var(--tint);
}

.navbar__link[aria-current] {
  color: var(--heading);
}

.navbar__link--page :deep(.ui-icon) {
  opacity: 0.55;
  transition:
    opacity 0.2s,
    transform 0.3s var(--ease);
}

.navbar__link--page:hover :deep(.ui-icon) {
  opacity: 1;
  transform: translate(1px, -1px);
}

.navbar__sep {
  width: 1px;
  height: 18px;
  margin: 0 10px;
  background: var(--line);
  flex-shrink: 0;
}

/* kreska 2px pod samym tekstem, 5px pod linią bazową */
.navbar__indicator {
  position: absolute;
  left: 0;
  bottom: 4px;
  height: 2px;
  border-radius: 2px;
  background: var(--accent);
  opacity: 0;
  pointer-events: none;
  transition:
    transform 0.5s var(--ease),
    width 0.5s var(--ease),
    opacity 0.25s;
}

.navbar__actions {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .navbar__inner {
    gap: 10px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .navbar__link,
  .navbar__indicator {
    transition: none;
  }
}
</style>
