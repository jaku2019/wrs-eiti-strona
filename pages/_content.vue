<script setup lang="ts">
/**
 * Smoke A3: weryfikacja zapytań Content + filtr draft / przyszłych dat.
 * Nie jest częścią nawigacji publicznej (jak /_ui).
 */
import { upcomingWydarzenia, type WydarzeniaDoc } from '~/utils/calendarSource'
import { isPublishedAktualnosc } from '~/utils/contentFilters'

useSeoMeta({
  title: 'Content smoke — WRS',
  robots: 'noindex',
})

const now = new Date()

const { data: published } = await usePublishedAktualnosci({
  key: 'content-smoke-aktualnosci',
})

const { data: allAktualnosci } = await useAsyncData('content-smoke-all-news', () =>
  queryContent('aktualnosci').find(),
)

const { data: kb } = await useAsyncData('content-smoke-kb', () =>
  queryContent('baza-wiedzy').find(),
)

const { data: sklad } = await useAsyncData('content-smoke-sklad', () =>
  queryContent('/sklad').findOne(),
)

const { data: faq } = await useAsyncData('content-smoke-faq', () =>
  queryContent('/faq').findOne(),
)

const { data: dokumenty } = await useAsyncData('content-smoke-dokumenty', () =>
  queryContent('/dokumenty').findOne(),
)

const { data: wydarzeniaDoc } = await useAsyncData('content-smoke-wydarzenia', () =>
  queryContent<WydarzeniaDoc>('/wydarzenia').findOne(),
)

const { data: ustawienia } = await useAsyncData('content-smoke-ustawienia', () =>
  queryContent('/ustawienia').findOne(),
)

const excluded = computed(() =>
  (allAktualnosci.value ?? []).filter((doc) => !isPublishedAktualnosc(doc as never, now)),
)

const upcoming = computed(() =>
  upcomingWydarzenia(wydarzeniaDoc.value?.wydarzenia, now, 5),
)

const { initials } = useInitials()
</script>

<template>
  <div class="container section">
    <UiEyebrow>A3 · Pages CMS</UiEyebrow>
    <h1>Smoke treści</h1>
    <p class="lead">
      Publikowane aktualności: {{ published?.length ?? 0 }}
      · wykluczone (draft / przyszła data): {{ excluded.length }}
      · artykuły KB: {{ kb?.length ?? 0 }}
    </p>

    <section class="block">
      <h2>Aktualności (po filtrze)</h2>
      <ul>
        <li v-for="item in published" :key="item._path">
          {{ item.title }}
          <span class="meta">{{ item.date }}</span>
        </li>
      </ul>
      <h3>Wykluczone</h3>
      <ul>
        <li v-for="item in excluded" :key="item._path">
          {{ item.title }}
          <span class="meta">draft={{ item.draft }} · {{ item.date }}</span>
        </li>
      </ul>
    </section>

    <section class="block">
      <h2>Baza wiedzy</h2>
      <ul>
        <li v-for="a in kb" :key="a._path">
          <code>{{ a.category }}</code> — {{ a.title }}
        </li>
      </ul>
    </section>

    <section class="block">
      <h2>Skład (inicjały)</h2>
      <p>
        Kadencja {{ sklad?.kadencja }}, osób: {{ sklad?.osoby?.length ?? 0 }}
      </p>
      <ul class="people">
        <li v-for="(o, i) in sklad?.osoby ?? []" :key="i">
          <UiAvatarPlaceholder :name="o.imie" />
          <span>{{ o.imie }} · {{ o.funkcja }} · {{ initials(o.imie) }}</span>
        </li>
      </ul>
    </section>

    <section class="block">
      <h2>FAQ / dokumenty / wydarzenia / ustawienia</h2>
      <ul>
        <li>FAQ sekcje: {{ faq?.sekcje?.length ?? 0 }}</li>
        <li>Dokumenty: {{ dokumenty?.dokumenty?.length ?? 0 }}</li>
        <li>Wydarzenia nadchodzące: {{ upcoming.length }}</li>
        <li>Kontakt: {{ ustawienia?.kontakt?.email }}</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.lead {
  color: var(--muted);
  max-width: 40rem;
}
.block {
  margin-top: 2rem;
}
.meta {
  color: var(--muted);
  font-size: 0.875rem;
  margin-left: 0.5rem;
}
.people {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}
.people li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
</style>
