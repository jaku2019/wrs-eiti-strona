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
          <UiEyebrow>
            Wydziałowa Rada Samorządu · Wydział Elektroniki i Technik Informacyjnych PW
          </UiEyebrow>
          <h1>
            Masz sprawę?
            <em>{{ ustawienia?.hero?.tytul || 'Wiemy, jak to działa.' }}</em>
          </h1>
          <p class="lead">
            {{
              ustawienia?.hero?.opis
                || 'TODO(treść): krótkie intro — jedno miejsce na sprawy studenckie EiTI.'
            }}
          </p>
          <div class="hero__actions">
            <UiButton href="#baza">Przejdź do bazy wiedzy</UiButton>
            <UiButton variant="ghost" href="#kontakt">Zgłoś sprawę</UiButton>
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

    <section id="baza" class="section section--surface">
      <div class="container">
        <UiEyebrow>Baza wiedzy</UiEyebrow>
        <h2>Najczęstsze sprawy</h2>
        <p class="muted">
          TODO(treść): kafelki kategorii — pełna sekcja w A4.
        </p>
        <UiLink to="/baza-wiedzy">Wszystkie artykuły</UiLink>
      </div>
    </section>

    <section id="aktualnosci" class="section section--compact">
      <div class="container">
        <div class="row-head">
          <h2 class="h2-compact">Aktualności</h2>
          <UiLink to="/aktualnosci">Wszystkie</UiLink>
        </div>
        <p class="muted">
          TODO(treść): pasek 3 najnowszych wpisów (A4).
        </p>
      </div>
    </section>

    <section class="section section--compact">
      <div class="container">
        <UiEyebrow>Fundament</UiEyebrow>
        <h2>Layout A2</h2>
        <p class="muted">
          Navbar (scroll-spy, Priority+, menu kołowe), stopka, Ctrl&nbsp;K, View Transitions.
          Treści CMS (A3) + strony merytoryczne (A4).
        </p>
        <p class="hero__actions">
          <UiLink to="/_ui">Galeria komponentów /_ui</UiLink>
          <UiLink to="/_content">Smoke treści /_content</UiLink>
        </p>
      </div>
    </section>

    <section id="kalendarz" class="section section--surface">
      <div class="container split">
        <div>
          <div class="row-head">
            <h2>Nadchodzące</h2>
          </div>
          <p class="muted">
            TODO(treść): 3 wydarzenia z <code>content/wydarzenia.yml</code> (A4).
          </p>
        </div>
        <div id="kontakt" class="contact">
          <h3>Nie wiesz, do kogo się zgłosić?</h3>
          <p>
            TODO(treść): krótki opis kontaktu WRS.
          </p>
          <div class="hero__actions">
            <UiButton href="#kontakt">Zgłoś sprawę</UiButton>
            <UiButton variant="ghost" href="#kontakt">
              Napisz e-mail
            </UiButton>
          </div>
          <p class="todo-note">TODO(treść): prawdziwy e-mail w ustawieniach.</p>
        </div>
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

.muted {
  color: var(--muted);
  max-width: 40rem;
}

.row-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.h2-compact {
  font-size: 28px;
  margin: 0;
}

.split {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 2rem;
}

.contact {
  background: var(--grafit);
  color: #fff;
  border-radius: var(--r-lg);
  padding: 1.75rem;
  position: relative;
  overflow: hidden;
}

.contact h3 {
  color: #fff;
  font-size: clamp(24px, 3vw, 32px);
  margin-top: 0;
}

.contact p {
  color: color-mix(in srgb, #fff 78%, transparent);
}

.contact::before,
.contact::after {
  content: '';
  position: absolute;
  width: 40%;
  height: 70%;
  pointer-events: none;
  transform: skewX(-18deg);
}

.contact::before {
  right: -8%;
  top: -20%;
  background: color-mix(in srgb, var(--szafir) 35%, transparent);
}

.contact::after {
  right: 8%;
  bottom: -30%;
  background: color-mix(in srgb, var(--cyjan) 28%, transparent);
}

.todo-note {
  margin: 1rem 0 0;
  font-size: 12px;
  color: color-mix(in srgb, #fff 55%, transparent);
}

@media (max-width: 900px) {
  .hero__grid,
  .split {
    grid-template-columns: 1fr;
  }

  .hero__visual {
    min-height: 200px;
    order: -1;
  }
}
</style>
