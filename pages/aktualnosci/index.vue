<script setup lang="ts">
useSeoMeta({
  title: 'Aktualności — WRS WEiTI',
  description: 'Aktualności Wydziałowej Rady Samorządu WEiTI.',
})
</script>

<template>
  <div class="section">
    <div class="container stub">
      <UiEyebrow>Newsy</UiEyebrow>
      <h1>Aktualności</h1>
      <p class="lead">
        TODO(treść): lista wpisów z <code>content/aktualnosci/</code> (A4).
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
