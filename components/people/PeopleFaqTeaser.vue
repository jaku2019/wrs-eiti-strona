<script setup lang="ts">
import type { FaqPytanie } from '~/utils/faq'

defineProps<{
  pytania: FaqPytanie[]
}>()
</script>

<template>
  <section class="faq-teaser section" aria-labelledby="faq-teaser-heading">
    <div class="container faq-teaser__grid">
      <div class="faq-teaser__intro">
        <div class="faq-teaser__icon" aria-hidden="true">
          <UiIcon name="circleHelp" :size="22" />
        </div>
        <h2 id="faq-teaser-heading">Kto za co odpowiada?</h2>
        <p>
          Krótki przewodnik po organach i funkcjach samorządu — od WRS po Parlament Samorządu Studentów&nbsp;PW.
        </p>
        <UiButton to="/faq#organy">Przejdź do FAQ</UiButton>
      </div>
      <ul v-if="pytania.length" class="faq-teaser__links">
        <li v-for="p in pytania.slice(0, 4)" :key="p.id">
          <NuxtLink :to="`/faq#${p.id}`" class="faq-teaser__link">
            <span>{{ p.q }}</span>
            <UiIcon name="arrowRight" :size="16" />
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.faq-teaser__grid {
  display: grid;
  gap: 2rem;
  align-items: start;
}

@media (min-width: 900px) {
  .faq-teaser__grid {
    grid-template-columns: 1fr 1.1fr;
    gap: 3rem;
  }
}

.faq-teaser__intro {
  display: grid;
  gap: 0.85rem;
  justify-items: start;
}

.faq-teaser__intro p {
  margin: 0;
  max-width: 32rem;
  color: var(--muted);
}

.faq-teaser__icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: var(--r-sm);
  background: var(--tint);
  color: var(--link);
}

.faq-teaser__links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.35rem;
}

.faq-teaser__link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.95rem 0;
  border-bottom: 1px solid var(--line);
  color: var(--heading);
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
}

.faq-teaser__link:hover {
  color: var(--link);
}

.faq-teaser__link :deep(.ui-icon) {
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.faq-teaser__link:hover :deep(.ui-icon) {
  transform: translateX(3px);
}

@media (prefers-reduced-motion: reduce) {
  .faq-teaser__link :deep(.ui-icon) {
    transition: none;
  }
}
</style>
