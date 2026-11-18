<script setup lang="ts">
useSeoMeta({
  title: 'FAQ — WRS WEiTI',
  description: 'Najczęstsze pytania o samorząd WEiTI.',
})
</script>

<template>
  <div class="section">
    <div class="container stub">
      <UiEyebrow>Pomoc</UiEyebrow>
      <h1>FAQ</h1>
      <p class="lead">
        TODO(treść): pytania i odpowiedzi z <code>content/faq.yml</code> (A4).
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
