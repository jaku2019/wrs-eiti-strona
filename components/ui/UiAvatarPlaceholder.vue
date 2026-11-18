<script setup lang="ts">
const props = defineProps<{
  name: string
  /** Id grupy składu — kolor ukośnej belki. */
  group?: string
}>()

const { initials } = useInitials()
const letters = computed(() => initials(props.name))
</script>

<template>
  <div
    class="avatar-placeholder"
    role="img"
    :aria-label="name"
    :data-group="group || undefined"
  >
    <span>{{ letters }}</span>
  </div>
</template>
