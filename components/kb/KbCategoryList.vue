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
/* jak kafelki „Najczęstsze sprawy” z mockupu (.tile), na tle --bg więc karta --surface */
.kb-cats {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 16px;
}

.kb-cat {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 28px;
  height: 100%;
  min-height: 210px;
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: var(--r);
  background: var(--surface);
  color: var(--text);
  text-decoration: none;
  transition:
    border-color 0.25s,
    box-shadow 0.25s,
    transform 0.25s var(--ease);
}

.kb-cat:hover {
  border-color: color-mix(in oklab, var(--szafir) 55%, transparent);
  box-shadow: 0 12px 30px -18px #3c3c4c66;
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
    background 0.25s,
    color 0.25s;
}

.kb-cat:hover .kb-cat__icon {
  background: var(--szafir-deep);
  color: #fff;
}

.kb-cat__title {
  display: block;
  font: 600 19px / 1.25 var(--font-sans);
  letter-spacing: -0.01em;
  color: var(--heading);
}

.kb-cat__desc {
  display: block;
  margin-top: 6px;
  font-size: 14px;
  color: var(--muted);
}

.kb-cat__count {
  position: absolute;
  top: 24px;
  right: 24px;
  font: 500 22px / 1 var(--font-display);
  color: var(--muted);
  font-variant-numeric: tabular-nums;
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
