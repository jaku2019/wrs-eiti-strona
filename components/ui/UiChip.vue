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
/* mockup: .chip (sklad.html) */
.ui-chip {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  height: 36px;
  padding: 0 12px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: var(--surface);
  color: var(--muted);
  font: 500 14px var(--font-sans);
  white-space: nowrap;
  cursor: pointer;
  transition:
    color 0.2s,
    border-color 0.2s,
    background 0.2s;
}

/* licznik w chipie, np. „Wszystkie 3” */
.ui-chip :slotted(.count) {
  margin-left: 6px;
  opacity: 0.55;
  font-variant-numeric: tabular-nums;
}

.ui-chip:hover {
  color: var(--heading);
  border-color: color-mix(in oklab, var(--szafir) 50%, transparent);
}

.ui-chip--active,
.ui-chip--active:hover {
  background: var(--grafit);
  border-color: var(--grafit);
  color: #fff;
}

:root[data-theme='dark'] .ui-chip--active {
  background: var(--text);
  border-color: var(--text);
  color: var(--pw-szary-90);
}

@media (prefers-reduced-motion: reduce) {
  .ui-chip {
    transition: none;
  }
}
</style>
