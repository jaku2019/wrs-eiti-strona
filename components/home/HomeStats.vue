<script setup lang="ts">
export type HomeStat = {
  label: string
  value: number
  to?: string
}

const props = defineProps<{
  stats: HomeStat[]
}>()

const { reduced } = useReducedMotion()
const root = ref<HTMLElement | null>(null)
const display = ref<number[]>([])
let started = false

watch(
  () => props.stats,
  (stats) => {
    display.value = stats.map((s) => (reduced.value ? s.value : 0))
  },
  { immediate: true },
)

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

function setDisplay(index: number, value: number) {
  const next = display.value.slice()
  next[index] = value
  display.value = next
}

function animateCount(index: number, target: number) {
  if (reduced.value || target <= 0) {
    setDisplay(index, target)
    return
  }
  const duration = 1100
  const t0 = performance.now()
  const tick = (now: number) => {
    const p = Math.min(1, (now - t0) / duration)
    setDisplay(index, Math.round(easeOutCubic(p) * target))
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

onMounted(() => {
  if (!root.value) return
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting) || started) return
      started = true
      props.stats.forEach((stat, i) => animateCount(i, stat.value))
      io.disconnect()
    },
    { threshold: 0.35 },
  )
  io.observe(root.value)
  onBeforeUnmount(() => io.disconnect())
})
</script>

<template>
  <section
    ref="root"
    class="home-stats"
    aria-label="Liczniki"
  >
    <div class="container">
      <ul class="home-stats__grid">
        <li
          v-for="(stat, i) in stats"
          :key="stat.label"
        >
          <NuxtLink
            v-if="stat.to"
            :to="stat.to"
            class="stat-tile stat-tile--link reveal"
          >
            <span class="stat-tile__value">{{ display[i] ?? 0 }}</span>
            <span class="stat-tile__label">{{ stat.label }}
              <UiIcon
                name="arrowRight"
                :size="16"
              /></span>
          </NuxtLink>
          <div
            v-else
            class="stat-tile reveal"
          >
            <span class="stat-tile__value">{{ display[i] ?? 0 }}</span>
            <span class="stat-tile__label">{{ stat.label }}</span>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
/* mockup: .stats / .stat (kontener z padding-bottom 24px) */
.home-stats {
  background: var(--bg);
  padding-bottom: 24px;
}

.home-stats__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 16px;
}

.stat-tile {
  display: block;
  height: 100%;
  padding: 28px;
  border: 1px solid var(--line);
  border-radius: var(--r);
  color: inherit;
  text-decoration: none;
  transition:
    border-color 0.2s,
    background 0.2s;
}

.stat-tile--link:hover {
  border-color: color-mix(in oklab, var(--szafir) 60%, transparent);
  background: var(--tint);
}

.stat-tile__value {
  display: block;
  font: 500 clamp(48px, 6vw, 72px) / 1 var(--font-display);
  color: var(--heading);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}

.stat-tile__label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  font-size: 14px;
  color: var(--muted);
}

@media (prefers-reduced-motion: reduce) {
  .stat-tile {
    transition: none;
  }
}
</style>
