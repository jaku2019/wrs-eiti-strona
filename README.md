# WRS WEiTI — strona

Statyczna strona **Wydziałowej Rady Samorządu Wydziału Elektroniki i Technik Informacyjnych PW** (Nuxt 3 SSG).

Tymczasowy adres (GitHub Pages): **https://jaku2019.github.io/wrs-eiti-strona/**

## Szybki start

```bash
npm ci
npm run dev
npm run generate   # → .output/public
```

Wymagania: Node ≥ 20.

## Stack

- Nuxt 3 + TypeScript + `@nuxt/content` + `@nuxt/fonts` + `@nuxtjs/sitemap`
- Tokeny / motyw: `assets/css/{tokens,base,motion}.css`, `useTheme` (anty-mignięcie w `<head>`)
- Layout A2: `LayoutNavbar` (scroll-spy, Priority+, menu kołowe), `LayoutFooter`, Ctrl&nbsp;K (`LayoutSearchPalette`, dane statyczne do A5), View Transitions
- Komponenty `components/ui/` + galeria `/_ui`
- Deploy: `.github/workflows/deploy-pages.yml` (bez Facebooka)
- Treści przykładowe / `TODO(treść)` w `content/`

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

## Kolejne kamienie

- **A3** pełne Pages CMS + filtry draft/dat  
- **A4** strony merytoryczne (home / skład / KB / …)  
- **A5** Pagefind → podpięcie do Ctrl&nbsp;K  
- **A6** FB produkcyjnie 

## Licencja / treść

Treści merytoryczne oznaczone `TODO(treść)` — nie wymyślamy faktów o wydziale.
