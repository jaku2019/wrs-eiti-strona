#!/usr/bin/env node
/**
 * Stub publikacji aktualności na Facebooku (A1 / easy-setup).
 *
 * Produkcyjna konfiguracja Meta — NIE teraz (A0). Ten skrypt ma działać w DRY_RUN
 * i być gotowy do podpięcia sekretów później (A6).
 *
 * Wymagane sekrety / zmienne (GitHub Secrets & Variables):
 *   FB_PAGE_ID      — ID strony FB
 *   FB_PAGE_TOKEN   — token strony (pages_manage_posts, …)
 *   SITE_URL        — kanoniczny URL (np. https://….pw.edu.pl)  [vars.SITE_URL]
 *   DRY_RUN=1       — tylko log, bez wywołań Graph API
 *   CUTOFF          — daty starsze nie są publikowane (domyślnie 2026-12-01)
 *
 * Użycie:
 *   DRY_RUN=1 node scripts/publish-facebook.mjs
 *   node scripts/publish-facebook.mjs --list-due
 *
 * TODO(A6): pełna implementacja Graph API + zapis data/facebook.json po sukcesie.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

const {
  FB_PAGE_ID,
  FB_PAGE_TOKEN,
  SITE_URL = 'https://jaku2019.github.io/wrs-eiti-strona',
  DRY_RUN = '1',
  CUTOFF = '2026-12-01',
} = process.env

const API = 'https://graph.facebook.com/v23.0'
const DIR = 'content/aktualnosci'
const STATE = 'data/facebook.json'
const MAX_PER_RUN = 3
const dry = DRY_RUN === '1' || DRY_RUN === 'true' || !FB_PAGE_TOKEN

const state = JSON.parse(await fs.readFile(STATE, 'utf8').catch(() => '{}'))
const now = new Date()

const due = []
for (const file of await fs.readdir(DIR).catch(() => [])) {
  if (!file.endsWith('.md')) continue
  const slug = file.slice(0, -3)
  const raw = await fs.readFile(path.join(DIR, file), 'utf8')
  const { data } = matter(raw)
  const date = new Date(data.date)
  if (data.draft || !data.facebook?.publish || state[slug]) continue
  if (Number.isNaN(+date) || date > now || date < new Date(CUTOFF)) continue
  due.push({ slug, data, date })
}
due.sort((a, b) => a.date - b.date)

if (process.argv.includes('--list-due')) {
  console.log(due.length)
  process.exit(0)
}

console.log(`[fb] SITE_URL=${SITE_URL}`)
console.log(`[fb] DRY_RUN=${dry ? 'yes' : 'no'}  due=${due.length}  cutoff=${CUTOFF}`)
if (!FB_PAGE_ID) console.warn('[fb] brak FB_PAGE_ID (secret) — OK w stubie')
if (!FB_PAGE_TOKEN) console.warn('[fb] brak FB_PAGE_TOKEN (secret) — wymuszony DRY_RUN')

async function graph(endpoint, params) {
  if (dry) {
    console.log('[dry-run]', endpoint, params)
    return { id: 'dry', post_id: 'dry' }
  }
  // TODO(A6): prawdziwy POST do Graph API
  const res = await fetch(`${API}/${endpoint}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${FB_PAGE_TOKEN}` },
    body: new URLSearchParams(params),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(`${endpoint}: ${json.error?.message ?? res.status}`)
  return json
}

for (const { slug, data } of due.slice(0, MAX_PER_RUN)) {
  const url = `${SITE_URL.replace(/\/$/, '')}/aktualnosci/${slug}`
  const text = data.facebook?.text || data.excerpt || data.title
  console.log(`[fb] kandydat ${slug} → ${url}`)
  await graph(`${FB_PAGE_ID || 'PAGE_ID'}/feed`, { message: text, link: url })
}

if (!dry) {
  // TODO(A6): zapisz state dopiero po udanym poście
  await fs.writeFile(STATE, JSON.stringify(state, null, 2) + '\n')
}

console.log('[fb] done (stub A1)')
