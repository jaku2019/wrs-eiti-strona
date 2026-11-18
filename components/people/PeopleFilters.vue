<script setup lang="ts">
import type { SkladGrupa, SkladOsoba } from '~/utils/sklad'

const props = defineProps<{
  grupy: SkladGrupa[]
  osoby: SkladOsoba[]
  modelValue: string
  query: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:query': [value: string]
}>()

const stickyRoot = ref<HTMLElement | null>(null)
const stuck = ref(false)
let observer: IntersectionObserver | null = null

const counts = computed(() => {
  const map = new Map<string, number>()
  for (const g of props.grupy) map.set(g.id, 0)
  for (const o of props.osoby) {
    map.set(o.grupa, (map.get(o.grupa) ?? 0) + 1)
  }
  return map
})

const chips = computed(() => [
  { id: 'wszyscy', label: 'Wszyscy', count: props.osoby.length },
  ...props.grupy.map((g) => ({
    id: g.id,
    label: g.label,
    count: counts.value.get(g.id) ?? 0,
  })),
])

onMounted(() => {
  if (!import.meta.client || !stickyRoot.value) return
  const sentinel = stickyRoot.value.querySelector('[data-sticky-sentinel]')
  if (!sentinel) return
  observer = new IntersectionObserver(
    ([entry]) => {
      stuck.value = Boolean(entry && !entry.isIntersecting)
    },
    { threshold: [1], rootMargin: '-69px 0px 0px 0px' },
  )
  observer.observe(sentinel)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <div ref="stickyRoot" class="filters-wrap">
    <div data-sticky-sentinel class="filters-sentinel" aria-hidden="true" />
    <div
      class="filters"
      :class="{ 'filters--stuck': stuck }"
      role="search"
      aria-label="Filtry składu"
    >
      <div class="filters__inner container">
        <div class="filters__chips" role="list">
          <UiChip
            v-for="chip in chips"
            :key="chip.id"
            role="listitem"
            :active="modelValue === chip.id"
            :aria-pressed="modelValue === chip.id"
            @click="emit('update:modelValue', chip.id)"
          >
            {{ chip.label }}
            <span class="filters__count">{{ chip.count }}</span>
          </UiChip>
        </div>
        <label class="filters__search">
          <span class="visually-hidden">Szukaj osoby lub funkcji</span>
          <UiIcon
            name="search"
            :size="16"
            class="filters__search-icon"
          />
          <input
            :value="query"
            type="search"
            name="q"
            autocomplete="off"
            placeholder="Szukaj osoby lub funkcji…"
            @input="emit('update:query', ($event.target as HTMLInputElement).value)"
          >
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* mockup: .toolbar / .chips / .search (sklad.html) */
.filters-wrap {
  display: contents;
}

.filters-sentinel {
  height: 1px;
  margin-bottom: -1px;
  pointer-events: none;
}

.filters {
  position: sticky;
  top: 68px;
  z-index: 20;
  padding: 12px 0;
  background: color-mix(in oklab, var(--bg) 88%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

.filters--stuck {
  border-bottom-color: var(--line);
}

.filters__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.filters__chips {
  display: flex;
  flex-wrap: nowrap;
  gap: 6px;
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
}

.filters__chips::-webkit-scrollbar {
  display: none;
}

.filters__count {
  margin-left: 6px;
  opacity: 0.55;
  font-variant-numeric: tabular-nums;
}

.filters__search {
  position: relative;
  width: min(260px, 100%);
}

.filters__search-icon {
  position: absolute;
  left: 11px;
  top: 50%;
  translate: 0 -50%;
  color: var(--muted);
  pointer-events: none;
}

.filters__search input {
  width: 100%;
  height: 36px;
  padding: 0 12px 0 34px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: var(--surface);
  color: var(--text);
  font: 400 14px var(--font-sans);
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.filters__search input:focus {
  border-color: var(--szafir);
  box-shadow: 0 0 0 3px var(--tint);
}

.filters__search input::placeholder {
  color: var(--muted);
}

@media (max-width: 640px) {
  .filters__chips {
    flex-basis: 100%;
  }

  .filters__search {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .filters,
  .filters__search input {
    transition: none;
  }
}
</style>
