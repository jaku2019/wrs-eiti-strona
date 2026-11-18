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
    { threshold: [1], rootMargin: '-64px 0px 0px 0px' },
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
          <UiIcon name="search" :size="16" />
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
.filters-wrap {
  position: relative;
}

.filters-sentinel {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
}

.filters {
  position: sticky;
  top: 64px;
  z-index: 40;
  padding-block: 0.85rem;
  background: color-mix(in srgb, var(--bg) 92%, transparent);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease;
}

.filters--stuck {
  border-bottom-color: var(--line);
}

.filters__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1rem;
}

.filters__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  flex: 1;
  min-width: 0;
}

.filters__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  padding: 0 0.3rem;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
  background: color-mix(in srgb, var(--line) 55%, transparent);
}

.filters__chips :deep(.ui-chip--active) .filters__count {
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 14%, transparent);
}

.filters__search {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 40px;
  min-width: min(100%, 260px);
  padding: 0 0.75rem;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: var(--surface);
  color: var(--muted);
}

.filters__search:focus-within {
  border-color: var(--accent);
  color: var(--accent);
}

.filters__search input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  color: var(--text);
  font: inherit;
  font-size: 14px;
  outline: none;
}

.filters__search input::placeholder {
  color: var(--muted);
}

@media (prefers-reduced-motion: reduce) {
  .filters {
    transition: none;
  }
}
</style>
