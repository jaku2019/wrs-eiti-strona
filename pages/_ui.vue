<script setup lang="ts">
useSeoMeta({
  title: 'UI — WRS WEiTI',
  robots: 'noindex',
})

const chip = ref('prezydium')
</script>

<template>
  <div class="section">
    <div class="container ui-page">
      <UiEyebrow>Dev only</UiEyebrow>
      <h1>Komponenty UI</h1>
      <p class="muted">
        Galeria wariantów z M1.4. Pełny layout (navbar Priority+, footer) — A2.
      </p>

      <section class="ui-block">
        <h2>Przyciski</h2>
        <div class="row">
          <UiButton>Primary</UiButton>
          <UiButton size="sm">Primary sm</UiButton>
          <UiButton variant="ghost">Ghost</UiButton>
          <UiButton variant="icon" icon="search" tip="Szukaj · Ctrl K" aria-label="Szukaj" />
          <LayoutThemeToggle />
        </div>
      </section>

      <section class="ui-block">
        <h2>Linki, tagi, chipy</h2>
        <div class="row">
          <UiLink to="/">Strona główna</UiLink>
          <UiTag>Neutral</UiTag>
          <UiTag tone="accent">Akcent</UiTag>
          <UiChip :active="chip === 'prezydium'" @click="chip = 'prezydium'">Prezydium</UiChip>
          <UiChip :active="chip === 'dydaktyka'" @click="chip = 'dydaktyka'">Dydaktyczna</UiChip>
        </div>
      </section>

      <section class="ui-block">
        <h2>Placeholdery zdjęć (inicjały)</h2>
        <div class="avatars">
          <UiAvatarPlaceholder name="Anna Kowalczyk" />
          <UiAvatarPlaceholder name="Adam Baran" />
          <UiAvatarPlaceholder name="TODO Treść" />
        </div>
        <p class="muted small">
          Prawdziwe zdjęcia tylko po zgodach RODO — do M7.
        </p>
      </section>

      <section class="ui-block">
        <h2>Eyebrow + typografia</h2>
        <UiEyebrow>Baza wiedzy</UiEyebrow>
        <h3>Wiemy, <em>jak to działa.</em></h3>
      </section>
    </div>
  </div>
</template>

<style scoped>
.ui-page h1 {
  font-size: clamp(36px, 5vw, 56px);
}

.ui-block {
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--line);
}

.ui-block h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.ui-block h3 {
  font-size: clamp(28px, 3vw, 40px);
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.avatars {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 120px));
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.muted {
  color: var(--muted);
}

.small {
  font-size: 14px;
}
</style>
