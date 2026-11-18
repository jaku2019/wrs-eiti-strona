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
    class="home-contact reveal"
  >
    <UiEyebrow class="home-contact__eyebrow">
      Kontakt
    </UiEyebrow>
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
/* mockup: .contact */
.home-contact {
  --btn-bg: #fff;
  --btn-fg: var(--grafit-deep);
  --btn-hover: #dce5f6;
  position: relative;
  overflow: hidden;
  display: grid;
  gap: 18px;
  align-content: start;
  padding: 40px;
  border-radius: var(--r-lg);
  background: var(--grafit);
  color: #e7e6ee;
}

.home-contact::before,
.home-contact::after {
  content: '';
  position: absolute;
  top: -60px;
  transform: rotate(30deg);
  pointer-events: none;
}

.home-contact::before {
  right: -20px;
  width: 70px;
  height: 360px;
  background: linear-gradient(var(--szafir), transparent 85%);
  opacity: 0.5;
}

.home-contact::after {
  right: 70px;
  width: 18px;
  height: 300px;
  background: linear-gradient(var(--cyjan), transparent 85%);
  opacity: 0.6;
}

.home-contact > * {
  position: relative;
  z-index: 1;
}

.home-contact__eyebrow {
  margin: 0;
  color: #a9a8b8;
}

.home-contact h3 {
  margin: 0;
  font: 500 36px / 1.08 var(--font-display);
  letter-spacing: -0.02em;
  color: #fff;
}

.home-contact p {
  margin: 0;
  max-width: 40ch;
  color: #c3c2d0;
  font-size: 15px;
}

.home-contact__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-top: 8px;
}

.home-contact__actions :deep(.ui-btn--ghost) {
  color: #fff;
  border-color: #ffffff38;
}

.home-contact__actions :deep(.ui-btn--ghost:hover) {
  background: #ffffff14;
}

.home-contact .home-contact__note {
  font-size: 12px;
  color: #a9a8b8;
}

@media (max-width: 480px) {
  .home-contact {
    padding: 28px 24px;
  }
}
</style>
