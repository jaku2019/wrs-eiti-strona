<script setup lang="ts">
import {
  DOKUMENT_TYPY,
  type DokumentMeta,
  type DokumentTyp,
} from '~/utils/docsMeta'

useSeoMeta({
  title: 'Dokumenty — WRS WEiTI',
  description: 'Regulaminy, uchwały i protokoły samorządu WEiTI.',
  ogTitle: 'Dokumenty — WRS WEiTI',
  ogDescription: 'Regulaminy, uchwały i protokoły samorządu WEiTI.',
})

const { data: doc } = await useAsyncData('dokumenty-yml', () =>
  queryContent<{ dokumenty?: DokumentMeta[] }>('/dokumenty').findOne(),
)

const all = computed(() => doc.value?.dokumenty ?? [])

const typ = ref<DokumentTyp | 'all'>('all')
const year = ref<number | 'all'>('all')

const years = computed(() => {
  const set = new Set<number>()
  for (const d of all.value) {
    const y = new Date(d.data).getFullYear()
    if (!Number.isNaN(y)) set.add(y)
  }
  return [...set].sort((a, b) => b - a)
})

const typCounts = computed(() => {
  const counts: Partial<Record<DokumentTyp | 'all', number>> = {
    all: all.value.length,
  }
  for (const t of DOKUMENT_TYPY) counts[t.id] = 0
  for (const d of all.value) {
    const id = d.typ as DokumentTyp
    if (counts[id] != null) counts[id] = (counts[id] ?? 0) + 1
  }
  return counts
})

const filtered = computed(() =>
  all.value
    .filter((d) => (typ.value === 'all' ? true : d.typ === typ.value))
    .filter((d) => {
      if (year.value === 'all') return true
      return new Date(d.data).getFullYear() === year.value
    })
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()),
)
</script>

<template>
  <div class="section">
    <div class="container">
      <LayoutBreadcrumbs
        :items="[
          { label: 'Strona główna', to: '/' },
          { label: 'Dokumenty' },
        ]"
      />
      <UiEyebrow>Materiały</UiEyebrow>
      <h1>Dokumenty</h1>
      <p class="lead">
        Regulaminy, uchwały, protokoły i sprawozdania — pliki PDF z&nbsp;CMS.
      </p>

      <DocsFilters
        v-model:typ="typ"
        v-model:year="year"
        :years="years"
        :typ-counts="typCounts"
      />

      <DocsList :items="filtered" />
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-size: clamp(36px, 5vw, 64px);
}

.lead {
  max-width: 36rem;
  color: var(--muted);
  margin-bottom: 0.5rem;
}
</style>
