<script setup lang="ts">
const props = defineProps<{
  name: string
}>()

const { initials } = useInitials()
const letters = computed(() => initials(props.name))
</script>

<template>
  <div class="avatar-placeholder" role="img" :aria-label="name">
    <span>{{ letters }}</span>
  </div>
</template>
