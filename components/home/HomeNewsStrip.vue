<script setup lang="ts">
import type { AktualnoscMeta } from '~/utils/contentFilters'

defineProps<{
  items: AktualnoscMeta[]
}>()
</script>

<template>
  <section
    id="aktualnosci"
    class="home-news section section--compact"
  >
    <div class="container">
      <div class="home-news__head">
        <h2 class="home-news__title">
          Aktualności
        </h2>
        <UiLink to="/aktualnosci">
          Wszystkie
        </UiLink>
      </div>

      <div
        v-if="items.length"
        class="home-news__strip"
      >
        <NewsCard
          v-for="item in items"
          :key="item._path || String(item.date)"
          :to="item._path || '/aktualnosci'"
          :title="item.title || 'Aktualność'"
          :date="item.date"
          :image="item.image || null"
          variant="compact"
        />
      </div>
      <p
        v-else
        class="home-news__empty"
      >
        TODO(treść): brak opublikowanych aktualności.
      </p>
    </div>
  </section>
</template>

<style scoped>
.home-news {
  background: var(--bg);
}

.home-news__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.15rem;
}

.home-news__title {
  margin: 0;
  font-size: 28px;
}

.home-news__strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
}

.home-news__empty {
  margin: 0;
  color: var(--muted);
  font-size: 15px;
}

@media (max-width: 900px) {
  .home-news__strip {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding-bottom: 0.25rem;
    margin-inline: calc(-1 * var(--gutter));
    padding-inline: var(--gutter);
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .home-news__strip::-webkit-scrollbar {
    display: none;
  }

  .home-news__strip :deep(.news-card) {
    flex: 0 0 min(78vw, 320px);
    scroll-snap-align: start;
  }
}
</style>
