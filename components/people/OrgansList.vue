<script setup lang="ts">
import type { SkladPrzedstawiciel } from '~/utils/sklad'

defineProps<{
  items: SkladPrzedstawiciel[]
}>()
</script>

<template>
  <section
    class="organs"
    aria-labelledby="przedstawiciele-heading"
  >
    <div class="organs__head">
      <h2 id="przedstawiciele-heading">
        Przedstawiciele
      </h2>
      <p>Osoby delegowane przez samorząd do organów wydziałowych i uczelnianych.</p>
    </div>

    <ul class="organs__list">
      <li
        v-for="(item, i) in items"
        :key="`${item.organ}-${i}`"
        class="organ"
      >
        <div>
          <b>{{ item.organ }}</b>
          <span
            v-if="item.opis"
            class="organ__sub"
          >{{ item.opis }}</span>
        </div>
        <ul
          v-if="item.osoby?.length"
          class="organ__names"
        >
          <li
            v-for="(name, j) in item.osoby"
            :key="`${name}-${j}`"
          >
            {{ name }}
          </li>
        </ul>
        <p
          v-else
          class="organ__sub"
        >
          TODO(treść): brak wskazanych przedstawicieli.
        </p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
/* mockup: .block + .block-head + .organs/.organ */
.organs {
  padding: 36px 0;
}

.organs__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 20px;
}

.organs__head h2 {
  font-size: 30px;
}

.organs__head p {
  margin-left: auto;
  font-size: 14px;
  color: var(--muted);
}

.organs__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}

.organ {
  display: grid;
  grid-template-columns: minmax(200px, 1fr) 2fr;
  gap: 16px;
  align-items: center;
  padding: 14px 18px;
  border: 1px solid var(--line);
  border-radius: var(--r);
  background: var(--surface);
}

.organ b {
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
}

.organ__sub {
  display: block;
  font-size: 13px;
  color: var(--muted);
}

.organ__names {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.organ__names li {
  padding: 3px 9px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: var(--bg);
  font-size: 13.5px;
}

@media (max-width: 700px) {
  .organ {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .organs__head p {
    margin-left: 0;
  }
}
</style>
