<script setup lang="ts">
import type { PriorityNavItem } from '~/composables/usePriorityNav'

const props = defineProps<{
  items: PriorityNavItem[]
  /** When true, render as full-screen mobile sheet (≤640). */
  mobile?: boolean
  activeHref?: string | null
  open?: boolean
}>()

const emit = defineEmits<{
  close: []
  'update:open': [value: boolean]
}>()

const moreBtn = ref<HTMLButtonElement | null>(null)
const sheet = ref<HTMLElement | null>(null)
const popoverId = 'nav-more-popover'
const popoverSupported = ref(false)

const isOpen = computed({
  get: () => props.open ?? false,
  set: (v: boolean) => emit('update:open', v),
})

const route = useRoute()
const router = useRouter()
const nuxtApp = useNuxtApp()

function isActive(item: PriorityNavItem) {
  if (!props.activeHref) return false
  if (item.kind === 'section') {
    return props.activeHref === `#${item.id}`
  }
  return props.activeHref === item.href || props.activeHref.startsWith(`${item.href}/`)
}

function close() {
  isOpen.value = false
  emit('close')
  // Popover API
  const el = document.getElementById(popoverId) as HTMLElement & { hidePopover?: () => void } | null
  el?.hidePopover?.()
}

function onPopoverToggle(event: Event) {
  const e = event as ToggleEvent
  isOpen.value = e.newState === 'open'
}

function toggleDesktopFallback(event: MouseEvent) {
  // When Popover API is unavailable, popovertarget is inert — toggle manually.
  const el = document.getElementById(popoverId) as HTMLElement & {
    togglePopover?: () => void
  } | null
  if (el?.togglePopover) {
    // Native popovertarget already toggles; avoid double-toggle.
    return
  }
  event.preventDefault()
  isOpen.value = !isOpen.value
}

/**
 * Mobile: a click that changes the page keeps the sheet open — the navbar
 * closes it on route change, i.e. inside the page view transition, so the
 * sheet leaves as one animation (::view-transition-old(nav-sheet)) instead
 * of its clip-path collapse fighting the page crossfade.
 */
const navigating = ref(false)
const instantClose = ref(false)

function onItemClick(item: PriorityNavItem, event: MouseEvent) {
  const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0
  if (
    props.mobile &&
    !modified &&
    !item.href.startsWith('#') &&
    'startViewTransition' in document &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    router.resolve(item.href).fullPath !== route.fullPath
  ) {
    navigating.value = true
    // The old page sat hidden under the sheet — don't let it fade through.
    const root = document.documentElement
    root.classList.add('vt-from-sheet')
    nuxtApp.hooks.hookOnce('page:view-transition:start', (transition) => {
      transition.finished.catch(() => {}).finally(() => root.classList.remove('vt-from-sheet'))
    })
    // Safety net: navigation blocked or failed → close the usual way.
    window.setTimeout(() => {
      root.classList.remove('vt-from-sheet')
      if (navigating.value) {
        navigating.value = false
        close()
      }
    }, 2000)
    return
  }
  close()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) {
    event.preventDefault()
    close()
    moreBtn.value?.focus()
  }
}

watch(
  () => props.open,
  (open) => {
    if (!import.meta.client || !props.mobile) return
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open && navigating.value) {
      navigating.value = false
      instantClose.value = true
      requestAnimationFrame(() => requestAnimationFrame(() => {
        instantClose.value = false
      }))
    }
  },
)

onMounted(() => {
  popoverSupported.value =
    typeof HTMLElement !== 'undefined' &&
    typeof HTMLElement.prototype.hidePopover === 'function'
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  if (import.meta.client) document.body.style.overflow = ''
})

defineExpose({ moreBtn, sheet })
</script>

<template>
  <!-- Desktop / tablet: Popover „Więcej” -->
  <div v-if="!mobile" class="more">
    <button
      ref="moreBtn"
      type="button"
      class="more__btn"
      :class="{ 'more__btn--active': items.some(isActive) }"
      popovertarget="nav-more-popover"
      :aria-expanded="isOpen ? 'true' : 'false'"
      aria-haspopup="true"
      aria-controls="nav-more-popover"
      data-nav-more
      @click="toggleDesktopFallback"
    >
      Więcej
      <UiIcon name="chevronDown" :size="14" />
    </button>
    <div
      :id="popoverId"
      popover="auto"
      class="more__panel"
      :class="{ 'more__panel--fallback-open': isOpen && !popoverSupported }"
      @toggle="onPopoverToggle"
    >
      <ul class="more__list" role="list">
        <li v-for="item in items" :key="item.id">
          <a
            v-if="item.href.startsWith('#')"
            :href="item.href"
            class="more__link"
            :aria-current="isActive(item) ? 'true' : undefined"
            @click="onItemClick(item, $event)"
          >
            {{ item.label }}
          </a>
          <NuxtLink
            v-else
            :to="item.href"
            class="more__link"
            :aria-current="isActive(item) ? (item.kind === 'page' ? 'page' : 'true') : undefined"
            @click="onItemClick(item, $event)"
          >
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>

  <!-- Mobile: full-screen circle reveal -->
  <div v-else class="mobile">
    <button
      ref="moreBtn"
      type="button"
      class="mobile__toggle"
      :aria-expanded="isOpen ? 'true' : 'false'"
      aria-controls="nav-mobile-sheet"
      data-nav-more
      @click="isOpen = !isOpen"
    >
      <span>{{ isOpen ? 'Zamknij' : 'Menu' }}</span>
      <UiIcon :name="isOpen ? 'x' : 'menu'" :size="18" />
    </button>

    <Teleport to="body">
    <div
      id="nav-mobile-sheet"
      ref="sheet"
      class="mobile__sheet"
      :class="{ 'mobile__sheet--open': isOpen, 'mobile__sheet--instant': instantClose }"
      role="dialog"
      aria-modal="true"
      aria-label="Menu nawigacji"
      :inert="!isOpen"
    >
      <nav class="mobile__nav" aria-label="Menu mobilne">
        <ul class="mobile__list" role="list">
          <li
            v-for="(item, index) in items"
            :key="item.id"
            class="mobile__item"
            :style="{ '--i': index }"
          >
            <a
              v-if="item.href.startsWith('#')"
              :href="item.href"
              class="mobile__link"
              :aria-current="isActive(item) ? 'true' : undefined"
              @click="onItemClick(item, $event)"
            >
              {{ item.label }}
            </a>
            <NuxtLink
              v-else
              :to="item.href"
              class="mobile__link"
              :aria-current="isActive(item) ? (item.kind === 'page' ? 'page' : 'true') : undefined"
              @click="onItemClick(item, $event)"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
    </Teleport>
  </div>
</template>

<style scoped>
.more {
  position: relative;
  flex-shrink: 0;
}

.more__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  height: 36px;
  padding: 0 0.55rem;
  border: 0;
  border-radius: var(--r-sm);
  background: transparent;
  color: var(--text);
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.more__btn:hover,
.more__btn--active {
  color: var(--link);
}

.more__panel {
  margin: 0;
  padding: 0.4rem;
  min-width: 11rem;
  border: 1px solid var(--line);
  border-radius: var(--r);
  background: var(--surface);
  color: var(--text);
  box-shadow: 0 12px 32px color-mix(in srgb, var(--grafit-deep) 12%, transparent);

  /* Anchor near button when Popover API supports it */
  position-anchor: --nav-more;
}

/* Fallback when Popover API is missing */
.more__panel--fallback-open {
  position: absolute;
  top: calc(100% + 0.35rem);
  right: 0;
  z-index: 60;
  display: block;
}

.more__btn {
  anchor-name: --nav-more;
}

@supports (position-area: block-end span-inline-end) {
  .more__panel:popover-open {
    position-area: block-end span-inline-end;
    margin-top: 0.35rem;
  }
}

.more__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.more__link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.55rem 0.65rem;
  border-radius: var(--r-sm);
  color: var(--text);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
}

.more__link:hover,
.more__link[aria-current] {
  background: var(--tint);
  color: var(--link);
}

/* —— Mobile sheet —— */
.mobile__toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  height: 40px;
  padding: 0 0.75rem;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: transparent;
  color: var(--text);
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  z-index: 60;
}

/* Teleported to <body>: the header's backdrop-filter would otherwise make it
   the containing block and clip the sheet to the 68px bar. Sits under the
   sticky header (z 50) so the „Zamknij” toggle stays visible. */
.mobile__sheet {
  position: fixed;
  inset: 68px 0 0;
  z-index: 45;
  display: grid;
  align-content: safe center;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 1.5rem var(--gutter) 2rem;
  background: var(--bg);
  clip-path: circle(0 at calc(100% - 2.5rem) 0);
  transition: clip-path 0.55s cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;
  visibility: hidden;
}

.mobile__sheet--open {
  clip-path: circle(150% at calc(100% - 2.5rem) 0);
  pointer-events: auto;
  visibility: visible;
  /* own snapshot in page view transitions (animated in motion.css) */
  view-transition-name: nav-sheet;
}

/* closed by a route change inside a view transition — the snapshot animates */
.mobile__sheet--instant,
.mobile__sheet--instant .mobile__item {
  transition: none;
}

@starting-style {
  .mobile__sheet--open {
    clip-path: circle(0 at calc(100% - 2.5rem) 0);
  }
}

.mobile__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.35rem;
}

.mobile__item {
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
  transition-delay: calc(var(--i, 0) * 40ms + 80ms);
}

.mobile__sheet--open .mobile__item {
  opacity: 1;
  transform: none;
}

.mobile__link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.65rem 0;
  color: var(--heading);
  text-decoration: none;
  font-family: var(--font-display);
  font-size: clamp(28px, 8vw, 40px);
  font-weight: 500;
  letter-spacing: -0.02em;
  border-bottom: 1px solid var(--line);
}

.mobile__link[aria-current] {
  color: var(--link);
}

@media (prefers-reduced-motion: reduce) {
  .mobile__sheet,
  .mobile__item {
    transition: none;
  }

  .mobile__sheet {
    clip-path: none;
    opacity: 0;
  }

  .mobile__sheet--open {
    opacity: 1;
  }

  .mobile__item {
    transform: none;
    opacity: 1;
  }
}
</style>
