<script setup lang="ts">
import type { SkladOsoba } from '~/utils/sklad'
import { splitHighlight } from '~/utils/sklad'

const props = defineProps<{
  person: SkladOsoba
  personId: string
  query?: string
}>()

const highlightedName = computed(() =>
  splitHighlight(props.person.imie, props.query ?? ''),
)
const highlightedRole = computed(() =>
  splitHighlight(props.person.funkcja, props.query ?? ''),
)
</script>

<template>
  <article
    class="person-card"
    :style="{ viewTransitionName: `person-${personId}` }"
  >
    <div class="person-card__media">
      <img
        v-if="person.zdjecie"
        :src="person.zdjecie"
        :alt="person.imie"
        width="176"
        height="220"
        loading="lazy"
        decoding="async"
      >
      <UiAvatarPlaceholder
        v-else
        :name="person.imie"
        :group="person.grupa"
      />
    </div>
    <h3 class="person-card__name">
      <template v-for="(part, i) in highlightedName" :key="`n-${i}`">
        <mark v-if="part.mark">{{ part.text }}</mark>
        <template v-else>{{ part.text }}</template>
      </template>
    </h3>
    <p
      class="person-card__role"
      :class="{ 'person-card__role--key': person.kluczowa }"
    >
      <template v-for="(part, i) in highlightedRole" :key="`r-${i}`">
        <mark v-if="part.mark">{{ part.text }}</mark>
        <template v-else>{{ part.text }}</template>
      </template>
    </p>
  </article>
</template>

<style scoped>
.person-card {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  min-width: 0;
}

.person-card__media {
  border-radius: var(--r);
  overflow: hidden;
  background: var(--wrzos-soft);
}

.person-card__media img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}

.person-card__name {
  margin: 0;
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.25;
  color: var(--heading);
}

.person-card__role {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  color: var(--muted);
}

.person-card__role--key {
  color: var(--link);
  font-weight: 500;
}

.person-card :deep(mark) {
  background: color-mix(in srgb, var(--szafir) 28%, transparent);
  color: inherit;
  border-radius: 2px;
  padding: 0 0.1em;
}

:root[data-theme='dark'] .person-card :deep(mark) {
  background: color-mix(in srgb, var(--szafir) 40%, transparent);
}
</style>
