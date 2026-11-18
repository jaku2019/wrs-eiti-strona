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
        ><UiIcon
          name="chevronRight"
          :size="16"
        /></span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
/* mockup: .crumbs */
.crumbs ol {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  font-size: 13px;
  color: var(--muted);
}

.crumbs li {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.crumbs a {
  color: var(--muted);
  text-decoration: none;
  transition: color 0.2s;
}

.crumbs a:hover {
  color: var(--link);
}

.crumbs__sep {
  display: inline-flex;
}
</style>
