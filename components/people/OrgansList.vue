<script setup lang="ts">
import type { SkladPrzedstawiciel } from '~/utils/sklad'

defineProps<{
  items: SkladPrzedstawiciel[]
}>()
</script>

<template>
  <section class="organs section section--surface" aria-labelledby="przedstawiciele-heading">
    <div class="container">
      <UiEyebrow>Organy</UiEyebrow>
      <h2 id="przedstawiciele-heading">Przedstawiciele</h2>
      <p class="organs__lead">
        Osoby delegowane przez samorząd do organów wydziałowych i uczelnianych.
      </p>

      <ul class="organs__list">
        <li
          v-for="(item, i) in items"
          :key="`${item.organ}-${i}`"
          class="organs__item"
        >
          <div class="organs__head">
            <h3>{{ item.organ }}</h3>
            <p v-if="item.opis" class="organs__desc">{{ item.opis }}</p>
          </div>
          <ul v-if="item.osoby?.length" class="organs__pills">
            <li v-for="(name, j) in item.osoby" :key="`${name}-${j}`">
              <span class="pill">{{ name }}</span>
            </li>
          </ul>
          <p v-else class="organs__empty">TODO(treść): brak wskazanych przedstawicieli.</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.organs__lead {
  max-width: 36rem;
  margin: 0 0 2rem;
  color: var(--muted);
}

.organs__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1.5rem;
}

.organs__item {
  display: grid;
  gap: 0.85rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--line);
}

.organs__item:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.organs__head h3 {
  margin: 0 0 0.35rem;
  font-size: clamp(22px, 2.4vw, 28px);
}

.organs__desc {
  margin: 0;
  color: var(--muted);
  font-size: 15px;
}

.organs__pills {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.pill {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 0.85rem;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--bg);
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
}

.organs__empty {
  margin: 0;
  color: var(--muted);
  font-size: 14px;
}
</style>
