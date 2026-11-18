<script setup lang="ts">
import type { AktualnoscMeta } from '~/utils/contentFilters'

defineProps<{
  items: AktualnoscMeta[]
}>()
</script>

<template>
  <section
    id="aktualnosci"
    class="home-news"
  >
    <div class="container">
      <div class="home-news__head reveal">
        <h2 class="home-news__title">
          Aktualności
        </h2>
        <UiLink to="/aktualnosci">
          Wszystkie
        </UiLink>
      </div>

      <div
        v-if="items.length"
        class="home-news__strip reveal"
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
/* mockup: #aktualnosci, .news-head, .news */
.home-news {
  background: var(--bg);
  padding-block: 56px;
}

.home-news__head {
  display: flex;
  align-items: center;
  gap: 16px 28px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.home-news__title {
  margin: 0 auto 0 0;
  font-size: 28px;
}

.home-news__strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.home-news__empty {
  margin: 0;
  color: var(--muted);
  font-size: 15px;
}

@media (max-width: 900px) {
  .home-news__strip {
    grid-auto-flow: column;
    grid-template-columns: none;
    grid-auto-columns: min(320px, 82%);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
  }

  .home-news__strip::-webkit-scrollbar {
    display: none;
  }

  .home-news__strip :deep(.news-card) {
    scroll-snap-align: start;
  }
}
</style>
