<script setup lang="ts">
useSeoMeta({
  title: 'WRS WEiTI',
  description:
    'Wydziałowa Rada Samorządu Wydziału Elektroniki i Technik Informacyjnych PW.',
})

const { data: ustawienia } = await useAsyncData('ustawienia-home', () =>
  queryContent('/ustawienia').findOne(),
)
</script>

<template>
  <div>
    <section class="hero section">
      <div class="container hero__grid">
        <div>
          <UiEyebrow>Wydziałowa Rada Samorządu</UiEyebrow>
          <h1>
            {{ ustawienia?.hero?.tytul || 'Wiemy, jak to działa.' }}
          </h1>
          <p class="lead">
            {{
              ustawienia?.hero?.opis
                || 'TODO(treść): krótkie intro — jedno miejsce na sprawy studenckie EiTI.'
            }}
          </p>
          <div class="hero__actions">
            <UiButton to="/_ui">Zobacz komponenty UI</UiButton>
            <UiButton variant="ghost" href="#status">Status A1</UiButton>
          </div>
        </div>
        <div class="hero__visual" aria-hidden="true">
          <img
            src="/brand/wrs-mark-color.svg"
            alt=""
            width="280"
            height="280"
            class="hero__mark"
          >
        </div>
      </div>
    </section>

    <section id="status" class="section section--surface">
      <div class="container">
        <UiEyebrow>Fundament</UiEyebrow>
        <h2>A1 — gotowe do dalszej pracy</h2>
        <p>
          Scaffold Nuxt&nbsp;3 + tokeny + motyw + UI + CI Pages. Layout, CMS i
          strony merytoryczne dojdą w kolejnych agentach (A2–A4).
        </p>
        <ul class="checklist">
          <li><code>nuxt generate</code> — SSG</li>
          <li>GitHub Pages workflow (bez FB w deployu)</li>
          <li>Stuby FB / domeny / kalendarza — patrz README</li>
          <li>Placeholdery zdjęć: inicjały (<code>UiAvatarPlaceholder</code>)</li>
        </ul>
        <UiLink to="/_ui">Galeria komponentów /_ui</UiLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero__grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 2rem;
  align-items: center;
}

.lead {
  max-width: 36rem;
  color: var(--muted);
  font-size: 1.05rem;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.hero__visual {
  display: grid;
  place-items: center;
  min-height: 280px;
  border-radius: var(--r-lg);
  background:
    linear-gradient(135deg, var(--tint), transparent 55%),
    var(--surface);
  border: 1px solid var(--line);
}

.hero__mark {
  width: min(280px, 70%);
  height: auto;
}

.checklist {
  margin: 1.25rem 0 1.5rem;
  padding-left: 1.2rem;
  color: var(--muted);
}

.checklist li {
  margin-bottom: 0.35rem;
}

@media (max-width: 900px) {
  .hero__grid {
    grid-template-columns: 1fr;
  }

  .hero__visual {
    min-height: 200px;
    order: -1;
  }
}
</style>
