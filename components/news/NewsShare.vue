<script setup lang="ts">
const props = defineProps<{
  url: string
  title: string
}>()

const copied = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | null = null

onBeforeUnmount(() => {
  if (resetTimer) clearTimeout(resetTimer)
})

async function copyLink() {
  try {
    await navigator.clipboard.writeText(props.url)
    copied.value = true
    if (resetTimer) clearTimeout(resetTimer)
    resetTimer = setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // Fallback: select via prompt-less temporary input
    const input = document.createElement('input')
    input.value = props.url
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    copied.value = true
    if (resetTimer) clearTimeout(resetTimer)
    resetTimer = setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}
</script>

<template>
  <div class="news-share">
    <span class="news-share__label">Udostępnij</span>
    <button
      type="button"
      class="news-share__btn"
      :aria-label="copied ? 'Skopiowano link' : 'Kopiuj link'"
      @click="copyLink"
    >
      <UiIcon :name="copied ? 'check' : 'link2'" :size="16" />
      <span>{{ copied ? 'Skopiowano' : 'Kopiuj link' }}</span>
    </button>
  </div>
</template>

<style scoped>
.news-share {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--line);
}

.news-share__label {
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
}

.news-share__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 36px;
  padding: 0 0.85rem;
  border-radius: var(--r-sm);
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text);
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

.news-share__btn:hover {
  border-color: var(--accent);
  background: var(--tint);
  color: var(--accent);
}

@media (prefers-reduced-motion: reduce) {
  .news-share__btn {
    transition: none;
  }
}
</style>
