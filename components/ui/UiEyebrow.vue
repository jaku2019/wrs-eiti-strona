<template>
  <p class="ui-eyebrow">
    <slot />
  </p>
</template>

<style scoped>
/* mockup: .eyebrow */
.ui-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 12px;
  color: var(--muted);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.6;
  font-variant-numeric: tabular-nums;
}

.ui-eyebrow::after {
  content: '';
  width: 28px;
  height: 1px;
  background: currentColor;
  opacity: 0.5;
}
</style>
