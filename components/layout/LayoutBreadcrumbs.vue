<script setup lang="ts">
export type Crumb = {
  label: string
  to?: string
}

defineProps<{
  items: Crumb[]
}>()
</script>

<template>
  <nav class="crumbs" aria-label="Okruszki">
    <ol>
      <li v-for="(item, i) in items" :key="`${item.label}-${i}`">
        <NuxtLink v-if="item.to" :to="item.to">{{ item.label }}</NuxtLink>
        <span v-else aria-current="page">{{ item.label }}</span>
        <span
          v-if="i < items.length - 1"
          class="crumbs__sep"
          aria-hidden="true"
        >›</span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.crumbs {
  margin-bottom: 1.25rem;
}

.crumbs ol {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  align-items: center;
  font-size: 14px;
  color: var(--muted);
}

.crumbs li {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.crumbs a {
  color: var(--muted);
  text-decoration: none;
}

.crumbs a:hover {
  color: var(--link);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.crumbs [aria-current='page'] {
  color: var(--text);
}

.crumbs__sep {
  color: var(--line);
}
</style>
