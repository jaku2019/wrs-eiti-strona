<script setup lang="ts">
import type { AktualnoscMeta } from '~/utils/contentFilters'

const props = withDefaults(
  defineProps<{
    items: AktualnoscMeta[]
    pageSize?: number
  }>(),
  {
    pageSize: 6,
  },
)

const visibleCount = ref(props.pageSize)

watch(
  () => props.items,
  () => {
    visibleCount.value = props.pageSize
  },
)

const visible = computed(() => props.items.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < props.items.length)

function showMore() {
  visibleCount.value = Math.min(
    visibleCount.value + props.pageSize,
    props.items.length,
  )
}

function pathOf(item: AktualnoscMeta): string {
  return item._path || '#'
}
</script>

<template>
  <div class="news-list">
    <div class="news-list__grid">
      <NewsCard
        v-for="item in visible"
        :key="pathOf(item)"
        :to="pathOf(item)"
        :title="item.title || 'Bez tytułu'"
        :date="item.date"
        :excerpt="typeof item.excerpt === 'string' ? item.excerpt : null"
        :image="typeof item.image === 'string' && item.image ? item.image : null"
        variant="full"
      />
    </div>

    <p v-if="!items.length" class="news-list__empty">
      Brak opublikowanych aktualności.
    </p>

    <div v-if="hasMore" class="news-list__more">
      <UiButton variant="ghost" type="button" @click="showMore">
        Pokaż więcej
      </UiButton>
    </div>
  </div>
</template>

<style scoped>
.news-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}

.news-list__empty {
  color: var(--muted);
  margin: 1rem 0 0;
}

.news-list__more {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}
</style>
