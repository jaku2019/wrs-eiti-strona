<script setup lang="ts">
const props = defineProps<{
  email?: string | null
  description?: string | null
}>()

const mailto = computed(() => {
  const email = props.email?.trim()
  if (!email || email.startsWith('TODO')) return null
  return `mailto:${email}`
})

const emailLabel = computed(() => {
  const email = props.email?.trim()
  if (!email || email.startsWith('TODO')) {
    return 'TODO(treść): prawdziwy e-mail w ustawieniach'
  }
  return email
})
</script>

<template>
  <aside
    id="kontakt"
    class="home-contact"
  >
    <h3>Nie wiesz, do kogo się zgłosić?</h3>
    <p>
      {{
        description
          || 'TODO(treść): krótki opis kontaktu WRS — dyżury, kanały zgłoszeń.'
      }}
    </p>
    <div class="home-contact__actions">
      <UiButton
        v-if="mailto"
        :href="mailto"
      >
        Zgłoś sprawę
      </UiButton>
      <UiButton
        v-else
        href="#kontakt"
      >
        Zgłoś sprawę
      </UiButton>
      <UiButton
        v-if="mailto"
        variant="ghost"
        :href="mailto"
        icon="mail"
      >
        Napisz e-mail
      </UiButton>
      <UiButton
        v-else
        variant="ghost"
        href="#kontakt"
        icon="mail"
      >
        Napisz e-mail
      </UiButton>
    </div>
    <p class="home-contact__note">
      {{ emailLabel }}
    </p>
  </aside>
</template>

<style scoped>
.home-contact {
  --text: #fff;
  --heading: #fff;
  --line: color-mix(in srgb, #fff 28%, transparent);
  --tint: color-mix(in srgb, var(--szafir) 28%, transparent);
  --accent: #c5d4f0;
  --link: #c5d4f0;
  --btn-bg: #fff;
  --btn-fg: var(--grafit-deep);
  --btn-hover: #e8eef8;

  position: relative;
  overflow: hidden;
  background: var(--grafit);
  color: #fff;
  border-radius: var(--r-lg);
  padding: 1.75rem 1.6rem 1.5rem;
  isolation: isolate;
}

.home-contact::before,
.home-contact::after {
  content: '';
  position: absolute;
  width: 42%;
  height: 75%;
  pointer-events: none;
  z-index: 0;
  transform: skewX(-18deg);
}

.home-contact::before {
  right: -10%;
  top: -22%;
  background: color-mix(in srgb, var(--szafir) 38%, transparent);
}

.home-contact::after {
  right: 6%;
  bottom: -34%;
  background: color-mix(in srgb, var(--cyjan) 28%, transparent);
}

.home-contact > * {
  position: relative;
  z-index: 1;
}

.home-contact h3 {
  margin: 0 0 0.55rem;
  font-size: clamp(24px, 3vw, 32px);
  color: #fff;
}

.home-contact p {
  margin: 0 0 1.25rem;
  color: color-mix(in srgb, #fff 78%, transparent);
  font-size: 15px;
  line-height: 1.5;
}

.home-contact__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.home-contact__note {
  margin: 1rem 0 0 !important;
  font-size: 12px !important;
  color: color-mix(in srgb, #fff 55%, transparent) !important;
}
</style>
