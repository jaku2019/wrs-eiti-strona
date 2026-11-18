<script setup lang="ts">
useSeoMeta({
  title: 'Dokumenty — WRS WEiTI',
  description: 'Regulaminy, uchwały i protokoły samorządu WEiTI.',
})
</script>

<template>
  <div class="section">
    <div class="container stub">
      <UiEyebrow>Materiały</UiEyebrow>
      <h1>Dokumenty</h1>
      <p class="lead">
        TODO(treść): lista dokumentów z filtrami typu i roku (A4).
      </p>
      <UiLink to="/">Wróć na stronę główną</UiLink>
    </div>
  </div>
</template>

<style scoped>
.stub h1 {
  font-size: clamp(36px, 5vw, 64px);
}

.lead {
  max-width: 36rem;
  color: var(--muted);
}
</style>
