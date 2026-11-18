<script setup lang="ts">
const { data: ustawienia } = await useAsyncData('ustawienia-footer', () =>
  queryContent('/ustawienia').findOne(),
)

const email = computed(() => {
  const value = ustawienia.value?.kontakt?.email as string | undefined
  if (!value || value.startsWith('TODO')) return null
  return value
})

const facebook = computed(() => {
  const value = ustawienia.value?.social?.facebook as string | undefined
  // Placeholder root URL from CMS sample — hide until real URL.
  if (!value || value.startsWith('TODO') || value === 'https://www.facebook.com/') return null
  return value
})

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer__grid">
      <div class="footer__brand">
        <div class="footer__marks">
          <img
            src="/brand/wrs-mark-dark.svg"
            alt=""
            width="44"
            height="44"
            class="footer__wrs"
          >
          <img
            src="/brand/faculty/faculty-mark-color.svg"
            alt=""
            width="44"
            height="44"
            class="footer__faculty"
          >
        </div>
        <p class="footer__name">
          Wydziałowa Rada Samorządu<br>
          Wydziału Elektroniki i Technik Informacyjnych PW
        </p>
        <p class="footer__address">
          <!-- Adres wydziału (publiczny) — redakcja może nadpisać w ustawieniach później -->
          ul.&nbsp;Nowowiejska 15/19<br>
          00-665 Warszawa
        </p>
      </div>

      <nav class="footer__nav" aria-label="Stopka">
        <p class="footer__heading">Nawigacja</p>
        <ul role="list">
          <li><NuxtLink :to="{ path: '/', hash: '#baza' }">Baza wiedzy</NuxtLink></li>
          <li><NuxtLink to="/aktualnosci">Aktualności</NuxtLink></li>
          <li><NuxtLink to="/sklad">Skład samorządu</NuxtLink></li>
          <li><NuxtLink to="/dokumenty">Dokumenty</NuxtLink></li>
          <li><NuxtLink to="/faq">FAQ</NuxtLink></li>
        </ul>
      </nav>

      <div class="footer__contact">
        <p class="footer__heading">Kontakt</p>
        <ul role="list">
          <li v-if="email">
            <a :href="`mailto:${email}`" class="footer__social">
              <UiIcon name="mail" :size="16" />
              {{ email }}
            </a>
          </li>
          <li v-else class="footer__todo">
            TODO(treść): e-mail kontaktowy WRS
          </li>
          <li v-if="facebook">
            <a
              :href="facebook"
              class="footer__social"
              target="_blank"
              rel="noopener noreferrer"
            >
              <UiIcon name="facebook" :size="16" />
              Facebook
            </a>
          </li>
          <li v-else class="footer__todo">
            TODO(treść): oficjalny URL strony FB WRS
          </li>
        </ul>
      </div>
    </div>

    <div class="container footer__legal">
      <p>
        © {{ year }} WRS WEiTI.
        <span class="footer__muted">Strona statyczna — bez cookies i trackerów.</span>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: auto;
  background: var(--pw-szary-90);
  color: #eceef1;
  padding-block: 3.5rem 1.75rem;
  view-transition-name: site-footer;
}

.footer__grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 2rem 2.5rem;
}

.footer__marks {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.footer__wrs,
.footer__faculty {
  width: 44px;
  height: 44px;
}

.footer__name {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 500;
  line-height: 1.35;
  margin: 0 0 0.85rem;
  color: #f5f5f6;
}

.footer__address {
  margin: 0;
  color: #a4a8ae;
  font-size: 14px;
  line-height: 1.55;
}

.footer__heading {
  margin: 0 0 0.75rem;
  font-size: 13px;
  font-weight: 600;
  color: #a4a8ae;
}

.footer ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.45rem;
}

.footer a {
  color: #eceef1;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
}

.footer a:hover {
  color: #a9bfea;
}

.footer__social {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.footer__todo {
  color: #a4a8ae;
  font-size: 13px;
}

.footer__legal {
  margin-top: 2.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid #3a3f46;
  font-size: 13px;
  color: #a4a8ae;
}

.footer__legal p {
  margin: 0;
}

.footer__muted {
  color: #7d828a;
}

@media (max-width: 900px) {
  .footer__grid {
    grid-template-columns: 1fr 1fr;
  }

  .footer__brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .footer__grid {
    grid-template-columns: 1fr;
  }
}
</style>
