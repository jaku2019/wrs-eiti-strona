#!/usr/bin/env node
/**
 * Fail if generated HTML still has root-absolute `/_fonts/` or favicon
 * links that ignore NUXT_APP_BASE_URL (broken on project Pages).
 */
import { readdir, readFile } from 'node:fs/promises'
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

const bad = []
for (const file of await walkHtml(siteRoot)) {
  const html = await readFile(file, 'utf8')
  if (/url\(\/_fonts\//.test(html) || /url\(["']\/_fonts\//.test(html)) {
    bad.push(`${path.relative(siteRoot, file)}: unprefixed /_fonts/`)
  }
  if (
    base !== '/'
    && (/"\/favicon\.ico"/.test(html)
      || /"\/favicon-32\.png"/.test(html)
      || /"\/apple-touch-icon\.png"/.test(html))
  ) {
    bad.push(`${path.relative(siteRoot, file)}: root favicon href`)
  }
}

if (bad.length) {
  console.error('verify:asset-base FAIL')
  for (const line of bad.slice(0, 20)) console.error(`  - ${line}`)
  if (bad.length > 20) console.error(`  … +${bad.length - 20} more`)
  process.exit(1)
}

console.log(`verify:asset-base OK (base=${base})`)
