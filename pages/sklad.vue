<script setup lang="ts">
useSeoMeta({
  title: 'Skład samorządu — WRS WEiTI',
  description: 'Skład samorządu Wydziału Elektroniki i Technik Informacyjnych PW.',
})
</script>

<template>
  <div class="section">
    <div class="container stub">
      <nav class="crumbs" aria-label="Okruszki">
        <NuxtLink to="/">Strona główna</NuxtLink>
        <span aria-hidden="true">›</span>
        <span>Skład</span>
      </nav>
      <UiEyebrow>Samorząd</UiEyebrow>
      <h1>Skład <em>samorządu</em></h1>
      <p class="lead">
        TODO(treść): strona składu — siatka osób, filtry i przedstawiciele (A4).
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

.crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 1.25rem;
  font-size: 14px;
  color: var(--muted);
}

.crumbs a {
  color: var(--link);
  text-decoration: none;
  font-weight: 600;
}
</style>
