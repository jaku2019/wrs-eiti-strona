<script setup lang="ts">
import type { FaqSekcja } from '~/utils/faq'
import { matchesFaqQuery } from '~/utils/faq'

const props = defineProps<{
  sekcje: FaqSekcja[]
  query: string
  /** Bumps when a question should be revealed (hash navigation). */
  revealId: string | null
  revealToken: number
}>()

const emit = defineEmits<{
  open: [id: string]
}>()

const filtered = computed(() =>
  props.sekcje
    .map((sekcja) => ({
      ...sekcja,
      pytania: (sekcja.pytania ?? []).filter((p) => matchesFaqQuery(p, props.query)),
    }))
    .filter((sekcja) => sekcja.pytania.length > 0),
)

function onToggle(id: string, open: boolean) {
  if (open) emit('open', id)
}

function tokenFor(id: string): number | undefined {
  return props.revealId === id ? props.revealToken : undefined
}
</script>

<template>
  <div class="faq-sections">
    <section
      v-for="sekcja in filtered"
      :id="sekcja.id"
      :key="sekcja.id"
      class="faq-section"
      :aria-labelledby="`faq-sec-${sekcja.id}`"
    >
      <h2 :id="`faq-sec-${sekcja.id}`" class="faq-section__title">
        {{ sekcja.tytul }}
      </h2>
      <div class="faq-section__items">
        <FaqItem
          v-for="pytanie in sekcja.pytania"
          :key="pytanie.id"
          :pytanie="pytanie"
          :reveal-token="tokenFor(pytanie.id)"
          @toggle="onToggle"
        />
      </div>
    </section>

    <div
      v-if="!filtered.length"
      class="faq-empty"
      role="status"
    >
      <UiIcon name="circleHelp" :size="28" />
      <p>Brak pytań pasujących do wyszukiwania.</p>
    </div>
  </div>
</template>

<style scoped>
.faq-sections {
  display: grid;
  gap: 2.75rem;
}

.faq-section {
  scroll-margin-top: 88px;
}

.faq-section__title {
  margin: 0 0 0.5rem;
  font-size: clamp(26px, 3.2vw, 36px);
}

.faq-empty {
  display: grid;
  place-items: center;
  gap: 0.45rem;
  padding: 2.5rem 1rem;
  text-align: center;
  color: var(--muted);
  border: 1px dashed var(--line);
  border-radius: var(--r-lg);
  background: var(--surface);
}

.faq-empty p {
  margin: 0;
}
</style>
