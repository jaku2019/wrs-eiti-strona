<script setup lang="ts">
const { theme, toggleTheme } = useTheme()

const label = computed(() =>
  theme.value === 'dark' ? 'Włącz jasny motyw' : 'Włącz ciemny motyw',
)
</script>

<template>
  <UiButton
    variant="icon"
    icon-only
    :icon="theme === 'dark' ? 'sun' : 'moon'"
    :tip="label"
    :aria-label="label"
    @click="toggleTheme($event)"
  />
</template>
