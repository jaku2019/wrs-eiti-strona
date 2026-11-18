<script setup lang="ts">
useSeoMeta({
  title: 'Aktualności — WRS WEiTI',
  description: 'Aktualności Wydziałowej Rady Samorządu WEiTI.',
  ogTitle: 'Aktualności — WRS WEiTI',
  ogDescription: 'Aktualności Wydziałowej Rady Samorządu WEiTI.',
})

const { data: items } = await usePublishedAktualnosci({
  key: 'aktualnosci-list',
})
</script>

<template>
  <div class="section">
    <div class="container">
      <LayoutBreadcrumbs
        :items="[
          { label: 'Strona główna', to: '/' },
          { label: 'Aktualności' },
        ]"
      />
      <UiEyebrow>Newsy</UiEyebrow>
      <h1>Aktualności</h1>
      <p class="lead">
        Ogłoszenia i komunikaty Wydziałowej Rady Samorządu WEiTI.
      </p>

      <NewsList :items="items ?? []" />
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
  margin-bottom: 2rem;
}
</style>
