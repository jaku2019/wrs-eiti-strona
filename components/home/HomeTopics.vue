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
    class="home-topics section section--surface"
  >
    <div class="container">
      <UiEyebrow>Baza wiedzy</UiEyebrow>
      <div class="home-topics__head">
        <h2>Najczęstsze sprawy</h2>
        <UiLink to="/baza-wiedzy">
          Wszystkie artykuły
        </UiLink>
      </div>
      <ul class="home-topics__grid">
        <li
          v-for="topic in topics"
          :key="topic.id"
        >
          <NuxtLink
            :to="topic.to"
            class="topic-tile"
          >
            <span
              class="topic-tile__icon"
              aria-hidden="true"
            >
              <UiIcon
                :name="topic.icon"
                :size="22"
              />
            </span>
            <span class="topic-tile__title">{{ topic.title }}</span>
            <span class="topic-tile__desc">{{ topic.description }}</span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.home-topics__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem 1.25rem;
  margin-bottom: 1.75rem;
}

.home-topics__head h2 {
  margin: 0;
}

.home-topics__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.topic-tile {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  height: 100%;
  padding: 1.15rem 1.1rem 1.25rem;
  border: 1px solid var(--line);
  border-radius: var(--r);
  background: var(--bg);
  text-decoration: none;
  color: inherit;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.topic-tile:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 10px 28px color-mix(in srgb, var(--grafit) 8%, transparent);
}

.topic-tile__icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: var(--r-sm);
  background: var(--tint);
  color: var(--link);
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.topic-tile:hover .topic-tile__icon {
  background: var(--szafir-deep);
  color: #fff;
}

.topic-tile__title {
  font-family: var(--font-sans);
  font-size: 19px;
  font-weight: 600;
  line-height: 1.25;
  color: var(--heading);
}

.topic-tile__desc {
  font-size: 14px;
  line-height: 1.45;
  color: var(--muted);
}

@media (max-width: 1000px) {
  .home-topics__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .home-topics__grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .topic-tile,
  .topic-tile__icon {
    transition: none;
  }

  .topic-tile:hover {
    transform: none;
  }
}
</style>
