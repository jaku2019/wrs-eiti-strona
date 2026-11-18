<script setup lang="ts">
/** Pasek postępu czytania artykułu — CSS scroll-driven + fallback JS. */
const trackRef = ref<HTMLElement | null>(null)
const progress = ref(0)
const supportsScrollTimeline = ref(false)

onMounted(() => {
  if (!import.meta.client) return
  supportsScrollTimeline.value = CSS.supports('animation-timeline', 'scroll()')
  if (supportsScrollTimeline.value) return

  const article = document.getElementById('kb-article-body')
  if (!article) return

  const update = () => {
    const rect = article.getBoundingClientRect()
    const total = article.offsetHeight - window.innerHeight
    if (total <= 0) {
      progress.value = rect.bottom <= window.innerHeight ? 1 : 0
      return
    }
    const scrolled = Math.min(Math.max(-rect.top, 0), total)
    progress.value = scrolled / total
  }

  update()
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update)
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', update)
    window.removeEventListener('resize', update)
  })
})
</script>

<template>
  <div
    ref="trackRef"
    class="kb-progress"
    role="progressbar"
    :aria-valuenow="Math.round(progress * 100)"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-label="Postęp czytania"
  >
    <div
      class="kb-progress__bar"
      :class="{ 'kb-progress__bar--css': supportsScrollTimeline }"
      :style="
        supportsScrollTimeline
          ? undefined
          : { transform: `scaleX(${progress})` }
      "
    />
  </div>
</template>

<style scoped>
.kb-progress {
  position: sticky;
  top: 0;
  z-index: 2;
  height: 3px;
  background: var(--line);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 1.25rem;
}

.kb-progress__bar {
  height: 100%;
  width: 100%;
  transform-origin: left center;
  transform: scaleX(0);
  background: linear-gradient(90deg, var(--szafir-deep), var(--cyjan));
  will-change: transform;
}

@supports (animation-timeline: scroll()) {
  .kb-progress__bar--css {
    animation: kb-read-progress linear;
    animation-timeline: scroll(root);
    animation-range: entry 0% exit 100%;
  }
}

@keyframes kb-read-progress {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .kb-progress__bar--css {
    animation: none;
  }
}
</style>
