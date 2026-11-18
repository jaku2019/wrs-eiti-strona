#!/usr/bin/env node
/**
 * Szybki test jednostkowy filtrów draft / dat (bez Nuxt).
 * Uruchom: node scripts/verify-content-filters.mjs
 */
import assert from 'node:assert/strict'

function isPublishedAktualnosc(doc, now = new Date()) {
  if (!doc) return false
  if (doc.draft === true) return false
  if (doc.date == null || doc.date === '') return false
  const publishedAt = new Date(doc.date)
  if (Number.isNaN(publishedAt.getTime())) return false
  return publishedAt.getTime() <= now.getTime()
}

const now = new Date('2026-11-18T15:00:00+01:00')

assert.equal(
  isPublishedAktualnosc({ draft: false, date: '2026-11-18T12:00:00+01:00' }, now),
  true,
  'published past',
)
assert.equal(
  isPublishedAktualnosc({ draft: true, date: '2026-11-10T09:00:00+01:00' }, now),
  false,
  'draft excluded',
)
assert.equal(
  isPublishedAktualnosc({ draft: false, date: '2099-01-01T10:00:00+01:00' }, now),
  false,
  'future excluded',
)
assert.equal(
  isPublishedAktualnosc({ date: '2026-11-15T16:00:00+01:00' }, now),
  true,
  'missing draft treated as published',
)

console.log('[verify-content-filters] ok')
