<script setup lang="ts">
import { dokumentTypMeta, type DokumentMeta } from '~/utils/docsMeta'
import { formatDateShort, toDateTimeAttr } from '~/utils/formatDate'
import { withAppBase } from '~/utils/siteUrl'

defineProps<{
  items: DokumentMeta[]
}>()

function fileHref(path: string) {
  return withAppBase(path)
}
</script>

<template>
  <div class="docs-list">
    <p v-if="!items.length" class="docs-list__empty">
      Brak dokumentów dla wybranych filtrów.
    </p>

    <ul v-else class="docs-list__ul">
      <li
        v-for="(doc, i) in items"
        :key="`${doc.plik}-${i}`"
        class="docs-row"
      >
        <span class="docs-row__icon" aria-hidden="true">
          <UiIcon :name="dokumentTypMeta(doc.typ).icon" :size="20" />
        </span>
        <div class="docs-row__main">
          <a
            class="docs-row__title"
            :href="fileHref(doc.plik)"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ doc.tytul }}
          </a>
          <p class="docs-row__meta">
            <span>{{ dokumentTypMeta(doc.typ).label }}</span>
            <span aria-hidden="true">·</span>
            <time :datetime="toDateTimeAttr(doc.data)">
              {{ formatDateShort(doc.data) }}
            </time>
            <template v-if="doc.rozmiar">
              <span aria-hidden="true">·</span>
              <span>{{ doc.rozmiar }}</span>
            </template>
          </p>
        </div>
        <a
          class="docs-row__dl"
          :href="fileHref(doc.plik)"
          target="_blank"
          rel="noopener noreferrer"
        >
          PDF
          <UiIcon name="externalLink" :size="14" />
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.docs-list__empty {
  color: var(--muted);
  margin: 0.5rem 0 0;
}

.docs-list__ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.docs-row {
  display: grid;
  grid-template-columns: 44px 1fr auto;
  gap: 0.85rem;
  align-items: center;
  padding: 0.95rem 0;
  border-bottom: 1px solid var(--line);
}

.docs-row__icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: var(--r-sm);
  background: var(--tint);
  color: var(--link);
}

.docs-row__title {
  font-weight: 600;
  color: var(--heading);
  text-decoration: none;
}

.docs-row__title:hover {
  color: var(--link);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.docs-row__meta {
  margin: 0.25rem 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  font-size: 13px;
  color: var(--muted);
}

.docs-row__dl {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 14px;
  font-weight: 600;
  color: var(--link);
  text-decoration: none;
  white-space: nowrap;
}

.docs-row__dl:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 640px) {
  .docs-row {
    grid-template-columns: 40px 1fr;
  }

  .docs-row__dl {
    grid-column: 2;
  }
}
</style>
