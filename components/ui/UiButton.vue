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
    <UiIcon v-if="icon || variant === 'primary'" :name="icon || 'arrowRight'" :size="size === 'sm' ? 16 : 20" />
  </NuxtLink>
  <a
    v-else-if="href"
    :href="href"
    class="ui-btn"
    :class="[`ui-btn--${variant}`, `ui-btn--${size}`, { 'ui-btn--icon-only': iconOnly || variant === 'icon' }]"
    :data-tip="tip"
  >
    <span v-if="$slots.default" class="ui-btn__label"><slot /></span>
    <UiIcon v-if="icon || variant === 'primary'" :name="icon || 'arrowRight'" :size="size === 'sm' ? 16 : 20" />
  </a>
  <button
    v-else
    :type="type"
    class="ui-btn"
    :class="[`ui-btn--${variant}`, `ui-btn--${size}`, { 'ui-btn--icon-only': iconOnly || variant === 'icon' }]"
    :data-tip="tip"
  >
    <span v-if="$slots.default" class="ui-btn__label"><slot /></span>
    <UiIcon v-if="icon || (variant === 'primary' && !iconOnly)" :name="icon || 'arrowRight'" :size="size === 'sm' ? 16 : 20" />
  </button>
</template>

<style scoped>
/* mockup: .btn / .btn.ghost / .btn.icon */
.ui-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 48px;
  padding: 0 20px;
  border: 1px solid transparent;
  border-radius: var(--r-sm);
  background: var(--btn-bg);
  color: var(--btn-fg);
  box-shadow:
    0 1px 2px #0000001f,
    inset 0 1px 0 #ffffff1a;
  font: 500 15px / 1 var(--font-sans);
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background 0.25s,
    color 0.25s,
    border-color 0.25s,
    box-shadow 0.25s,
    transform 0.15s;
}

.ui-btn :deep(.ui-icon) {
  transition: transform 0.3s var(--ease);
}

.ui-btn:hover {
  background: var(--btn-hover);
}

.ui-btn:hover :deep(.ui-icon) {
  transform: translateX(3px);
}

.ui-btn:active {
  transform: scale(0.98);
}

.ui-btn--sm {
  height: 40px;
  padding: 0 14px;
  font-size: 14px;
}

.ui-btn--ghost {
  background: transparent;
  color: var(--heading);
  border-color: var(--line);
  box-shadow: none;
}

.ui-btn--ghost:hover {
  background: var(--tint);
  border-color: color-mix(in oklab, var(--szafir) 50%, transparent);
}

.ui-btn--icon,
.ui-btn--icon-only {
  width: 40px;
  height: 40px;
  padding: 0;
}

.ui-btn--icon {
  background: transparent;
  color: var(--heading);
  border-color: var(--line);
  box-shadow: none;
}

.ui-btn--icon:hover {
  background: var(--tint);
  border-color: color-mix(in oklab, var(--szafir) 50%, transparent);
}

.ui-btn--icon:hover :deep(.ui-icon),
.ui-btn--icon-only:hover :deep(.ui-icon) {
  transform: none;
}

/* podpowiedź pod przyciskiem z ikoną */
.ui-btn[data-tip]::after {
  content: attr(data-tip);
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  translate: -50% -4px;
  padding: 5px 9px;
  border-radius: var(--r-sm);
  background: var(--grafit-deep);
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 0.2s,
    translate 0.2s;
  z-index: 5;
}

.ui-btn[data-tip]:hover::after,
.ui-btn[data-tip]:focus-visible::after {
  opacity: 1;
  translate: -50% 0;
}

:root[data-theme='dark'] .ui-btn[data-tip]::after {
  background: #fff;
  color: var(--grafit-deep);
}

@media (prefers-reduced-motion: reduce) {
  .ui-btn,
  .ui-btn :deep(.ui-icon),
  .ui-btn[data-tip]::after {
    transition: none;
  }
}
</style>
