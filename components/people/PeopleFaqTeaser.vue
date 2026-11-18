<script setup lang="ts">
import type { FaqPytanie } from '~/utils/faq'

defineProps<{
  pytania: FaqPytanie[]
}>()
</script>

<template>
  <aside
    class="faq-teaser reveal"
    aria-labelledby="faq-teaser-heading"
  >
    <div>
      <span
        class="faq-teaser__icon"
        aria-hidden="true"
      >
        <UiIcon
          name="circleHelp"
          :size="20"
        />
      </span>
      <h2 id="faq-teaser-heading">
        Kto za co odpowiada?
      </h2>
      <p>
        Krótki przewodnik po organach i funkcjach samorządu — od WRS po Parlament Samorządu Studentów&nbsp;PW.
      </p>
      <UiButton
        class="faq-teaser__btn"
        to="/faq#organy"
      >
        Przejdź do FAQ
      </UiButton>
    </div>
    <ul
      v-if="pytania.length"
      class="faq-teaser__links"
    >
      <li
        v-for="p in pytania.slice(0, 4)"
        :key="p.id"
      >
        <NuxtLink :to="`/faq#${p.id}`">
          {{ p.q }}
          <UiIcon
            name="arrowRight"
            :size="16"
          />
        </NuxtLink>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
/* mockup: aside.faq (sklad.html) */
.faq-teaser {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 24px 48px;
  align-items: center;
  margin: 24px 0 96px;
  padding: 32px;
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  background: var(--surface);
}

.faq-teaser__icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  margin-bottom: 16px;
  border-radius: var(--r-sm);
  background: var(--tint);
  color: var(--link);
}

.faq-teaser h2 {
  font-size: 30px;
}

.faq-teaser p {
  margin-top: 8px;
  max-width: 42ch;
  color: var(--muted);
  font-size: 15px;
}

.faq-teaser__btn {
  margin-top: 20px;
}

.faq-teaser__links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
}

.faq-teaser__links a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 4px;
  border-bottom: 1px solid var(--line);
  color: var(--text);
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  transition:
    color 0.2s,
    padding 0.3s var(--ease);
}

.faq-teaser__links li:first-child a {
  border-top: 1px solid var(--line);
}

.faq-teaser__links a :deep(.ui-icon) {
  flex-shrink: 0;
  color: var(--muted);
  transition:
    transform 0.3s var(--ease),
    color 0.2s;
}

.faq-teaser__links a:hover {
  color: var(--link);
  padding-left: 10px;
}

.faq-teaser__links a:hover :deep(.ui-icon) {
  color: var(--link);
  transform: translateX(3px);
}

@media (max-width: 820px) {
  .faq-teaser {
    grid-template-columns: 1fr;
    padding: 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .faq-teaser__links a,
  .faq-teaser__links a :deep(.ui-icon) {
    transition: none;
  }
}
</style>
