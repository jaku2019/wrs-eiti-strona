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

const peopleNoun = computed(() => {
  const n = osoby.value.length
  const last2 = n % 100
  const last = n % 10
  if (n === 1) return 'osoba'
  if (last >= 2 && last <= 4 && !(last2 >= 12 && last2 <= 14)) return 'osoby'
  return 'osób'
})
const updatedLabel = computed(() => formatSkladDate(sklad.value?.aktualizacja))

async function withFilterTransition(update: () => void | Promise<void>) {
  if (
    import.meta.client
    && typeof document.startViewTransition === 'function'
    && !reduced.value
  ) {
    await document.startViewTransition(async () => {
      await update()
      await nextTick()
    }).finished.catch(() => {})
  } else {
    await update()
  }
}

function setGroup(id: string) {
  if (id === activeGroup.value) return
  void withFilterTransition(() => {
    activeGroup.value = id
  })
}

function setQuery(value: string) {
  query.value = value
}
</script>

<template>
  <div class="sklad-page">
    <header class="page-head">
      <div class="container">
        <LayoutBreadcrumbs
          :items="[{ label: 'Strona główna', to: '/' }, { label: 'Skład' }]"
        />
        <h1>Skład <em>samorządu</em></h1>
        <p class="lead">
          TODO(treść): krótki opis składu samorządu WEiTI w bieżącej kadencji.
        </p>
        <ul
          class="page-meta"
          aria-label="Metadane składu"
        >
          <li v-if="sklad?.kadencja">
            <UiIcon
              name="calendar"
              :size="14"
            />
            Kadencja {{ sklad.kadencja }}
          </li>
          <li>
            <UiIcon
              name="users"
              :size="14"
            />
            <b>{{ osoby.length }}</b>&nbsp;{{ peopleNoun }}
          </li>
          <li v-if="updatedLabel">
            <UiIcon
              name="refresh"
              :size="14"
            />
            Aktualizacja: {{ updatedLabel }}
          </li>
        </ul>
      </div>
    </header>

    <PeopleFilters
      :grupy="grupy"
      :osoby="osoby"
      :model-value="activeGroup"
      :query="query"
      @update:model-value="setGroup"
      @update:query="setQuery"
    />

    <div class="container">
      <section
        class="block"
        aria-label="Siatka osób"
      >
        <PeopleGrid
          :osoby="filtered"
          :query="query"
        />
      </section>

      <PeopleOrgansList
        v-if="przedstawiciele.length"
        :items="przedstawiciele"
      />
      <PeopleFaqTeaser :pytania="faqTeaser" />
    </div>
  </div>
</template>

<style scoped>
/* mockup: .block */
.block {
  padding: 36px 0;
}
</style>
