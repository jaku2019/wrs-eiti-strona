<script setup lang="ts">
import type { SkladDoc } from '~/utils/sklad'
import { formatSkladDate, matchesPersonQuery } from '~/utils/sklad'
import type { FaqDoc } from '~/utils/faq'

useSeoMeta({
  title: 'Skład samorządu — WRS WEiTI',
  description: 'Skład samorządu Wydziału Elektroniki i Technik Informacyjnych PW.',
})

const { data: sklad } = await useAsyncData('sklad-page', () =>
  queryContent<SkladDoc>('/sklad').findOne(),
)

const { data: faq } = await useAsyncData('sklad-faq-teaser', () =>
  queryContent<FaqDoc>('/faq').findOne(),
)

const activeGroup = ref('wszyscy')
const query = ref('')
const { reduced } = useReducedMotion()

const osoby = computed(() => sklad.value?.osoby ?? [])
const grupy = computed(() => sklad.value?.grupy ?? [])
const przedstawiciele = computed(() => sklad.value?.przedstawiciele ?? [])

const filtered = computed(() =>
  osoby.value.filter((o) => {
    const groupOk = activeGroup.value === 'wszyscy' || o.grupa === activeGroup.value
    return groupOk && matchesPersonQuery(o, query.value)
  }),
)

const faqTeaser = computed(() => {
  const organy = (faq.value?.sekcje ?? []).find((s) => s.id === 'organy')
  return organy?.pytania ?? []
})

const metaLine = computed(() => {
  const parts: string[] = []
  if (sklad.value?.kadencja) parts.push(`Kadencja ${sklad.value.kadencja}`)
  const n = osoby.value.length
  const noun = n === 1 ? 'osoba' : n >= 2 && n <= 4 ? 'osoby' : 'osób'
  parts.push(`${n} ${noun}`)
  const updated = formatSkladDate(sklad.value?.aktualizacja)
  if (updated) parts.push(`Aktualizacja: ${updated}`)
  return parts
})

function withFilterTransition(update: () => void) {
  if (
    import.meta.client
    && typeof document.startViewTransition === 'function'
    && !reduced.value
  ) {
    document.startViewTransition(update)
  } else {
    update()
  }
}

function setGroup(id: string) {
  if (id === activeGroup.value) return
  withFilterTransition(() => {
    activeGroup.value = id
  })
}
</script>

<template>
  <div class="sklad-page">
    <header class="section section--compact sklad-hero">
      <div class="container">
        <nav class="crumbs" aria-label="Okruszki">
          <NuxtLink to="/">Strona główna</NuxtLink>
          <span aria-hidden="true">›</span>
          <span>Skład</span>
        </nav>
        <UiEyebrow>Samorząd</UiEyebrow>
        <h1>Skład <em>samorządu</em></h1>
        <p class="lead">
          TODO(treść): krótki opis składu samorządu WEiTI w bieżącej kadencji.
        </p>
        <ul class="meta" aria-label="Metadane składu">
          <li v-for="(item, i) in metaLine" :key="i">{{ item }}</li>
        </ul>
      </div>
    </header>

    <PeopleFilters
      :grupy="grupy"
      :osoby="osoby"
      :model-value="activeGroup"
      :query="query"
      @update:model-value="setGroup"
      @update:query="query = $event"
    />

    <section class="section section--compact" aria-label="Siatka osób">
      <div class="container">
        <PeopleGrid :osoby="filtered" :query="query" />
      </div>
    </section>

    <PeopleOrgansList v-if="przedstawiciele.length" :items="przedstawiciele" />
    <PeopleFaqTeaser :pytania="faqTeaser" />
  </div>
</template>

<style scoped>
.sklad-hero {
  padding-bottom: 1.5rem;
}

.crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 1.25rem;
  font-size: 14px;
  color: var(--muted);
}

.crumbs a {
  color: var(--link);
  text-decoration: none;
  font-weight: 600;
}

.sklad-hero h1 {
  font-size: clamp(40px, 6vw, 72px);
  margin-bottom: 0.55rem;
}

.lead {
  max-width: 38rem;
  margin: 0 0 1.1rem;
  color: var(--muted);
  font-size: 17px;
}

.meta {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem 0.85rem;
  color: var(--muted);
  font-size: 14px;
  font-weight: 500;
}

.meta li:not(:last-child)::after {
  content: '·';
  margin-left: 0.85rem;
  color: var(--line);
}
</style>
