<script setup lang="ts">
import { KB_CATEGORIES, type KbCategoryId } from '~/utils/kbMeta'

defineProps<{
  counts: Partial<Record<KbCategoryId, number>>
}>()
</script>

<template>
  <ul class="kb-cats">
    <li v-for="cat in KB_CATEGORIES" :key="cat.id">
      <NuxtLink
        :to="{ path: '/baza-wiedzy', hash: `#kategoria-${cat.id}` }"
        class="kb-cat"
      >
        <span class="kb-cat__icon">
          <UiIcon :name="cat.icon" :size="22" />
        </span>
        <span class="kb-cat__text">
          <span class="kb-cat__title">{{ cat.label }}</span>
          <span class="kb-cat__desc">{{ cat.description }}</span>
        </span>
        <span class="kb-cat__count">
          {{ counts[cat.id] ?? 0 }}
        </span>
      </NuxtLink>
    </li>
  </ul>
</template>

<style scoped>
.kb-cats {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
}

.kb-cat {
  display: grid;
  grid-template-columns: 44px 1fr auto;
  gap: 0.85rem;
  align-items: start;
  padding: 1.1rem 1.15rem;
  border: 1px solid var(--line);
  border-radius: var(--r);
  background: var(--bg);
  text-decoration: none;
  color: inherit;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease;
}

.kb-cat:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}

.kb-cat__icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: var(--r-sm);
  background: var(--tint);
  color: var(--link);
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.kb-cat:hover .kb-cat__icon {
  background: var(--szafir-deep);
  color: #fff;
}

:root[data-theme='dark'] .kb-cat:hover .kb-cat__icon {
  color: var(--grafit-deep);
}

.kb-cat__title {
  display: block;
  font-family: var(--font-sans);
  font-size: 19px;
  font-weight: 600;
  color: var(--heading);
  margin-bottom: 0.25rem;
}

.kb-cat__desc {
  display: block;
  font-size: 14px;
  line-height: 1.45;
  color: var(--muted);
}

.kb-cat__count {
  font-family: var(--font-display);
  font-size: 1.25rem;
  color: var(--muted);
  line-height: 1;
  padding-top: 0.2rem;
}

@media (prefers-reduced-motion: reduce) {
  .kb-cat,
  .kb-cat__icon {
    transition: none;
  }

  .kb-cat:hover {
    transform: none;
  }
}
</style>
