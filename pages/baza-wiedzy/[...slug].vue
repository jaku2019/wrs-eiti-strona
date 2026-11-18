<script setup lang="ts">
import { formatDateLong, toDateTimeAttr } from '~/utils/formatDate'
import { kbCategoryLabel } from '~/utils/kbMeta'
import { extractToc } from '~/utils/toc'

type KbDoc = {
  _path?: string
  title?: string
  summary?: string
  category?: string
  updated?: string
  related?: string[]
  body?: unknown
}

const route = useRoute()
const slugParam = computed(() => {
  const raw = route.params.slug
  return Array.isArray(raw) ? raw.join('/') : String(raw || '')
})

const { data: article } = await useAsyncData(
  () => `kb-article-${slugParam.value}`,
  () => queryContent<KbDoc>('baza-wiedzy', slugParam.value).findOne(),
  { watch: [slugParam] },
)

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Nie znaleziono artykułu' })
}

const { data: allArticles } = await useAsyncData('kb-all-for-nav', () =>
  queryContent<KbDoc>('baza-wiedzy').only(['_path', 'title', 'summary', 'category', 'related']).find(),
)

const { data: ustawienia } = await useAsyncData('kb-ustawienia-contact', () =>
  queryContent<{ kontakt?: { email?: string } }>('/ustawienia').findOne(),
)

const toc = computed(() => extractToc(article.value?.body))

const related = computed(() => {
  const slugs = article.value?.related ?? []
  if (!slugs.length) return []
  const pool = allArticles.value ?? []
  return slugs
    .map((slug) => {
      const byPathEnd = pool.find(
        (a) => a._path?.endsWith(`/${slug}`) || a._path?.endsWith(slug),
      )
      return byPathEnd
    })
    .filter((a): a is KbDoc => !!a && a._path !== article.value?._path)
})

const contactEmail = computed(() => {
  const email = ustawienia.value?.kontakt?.email
  if (!email || email.includes('TODO')) return null
  return email
})

const reportHref = computed(() => {
  const title = article.value?.title || 'artykuł'
  const subject = encodeURIComponent(`Nieaktualna informacja: ${title}`)
  if (contactEmail.value) {
    return `mailto:${contactEmail.value}?subject=${subject}`
  }
  return `mailto:?subject=${subject}`
})

useSeoMeta({
  title: () => `${article.value?.title || 'Artykuł'} — Baza wiedzy — WRS WEiTI`,
  description: () =>
    article.value?.summary ||
    'Artykuł bazy wiedzy samorządu WEiTI.',
  ogTitle: () => article.value?.title || 'Baza wiedzy — WRS WEiTI',
  ogDescription: () =>
    article.value?.summary ||
    'Artykuł bazy wiedzy samorządu WEiTI.',
})
</script>

<template>
  <div v-if="article" class="section kb-page">
    <div class="container kb-layout">
      <LayoutBreadcrumbs
        class="kb-crumbs"
        :items="[
          { label: 'Strona główna', to: '/' },
          { label: 'Baza wiedzy', to: '/baza-wiedzy' },
          { label: article.title || 'Artykuł' },
        ]"
      />

      <aside class="kb-side kb-side--left">
        <details class="kb-drawer">
          <summary>Kategorie</summary>
          <KbCategoryTree
            :articles="allArticles ?? []"
            :current-path="article._path"
            :current-category="article.category"
          />
        </details>
        <div class="kb-side__desktop">
          <KbCategoryTree
            :articles="allArticles ?? []"
            :current-path="article._path"
            :current-category="article.category"
          />
        </div>
      </aside>

      <div
        class="kb-main"
        data-pagefind-body
        data-pagefind-meta="group:Baza wiedzy"
      >
        <p class="kb-cat" data-pagefind-ignore>{{ kbCategoryLabel(article.category) }}</p>
        <h1 data-pagefind-meta="title">{{ article.title }}</h1>
        <p
          v-if="article.summary"
          class="lead"
          data-pagefind-meta="summary"
        >
          {{ article.summary }}
        </p>

        <KbReadingProgress data-pagefind-ignore />

        <div id="kb-article-body" class="prose">
          <ContentRenderer :value="article" />
        </div>

        <footer class="kb-foot" data-pagefind-ignore>
          <p v-if="article.updated">
            Aktualizacja:
            <time :datetime="toDateTimeAttr(article.updated)">
              {{ formatDateLong(article.updated) }}
            </time>
          </p>
          <a :href="reportHref" class="kb-report">
            Zgłoś nieaktualną informację
          </a>
        </footer>
      </div>

      <aside class="kb-side kb-side--right">
        <details class="kb-drawer" open>
          <summary>Spis treści</summary>
          <KbToc :items="toc" />
          <KbRelated :items="related" />
        </details>
        <div class="kb-side__desktop">
          <KbToc :items="toc" />
          <KbRelated :items="related" />
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.kb-layout {
  display: grid;
  gap: 1.5rem 2rem;
}

.kb-crumbs {
  grid-column: 1 / -1;
}

h1 {
  font-size: clamp(32px, 4.5vw, 52px);
}

.kb-cat {
  margin: 0 0 0.45rem;
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
}

.lead {
  color: var(--muted);
  max-width: 40rem;
}

.prose {
  max-width: 72ch;
}

.prose :deep(h2),
.prose :deep(h3) {
  scroll-margin-top: 5.5rem;
}

.prose :deep(h2) {
  font-size: clamp(26px, 3vw, 34px);
  margin-top: 1.6em;
}

.prose :deep(h3) {
  font-size: 1.25rem;
  margin-top: 1.35em;
}

.prose :deep(p) {
  margin: 0 0 1em;
}

.prose :deep(ul),
.prose :deep(ol) {
  padding-left: 1.25rem;
  margin: 0 0 1em;
}

.kb-foot {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
  align-items: baseline;
  justify-content: space-between;
  margin-top: 2.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--line);
  font-size: 14px;
  color: var(--muted);
}

.kb-foot p {
  margin: 0;
}

.kb-report {
  font-weight: 600;
  color: var(--link);
  text-decoration: none;
}

.kb-report:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.kb-drawer {
  border: 1px solid var(--line);
  border-radius: var(--r);
  background: var(--surface);
  padding: 0.65rem 0.85rem;
}

.kb-drawer summary {
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  list-style: none;
}

.kb-drawer summary::-webkit-details-marker {
  display: none;
}

.kb-drawer[open] summary {
  margin-bottom: 0.85rem;
}

.kb-side__desktop {
  display: none;
}

@media (min-width: 1000px) {
  .kb-layout {
    grid-template-columns: 200px minmax(0, 1fr) 220px;
    align-items: start;
  }

  .kb-drawer {
    display: none;
  }

  .kb-side__desktop {
    display: block;
    position: sticky;
    top: 5.5rem;
  }

  .kb-side--right .kb-side__desktop {
    display: grid;
    gap: 0.5rem;
  }
}
</style>
