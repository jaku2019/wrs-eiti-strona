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
    <div class="home-events__head reveal">
      <div>
        <UiEyebrow>Kalendarz</UiEyebrow>
        <h2>Nadchodzące</h2>
      </div>
      <button
        v-if="events.length"
        type="button"
        class="home-events__ics"
        @click="onAddToCalendar"
      >
        <UiIcon
          name="calendar"
          :size="16"
        />
        Dodaj do kalendarza
      </button>
    </div>

    <ul
      v-if="events.length"
      class="home-events__list reveal"
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
/* mockup: .sec-head + .list (kalendarz) */
.home-events__head {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 40px;
}

.home-events__head :deep(.ui-eyebrow) {
  margin: 0;
}

.home-events__head h2 {
  margin-top: 12px;
}

.home-events__ics {
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 0;
  background: none;
  padding: 0;
  color: var(--link);
  font: 500 15px var(--font-sans);
  cursor: pointer;
  text-decoration: underline 1px transparent;
  text-underline-offset: 5px;
  transition: text-decoration-color 0.25s;
}

.home-events__ics:hover {
  text-decoration-color: currentColor;
}

.home-events__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}

.event-row {
  display: grid;
  grid-template-columns: 44px 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 8px 14px 8px 8px;
  border: 1px solid var(--line);
  border-radius: var(--r);
  transition: border-color 0.2s;
}

.event-row:hover {
  border-color: color-mix(in oklab, var(--szafir) 55%, transparent);
}

.event-row__date {
  display: grid;
  place-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--r-sm);
  background: var(--tint);
  text-align: center;
}

.event-row__day {
  font: 500 18px / 1 var(--font-display);
  color: var(--heading);
}

.event-row__month {
  display: block;
  margin-top: 2px;
  font: 600 9.5px var(--font-sans);
  color: var(--link);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.event-row__title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--text);
}

.event-row__meta {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 2px 12px;
  font-size: 13px;
  color: var(--muted);
}

.event-row__meta span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.event-row__meta :deep(.ui-icon) {
  width: 13px;
  height: 13px;
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
