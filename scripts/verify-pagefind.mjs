#!/usr/bin/env node
/**
 * Smoke check after `npm run generate`:
 * - Pagefind bundle under `.output/public/pagefind/`
 * - Polish language index with enough pages (KB + FAQ + news)
 * - Marked HTML bodies for those surfaces
 * - Indexed HTML contains Polish diacritics that Pagefind will normalize
 */
import { access, readFile } from 'node:fs/promises'
import path from 'node:path'

const siteRoot = path.resolve('.output/public')
const pagefindDir = path.join(siteRoot, 'pagefind')
const entryPath = path.join(pagefindDir, 'pagefind-entry.json')

const requiredHtml = [
  {
    rel: 'faq/index.html',
    needles: ['data-pagefind-body', 'group:FAQ', 'Wydziałowa', 'id="wrs"'],
  },
  {
    rel: 'aktualnosci/2026-11-18-przyklad/index.html',
    needles: ['data-pagefind-body', 'group:Aktualności'],
  },
  {
    rel: 'baza-wiedzy/wnioski/przyklad-wniosek/index.html',
    needles: ['data-pagefind-body', 'group:Baza wiedzy', 'wniosek'],
  },
]

function fail(message) {
  console.error(`verify:pagefind FAIL — ${message}`)
  process.exit(1)
}

async function mustExist(filePath) {
  try {
    await access(filePath)
  } catch {
    fail(`missing ${path.relative(process.cwd(), filePath)}`)
  }
}

/** Fold Polish letters for an ASCII-ish smoke assertion (ł does not NFD-decompose). */
function foldPl(text) {
  return text
    .toLocaleLowerCase('pl')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/ł/g, 'l')
}

async function main() {
  await mustExist(siteRoot)
  await mustExist(path.join(pagefindDir, 'pagefind.js'))
  await mustExist(path.join(pagefindDir, 'wasm.pl.pagefind'))
  await mustExist(entryPath)

  const entry = JSON.parse(await readFile(entryPath, 'utf8'))
  const pl = entry.languages?.pl
  if (!pl) {
    fail(`expected languages.pl in pagefind-entry.json, got: ${JSON.stringify(entry)}`)
  }
  const pageCount = pl.page_count ?? 0
  if (pageCount < 3) {
    fail(`expected ≥3 indexed pages for pl, got ${pageCount}`)
  }
  console.log(`verify:pagefind — bundle OK (pl page_count=${pageCount})`)

  for (const { rel, needles } of requiredHtml) {
    const filePath = path.join(siteRoot, rel)
    await mustExist(filePath)
    const html = await readFile(filePath, 'utf8')
    for (const needle of needles) {
      if (!html.includes(needle)) {
        fail(`${rel} missing ${JSON.stringify(needle)}`)
      }
    }
  }

  const faqHtml = await readFile(path.join(siteRoot, 'faq/index.html'), 'utf8')
  const folded = foldPl(faqHtml)
  if (!folded.includes('wydzialowa')) {
    fail('FAQ HTML fold missing “wydzialowa” (Polish diacritic source)')
  }
  if (!faqHtml.includes('Wydziałowa')) {
    fail('FAQ HTML missing exact “Wydziałowa” (diacritics must be in index input)')
  }

  // Meta fragment for pl language should exist next to wasm.
  const metaName = `pagefind.${pl.hash}.pf_meta`
  await mustExist(path.join(pagefindDir, metaName))

  console.log('verify:pagefind — Polish body markers OK')
  console.log('verify:pagefind OK')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
