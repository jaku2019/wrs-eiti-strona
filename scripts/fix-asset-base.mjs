#!/usr/bin/env node
/**
 * @nuxt/fonts 0.11 writes some production @font-face URLs as `/_fonts/…`
 * without `app.baseURL`. On GitHub project Pages that 404s.
 * Rewrite unprefixed absolute `/_fonts/` (and leftover root favicons) in
 * generated HTML so assets resolve under NUXT_APP_BASE_URL.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const siteRoot = path.join(root, '.output', 'public')
const rawBase = process.env.NUXT_APP_BASE_URL || '/wrs-eiti-strona/'
const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`

async function walkHtml(dir) {
  const out = []
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'pagefind' || entry.name === '_nuxt') continue
      out.push(...(await walkHtml(full)))
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      out.push(full)
    }
  }
  return out
}

function rewrite(html) {
  let next = html
  let changes = 0

  next = next.replace(/url\(\/_fonts\//g, () => {
    changes += 1
    return `url(${base}_fonts/`
  })
  next = next.replace(/url\("\/_fonts\//g, () => {
    changes += 1
    return `url("${base}_fonts/`
  })
  next = next.replace(/url\('\/_fonts\//g, () => {
    changes += 1
    return `url('${base}_fonts/`
  })

  // Only rewrite root-absolute favicons that skipped Nuxt baseURL.
  for (const file of ['favicon.ico', 'favicon-32.png', 'apple-touch-icon.png']) {
    const re = new RegExp(`(href=")/${file.replace('.', '\\.')}"`, 'g')
    next = next.replace(re, (_m, p1) => {
      changes += 1
      return `${p1}${base}${file}"`
    })
  }

  return { next, changes }
}

const files = await walkHtml(siteRoot)
let touched = 0
let total = 0
for (const file of files) {
  const html = await readFile(file, 'utf8')
  const { next, changes } = rewrite(html)
  if (!changes) continue
  await writeFile(file, next)
  touched += 1
  total += changes
}

console.log(
  `fix-asset-base — base=${base} files=${touched} replacements=${total}`,
)
