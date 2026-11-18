<script setup lang="ts">
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Facebook,
  Mail,
  Menu,
  Moon,
  Search,
  Sun,
  X,
  type LucideIcon,
} from 'lucide-vue-next'

const icons = {
  arrowRight: ArrowRight,
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  externalLink: ExternalLink,
  facebook: Facebook,
  mail: Mail,
  menu: Menu,
  moon: Moon,
  search: Search,
  sun: Sun,
  x: X,
} as const satisfies Record<string, LucideIcon>

export type UiIconName = keyof typeof icons

const props = withDefaults(
  defineProps<{
    name: UiIconName
    size?: number | string
    strokeWidth?: number | string
  }>(),
  {
    size: 20,
    strokeWidth: 1.75,
  },
)

const component = computed(() => icons[props.name])
</script>

<template>
  <component
    :is="component"
    class="ui-icon"
    :size="size"
    :stroke-width="strokeWidth"
    aria-hidden="true"
  />
</template>

<style scoped>
.ui-icon {
  display: inline-block;
  flex-shrink: 0;
  vertical-align: middle;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
