<script setup lang="ts">
const props = defineProps<{
  title: string
  lead: string
  eyebrow?: string
}>()

const titleRef = ref<HTMLElement | null>(null)

const emWords = computed(() => {
  const raw = props.title.trim() || 'Wiemy, jak to działa.'
  return raw.split(/\s+/).filter(Boolean)
})

/** mockup: „Wiemy,” | „jak to działa.” — reszta po pierwszym słowie jako jedna fraza bez łamania. */
const emChunks = computed(() => {
  const [first, ...rest] = emWords.value
  return rest.length ? [first!, rest.join(' ')] : [first!]
})

onMounted(() => {
  if (!titleRef.value) return
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  titleRef.value.querySelectorAll<HTMLElement>('.w').forEach((w, i) => {
    w.animate(
      [
        { opacity: 0, transform: 'translateY(.4em)', filter: 'blur(8px)' },
        { opacity: 1, transform: 'none', filter: 'none' },
      ],
      {
        duration: 900,
        delay: 120 + i * 110,
        easing: 'cubic-bezier(.2,.7,.2,1)',
        fill: 'backwards',
      },
    )
  })
})
</script>

<template>
  <div class="hero">
    <ClientOnly>
      <HomeSignal />
    </ClientOnly>
    <div class="container hero__inner">
      <UiEyebrow class="hero__eyebrow">
        {{
          eyebrow
            || 'Wydziałowa Rada Samorządu · Wydział Elektroniki i Technik Informacyjnych PW'
        }}
      </UiEyebrow>
      <h1
        ref="titleRef"
        class="hero__title"
      >
        <span class="w">Masz</span> <span class="w">sprawę?</span>
        <template
          v-for="(chunk, i) in emChunks"
          :key="i"
        >
          {{ ' ' }}<span class="w"><em>{{ chunk }}</em></span>
        </template>
      </h1>
      <p class="hero__lead">
        {{ lead }}
      </p>
      <div class="hero__cta">
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
    <div
      class="hero__cut"
      aria-hidden="true"
    />
  </div>
</template>

<style scoped>
/* mockup: .hero */
.hero {
  position: relative;
  overflow: clip;
  background: var(--bg);
}

.hero__inner {
  position: relative;
  display: grid;
  align-content: center;
  justify-items: start;
  min-height: min(80vh, 740px);
  padding-block: 72px 150px;
}

.hero__eyebrow {
  position: relative;
  margin: 0;
}

.hero__title {
  position: relative;
  max-width: 11ch;
  margin-top: 22px;
  font-size: clamp(50px, 8vw, 108px);
  letter-spacing: -0.03em;
}

.hero__title .w {
  display: inline-block;
}

.hero__title em {
  font-style: italic;
  font-weight: 400;
  color: var(--link);
}

.hero__lead {
  position: relative;
  margin-top: 26px;
  max-width: 44ch;
  font-size: clamp(17px, 2vw, 20px);
  color: var(--muted);
}

.hero__cta {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-top: 40px;
}

/* skośne cięcie dolnej krawędzi w kolor następnej sekcji */
.hero__cut {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 96px;
  background: var(--surface);
  clip-path: polygon(0 100%, 100% 100%, 100% 0, 0 78%);
}

/* parallax treści przy przewijaniu (scroll-driven) */
@supports (animation-timeline: scroll()) {
  @media (prefers-reduced-motion: no-preference) {
    .hero__inner > * {
      animation: hero-parallax linear both;
      animation-timeline: scroll(root);
      animation-range: 0 70vh;
    }
  }
}

@keyframes hero-parallax {
  to {
    translate: 0 -40px;
    opacity: 0.2;
  }
}
</style>
