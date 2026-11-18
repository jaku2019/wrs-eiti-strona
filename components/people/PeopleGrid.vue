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
      <UiIcon name="users" :size="28" />
      <p>Brak osób spełniających wybrane kryteria.</p>
      <p class="people-empty__hint">Zmień filtr grupy albo wyczyść wyszukiwanie.</p>
    </div>
  </div>
</template>

<style scoped>
.people-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(176px, 1fr));
  gap: 1.5rem 1.1rem;
}

.people-empty {
  display: grid;
  place-items: center;
  gap: 0.4rem;
  padding: 3rem 1.25rem;
  text-align: center;
  color: var(--muted);
  border: 1px dashed var(--line);
  border-radius: var(--r-lg);
  background: var(--surface);
}

.people-empty p {
  margin: 0;
  max-width: 28rem;
}

.people-empty__hint {
  font-size: 14px;
}
</style>
