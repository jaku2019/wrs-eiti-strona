// https://nuxt.com/docs/api/configuration/nuxt-config
const siteUrl =
  process.env.SITE_URL || 'https://jaku2019.github.io/wrs-eiti-strona'
// @nuxtjs/sitemap wants origin without path; project Pages path lives in baseURL.
const siteOrigin = (() => {
  try {
    return new URL(siteUrl).origin
  } catch {
    return 'https://jaku2019.github.io'
  }
})()
// Keep trailing slash; head icon hrefs must include project Pages path.
const appBaseURL = process.env.NUXT_APP_BASE_URL || '/wrs-eiti-strona/'
const withBase = (assetPath: string) => {
  const base = appBaseURL.endsWith('/') ? appBaseURL.slice(0, -1) : appBaseURL
  const path = assetPath.startsWith('/') ? assetPath : `/${assetPath}`
  return base ? `${base}${path}` : path
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: true,
  devtools: { enabled: true },

  modules: ['@nuxt/content', '@nuxt/fonts', '@nuxtjs/sitemap'],

  experimental: {
    viewTransition: true,
  },

  // Temporary GitHub Pages project site. Swap SITE_URL (+ optional CNAME) for faculty domain later.
  // See README „Domena”.
  runtimeConfig: {
    public: {
      siteUrl,
    },
  },

  site: {
    url: siteOrigin,
    name: 'WRS WEiTI',
    description: 'Wydziałowa Rada Samorządu Wydziału Elektroniki i Technik Informacyjnych PW',
  },


  app: {
    // Project Pages: https://jaku2019.github.io/wrs-eiti-strona/
    // For a custom domain (or user site), set NUXT_APP_BASE_URL=/ and SITE_URL accordingly.
    baseURL: appBaseURL,
    head: {
      htmlAttrs: { lang: 'pl' },
      title: 'WRS WEiTI',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Wydziałowa Rada Samorządu WEiTI PW — baza wiedzy, aktualności i kontakt.',
        },
        { name: 'theme-color', content: '#F0F0F0' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: withBase('/favicon.ico') },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: withBase('/favicon-32.png') },
        { rel: 'apple-touch-icon', href: withBase('/apple-touch-icon.png') },
      ],
      script: [
        {
          // Anti-flash: set data-theme before paint (localStorage → prefers-color-scheme).
          children: `(function(){try{var k='wrs-theme';var s=localStorage.getItem(k);var m=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';var t=(s==='light'||s==='dark')?s:m;document.documentElement.setAttribute('data-theme',t);document.documentElement.style.colorScheme=t;}catch(e){}})();`,
          tagPosition: 'head',
        },
      ],
    },
  },

  css: [
    '~/assets/css/tokens.css',
    '~/assets/css/base.css',
    '~/assets/css/motion.css',
  ],

  fonts: {
    families: [
      {
        name: 'Inter',
        provider: 'google',
        weights: [400, 500, 600],
        styles: ['normal'],
        display: 'swap',
        subsets: ['latin', 'latin-ext'],
      },
      {
        name: 'Literata',
        provider: 'google',
        weights: [400, 500, 600],
        styles: ['normal', 'italic'],
        display: 'swap',
        subsets: ['latin', 'latin-ext'],
      },
    ],
  },

  content: {
    highlight: false,
    markdown: {
      // h2/h3 get ids for KB TOC + deep links (news body rarely uses headings)
      anchorLinks: {
        depth: 3,
        exclude: [1],
      },
    },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/_ui',
        '/_content',
        '/sklad',
        '/faq',
        '/dokumenty',
        '/aktualnosci',
        '/baza-wiedzy',
      ],
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },
})
