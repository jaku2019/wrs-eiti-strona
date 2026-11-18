<script setup lang="ts">
import type { FaqPytanie } from '~/utils/faq'

const props = defineProps<{
  pytanie: FaqPytanie
  /** One-shot: open this item when hash / parent requests it. */
  revealToken?: number
}>()

const emit = defineEmits<{
  toggle: [id: string, open: boolean]
}>()

const detailsEl = ref<HTMLDetailsElement | null>(null)
const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | null = null

const answerParagraphs = computed(() =>
  props.pytanie.a
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean),
)

watch(
  [() => props.revealToken, detailsEl],
  ([token]) => {
    if (token == null || !detailsEl.value) return
    detailsEl.value.open = true
  },
)

function onToggle(event: Event) {
  const el = event.target as HTMLDetailsElement
  emit('toggle', props.pytanie.id, el.open)
}

async function copyLink() {
  if (!import.meta.client) return
  const url = new URL(window.location.href)
  url.hash = props.pytanie.id
  try {
    await navigator.clipboard.writeText(url.toString())
    copied.value = true
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      copied.value = false
    }, 1800)
  } catch {
    // Fallback: still update hash so the link is shareable from the address bar.
    window.location.hash = props.pytanie.id
  }
}

onBeforeUnmount(() => {
  if (copyTimer) clearTimeout(copyTimer)
})
</script>

<template>
  <details
    :id="pytanie.id"
    ref="detailsEl"
    class="faq-item"
    @toggle="onToggle"
  >
    <summary class="faq-item__summary">
      <span class="faq-item__q">{{ pytanie.q }}</span>
      <UiIcon name="chevronDown" :size="18" class="faq-item__chevron" />
    </summary>
    <div class="faq-item__body">
      <p v-for="(para, i) in answerParagraphs" :key="i">{{ para }}</p>
      <button
        type="button"
        class="faq-item__copy"
        :aria-label="copied ? 'Skopiowano link' : 'Kopiuj link do pytania'"
        @click.stop="copyLink"
      >
        <UiIcon :name="copied ? 'check' : 'link'" :size="14" />
        <span>{{ copied ? 'Skopiowano' : 'Kopiuj link' }}</span>
      </button>
    </div>
  </details>
</template>

<style scoped>
.faq-item {
  border-bottom: 1px solid var(--line);
  scroll-margin-top: 88px;
}

.faq-item__summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem 0;
  cursor: pointer;
  list-style: none;
  font-family: var(--font-display);
  font-size: clamp(18px, 2vw, 22px);
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--heading);
}

.faq-item__summary::-webkit-details-marker {
  display: none;
}

.faq-item__q {
  min-width: 0;
}

.faq-item__chevron {
  flex-shrink: 0;
  color: var(--muted);
  transition: transform 0.22s ease;
}

.faq-item[open] .faq-item__chevron {
  transform: rotate(180deg);
  color: var(--link);
}

.faq-item__body {
  padding: 0 0 1.25rem;
  color: var(--text);
  font-size: 16px;
  line-height: 1.6;
}

.faq-item__body p {
  margin: 0 0 0.75rem;
  max-width: 42rem;
}

.faq-item__copy {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.25rem;
  padding: 0.35rem 0.55rem;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: transparent;
  color: var(--muted);
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.faq-item__copy:hover {
  color: var(--link);
  border-color: var(--accent);
  background: var(--tint);
}

@supports (interpolate-size: allow-keywords) {
  .faq-item {
    interpolate-size: allow-keywords;
  }
}

@supports (selector(::details-content)) {
  .faq-item::details-content {
    transition:
      height 0.28s ease,
      content-visibility 0.28s allow-discrete;
    overflow: hidden;
  }

  .faq-item:not([open])::details-content {
    height: 0;
  }

  @starting-style {
    .faq-item[open]::details-content {
      height: 0;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .faq-item__chevron,
  .faq-item::details-content {
    transition: none !important;
  }
}
</style>
