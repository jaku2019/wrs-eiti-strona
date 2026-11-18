<template>
  <p class="ui-eyebrow">
    <slot />
  </p>
</template>

<style scoped>
.ui-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 0 0.85rem;
  color: var(--muted);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.ui-eyebrow::after {
  content: '';
  display: block;
  width: 28px;
  height: 1px;
  background: var(--line);
}
</style>
