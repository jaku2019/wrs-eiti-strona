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

/** On home: sections + pages. On subpages: pages only (sections still reachable via logo/home). */
const navItems = computed<PriorityNavItem[]>(() =>
  isHome.value ? [...sectionItems.value, ...pageItems] : [...pageItems],
)

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

onMounted(() => {
  remasure()
  window.addEventListener('resize', remasure)
  window.addEventListener('keydown', onSectionShortcut)
  // Fonts can shift widths.
  document.fonts?.ready?.then(() => remasure())
})

onBeforeUnmount(() => {
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
            <UiIcon name="externalLink" :size="12" />
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
.navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid var(--line);
  background: color-mix(in srgb, var(--bg) 82%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  view-transition-name: site-navbar;
}

.navbar__inner {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: 64px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  color: inherit;
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
  display: flex;
  flex-direction: column;
  line-height: 1.1;
  font-size: 13px;
}

.brand__text strong {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
}

.navbar__nav {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  gap: 0.15rem;
  margin-inline: 0.5rem 0.75rem;
  overflow: hidden;
}

.navbar__link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  height: 36px;
  padding: 0 0.55rem;
  color: var(--text);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  border-radius: var(--r-sm);
  flex-shrink: 0;
}

.navbar__link:hover,
.navbar__link[aria-current] {
  color: var(--link);
}

.navbar__link--page :deep(.ui-icon) {
  opacity: 0.7;
}

.navbar__sep {
  width: 1px;
  height: 16px;
  margin-inline: 0.35rem;
  background: var(--line);
  flex-shrink: 0;
}

.navbar__indicator {
  position: absolute;
  left: 0;
  bottom: 4px;
  height: 2px;
  border-radius: 999px;
  background: var(--link);
  opacity: 0;
  pointer-events: none;
  transition:
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    width 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.2s ease;
}

.navbar__actions {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-left: auto;
  flex-shrink: 0;
}

@media (prefers-reduced-motion: reduce) {
  .navbar__indicator {
    transition: none;
  }
}
</style>
