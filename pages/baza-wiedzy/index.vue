<script setup lang="ts">
import { formatDateShort, toDateTimeAttr } from '~/utils/formatDate'
import { KB_CATEGORIES, type KbCategoryId } from '~/utils/kbMeta'

useSeoMeta({
  title: 'Baza wiedzy — WRS WEiTI',
  description: 'Baza wiedzy samorządu WEiTI — jak załatwić sprawę.',
  ogTitle: 'Baza wiedzy — WRS WEiTI',
  ogDescription: 'Baza wiedzy samorządu WEiTI — jak załatwić sprawę.',
})

type KbDoc = {
  _path?: string
  title?: string
  summary?: string
  category?: string
  updated?: string
}

const { data: articles } = await useAsyncData('kb-index-articles', () =>
  queryContent<KbDoc>('baza-wiedzy').find(),
)

const counts = computed(() => {
  const map: Partial<Record<KbCategoryId, number>> = {}
  for (const a of articles.value ?? []) {
    const id = a.category as KbCategoryId | undefined
    if (!id) continue
    map[id] = (map[id] ?? 0) + 1
  }
  return map
})

const recent = computed(() =>
  [...(articles.value ?? [])]
    .sort((a, b) => {
      const ta = a.updated ? new Date(a.updated).getTime() : 0
      const tb = b.updated ? new Date(b.updated).getTime() : 0
      return tb - ta
    })
    .slice(0, 6),
)

const byCategory = computed(() =>
  KB_CATEGORIES.map((cat) => ({
    ...cat,
    articles: (articles.value ?? []).filter((a) => a.category === cat.id),
  })),
)
</script>

<template>
  <div>
    <header class="page-head">
      <div class="container">
        <LayoutBreadcrumbs
          :items="[
            { label: 'Strona główna', to: '/' },
            { label: 'Baza wiedzy' },
          ]"
        />
        <h1>Baza wiedzy</h1>
        <p class="lead">
          Odpowiedzi na najczęstsze sprawy studenckie — kategorie i artykuły z&nbsp;CMS.
        </p>
      </div>
    </header>

    <div class="container kb-cats">
      <KbCategoryList :counts="counts" />
    </div>

    <div class="section section--surface">
      <div class="container">
        <div class="section-head">
          <h2>Ostatnio aktualizowane</h2>
        </div>
        <ul class="recent">
          <li v-for="item in recent" :key="item._path">
            <NuxtLink :to="item._path || '/baza-wiedzy'" class="recent__link">
              <span class="recent__title">{{ item.title }}</span>
              <time
                v-if="item.updated"
                class="recent__date"
                :datetime="toDateTimeAttr(item.updated)"
              >
                {{ formatDateShort(item.updated) }}
              </time>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <div class="section">
      <div class="container">
        <div
          v-for="group in byCategory"
          :id="`kategoria-${group.id}`"
          :key="group.id"
          class="cat-block"
        >
          <h2>{{ group.label }}</h2>
          <p class="cat-lead">{{ group.description }}</p>
          <ul class="cat-list">
            <li v-for="a in group.articles" :key="a._path">
              <NuxtLink :to="a._path || '/baza-wiedzy'">
                {{ a.title }}
              </NuxtLink>
              <span v-if="a.summary" class="cat-summary">{{ a.summary }}</span>
            </li>
            <li v-if="!group.articles.length" class="cat-empty">
              TODO(treść): brak artykułów w tej kategorii.
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kb-cats {
  padding: 8px 0 96px;
}

.section-head h2 {
  font-size: clamp(28px, 3.5vw, 40px);
  margin-bottom: 1.25rem;
}

.recent {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.55rem;
}

.recent__link {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--line);
  text-decoration: none;
  color: inherit;
}

.recent__title {
  font-weight: 600;
  color: var(--heading);
}

.recent__link:hover .recent__title {
  color: var(--link);
}

.recent__date {
  font-family: var(--font-display);
  font-size: 14px;
  color: var(--muted);
}

.cat-block {
  margin-bottom: 2.5rem;
  scroll-margin-top: 6rem;
}

.cat-block h2 {
  font-size: clamp(26px, 3vw, 36px);
}

.cat-lead {
  color: var(--muted);
  margin-top: -0.25rem;
  margin-bottom: 0.85rem;
}

.cat-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.65rem;
}

.cat-list a {
  font-weight: 600;
  text-decoration: none;
}

.cat-list a:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.cat-summary {
  display: block;
  margin-top: 0.15rem;
  font-size: 14px;
  color: var(--muted);
}

.cat-empty {
  color: var(--muted);
  font-size: 14px;
}
</style>
