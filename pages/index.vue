<script setup lang="ts">
import type { HomeTopic } from '~/components/home/HomeTopics.vue'
import type { HomeStat } from '~/components/home/HomeStats.vue'
import type { WydarzeniaDoc } from '~/utils/calendarSource'
import { upcomingWydarzenia } from '~/utils/calendarSource'
import { KB_CATEGORIES } from '~/utils/kbMeta'

useSeoMeta({
  title: 'WRS WEiTI',
  description:
    'Wydziałowa Rada Samorządu Wydziału Elektroniki i Technik Informacyjnych PW — baza wiedzy, aktualności i kontakt.',
})

const { data: ustawienia } = await useAsyncData('ustawienia-home', () =>
  queryContent('/ustawienia').findOne(),
)

const { data: news } = await usePublishedAktualnosci({
  limit: 3,
  key: 'home-news-3',
})

const { data: wydarzeniaDoc } = await useAsyncData('wydarzenia-home', () =>
  queryContent<WydarzeniaDoc>('/wydarzenia').findOne(),
)

const { data: sklad } = await useAsyncData('sklad-home-stats', () =>
  queryContent('/sklad').findOne(),
)

const { data: kbCount } = await useAsyncData('kb-count-home', async () => {
  const docs = await queryContent('baza-wiedzy').only(['_path']).find()
  return docs.length
})

const events = computed(() =>
  upcomingWydarzenia(wydarzeniaDoc.value?.wydarzenia, new Date(), 3),
)

/** Home shows 4 „najczęstsze sprawy” tiles (05-strony); full list lives on /baza-wiedzy. */
const topics = computed<HomeTopic[]>(() =>
  KB_CATEGORIES.slice(0, 4).map((cat) => ({
    id: cat.id,
    title: cat.label,
    description: cat.description,
    to: '/baza-wiedzy',
    icon: cat.icon,
  })),
)

const stats = computed<HomeStat[]>(() => {
  const fromCms = (ustawienia.value?.liczniki ?? []) as Array<{
    etykieta?: string
    wartosc?: number
  }>

  const osoby = (sklad.value?.osoby as unknown[] | undefined)?.length ?? 0
  const grupy = (sklad.value?.grupy as Array<{ id?: string }> | undefined) ?? []
  const komisje = grupy.filter(
    (g) => g.id && g.id !== 'prezydium' && g.id !== 'czlonkowie',
  ).length

  const label = (i: number, fallback: string) =>
    fromCms[i]?.etykieta?.trim() || fallback

  const cmsVal = (i: number) => {
    const v = fromCms[i]?.wartosc
    return typeof v === 'number' && v > 0 ? v : null
  }

  return [
    {
      label: label(0, 'Członkowie samorządu'),
      value: cmsVal(0) ?? osoby,
      to: '/sklad',
    },
    {
      label: label(1, 'Komisje'),
      value: cmsVal(1) ?? komisje,
    },
    {
      label: label(2, 'TODO(treść): uchwały w roku'),
      value: cmsVal(2) ?? 0,
    },
    {
      label: label(3, 'Artykuły w bazie'),
      value: cmsVal(3) ?? kbCount.value ?? 0,
    },
  ]
})

const heroTitle = computed(
  () => ustawienia.value?.hero?.tytul || 'Wiemy, jak to działa.',
)

const heroLead = computed(
  () =>
    ustawienia.value?.hero?.opis
    || 'TODO(treść): jedno zdanie — student EiTI wie, gdzie załatwić sprawę.',
)
</script>

<template>
  <div class="home">
    <HomeHero
      :title="heroTitle"
      :lead="heroLead"
    />
    <HomeTopics :topics="topics" />
    <HomeNewsStrip :items="news || []" />
    <HomeStats :stats="stats" />
    <section class="home-calendar section section--surface">
      <div class="container home-calendar__grid">
        <HomeEvents :events="events" />
        <HomeContact
          :email="ustawienia?.kontakt?.email"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-calendar__grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 900px) {
  .home-calendar__grid {
    grid-template-columns: 1fr;
  }
}
</style>
