<script setup lang="ts">
useSeoMeta({
  title: 'Baza wiedzy — WRS WEiTI',
  description: 'Baza wiedzy samorządu WEiTI — jak załatwić sprawę.',
})
</script>

<template>
  <div class="section">
    <div class="container stub">
      <UiEyebrow>Baza wiedzy</UiEyebrow>
      <h1>Baza wiedzy</h1>
      <p class="lead">
        TODO(treść): kategorie i artykuły z <code>content/baza-wiedzy/</code> (A4).
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
