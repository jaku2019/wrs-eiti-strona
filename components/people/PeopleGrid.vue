<script setup lang="ts">
import type { SkladOsoba } from '~/utils/sklad'
import { personKey } from '~/utils/sklad'

defineProps<{
  osoby: SkladOsoba[]
  query?: string
}>()
</script>

<template>
  <div class="people-grid-wrap">
    <div
      v-if="osoby.length"
      class="people-grid"
      role="list"
    >
      <div
        v-for="(person, index) in osoby"
        :key="personKey(person, index)"
        class="people-grid__item"
        role="listitem"
      >
        <PeoplePersonCard
          :person="person"
          :person-id="personKey(person, index)"
          :query="query"
        />
      </div>
    </div>
    <div
      v-else
      class="people-empty"
      role="status"
    >
      <p>Brak osób spełniających wybrane kryteria. Zmień filtr grupy albo wyczyść wyszukiwanie.</p>
    </div>
  </div>
</template>

<style scoped>
/* mockup: .people / .empty */
.people-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(176px, 1fr));
  gap: 28px 18px;
}

.people-empty {
  padding: 56px 0;
  text-align: center;
  color: var(--muted);
}
</style>
