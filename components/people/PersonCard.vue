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
    :class="{ 'person-card--key': person.kluczowa }"
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
    <div>
      <h3 class="person-card__name">
        <template
          v-for="(part, i) in highlightedName"
          :key="`n-${i}`"
        >
          <mark v-if="part.mark">{{ part.text }}</mark>
          <template v-else>{{ part.text }}</template>
        </template>
      </h3>
      <p class="person-card__role">
        <template
          v-for="(part, i) in highlightedRole"
          :key="`r-${i}`"
        >
          <mark v-if="part.mark">{{ part.text }}</mark>
          <template v-else>{{ part.text }}</template>
        </template>
      </p>
    </div>
  </article>
</template>

<style scoped>
/* mockup: .person / .photo */
.person-card {
  display: grid;
  gap: 12px;
  align-content: start;
  min-width: 0;
  color: var(--text);
}

.person-card__media {
  position: relative;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border-radius: var(--r);
  background: var(--wrzos-soft);
}

.person-card__media img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.person-card:hover :deep(.avatar-placeholder)::before {
  left: 70%;
}

.person-card__name {
  font: 500 18px / 1.2 var(--font-display);
  letter-spacing: -0.01em;
  color: var(--heading);
}

.person-card__role {
  margin-top: 3px;
  font-size: 14px;
  line-height: 1.35;
  color: var(--muted);
}

.person-card--key .person-card__role {
  color: var(--link);
  font-weight: 500;
}
</style>
