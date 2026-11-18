# WRS WEiTI — strona

Statyczna strona **Wydziałowej Rady Samorządu Wydziału Elektroniki i Technik Informacyjnych PW** (Nuxt 3 SSG).

Tymczasowy adres (GitHub Pages): **https://jaku2019.github.io/wrs-eiti-strona/**

## Szybki start

```bash
npm ci
npm run dev
npm run generate         # nuxt generate + fix baseURL assets + Pagefind
npm run verify:search    # smoke indeksu (po generate)
npm run verify:asset-base # brak `/_fonts` / favicon bez base path
```

Wymagania: Node ≥ 20.

### Podgląd jak na GitHub Pages (ważne: `baseURL`)

Site jest **project Pages** pod `/wrs-eiti-strona/` (nie root). Serwuj katalog nadrzędny z podfolderem o tej nazwie — inaczej JS/CSS 404 i brak hydracji:

```bash
npm run generate
rm -rf /tmp/wrs-pages-serve && mkdir -p /tmp/wrs-pages-serve/wrs-eiti-strona
cp -a .output/public/. /tmp/wrs-pages-serve/wrs-eiti-strona/
npx serve -l 4173 /tmp/wrs-pages-serve
# otwórz http://127.0.0.1:4173/wrs-eiti-strona/
```

## Stack

- Nuxt 3 + TypeScript + `@nuxt/content` + `@nuxt/fonts` + `@nuxtjs/sitemap`
- Tokeny / motyw: `assets/css/{tokens,base,motion}.css`, `useTheme` (anty-mignięcie w `<head>`)
- Layout: `LayoutNavbar` (scroll-spy, Priority+, menu kołowe), `LayoutFooter`, Ctrl&nbsp;K (`LayoutSearchPalette` + Pagefind), View Transitions
- Wyszukiwarka: **Pagefind** (indeks po generate; `pagefind.yml`; UI = własna paleta)
- Komponenty `components/ui/` + galeria `/_ui`
- Deploy: `.github/workflows/deploy-pages.yml` (generate + Pagefind + `verify:search`, bez Facebooka)
- Treści przykładowe / `TODO(treść)` w `content/`

## Wyszukiwanie (Pagefind / Ctrl K)

1. `npm run generate` buduje SSG, potem `pagefind --site .output/public` (język `pl`).
2. Indeksowane są strony z `data-pagefind-body`: artykuły bazy wiedzy, FAQ, aktualności.
3. Paleta Ctrl/⌘&nbsp;K ładuje `/pagefind/pagefind.js` (z uwzględnieniem `baseURL` project Pages).
4. Polskie znaki: stemming + normalizacja diakrytyków (np. `wydzialowa` ≈ `wydziałowa`).
5. W `nuxt dev` indeksu nie ma — najpierw `generate`, albo podgląd statyczny (`nuxt preview` / serwowanie `.output/public`).

Smoke: `npm run verify:search` (CI uruchamia to w workflow Pages).

## Treści i Pages CMS (A3)

- Modele w `content/` (aktualności, baza wiedzy, FAQ, skład, dokumenty, `wydarzenia.yml`, ustawienia)
- Konfiguracja redakcji: [`.pages.yml`](.pages.yml) → [Pages CMS](https://pagescms.org/)
- Media: `public/uploads/` (ścieżki `/uploads/…`)
- Filtr publikacji aktualności: `draft !== true` oraz `date <= czas buildu` — `composables/usePublishedAktualnosci.ts`, `utils/contentFilters.ts`
- Smoke zapytań: `/_content` (prerender)
- Kalendarz: `content/wydarzenia.yml` + `TODO(ICS)` w pliku i `utils/calendarSource.ts`
- Facebook: nadal stub / DRY_RUN (sekcja poniżej) — `facebook.publish` domyślnie wyłączone w CMS

## GitHub Pages (włączenie + deploy)

Docelowy URL: **https://jaku2019.github.io/wrs-eiti-strona/**

Workflow `.github/workflows/deploy-pages.yml` buduje `.output/public` (z Pagefind) i publikuje przez `actions/deploy-pages`.  
**Build może być zielony, a `deploy` czerwony**, dopóki Pages nie jest włączone.

### Jednorazowo — właściciel repo (Jakub)

1. Otwórz **https://github.com/jaku2019/wrs-eiti-strona/settings/pages**
2. **Build and deployment → Source** → wybierz **GitHub Actions** (nie „Deploy from a branch”).
3. Zapisz. Pierwsze udane `Deploy GitHub Pages` utworzy environment `github-pages`.
4. (Opcjonalnie) Actions → **Deploy GitHub Pages** → **Run workflow**, albo push na `main`.
5. Po sukcesie sprawdź: `https://jaku2019.github.io/wrs-eiti-strona/` oraz `/sklad`, `/faq`, Ctrl+K.

Host mode: **project site** z `NUXT_APP_BASE_URL=/wrs-eiti-strona/` (domyślne w `nuxt.config.ts` i CI).

## Domena (swap github.io → wydziałowa)

1. DNS / GitHub Pages → Custom domain (np. `wrs.elka.pw.edu.pl`).
2. Repo **Variables** (Settings → Secrets and variables → Actions → Variables):
   - `SITE_URL` = `https://wrs.elka.pw.edu.pl` (bez trailing slash)
   - `NUXT_APP_BASE_URL` = `/`
3. Opcjonalnie: `public/CNAME` z jedną linią domeny — wzór w `public/CNAME.example`.
4. Lokalnie to samo przez `.env` (patrz `.env.example`).
5. Po zmianie: push na `main` → workflow Deploy GitHub Pages.

`nuxt.config.ts` czyta `SITE_URL` i `NUXT_APP_BASE_URL` z env.

## Facebook (checklist — bez produkcji Meta teraz)

Sekrety (Settings → Secrets):

| Secret | Opis |
|---|---|
| `FB_PAGE_ID` | ID strony FB |
| `FB_PAGE_TOKEN` | token strony (`pages_manage_posts`, …) |

Variable: `SITE_URL` (jak wyżej).

Lokalnie / CI stub:

```bash
npm run fb:list-due
npm run fb:dry-run    # DRY_RUN=1, bez Graph API
```

Pliki:

- `scripts/publish-facebook.mjs` — szkielet + DRY_RUN (pełna publikacja = A6)
- `data/facebook.json` — stan publikacji (pisze bot)
- `.github/workflows/fb-publish.stub.yml` — **ręczny, `if: false`** (nic nie publikuje)
- `.github/workflows/fb-token-check.yml` — ręczny probe tokenu

Gdy Meta będzie gotowe: odblokować stub / scalić z `publikacja.yml` (docs `06`), ustawić `CUTOFF`, włączyć `facebook.publish` na aktualnościach.

## Kalendarz

Źródło: `content/wydarzenia.yml` (CMS).  
W pliku jest komentarz **TODO** pod przyszły adapter Google Calendar → ICS — bez zmiany modelu.

## Brand

Znaki WRS w `public/brand/` (z Context `media/brand/`). Emblemat wydziału tylko w `public/brand/faculty/` — **nie** jako logo WRS.

Zdjęcia składu: placeholdery z inicjałów (`UiAvatarPlaceholder`) do czasu zgód RODO.

## Strony treści (A4c)

- `/aktualnosci` + `/aktualnosci/<slug>` — lista (filtr draft/dat), wpis, `og:*`, kopiowanie linku  
- `/baza-wiedzy` + `/baza-wiedzy/<kategoria>/<slug>` — kategorie, TOC ze scroll-spy, powiązane, postęp czytania  
- `/dokumenty` — filtry typu i roku z `content/dokumenty.yml`  
- Zajawka aktualności: plugin `server/plugins/preserve-excerpt.ts` (Content nadpisuje frontmatter `excerpt`)

## Kolejne kamienie

- **A6** FB produkcyjnie (poza zakresem, dopóki Meta + sekrety)

## Licencja / treść

Treści merytoryczne oznaczone `TODO(treść)` — nie wymyślamy faktów o wydziale.
