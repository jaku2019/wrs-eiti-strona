<script setup lang="ts">
withDefaults(
  defineProps<{
    active?: boolean
    as?: 'button' | 'span'
  }>(),
  {
    active: false,
    as: 'button',
  },
)
</script>

<template>
  <component
    :is="as"
    class="ui-chip"
    :class="{ 'ui-chip--active': active }"
    :type="as === 'button' ? 'button' : undefined"
  >
    <slot />
  </component>
</template>

<style scoped>
.ui-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
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

.ui-chip:hover {
  border-color: var(--accent);
  background: var(--tint);
}

.ui-chip--active {
  background: var(--tint);
  border-color: var(--accent);
  color: var(--accent);
}

@media (prefers-reduced-motion: reduce) {
  .ui-chip {
    transition: none;
  }
}
</style>
