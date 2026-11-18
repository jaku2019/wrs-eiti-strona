<script setup lang="ts">
import type { FaqDoc } from '~/utils/faq'

useSeoMeta({
  title: 'FAQ — WRS WEiTI',
  description: 'Najczęstsze pytania o samorząd WEiTI.',
})

const route = useRoute()
const router = useRouter()

const { data: faq } = await useAsyncData('faq-page', () =>
  queryContent<FaqDoc>('/faq').findOne(),
)

const query = ref('')
const revealId = ref<string | null>(null)
const revealToken = ref(0)
const sekcje = computed(() => faq.value?.sekcje ?? [])

function hashId(hash: string): string | null {
  const raw = hash.replace(/^#/, '').trim()
  return raw || null
}

function allQuestionIds(): Set<string> {
  const ids = new Set<string>()
  for (const s of sekcje.value) {
    for (const p of s.pytania ?? []) ids.add(p.id)
  }
  return ids
}

function applyHash(hash: string) {
  const id = hashId(hash)
  if (!id || !import.meta.client) return

  const isQuestion = allQuestionIds().has(id)
  const isSection = sekcje.value.some((s) => s.id === id)
  if (!isQuestion && !isSection) return

  if (isQuestion) {
    revealId.value = id
    revealToken.value += 1
    const el = document.getElementById(id)
    if (el instanceof HTMLDetailsElement) el.open = true
  }

  nextTick(() => {
    const el = document.getElementById(id)
    if (!el) return
    if (el instanceof HTMLDetailsElement) el.open = true
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

function onOpen(id: string) {
  if (import.meta.client && route.hash !== `#${id}`) {
    router.replace({ hash: `#${id}` })
  }
}

onMounted(() => {
  // Prefer window.location — more reliable than route.hash on cold SSG loads.
  const hash = import.meta.client ? window.location.hash : route.hash
  applyHash(hash || route.hash)
  // Second pass after hydration settles.
  requestAnimationFrame(() => applyHash(window.location.hash || route.hash))
})

watch(
  () => route.hash,
  (hash) => {
    applyHash(hash)
  },
)
</script>

<template>
  <div class="faq-page" data-pagefind-body data-pagefind-meta="group:FAQ">
    <header class="page-head faq-hero">
      <div class="container">
        <LayoutBreadcrumbs
          data-pagefind-ignore
          :items="[{ label: 'Strona główna', to: '/' }, { label: 'FAQ' }]"
        />
        <h1 data-pagefind-meta="title">FAQ</h1>
        <p class="lead">
          Najczęstsze pytania o samorząd, organy i sprawy studenckie.
        </p>
        <label class="faq-search" data-pagefind-ignore>
          <span class="visually-hidden">Szukaj w FAQ</span>
          <UiIcon name="search" :size="16" />
          <input
            v-model="query"
            type="search"
            name="faq-q"
            autocomplete="off"
            placeholder="Szukaj pytania…"
          >
        </label>
      </div>
    </header>

    <section class="section section--compact section--surface">
      <div class="container">
        <FaqSectionList
          :sekcje="sekcje"
          :query="query"
          :reveal-id="revealId"
          :reveal-token="revealToken"
          @open="onOpen"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
/* nagłówek: wspólne .page-head (base.css) */
.faq-search {
  margin-top: 22px;
}

.faq-search {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  width: min(100%, 420px);
  min-height: 44px;
  padding: 0 0.85rem;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: var(--surface);
  color: var(--muted);
}

.faq-search:focus-within {
  border-color: var(--accent);
  color: var(--accent);
}

.faq-search input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  color: var(--text);
  font: inherit;
  font-size: 15px;
  outline: none;
}

.faq-search input::placeholder {
  color: var(--muted);
}
</style>
