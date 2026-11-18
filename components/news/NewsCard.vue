<script setup lang="ts">
import { formatDateLong, formatDateShort, toDateTimeAttr } from '~/utils/formatDate'
import { withAppBase } from '~/utils/siteUrl'

const props = withDefaults(
  defineProps<{
    to: string
    title: string
    date?: string | Date | null
    excerpt?: string | null
    image?: string | null
    /** kompaktowa = pasek na home; full = siatka listy */
    variant?: 'full' | 'compact'
  }>(),
  {
    variant: 'full',
  },
)

const imageSrc = computed(() =>
  props.image ? withAppBase(props.image) : '',
)
</script>

<template>
  <NuxtLink
    :to="to"
    class="news-card"
    :class="[`news-card--${variant}`]"
  >
    <div class="news-card__media" aria-hidden="true">
      <img
        v-if="imageSrc"
        :src="imageSrc"
        alt=""
        loading="lazy"
        width="640"
        height="400"
      >
      <div v-else class="news-card__placeholder" />
    </div>
    <div class="news-card__body">
      <time
        v-if="date"
        class="news-card__date"
        :datetime="toDateTimeAttr(date)"
      >
        {{ variant === 'compact' ? formatDateLong(date) : formatDateShort(date) }}
      </time>
      <h3 class="news-card__title">{{ title }}</h3>
      <p v-if="variant === 'full' && excerpt" class="news-card__excerpt">
        {{ excerpt }}
      </p>
    </div>
  </NuxtLink>
</template>

<style scoped>
.news-card {
  display: grid;
  text-decoration: none;
  color: inherit;
  border: 1px solid var(--line);
  border-radius: var(--r);
  background: var(--surface);
  overflow: hidden;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.news-card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 10px 28px color-mix(in srgb, var(--grafit) 12%, transparent);
}

.news-card--full {
  grid-template-rows: auto 1fr;
}

.news-card--compact {
  grid-template-columns: 84px 1fr;
  align-items: stretch;
  min-width: 280px;
}

.news-card__media {
  position: relative;
  background: var(--bg);
  overflow: hidden;
}

.news-card--full .news-card__media {
  aspect-ratio: 16 / 10;
}

.news-card--compact .news-card__media {
  aspect-ratio: 1;
}

.news-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-card__placeholder {
  width: 100%;
  height: 100%;
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--szafir) 22%, transparent) 0%,
      transparent 42%
    ),
    linear-gradient(
      135deg,
      transparent 48%,
      color-mix(in srgb, var(--cyjan) 18%, transparent) 78%,
      transparent 100%
    ),
    var(--wrzos-soft);
}

.news-card__body {
  display: grid;
  gap: 0.35rem;
  padding: 1rem 1.1rem 1.15rem;
  align-content: start;
}

.news-card--compact .news-card__body {
  padding: 0.7rem 0.85rem;
}

.news-card__date {
  font-family: var(--font-display);
  font-size: 13px;
  color: var(--muted);
}

.news-card__title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 500;
  line-height: 1.25;
  margin: 0;
  color: var(--heading);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-card--compact .news-card__title {
  font-size: 17px;
}

.news-card__excerpt {
  margin: 0.15rem 0 0;
  font-size: 14px;
  line-height: 1.45;
  color: var(--muted);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}


/* ---------- wariant kompaktowy — mockup: .card ---------- */
.news-card--compact {
  grid-template-columns: 84px 1fr;
  gap: 14px;
  align-items: center;
  min-width: 0;
  padding: 10px;
  overflow: visible;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.news-card--compact:hover {
  transform: none;
  border-color: color-mix(in oklab, var(--szafir) 55%, transparent);
  box-shadow: 0 8px 24px -16px #21252966;
}

.news-card--compact .news-card__media {
  width: 84px;
  aspect-ratio: 1;
  border-radius: var(--r-sm);
  background: var(--grafit);
}

/* miniatura bez zdjęcia: ukośne belki z logo */
.news-card--compact .news-card__placeholder {
  position: relative;
  background: none;
}

.news-card--compact .news-card__placeholder::before,
.news-card--compact .news-card__placeholder::after {
  content: '';
  position: absolute;
  top: -20%;
  bottom: -20%;
  transform: rotate(28deg);
  transition: translate 0.6s var(--ease);
}

.news-card--compact .news-card__placeholder::before {
  left: 46%;
  width: 16%;
  background: linear-gradient(var(--szafir), transparent 95%);
}

.news-card--compact .news-card__placeholder::after {
  left: 30%;
  width: 6%;
  background: linear-gradient(var(--cyjan), transparent 95%);
}

.news-card--compact:hover .news-card__placeholder::before {
  translate: 8px 0;
}

.news-card--compact:hover .news-card__placeholder::after {
  translate: 4px 0;
}

.news-card--compact:nth-child(2) .news-card__media {
  background: var(--szafir-deep);
}

.news-card--compact:nth-child(2) .news-card__placeholder::before {
  background: linear-gradient(var(--wrzos), transparent 95%);
}

.news-card--compact:nth-child(3) .news-card__media {
  background: var(--wrzos);
}

.news-card--compact:nth-child(3) .news-card__placeholder::before {
  background: linear-gradient(var(--grafit), transparent 95%);
}

.news-card--compact .news-card__body {
  gap: 4px;
  padding: 0;
  min-width: 0;
}

.news-card--compact .news-card__date {
  font-family: var(--font-sans);
  font-size: 12.5px;
  font-variant-numeric: tabular-nums;
}

.news-card--compact .news-card__title {
  font: 500 17px / 1.25 var(--font-display);
  letter-spacing: -0.01em;
  transition: color 0.2s;
}

.news-card--compact:hover .news-card__title {
  color: var(--link);
}

/* ---------- wariant kompaktowy — mockup: .card ---------- */
.news-card--compact {
  grid-template-columns: 84px 1fr;
  gap: 14px;
  align-items: center;
  min-width: 0;
  padding: 10px;
  overflow: visible;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.news-card--compact:hover {
  transform: none;
  border-color: color-mix(in oklab, var(--szafir) 55%, transparent);
  box-shadow: 0 8px 24px -16px #21252966;
}

.news-card--compact .news-card__media {
  width: 84px;
  aspect-ratio: 1;
  border-radius: var(--r-sm);
  background: var(--grafit);
}

/* miniatura bez zdjęcia: ukośne belki z logo */
.news-card--compact .news-card__placeholder {
  position: relative;
  background: none;
}

.news-card--compact .news-card__placeholder::before,
.news-card--compact .news-card__placeholder::after {
  content: '';
  position: absolute;
  top: -20%;
  bottom: -20%;
  transform: rotate(28deg);
  transition: translate 0.6s var(--ease);
}

.news-card--compact .news-card__placeholder::before {
  left: 46%;
  width: 16%;
  background: linear-gradient(var(--szafir), transparent 95%);
}

.news-card--compact .news-card__placeholder::after {
  left: 30%;
  width: 6%;
  background: linear-gradient(var(--cyjan), transparent 95%);
}

.news-card--compact:hover .news-card__placeholder::before {
  translate: 8px 0;
}

.news-card--compact:hover .news-card__placeholder::after {
  translate: 4px 0;
}

.news-card--compact:nth-child(2) .news-card__media {
  background: var(--szafir-deep);
}

.news-card--compact:nth-child(2) .news-card__placeholder::before {
  background: linear-gradient(var(--wrzos), transparent 95%);
}

.news-card--compact:nth-child(3) .news-card__media {
  background: var(--wrzos);
}

.news-card--compact:nth-child(3) .news-card__placeholder::before {
  background: linear-gradient(var(--grafit), transparent 95%);
}

.news-card--compact .news-card__body {
  gap: 4px;
  padding: 0;
  min-width: 0;
}

.news-card--compact .news-card__date {
  font-family: var(--font-sans);
  font-size: 12.5px;
  font-variant-numeric: tabular-nums;
}

.news-card--compact .news-card__title {
  font: 500 17px / 1.25 var(--font-display);
  letter-spacing: -0.01em;
  transition: color 0.2s;
}

.news-card--compact:hover .news-card__title {
  color: var(--link);
}

@media (prefers-reduced-motion: reduce) {
  .news-card {
    transition: none;
  }

  .news-card:hover {
    transform: none;
  }
}
</style>
