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
/* mockup: footer — ciemny pas, 14px, jeden rząd (flex-wrap) */
.footer {
  margin-top: auto;
  background: var(--pw-szary-90);
  color: #b9b8c6;
  padding: 56px 0 40px;
  font-size: 14px;
  view-transition-name: site-footer;
}

:root[data-theme='dark'] .footer {
  background: #16191c;
}

.footer__grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px 48px;
}

.footer__brand {
  display: grid;
  gap: 10px;
}

.footer__marks {
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer__wrs,
.footer__faculty {
  width: 36px;
  height: 36px;
}

.footer__name {
  margin: 0;
  font: 600 16px / 1.3 var(--font-display);
  color: #fff;
}

.footer__address {
  margin: 0;
  color: #9897a8;
  line-height: 1.5;
}

.footer__heading {
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 600;
  color: #9897a8;
}

.footer ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 6px;
}

.footer__nav ul {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 18px;
  max-width: 36ch;
}

.footer a {
  color: #d8d7e2;
  text-decoration: none;
  transition: color 0.2s;
}

.footer a:hover {
  color: var(--szafir);
}

.footer__social {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.footer__todo {
  color: #9897a8;
  font-size: 13px;
}

.footer__legal {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #ffffff14;
}

.footer__legal p {
  margin: 0;
  font-size: 13px;
  color: #9897a8;
}

.footer__muted {
  color: #6f6e7e;
}
</style>
