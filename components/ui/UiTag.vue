<script setup lang="ts">
withDefaults(
  defineProps<{
    tone?: 'neutral' | 'accent'
  }>(),
  {
    tone: 'neutral',
  },
)
</script>

<template>
  <span class="ui-tag" :class="`ui-tag--${tone}`">
    <slot />
  </span>
</template>

<style scoped>
.ui-tag {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 0.55rem;
  border-radius: var(--r-sm);
  background: var(--wrzos-soft);
  color: var(--muted);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.ui-tag--accent {
  background: var(--tint);
  color: var(--accent);
}
</style>
