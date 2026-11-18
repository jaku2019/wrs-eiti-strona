<script setup lang="ts">
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Copy,
  ExternalLink,
  Facebook,
  FileCheck,
  FileText,
  GraduationCap,
  Link,
  Link2,
  Mail,
  Menu,
  Moon,
  Notebook,
  ScrollText,
  Search,
  Sun,
  Users,
  Vote,
  Wallet,
  X,
  type LucideIcon,
} from 'lucide-vue-next'

const icons = {
  arrowRight: ArrowRight,
  check: Check,
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  circleHelp: CircleHelp,
  clipboardList: ClipboardList,
  copy: Copy,
  externalLink: ExternalLink,
  facebook: Facebook,
  fileCheck: FileCheck,
  fileText: FileText,
  graduationCap: GraduationCap,
  link: Link,
  link2: Link2,
  mail: Mail,
  menu: Menu,
  moon: Moon,
  notebook: Notebook,
  scrollText: ScrollText,
  search: Search,
  sun: Sun,
  users: Users,
  vote: Vote,
  wallet: Wallet,
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
