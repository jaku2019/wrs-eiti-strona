<script setup lang="ts">
const progress = ref(0)

onMounted(() => {
  if (!import.meta.client) return

  const update = () => {
    const doc = document.documentElement
    const scrollable = doc.scrollHeight - window.innerHeight
    progress.value = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0
  }

  update()
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update, { passive: true })
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', update)
    window.removeEventListener('resize', update)
  })
})
</script>

<template>
  <div
    class="scroll-progress"
    role="progressbar"
    aria-hidden="true"
    :aria-valuenow="Math.round(progress * 100)"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div class="scroll-progress__bar" :style="{ transform: `scaleX(${progress})` }" />
  </div>
</template>

<style scoped>
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 70;
  pointer-events: none;
  background: transparent;
}

.scroll-progress__bar {
  height: 100%;
  width: 100%;
  transform-origin: left center;
  background: linear-gradient(90deg, var(--szafir), var(--cyjan));
  transition: transform 0.05s linear;
}

@media (prefers-reduced-motion: reduce) {
  .scroll-progress__bar {
    transition: none;
  }
}

@supports (animation-timeline: scroll()) {
  .scroll-progress__bar {
    transform: none;
    animation: scroll-progress-fill linear;
    animation-timeline: scroll(root);
  }

  @keyframes scroll-progress-fill {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
    }
  }
}
</style>
