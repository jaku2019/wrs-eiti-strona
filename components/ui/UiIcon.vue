<script setup lang="ts">
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Clock,
  Copy,
  ExternalLink,
  Facebook,
  FileCheck,
  FileText,
  GraduationCap,
  Home,
  Link,
  Link2,
  Mail,
  MapPin,
  Menu,
  Moon,
  Notebook,
  Scale,
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
  bookOpen: BookOpen,
  calendar: Calendar,
  check: Check,
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  circleHelp: CircleHelp,
  clipboardList: ClipboardList,
  clock: Clock,
  copy: Copy,
  externalLink: ExternalLink,
  facebook: Facebook,
  fileCheck: FileCheck,
  fileText: FileText,
  graduationCap: GraduationCap,
  home: Home,
  link: Link,
  link2: Link2,
  mail: Mail,
  mapPin: MapPin,
  menu: Menu,
  moon: Moon,
  notebook: Notebook,
  scale: Scale,
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
