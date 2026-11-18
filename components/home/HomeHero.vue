<script setup lang="ts">
const props = defineProps<{
  title: string
  lead: string
  eyebrow?: string
}>()

const { reduced } = useReducedMotion()
const titleRef = ref<HTMLElement | null>(null)

const words = computed(() => {
  const raw = props.title.trim() || 'Wiemy, jak to działa.'
  return raw.split(/\s+/).filter(Boolean)
})

onMounted(() => {
  if (reduced.value || !titleRef.value) return
  const spans = titleRef.value.querySelectorAll<HTMLElement>('.home-hero__word')
  spans.forEach((el, i) => {
    el.animate(
      [
        { opacity: 0, filter: 'blur(8px)', transform: 'translateY(0.45em)' },
        { opacity: 1, filter: 'blur(0)', transform: 'translateY(0)' },
      ],
      {
        duration: 720,
        delay: 80 + i * 70,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'forwards',
      },
    )
  })
})
</script>

<template>
  <section class="home-hero section">
    <HomeSignal />
    <div class="container home-hero__inner">
      <UiEyebrow>
        {{
          eyebrow
            || 'Wydziałowa Rada Samorządu · Wydział Elektroniki i Technik Informacyjnych PW'
        }}
      </UiEyebrow>
      <h1 class="home-hero__title">
        <span class="home-hero__plain">Masz sprawę?</span>
        <em
          ref="titleRef"
          class="home-hero__em"
        >
          <span
            v-for="(word, i) in words"
            :key="`${word}-${i}`"
            class="home-hero__word"
          >{{ word }}&nbsp;</span>
        </em>
      </h1>
      <p class="home-hero__lead">
        {{ lead }}
      </p>
      <div class="home-hero__actions">
        <UiButton href="#baza">
          Przejdź do bazy wiedzy
        </UiButton>
        <UiButton
          variant="ghost"
          href="#kontakt"
        >
          Zgłoś sprawę
        </UiButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-hero {
  position: relative;
  background: var(--bg);
  overflow: hidden;
  /* Skos w kolor następnej sekcji (--surface) */
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 48px), 0 100%);
  padding-bottom: calc(var(--section-y) + 24px);
}

.home-hero__inner {
  position: relative;
  z-index: 1;
  max-width: min(36rem, 100%);
}

.home-hero__title {
  margin-bottom: 0.65em;
}

.home-hero__plain {
  display: block;
}

.home-hero__em {
  display: block;
  font-style: italic;
  color: var(--accent);
}

.home-hero__word {
  display: inline-block;
}

@media (prefers-reduced-motion: no-preference) {
  .home-hero__word {
    opacity: 0;
  }
}

.home-hero__lead {
  max-width: 34rem;
  color: var(--muted);
  font-size: 1.05rem;
  margin-bottom: 0;
}

.home-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.65rem;
}

@media (max-width: 900px) {
  .home-hero {
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 32px), 0 100%);
    padding-bottom: calc(var(--section-y) + 72px);
  }

  .home-hero__inner {
    max-width: 100%;
  }
}
</style>
