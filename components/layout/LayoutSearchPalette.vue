<script setup lang="ts">
const {
  open,
  query,
  activeIndex,
  grouped,
  results,
  status,
  closePalette,
} = useSearch()

const inputEl = ref<HTMLInputElement | null>(null)

watch(open, async (isOpen) => {
  if (!isOpen) return
  await nextTick()
  inputEl.value?.focus()
})

function onBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) closePalette()
}

function flatIndex(groupIndex: number, itemIndex: number) {
  let offset = 0
  for (let i = 0; i < groupIndex; i++) {
    offset += grouped.value[i]?.items.length ?? 0
  }
  return offset + itemIndex
}

function select(href: string) {
  closePalette()
  navigateTo(href)
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="palette"
      role="dialog"
      aria-modal="true"
      aria-label="Wyszukiwarka"
      @click="onBackdropClick"
    >
      <div class="palette__panel">
        <div class="palette__field">
          <UiIcon name="search" :size="18" />
          <input
            ref="inputEl"
            v-model="query"
            type="search"
            class="palette__input"
            placeholder="Szukaj w bazie wiedzy, FAQ, aktualnościach…"
            aria-label="Szukaj"
            autocomplete="off"
            autocapitalize="off"
            spellcheck="false"
          >
          <kbd class="palette__kbd">Esc</kbd>
        </div>

        <p v-if="!query.trim()" class="palette__hint">
          Szybkie linki. Wpisz frazę, by szukać w bazie wiedzy, FAQ i aktualnościach.
        </p>
        <p v-else-if="status === 'missing'" class="palette__hint">
          Indeks Pagefind niedostępny (uruchom <code>npm run generate</code>).
        </p>
        <p v-else-if="status === 'loading'" class="palette__hint" aria-live="polite">
          Szukam…
        </p>

        <div v-if="results.length" class="palette__results" role="listbox">
          <section
            v-for="(group, gIndex) in grouped"
            :key="group.group"
            class="palette__group"
          >
            <h2 class="palette__group-title">{{ group.group }}</h2>
            <ul role="presentation">
              <li
                v-for="(hit, iIndex) in group.items"
                :key="hit.id"
                role="option"
                :aria-selected="activeIndex === flatIndex(gIndex, iIndex)"
              >
                <button
                  type="button"
                  class="palette__hit"
                  :class="{ 'palette__hit--active': activeIndex === flatIndex(gIndex, iIndex) }"
                  @click="select(hit.href)"
                  @mouseenter="activeIndex = flatIndex(gIndex, iIndex)"
                >
                  <span class="palette__hit-title">{{ hit.title }}</span>
                  <span class="palette__hit-desc">{{ hit.description }}</span>
                </button>
              </li>
            </ul>
          </section>
        </div>
        <p v-else-if="query.trim() && status !== 'loading'" class="palette__empty">
          Brak wyników dla „{{ query }}”.
        </p>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.palette {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  align-content: start;
  justify-items: center;
  padding: 12vh 1rem 2rem;
  background: color-mix(in srgb, var(--grafit-deep) 45%, transparent);
  backdrop-filter: blur(4px);
}

.palette__panel {
  width: min(100%, 560px);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  background: var(--surface);
  color: var(--text);
  box-shadow: 0 24px 64px color-mix(in srgb, var(--grafit-deep) 28%, transparent);
  overflow: hidden;
}

.palette__field {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.9rem 1rem;
  border-bottom: 1px solid var(--line);
}

.palette__input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  color: var(--text);
  font-family: var(--font-sans);
  font-size: 16px;
  outline: none;
}

.palette__input::placeholder {
  color: var(--muted);
}

.palette__kbd {
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 600;
  padding: 0.2rem 0.4rem;
  border: 1px solid var(--line);
  border-radius: 4px;
  color: var(--muted);
}

.palette__hint {
  margin: 0;
  padding: 0.55rem 1rem 0;
  font-size: 12px;
  color: var(--muted);
}

.palette__hint code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
}

.palette__results {
  max-height: min(50vh, 380px);
  overflow: auto;
  padding: 0.5rem 0.5rem 0.75rem;
}

.palette__group {
  margin-top: 0.35rem;
}

.palette__group-title {
  margin: 0.4rem 0.5rem 0.25rem;
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
  letter-spacing: 0;
}

.palette__group ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.palette__hit {
  width: 100%;
  display: grid;
  gap: 0.15rem;
  text-align: left;
  padding: 0.65rem 0.7rem;
  border: 0;
  border-radius: var(--r-sm);
  background: transparent;
  color: inherit;
  font-family: var(--font-sans);
  cursor: pointer;
}

.palette__hit:hover,
.palette__hit--active {
  background: var(--tint);
}

.palette__hit-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--heading);
}

.palette__hit-desc {
  font-size: 13px;
  color: var(--muted);
}

.palette__empty {
  margin: 0;
  padding: 1.5rem 1rem;
  text-align: center;
  color: var(--muted);
  font-size: 14px;
}

@media (prefers-reduced-motion: reduce) {
  .palette {
    backdrop-filter: none;
  }
}
</style>
