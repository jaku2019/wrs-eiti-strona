<script setup lang="ts">
export type KbRelatedItem = {
  _path?: string
  title?: string
  summary?: string
}

defineProps<{
  items: KbRelatedItem[]
}>()
</script>

<template>
  <section v-if="items.length" class="kb-related" aria-labelledby="kb-related-title">
    <h2 id="kb-related-title" class="kb-related__title">Powiązane</h2>
    <ul class="kb-related__list">
      <li v-for="item in items" :key="item._path">
        <NuxtLink :to="item._path || '/baza-wiedzy'" class="kb-related__link">
          <span class="kb-related__name">{{ item.title }}</span>
          <span v-if="item.summary" class="kb-related__summary">{{ item.summary }}</span>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.kb-related {
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--line);
}

.kb-related__title {
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0;
  color: var(--muted);
  margin: 0 0 0.65rem;
}

.kb-related__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.55rem;
}

.kb-related__link {
  display: grid;
  gap: 0.15rem;
  text-decoration: none;
  color: inherit;
}

.kb-related__name {
  font-size: 14px;
  font-weight: 600;
  color: var(--link);
}

.kb-related__summary {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.4;
}
</style>
