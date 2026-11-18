<script setup lang="ts">
import { KB_CATEGORIES, type KbCategoryId } from '~/utils/kbMeta'

export type KbTreeArticle = {
  _path?: string
  title?: string
  category?: string
}

const props = defineProps<{
  articles: KbTreeArticle[]
  currentPath?: string | null
  currentCategory?: string | null
}>()

const grouped = computed(() =>
  KB_CATEGORIES.map((cat) => ({
    ...cat,
    articles: props.articles.filter((a) => a.category === cat.id),
  })).filter((g) => g.articles.length > 0),
)

function isCurrent(path?: string) {
  return !!path && path === props.currentPath
}

function isCatOpen(id: KbCategoryId) {
  return props.currentCategory === id
}
</script>

<template>
  <nav class="kb-tree" aria-label="Kategorie bazy wiedzy">
    <div
      v-for="group in grouped"
      :key="group.id"
      class="kb-tree__group"
    >
      <p class="kb-tree__label">
        <UiIcon :name="group.icon" :size="16" />
        <span>{{ group.label }}</span>
      </p>
      <ul
        class="kb-tree__list"
        :data-open="isCatOpen(group.id) ? 'true' : undefined"
      >
        <li v-for="article in group.articles" :key="article._path">
          <NuxtLink
            :to="article._path || '/baza-wiedzy'"
            class="kb-tree__link"
            :aria-current="isCurrent(article._path) ? 'page' : undefined"
          >
            {{ article.title }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.kb-tree {
  display: grid;
  gap: 1.25rem;
}

.kb-tree__label {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0 0 0.45rem;
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
}

.kb-tree__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.15rem;
}

.kb-tree__link {
  display: block;
  padding: 0.35rem 0.5rem;
  border-radius: var(--r-sm);
  color: var(--text);
  text-decoration: none;
  font-size: 14px;
  line-height: 1.35;
}

.kb-tree__link:hover {
  background: var(--tint);
  color: var(--link);
}

.kb-tree__link[aria-current='page'] {
  background: var(--tint);
  color: var(--link);
  font-weight: 600;
}
</style>
