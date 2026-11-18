<script setup lang="ts">
// Motyw inicjalizowany w composable (anty-mignięcie w <head> via nuxt.config).
useTheme()
const { bindGlobalHotkeys } = useSearch()
bindGlobalHotkeys()
</script>

<template>
  <div class="site">
    <LayoutScrollProgress />
    <LayoutNavbar />
    <main id="main" class="site-main">
      <slot />
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
}

.site-main {
  flex: 1;
  view-transition-name: site-main;
}
</style>
