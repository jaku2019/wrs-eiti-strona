<script setup lang="ts">
// Motyw inicjalizowany w composable (anty-mignięcie w <head> via nuxt.config).
useTheme()
</script>

<template>
  <div class="site">
    <header class="site-header">
      <div class="container site-header__inner">
        <NuxtLink to="/" class="brand" aria-label="WRS WEiTI — strona główna">
          <img
            class="brand__mark brand__mark--light"
            src="/brand/wrs-mark-color.svg"
            alt=""
            width="40"
            height="40"
          >
          <img
            class="brand__mark brand__mark--dark"
            src="/brand/wrs-mark-dark.svg"
            alt=""
            width="40"
            height="40"
          >
          <span class="brand__text">
            <strong>WRS</strong>
            <span>WEiTI</span>
          </span>
        </NuxtLink>
        <nav class="site-nav" aria-label="Główna">
          <NuxtLink to="/">Strona główna</NuxtLink>
          <NuxtLink to="/_ui">UI</NuxtLink>
        </nav>
        <LayoutThemeToggle />
      </div>
    </header>
    <main class="site-main">
      <slot />
    </main>
    <footer class="site-footer section section--compact">
      <div class="container">
        <p>
          Wydziałowa Rada Samorządu WEiTI PW —
          <span class="muted">fundament A1 (scaffold)</span>
        </p>
        <p class="muted small">
          TODO(treść): pełny footer, kontakt i linki social z
          <code>content/ustawienia.yml</code>
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.site {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 40;
  border-bottom: 1px solid var(--line);
  background: color-mix(in srgb, var(--bg) 82%, transparent);
  backdrop-filter: blur(12px);
}

.site-header__inner {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: 64px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  color: inherit;
  text-decoration: none;
  margin-right: auto;
}

.brand__mark {
  width: 40px;
  height: 40px;
}

.brand__mark--dark {
  display: none;
}

:root[data-theme='dark'] .brand__mark--light {
  display: none;
}

:root[data-theme='dark'] .brand__mark--dark {
  display: block;
}

.brand__text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
  font-size: 13px;
}

.brand__text strong {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
}

.site-nav {
  display: flex;
  gap: 1rem;
}

.site-nav a {
  color: var(--text);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
}

.site-nav a:hover,
.site-nav a.router-link-active {
  color: var(--link);
}

.site-main {
  flex: 1;
}

.site-footer {
  border-top: 1px solid var(--line);
  background: var(--surface);
}

.muted {
  color: var(--muted);
}

.small {
  font-size: 14px;
}

code {
  font-size: 0.9em;
}
</style>
