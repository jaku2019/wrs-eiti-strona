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
.ui-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--link);
  font-weight: 600;
  font-size: 15px;
  text-decoration: none;
}

.ui-link__text {
  text-decoration: underline;
  text-decoration-color: transparent;
  text-underline-offset: 5px;
  transition: text-decoration-color 0.2s ease;
}

.ui-link :deep(.ui-icon) {
  transition: transform 0.2s ease;
}

.ui-link:hover .ui-link__text {
  text-decoration-color: currentColor;
}

.ui-link:hover :deep(.ui-icon) {
  transform: translateX(3px);
}

@media (prefers-reduced-motion: reduce) {
  .ui-link__text,
  .ui-link :deep(.ui-icon) {
    transition: none;
  }
}
</style>
