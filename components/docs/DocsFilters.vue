<script setup lang="ts">
import { DOKUMENT_TYPY, type DokumentTyp } from '~/utils/docsMeta'

defineProps<{
  years: number[]
  typCounts: Partial<Record<DokumentTyp | 'all', number>>
}>()

const typ = defineModel<DokumentTyp | 'all'>('typ', { required: true })
const year = defineModel<number | 'all'>('year', { required: true })
</script>

<template>
  <div class="docs-filters" role="group" aria-label="Filtry dokumentów">
    <div class="docs-filters__row">
      <span class="docs-filters__label">Typ</span>
      <div class="docs-filters__chips">
        <UiChip
          :active="typ === 'all'"
          @click="typ = 'all'"
        >
          Wszystkie
          <span class="count">{{ typCounts.all ?? 0 }}</span>
        </UiChip>
        <UiChip
          v-for="t in DOKUMENT_TYPY"
          :key="t.id"
          :active="typ === t.id"
          @click="typ = t.id"
        >
          {{ t.label }}
          <span class="count">{{ typCounts[t.id] ?? 0 }}</span>
        </UiChip>
      </div>
    </div>

    <div class="docs-filters__row">
      <label class="docs-filters__label" for="docs-year">Rok</label>
      <select
        id="docs-year"
        class="docs-filters__select"
        :value="year === 'all' ? 'all' : String(year)"
        @change="
          year =
            ($event.target as HTMLSelectElement).value === 'all'
              ? 'all'
              : Number(($event.target as HTMLSelectElement).value)
        "
      >
        <option value="all">Wszystkie lata</option>
        <option
          v-for="y in years"
          :key="y"
          :value="String(y)"
        >
          {{ y }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.docs-filters {
  display: grid;
  gap: 1rem;
  padding: 1rem 0 1.25rem;
  border-bottom: 1px solid var(--line);
  margin-bottom: 1.25rem;
}

.docs-filters__row {
  display: grid;
  gap: 0.55rem;
}

.docs-filters__label {
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
}

.docs-filters__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.count {
  font-variant-numeric: tabular-nums;
  opacity: 0.75;
}

.docs-filters__select {
  width: min(100%, 220px);
  min-height: 40px;
  padding: 0 0.75rem;
  border-radius: var(--r-sm);
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text);
  font-family: var(--font-sans);
  font-size: 14px;
}

.docs-filters__select:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
</style>
