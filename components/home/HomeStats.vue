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
    class="home-stats section section--compact"
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
            class="stat-tile stat-tile--link"
          >
            <span class="stat-tile__value">{{ display[i] ?? 0 }}</span>
            <span class="stat-tile__label">{{ stat.label }}</span>
          </NuxtLink>
          <div
            v-else
            class="stat-tile"
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
.home-stats {
  background: var(--bg);
  padding-top: 0;
}

.home-stats__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.stat-tile {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1.15rem 1.1rem;
  border: 1px solid var(--line);
  border-radius: var(--r);
  background: var(--surface);
}

.stat-tile--link {
  text-decoration: none;
  color: inherit;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease;
}

.stat-tile--link:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}

.stat-tile__value {
  font-family: var(--font-display);
  font-size: clamp(32px, 4vw, 44px);
  font-weight: 500;
  letter-spacing: -0.03em;
  color: var(--heading);
  line-height: 1;
}

.stat-tile__label {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.35;
}

@media (max-width: 900px) {
  .home-stats__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (prefers-reduced-motion: reduce) {
  .stat-tile--link {
    transition: none;
  }

  .stat-tile--link:hover {
    transform: none;
  }
}
</style>
