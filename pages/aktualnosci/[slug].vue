<script setup lang="ts">
import { isPublishedAktualnosc, type AktualnoscMeta } from '~/utils/contentFilters'
import { formatDateLong, toDateTimeAttr } from '~/utils/formatDate'
import { absoluteAssetUrl, joinSiteUrl, withAppBase } from '~/utils/siteUrl'

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const { data: article } = await useAsyncData(
  () => `aktualnosc-${slug.value}`,
  () => queryContent<AktualnoscMeta>('aktualnosci', slug.value).findOne(),
  { watch: [slug] },
)

if (!article.value || !isPublishedAktualnosc(article.value)) {
  throw createError({ statusCode: 404, statusMessage: 'Nie znaleziono aktualności' })
}

const runtime = useRuntimeConfig()
const siteUrl = String(runtime.public.siteUrl || '')
const pagePath = article.value._path || `/aktualnosci/${slug.value}`
const absolutePageUrl = joinSiteUrl(siteUrl, pagePath)

const imageSrc = article.value.image
  ? withAppBase(String(article.value.image))
  : ''

const ogImage =
  absoluteAssetUrl(siteUrl, article.value.image || undefined) ||
  absoluteAssetUrl(siteUrl, '/brand/wrs-mark-color.png')

const zajawka = computed(() => {
  const ex = article.value?.excerpt
  return typeof ex === 'string' && ex.trim() ? ex.trim() : ''
})

useSeoMeta({
  title: () => `${article.value?.title || 'Aktualność'} — WRS WEiTI`,
  description: () =>
    zajawka.value || 'Aktualność Wydziałowej Rady Samorządu WEiTI.',
  ogTitle: () => article.value?.title || 'Aktualność — WRS WEiTI',
  ogDescription: () =>
    zajawka.value || 'Aktualność Wydziałowej Rady Samorządu WEiTI.',
  ogType: 'article',
  ogUrl: absolutePageUrl,
  ogImage,
  twitterCard: 'summary_large_image',
  articlePublishedTime: () =>
    article.value?.date
      ? new Date(article.value.date as string | Date).toISOString()
      : undefined,
})

useHead({
  link: [{ rel: 'canonical', href: absolutePageUrl }],
})
</script>

<template>
  <article v-if="article" class="section">
    <div class="container article">
      <LayoutBreadcrumbs
        data-pagefind-ignore
        :items="[
          { label: 'Strona główna', to: '/' },
          { label: 'Aktualności', to: '/aktualnosci' },
          { label: article.title || 'Wpis' },
        ]"
      />

      <div data-pagefind-body data-pagefind-meta="group:Aktualności">
        <time
          v-if="article.date"
          class="article__date"
          :datetime="toDateTimeAttr(article.date)"
          data-pagefind-ignore
        >
          {{ formatDateLong(article.date) }}
        </time>
        <h1 data-pagefind-meta="title">{{ article.title }}</h1>
        <p
          v-if="zajawka"
          class="lead"
          data-pagefind-meta="summary"
        >
          {{ zajawka }}
        </p>

        <div v-if="imageSrc" class="article__media" data-pagefind-ignore>
          <img
            :src="imageSrc"
            :alt="article.title || ''"
            width="1200"
            height="630"
            loading="eager"
          >
        </div>
        <div
          v-else
          class="article__media article__media--placeholder"
          aria-hidden="true"
          data-pagefind-ignore
        />

        <div class="article__body prose">
          <ContentRenderer :value="article" />
        </div>
      </div>

      <NewsShare
        data-pagefind-ignore
        :url="absolutePageUrl"
        :title="article.title || 'Aktualność'"
      />
    </div>
  </article>
</template>

<style scoped>
.article {
  max-width: 760px;
}

/* rytm jak .page-head z mockupu */
h1 {
  margin-top: 10px;
  font-size: clamp(34px, 5vw, 56px);
  letter-spacing: -0.03em;
}

.article__date {
  display: block;
  margin-top: 18px;
  font-size: 13px;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}

.lead {
  margin-top: 14px;
  max-width: 58ch;
  color: var(--muted);
  font-size: 18px;
}

.article__media {
  margin: 1.5rem 0 1.75rem;
  border-radius: var(--r);
  overflow: hidden;
  border: 1px solid var(--line);
  aspect-ratio: 16 / 10;
  background: var(--bg);
}

.article__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article__media--placeholder {
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--szafir) 22%, transparent) 0%,
      transparent 42%
    ),
    linear-gradient(
      135deg,
      transparent 48%,
      color-mix(in srgb, var(--cyjan) 18%, transparent) 78%,
      transparent 100%
    ),
    var(--wrzos-soft);
}

.article__body {
  max-width: 72ch;
}

.prose :deep(p) {
  margin: 0 0 1em;
}

.prose :deep(h2) {
  font-size: clamp(26px, 3vw, 34px);
  margin-top: 1.6em;
}

.prose :deep(h3) {
  font-size: 1.25rem;
  margin-top: 1.35em;
}

.prose :deep(ul),
.prose :deep(ol) {
  padding-left: 1.25rem;
  margin: 0 0 1em;
}
</style>
