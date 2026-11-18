<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const is404 = computed(() => props.error?.statusCode === 404)

useSeoMeta({
  title: is404.value ? 'Nie znaleziono — WRS WEiTI' : 'Błąd — WRS WEiTI',
  robots: 'noindex',
})

// error.vue is outside default layout — wire theme + Ctrl K locally.
useTheme()
const { openPalette, bindGlobalHotkeys } = useSearch()
bindGlobalHotkeys()

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="site">
    <LayoutScrollProgress />
    <LayoutNavbar />
    <main
      id="main"
      class="site-main section"
    >
      <div class="container error-page">
        <UiEyebrow>{{ is404 ? '404' : `Błąd ${error.statusCode}` }}</UiEyebrow>
        <h1>
          <template v-if="is404">
            Nie ma takiej <em>strony.</em>
          </template>
          <template v-else>
            Coś poszło <em>nie tak.</em>
          </template>
        </h1>
        <p class="error-page__lead">
          <template v-if="is404">
            Adres mógł się zmienić albo zawiera literówkę. Spróbuj wyszukiwarki albo wróć na stronę główną.
          </template>
          <template v-else>
            {{ error.statusMessage || 'Wystąpił nieoczekiwany błąd.' }}
          </template>
        </p>

        <div class="error-page__search">
          <UiButton
            variant="ghost"
            icon="search"
            tip="Szukaj · Ctrl K"
            @click="openPalette"
          >
            Szukaj na stronie
          </UiButton>
          <p class="error-page__hint">
            Skrót: <kbd>Ctrl</kbd> + <kbd>K</kbd>
          </p>
        </div>

        <div class="error-page__actions">
          <UiButton to="/baza-wiedzy">
            Baza wiedzy
          </UiButton>
          <UiButton
            variant="ghost"
            icon="home"
            @click="goHome"
          >
            Strona główna
          </UiButton>
        </div>
      </div>
    </main>
    <LayoutFooter />
    <LayoutSearchPalette />
  </div>
</template>

<style scoped>
.site {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
}

.site-main {
  flex: 1;
  view-transition-name: site-main;
}

.error-page {
  max-width: 40rem;
  padding-block: 2rem 4rem;
}

.error-page h1 {
  font-size: clamp(40px, 7vw, 72px);
  margin-bottom: 0.45em;
}

.error-page__lead {
  color: var(--muted);
  font-size: 1.05rem;
  max-width: 34rem;
}

.error-page__search {
  margin: 2rem 0 1.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.85rem 1.25rem;
}

.error-page__hint {
  margin: 0;
  font-size: 13px;
  color: var(--muted);
}

.error-page__hint kbd {
  display: inline-block;
  padding: 0.1em 0.4em;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: var(--surface);
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 600;
}

.error-page__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
</style>
