<script setup lang="ts">
withDefaults(
  defineProps<{
    to?: string
    href?: string
    external?: boolean
  }>(),
  {
    external: false,
  },
)
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="ui-link"
  >
    <span class="ui-link__text"><slot /></span>
    <UiIcon :name="external ? 'externalLink' : 'arrowRight'" :size="16" />
  </NuxtLink>
  <a
    v-else
    :href="href"
    class="ui-link"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
  >
    <span class="ui-link__text"><slot /></span>
    <UiIcon :name="external ? 'externalLink' : 'arrowRight'" :size="16" />
  </a>
</template>

<style scoped>
/* mockup: .link */
.ui-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--link);
  font-weight: 500;
  font-size: 15px;
  text-decoration: underline 1px transparent;
  text-underline-offset: 5px;
  transition: text-decoration-color 0.25s;
}

.ui-link__text {
  text-decoration: inherit;
}

.ui-link :deep(.ui-icon) {
  transition: transform 0.3s var(--ease);
}

.ui-link:hover {
  text-decoration-color: currentColor;
}

.ui-link:hover :deep(.ui-icon) {
  transform: translateX(3px);
}

@media (prefers-reduced-motion: reduce) {
  .ui-link,
  .ui-link :deep(.ui-icon) {
    transition: none;
  }
}
</style>
