<script setup lang="ts">
import type { Wydarzenie } from '~/utils/calendarSource'
import { buildIcsCalendar, downloadIcs } from '~/utils/ics'
import {
  formatDay,
  formatMonthShort,
  formatTimePl,
} from '~/utils/formatDate'

const props = defineProps<{
  events: Wydarzenie[]
}>()

function onAddToCalendar() {
  if (!import.meta.client || !props.events.length) return
  const ics = buildIcsCalendar(props.events)
  downloadIcs('wrs-eiti-wydarzenia.ics', ics)
}
</script>

<template>
  <div
    id="kalendarz"
    class="home-events"
  >
    <div class="home-events__head">
      <h2>Nadchodzące</h2>
      <button
        v-if="events.length"
        type="button"
        class="home-events__ics"
        @click="onAddToCalendar"
      >
        Dodaj do kalendarza
      </button>
    </div>

    <ul
      v-if="events.length"
      class="home-events__list"
    >
      <li
        v-for="event in events"
        :key="event.id"
        class="event-row"
      >
        <div
          class="event-row__date"
          aria-hidden="true"
        >
          <span class="event-row__day">{{ formatDay(event.start) }}</span>
          <span class="event-row__month">{{ formatMonthShort(event.start) }}</span>
        </div>
        <div class="event-row__body">
          <p class="event-row__title">
            {{ event.tytul }}
          </p>
          <p class="event-row__meta">
            <span v-if="event.miejsce">
              <UiIcon
                name="mapPin"
                :size="14"
              />
              {{ event.miejsce }}
            </span>
            <span>
              <UiIcon
                name="clock"
                :size="14"
              />
              {{ formatTimePl(event.start) }}
              <template v-if="event.koniec">
                – {{ formatTimePl(event.koniec) }}
              </template>
            </span>
          </p>
        </div>
        <UiTag
          v-if="event.tag"
          class="event-row__tag"
        >
          {{ event.tag }}
        </UiTag>
      </li>
    </ul>
    <p
      v-else
      class="home-events__empty"
    >
      TODO(treść): brak nadchodzących wydarzeń w
      <code>wydarzenia.yml</code>.
    </p>
  </div>
</template>

<style scoped>
.home-events__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem 1rem;
  margin-bottom: 1rem;
}

.home-events__head h2 {
  margin: 0;
}

.home-events__ics {
  appearance: none;
  border: 0;
  background: none;
  padding: 0;
  color: var(--link);
  font: inherit;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  text-decoration-color: transparent;
  text-underline-offset: 5px;
}

.home-events__ics:hover {
  text-decoration-color: currentColor;
}

.home-events__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.event-row {
  display: grid;
  grid-template-columns: 44px 1fr auto;
  gap: 0.85rem;
  align-items: center;
  min-height: 64px;
  padding: 0.35rem 0;
  border-bottom: 1px solid var(--line);
}

.event-row:last-child {
  border-bottom: 0;
}

.event-row__date {
  width: 44px;
  height: 44px;
  border-radius: var(--r-sm);
  background: var(--tint);
  color: var(--link);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.event-row__day {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 500;
}

.event-row__month {
  font-size: 11px;
  font-weight: 600;
  text-transform: lowercase;
  margin-top: 2px;
}

.event-row__title {
  margin: 0 0 0.2rem;
  font-size: 15px;
  font-weight: 600;
  color: var(--heading);
}

.event-row__meta {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.85rem;
  font-size: 13px;
  color: var(--muted);
}

.event-row__meta span {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.event-row__tag {
  justify-self: end;
}

.home-events__empty {
  margin: 0;
  color: var(--muted);
  font-size: 15px;
}

@media (max-width: 560px) {
  .event-row {
    grid-template-columns: 44px 1fr;
  }

  .event-row__tag {
    grid-column: 2;
    justify-self: start;
  }
}
</style>
