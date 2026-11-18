<script setup lang="ts">
import type { UiIconName } from './UiIcon.vue'

withDefaults(
  defineProps<{
    variant?: 'primary' | 'ghost' | 'icon'
    size?: 'md' | 'sm'
    to?: string
    href?: string
    type?: 'button' | 'submit' | 'reset'
    tip?: string
    icon?: UiIconName
    iconOnly?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
  },
)
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="ui-btn"
    :class="[`ui-btn--${variant}`, `ui-btn--${size}`, { 'ui-btn--icon-only': iconOnly || variant === 'icon' }]"
    :data-tip="tip"
  >
    <span v-if="$slots.default" class="ui-btn__label"><slot /></span>
    <UiIcon v-if="icon || variant === 'primary'" :name="icon || 'arrowRight'" :size="size === 'sm' ? 16 : 18" />
  </NuxtLink>
  <a
    v-else-if="href"
    :href="href"
    class="ui-btn"
    :class="[`ui-btn--${variant}`, `ui-btn--${size}`, { 'ui-btn--icon-only': iconOnly || variant === 'icon' }]"
    :data-tip="tip"
  >
    <span v-if="$slots.default" class="ui-btn__label"><slot /></span>
    <UiIcon v-if="icon || variant === 'primary'" :name="icon || 'arrowRight'" :size="size === 'sm' ? 16 : 18" />
  </a>
  <button
    v-else
    :type="type"
    class="ui-btn"
    :class="[`ui-btn--${variant}`, `ui-btn--${size}`, { 'ui-btn--icon-only': iconOnly || variant === 'icon' }]"
    :data-tip="tip"
  >
    <span v-if="$slots.default" class="ui-btn__label"><slot /></span>
    <UiIcon v-if="icon || (variant === 'primary' && !iconOnly)" :name="icon || 'arrowRight'" :size="size === 'sm' ? 16 : 18" />
  </button>
</template>

<style scoped>
.ui-btn {
  --btn-shift: 0px;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  min-height: 48px;
  padding: 0 1.15rem;
  border-radius: var(--r-sm);
  border: 1px solid transparent;
  background: var(--btn-bg);
  color: var(--btn-fg);
  font-family: var(--font-sans);
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.15s ease;
}

.ui-btn--sm {
  min-height: 40px;
  padding: 0 0.9rem;
  font-size: 14px;
}

.ui-btn--icon-only {
  width: 40px;
  min-height: 40px;
  padding: 0;
}

.ui-btn--ghost {
  background: transparent;
  color: var(--text);
  border-color: var(--line);
}

.ui-btn--ghost:hover {
  background: var(--tint);
  border-color: var(--accent);
  color: var(--accent);
}

.ui-btn--icon {
  background: transparent;
  color: var(--text);
  border-color: var(--line);
}

.ui-btn--icon:hover {
  background: var(--tint);
  border-color: var(--accent);
  color: var(--accent);
}

.ui-btn--primary:hover {
  background: var(--btn-hover);
  --btn-shift: 3px;
}

.ui-btn:active {
  transform: scale(0.98);
}

.ui-btn :deep(.ui-icon) {
  transition: transform 0.2s ease;
  transform: translateX(var(--btn-shift));
}

.ui-btn[data-tip]::after {
  content: attr(data-tip);
  position: absolute;
  left: 50%;
  bottom: calc(100% + 8px);
  transform: translateX(-50%);
  padding: 0.35rem 0.55rem;
  border-radius: var(--r-sm);
  background: var(--grafit-deep);
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
}

.ui-btn[data-tip]:hover::after,
.ui-btn[data-tip]:focus-visible::after {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .ui-btn,
  .ui-btn :deep(.ui-icon) {
    transition: none;
  }
}
</style>
