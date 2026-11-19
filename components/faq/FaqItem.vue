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

function openDetails() {
  const el = detailsEl.value
  if (!el) return
  el.open = true
}

watch(
  [() => props.revealToken, detailsEl],
  ([token]) => {
    if (token == null) return
    openDetails()
    // Retry after paint — cold hash loads can race hydration / layout.
    if (import.meta.client) {
      requestAnimationFrame(() => openDetails())
    }
  },
)

onMounted(() => {
  if (!import.meta.client) return
  const hash = window.location.hash.replace(/^#/, '')
  if (hash && hash === props.pytanie.id) {
    openDetails()
  }
})

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
    window.location.hash = props.pytanie.id
  }
}

onBeforeUnmount(() => {
  if (copyTimer) clearTimeout(copyTimer)
})
</script>

<template>
  <div class="faq-row">
  <details
    ref="detailsEl"
    class="faq-item"
    @toggle="onToggle"
  >
    <summary class="faq-item__summary">
      <!-- h3 + id: Pagefind sub-results deep-link to #question-id -->
      <h3 :id="pytanie.id" class="faq-item__q">{{ pytanie.q }}</h3>
      <UiIcon name="chevronDown" :size="18" class="faq-item__chevron" />
    </summary>
    <div class="faq-item__body">
      <p v-for="(para, i) in answerParagraphs" :key="i">{{ para }}</p>
    </div>
  </details>
  <!-- Outside <summary> (no nested interactive content); placed on the
       question line next to the chevron. -->
  <button
    type="button"
    class="faq-row__copy"
    :class="{ 'is-copied': copied }"
    data-pagefind-ignore
    :data-tip="copied ? 'Skopiowano' : 'Kopiuj link'"
    :aria-label="`Kopiuj link do pytania: ${pytanie.q}`"
    @click="copyLink"
  >
    <UiIcon :name="copied ? 'check' : 'link'" :size="16" />
  </button>
  <span class="visually-hidden" aria-live="polite">{{ copied ? 'Skopiowano link do pytania' : '' }}</span>
  </div>
</template>

<style scoped>
.faq-row {
  --q-fs: clamp(18px, 2vw, 22px);
  --q-lh: 1.3;
  --copy: 32px;
  position: relative;
  border-bottom: 1px solid var(--line);
  scroll-margin-top: 88px;
}

/* chevron + copy button sit on the first line of the question */
.faq-item__summary {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem 0;
  line-height: var(--q-lh);
  cursor: pointer;
  list-style: none;
  font-family: var(--font-display);
  font-size: var(--q-fs);
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--heading);
}

.faq-item__summary::-webkit-details-marker {
  display: none;
}

.faq-item__q {
  min-width: 0;
  margin: 0;
  font: inherit;
  font-size: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
  color: inherit;
  /* room for the copy button left of the chevron */
  padding-right: calc(var(--copy) + 0.25rem);
  scroll-margin-top: 88px;
}

.faq-item__chevron {
  flex-shrink: 0;
  margin-top: calc((var(--q-fs) * var(--q-lh) - 18px) / 2);
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

.faq-row__copy {
  position: absolute;
  top: calc(1.1rem + (var(--q-fs) * var(--q-lh) - var(--copy)) / 2);
  right: calc(18px + 0.5rem);
  display: grid;
  place-items: center;
  width: var(--copy);
  height: var(--copy);
  padding: 0;
  border: 1px solid transparent;
  border-radius: var(--r-sm);
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  opacity: 0;
  transition:
    opacity 0.2s,
    color 0.2s,
    background 0.2s,
    border-color 0.2s;
}

/* visible on row hover, keyboard focus or when the answer is open */
.faq-row:hover .faq-row__copy,
.faq-row__copy:focus-visible,
.faq-item[open] ~ .faq-row__copy,
.faq-row__copy.is-copied {
  opacity: 1;
}

@media (hover: none) {
  .faq-row:hover .faq-row__copy {
    opacity: 0;
  }

  .faq-item[open] ~ .faq-row__copy,
  .faq-row__copy.is-copied {
    opacity: 1;
  }
}

.faq-row__copy:hover,
.faq-row__copy:focus-visible {
  color: var(--link);
  border-color: var(--line);
  background: var(--tint);
}

.faq-row__copy.is-copied {
  color: var(--link);
}

/* tooltip to the left, on the question line */
.faq-row__copy::after {
  content: attr(data-tip);
  position: absolute;
  top: 50%;
  right: calc(100% + 8px);
  translate: 4px -50%;
  padding: 5px 9px;
  border-radius: var(--r-sm);
  background: var(--grafit-deep);
  color: #fff;
  font: 500 12px / 1.2 var(--font-sans);
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 0.2s,
    translate 0.2s;
}

.faq-row__copy:hover::after,
.faq-row__copy:focus-visible::after,
.faq-row__copy.is-copied::after {
  opacity: 1;
  translate: 0 -50%;
}

:root[data-theme='dark'] .faq-row__copy::after {
  background: #fff;
  color: var(--grafit-deep);
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
  .faq-row__copy,
  .faq-row__copy::after,
  .faq-item::details-content {
    transition: none !important;
  }
}
</style>
