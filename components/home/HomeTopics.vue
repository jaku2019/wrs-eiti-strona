<script setup lang="ts">
import type { UiIconName } from '~/components/ui/UiIcon.vue'

export type HomeTopic = {
  id: string
  title: string
  description: string
  to: string
  icon: UiIconName
}

defineProps<{
  topics: HomeTopic[]
}>()
</script>

<template>
  <section
    id="baza"
    class="home-topics"
  >
    <div class="container">
      <div class="sec-head reveal">
        <div>
          <UiEyebrow>Baza wiedzy</UiEyebrow>
          <h2>Najczęstsze sprawy</h2>
        </div>
        <UiLink to="/baza-wiedzy">
          Wszystkie artykuły
        </UiLink>
      </div>
      <ul class="home-topics__grid reveal">
        <li
          v-for="topic in topics"
          :key="topic.id"
        >
          <NuxtLink
            :to="topic.to"
            class="tile"
          >
            <span
              class="tile__ico"
              aria-hidden="true"
            >
              <UiIcon
                :name="topic.icon"
                :size="22"
              />
            </span>
            <span class="tile__text">
              <span class="tile__title">{{ topic.title }}</span>
              <span class="tile__desc">{{ topic.description }}</span>
            </span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
/* mockup: #baza (padding-top 32px pod cięciem hero), .sec-head, .grid4, .tile */
.home-topics {
  background: var(--surface);
  padding: 32px 0 96px;
}

.sec-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.sec-head :deep(.ui-eyebrow) {
  margin: 0;
}

.sec-head h2 {
  margin-top: 12px;
}

.home-topics__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 16px;
}

.tile {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 28px;
  height: 100%;
  min-height: 210px;
  padding: 24px;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: var(--r);
  color: var(--text);
  text-decoration: none;
  transition:
    border-color 0.25s,
    box-shadow 0.25s,
    transform 0.25s var(--ease);
}

.tile__ico {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: var(--r-sm);
  background: var(--tint);
  color: var(--link);
  transition:
    background 0.25s,
    color 0.25s;
}

.tile:hover {
  border-color: color-mix(in oklab, var(--szafir) 55%, transparent);
  box-shadow: 0 12px 30px -18px #3c3c4c66;
  transform: translateY(-2px);
}

.tile:hover .tile__ico {
  background: var(--szafir-deep);
  color: #fff;
}

.tile__text {
  display: block;
}

.tile__title {
  display: block;
  font: 600 19px / 1.25 var(--font-sans);
  letter-spacing: -0.01em;
  color: var(--heading);
}

.tile__desc {
  display: block;
  margin-top: 6px;
  font-size: 14px;
  color: var(--muted);
}

@media (prefers-reduced-motion: reduce) {
  .tile,
  .tile__ico {
    transition: none;
  }

  .tile:hover {
    transform: none;
  }
}
</style>
