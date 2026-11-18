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
  <div>
    <header class="page-head">
      <div class="container">
        <LayoutBreadcrumbs
          :items="[
            { label: 'Strona główna', to: '/' },
            { label: 'Aktualności' },
          ]"
        />
        <h1>Aktualności</h1>
        <p class="lead">
          Ogłoszenia i komunikaty Wydziałowej Rady Samorządu WEiTI.
        </p>
      </div>
    </header>

    <div class="container page-body">
      <NewsList :items="items ?? []" />
    </div>
  </div>
</template>

<style scoped>
.page-body {
  padding: 8px 0 96px;
}
</style>
