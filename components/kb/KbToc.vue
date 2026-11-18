<script setup lang="ts">
import type { TocHeading } from '~/utils/toc'

const props = defineProps<{
  items: TocHeading[]
}>()

const ids = computed(() => props.items.map((i) => i.id))

const { activeId } = useScrollSpy(ids, {
  stateKey: 'wrs-kb-toc-spy',
  enabled: computed(() => props.items.length > 0),
})
</script>

<template>
  <nav v-if="items.length" class="kb-toc" aria-label="Spis treści">
    <p class="kb-toc__title">Na tej stronie</p>
    <ol class="kb-toc__list">
      <li
        v-for="item in items"
        :key="item.id"
        :class="[`kb-toc__item--h${item.depth}`]"
      >
        <a
          :href="`#${item.id}`"
          class="kb-toc__link"
          :aria-current="activeId === item.id ? 'location' : undefined"
        >
          {{ item.text }}
        </a>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.kb-toc__title {
  margin: 0 0 0.65rem;
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
}

.kb-toc__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.2rem;
  border-left: 1px solid var(--line);
}

.kb-toc__link {
  display: block;
  padding: 0.3rem 0 0.3rem 0.85rem;
  margin-left: -1px;
  border-left: 2px solid transparent;
  color: var(--muted);
  text-decoration: none;
  font-size: 14px;
  line-height: 1.35;
  transition:
    color 0.15s ease,
    border-color 0.15s ease;
}

.kb-toc__item--h3 .kb-toc__link {
  padding-left: 1.35rem;
  font-size: 13px;
}

.kb-toc__link:hover {
  color: var(--link);
}

.kb-toc__link[aria-current='location'] {
  color: var(--link);
  border-left-color: var(--accent);
  font-weight: 600;
}

@media (prefers-reduced-motion: reduce) {
  .kb-toc__link {
    transition: none;
  }
}
</style>
