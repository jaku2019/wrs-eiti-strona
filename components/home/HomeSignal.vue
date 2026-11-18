<script setup lang="ts">
/**
 * Animated “three lines” motif for the hero (design system §5 / §7).
 * SVG + rAF: local cursor waves, scroll damping; WAAPI draw-in on mount.
 * Client-only decorative — no content dependence.
 */
const { reduced } = useReducedMotion()

const root = ref<HTMLElement | null>(null)
const pathEls = ref<SVGPathElement[]>([])
const dotEl = ref<SVGCircleElement | null>(null)

const mouse = reactive({ x: 0.72, y: 0.45, active: false })
const scrollDamp = ref(1)
let raf = 0
let t0 = 0
let drawDone = false

const LINE_COLORS = [
  'var(--heading)',
  'var(--szafir)',
  'var(--cyjan)',
] as const

function setPathRef(el: Element | null, index: number) {
  if (el) pathEls.value[index] = el as SVGPathElement
}

function waveY(
  x: number,
  baseY: number,
  amp: number,
  phase: number,
  time: number,
  mx: number,
  my: number,
  damp: number,
) {
  const dist = Math.hypot(x - mx, baseY - my)
  const local = Math.exp(-dist * dist * 9) * (mouse.active ? 1 : 0.25)
  const a = amp * damp * (0.35 + local * 1.4)
  return (
    baseY
    + Math.sin(x * 10 + phase + time * 1.4) * a * 0.55
    + Math.sin(x * 22 + phase * 1.7 + time * 2.1) * a * 0.25
  )
}

function buildPath(
  baseY: number,
  amp: number,
  phase: number,
  time: number,
  damp: number,
) {
  const steps = 28
  let d = ''
  for (let i = 0; i <= steps; i++) {
    const x = i / steps
    const y = waveY(x, baseY, amp, phase, time, mouse.x, mouse.y, damp)
    d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
  }
  return d
}

function frame(now: number) {
  if (!t0) t0 = now
  const time = (now - t0) / 1000
  const damp = scrollDamp.value

  const configs = [
    { y: 0.28, amp: 0.035, phase: 0.2 },
    { y: 0.5, amp: 0.045, phase: 1.1 },
    { y: 0.72, amp: 0.03, phase: 2.0 },
  ]

  configs.forEach((cfg, i) => {
    const el = pathEls.value[i]
    if (!el) return
    el.setAttribute('d', buildPath(cfg.y, cfg.amp, cfg.phase, time, damp))
  })

  const mid = pathEls.value[1]
  const dot = dotEl.value
  if (mid && dot) {
    const len = mid.getTotalLength()
    if (len > 0) {
      const progress = (time * 0.12) % 1
      const pt = mid.getPointAtLength(progress * len)
      dot.setAttribute('cx', String(pt.x))
      dot.setAttribute('cy', String(pt.y))
    }
  }

  raf = requestAnimationFrame(frame)
}

function onPointerMove(event: PointerEvent) {
  const el = root.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) return
  mouse.x = (event.clientX - rect.left) / rect.width
  mouse.y = (event.clientY - rect.top) / rect.height
  mouse.active = true
}

function onPointerLeave() {
  mouse.active = false
}

function onScroll() {
  const el = root.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const view = window.innerHeight || 1
  // 1 at top of hero → 0 as hero leaves viewport
  const visible = Math.min(1, Math.max(0, (rect.bottom - 40) / (rect.height + view * 0.2)))
  scrollDamp.value = visible * visible
}

function drawIn() {
  if (reduced.value || drawDone) return
  drawDone = true
  pathEls.value.forEach((el, i) => {
    if (!el) return
    try {
      const len = el.getTotalLength()
      el.style.strokeDasharray = String(len)
      el.style.strokeDashoffset = String(len)
      el.animate(
        [
          { strokeDashoffset: len },
          { strokeDashoffset: 0 },
        ],
        {
          duration: 1100 + i * 180,
          delay: i * 120,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'forwards',
        },
      )
    }
    catch {
      /* getTotalLength may fail before layout */
    }
  })
}

onMounted(() => {
  if (reduced.value) {
    // Static paths without animation loop
    const staticConfigs = [
      { y: 0.28, amp: 0.01, phase: 0.2 },
      { y: 0.5, amp: 0.012, phase: 1.1 },
      { y: 0.72, amp: 0.008, phase: 2.0 },
    ]
    staticConfigs.forEach((cfg, i) => {
      const el = pathEls.value[i]
      if (el) el.setAttribute('d', buildPath(cfg.y, cfg.amp, cfg.phase, 0, 1))
    })
    const mid = pathEls.value[1]
    const dot = dotEl.value
    if (mid && dot) {
      const len = mid.getTotalLength()
      if (len > 0) {
        const pt = mid.getPointAtLength(len * 0.55)
        dot.setAttribute('cx', String(pt.x))
        dot.setAttribute('cy', String(pt.y))
      }
    }
    return
  }

  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  raf = requestAnimationFrame(frame)
  requestAnimationFrame(() => drawIn())
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div
    ref="root"
    class="home-signal"
    aria-hidden="true"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <svg
      class="home-signal__svg"
      viewBox="0 0 1 1"
      preserveAspectRatio="none"
    >
      <path
        v-for="(color, i) in LINE_COLORS"
        :key="color"
        :ref="(el) => setPathRef(el as Element | null, i)"
        class="home-signal__line"
        :style="{ stroke: color }"
        fill="none"
        vector-effect="non-scaling-stroke"
        d="M 0 0.5 L 1 0.5"
      />
      <circle
        ref="dotEl"
        class="home-signal__dot"
        r="0.012"
        cx="0.5"
        cy="0.5"
      />
    </svg>
  </div>
</template>

<style scoped>
.home-signal {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.home-signal__svg {
  position: absolute;
  /* Desktop: lines in the right ~40% (start ~60% width) */
  left: 58%;
  right: -4%;
  top: 8%;
  bottom: 18%;
  width: auto;
  height: auto;
  overflow: visible;
}

.home-signal__line {
  fill: none;
  stroke-width: 1.75px;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.9;
}

.home-signal__dot {
  fill: var(--wrzos);
  stroke: none;
}

@media (max-width: 900px) {
  .home-signal__svg {
    /* Below CTAs: lower portion of hero */
    left: 4%;
    right: 4%;
    top: 72%;
    bottom: 4%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-signal__line {
    opacity: 0.7;
  }
}
</style>
