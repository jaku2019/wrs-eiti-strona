<script setup lang="ts">
/**
 * „Sygnał” w hero — trzy linie (grafit/heading, szafir, cyjan) + wrzosowa kropka.
 * Port 1:1 algorytmu z mockup/index.html: fale reagują lokalnie na kursor,
 * wygładzają się przy przewijaniu; linie rysowane na wejściu (WAAPI).
 * Desktop: start ~60% szerokości (wiersze 30/40/50% wysokości);
 * <900px: pod przyciskami (80/85/90% wysokości).
 */
const svgEl = ref<SVGSVGElement | null>(null)
const p1 = ref<SVGPathElement | null>(null)
const p2 = ref<SVGPathElement | null>(null)
const p3 = ref<SVGPathElement | null>(null)
const dot = ref<SVGCircleElement | null>(null)

let raf = 0
let cleanup: (() => void) | null = null

onMounted(() => {
  const svg = svgEl.value
  const paths = [p1.value, p2.value, p3.value].filter(Boolean) as SVGPathElement[]
  const host = svg?.parentElement
  if (!svg || !host || paths.length !== 3 || !dot.value) return

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  let W = 0
  let H = 0
  let mx = -1
  let tmx = -1
  let scrollK = 0

  const size = () => {
    const b = svg.getBoundingClientRect()
    W = b.width
    H = b.height
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
  }
  const onMove = (e: PointerEvent) => {
    tmx = e.clientX - svg.getBoundingClientRect().left
  }
  const onLeave = () => {
    tmx = -1
  }
  const onScroll = () => {
    scrollK = Math.min(1, scrollY / (innerHeight * 0.6))
  }

  size()
  onScroll()
  addEventListener('resize', size)
  addEventListener('scroll', onScroll, { passive: true })
  host.addEventListener('pointermove', onMove)
  host.addEventListener('pointerleave', onLeave)

  const rowsD = [0.3, 0.4, 0.5]
  const rowsM = [0.8, 0.85, 0.9]

  const draw = (now: number) => {
    const t = now / 1000
    mx = tmx < 0
      ? mx + (W * 0.78 + Math.sin(t * 0.6) * W * 0.1 - mx) * 0.04
      : mx + (tmx - mx) * 0.12
    const calm = reduce ? 1 : scrollK
    const narrow = W < 900
    paths.forEach((p, i) => {
      const y0 = H * (narrow ? rowsM : rowsD)[i]!
      const start = narrow ? W * (0.05 + i * 0.02) : W * (0.6 - i * 0.02)
      let d = ''
      for (let x = start; x <= W + 20; x += 10) {
        const dist = (x - mx) / (W * 0.15)
        const bump = Math.exp(-dist * dist)
        const wave
          = Math.sin(x * 0.02 - t * (2 + i * 0.5) + i) * 24 * bump * (1 - calm)
          + Math.sin(x * 0.006 + t * 0.8 + i * 2) * 4 * (1 - calm)
        d += (d ? 'L' : 'M') + x.toFixed(1) + ' ' + (y0 + wave - (x - start) * 0.018).toFixed(1)
      }
      p.setAttribute('d', d)
    })
    const len = paths[1]!.getTotalLength()
    if (len) {
      const pt = paths[1]!.getPointAtLength(((t * 0.12) % 1) * len)
      dot.value?.setAttribute('cx', String(pt.x))
      dot.value?.setAttribute('cy', String(pt.y))
    }
    if (!reduce) raf = requestAnimationFrame(draw)
  }
  raf = requestAnimationFrame(draw)

  if (!reduce) {
    paths.forEach((p, i) =>
      requestAnimationFrame(() => {
        p.style.strokeDasharray = '2400'
        p.animate([{ strokeDashoffset: 2400 }, { strokeDashoffset: 0 }], {
          duration: 1600,
          delay: 200 + i * 180,
          easing: 'cubic-bezier(.2,.7,.2,1)',
          fill: 'backwards',
        }).finished.then(() => {
          p.style.strokeDasharray = 'none'
        }).catch(() => {})
      }),
    )
  }

  cleanup = () => {
    cancelAnimationFrame(raf)
    removeEventListener('resize', size)
    removeEventListener('scroll', onScroll)
    host.removeEventListener('pointermove', onMove)
    host.removeEventListener('pointerleave', onLeave)
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <svg
    ref="svgEl"
    class="home-signal"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      ref="p1"
      fill="none"
      style="stroke: var(--heading)"
      stroke-width="3"
      stroke-linecap="round"
    />
    <path
      ref="p2"
      fill="none"
      style="stroke: var(--szafir)"
      stroke-width="3"
      stroke-linecap="round"
    />
    <path
      ref="p3"
      fill="none"
      style="stroke: var(--cyjan)"
      stroke-width="2"
      stroke-linecap="round"
    />
    <circle
      ref="dot"
      r="5"
      style="fill: var(--wrzos)"
    />
  </svg>
</template>

<style scoped>
/* mockup: .hero svg.signal */
.home-signal {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
