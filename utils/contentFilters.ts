/**
 * Filtry publikacji treści (M3.3 / 03-architektura.md):
 * - draft !== true
 * - date <= czas buildu (wpisy zaplanowane pojawiają się przy pierwszym buildzie po dacie)
 */

export type AktualnoscMeta = {
  draft?: boolean | null
  date?: string | Date | null
  title?: string
  excerpt?: string
  image?: string
  _path?: string
  [key: string]: unknown
}

/** Czy dokument aktualności jest publiczny w danym momencie (domyślnie: teraz / czas buildu). */
export function isPublishedAktualnosc(
  doc: AktualnoscMeta | null | undefined,
  now: Date = new Date(),
): boolean {
  if (!doc) return false
  if (doc.draft === true) return false
  if (doc.date == null || doc.date === '') return false
  const publishedAt = doc.date instanceof Date ? doc.date : new Date(doc.date)
  if (Number.isNaN(publishedAt.getTime())) return false
  return publishedAt.getTime() <= now.getTime()
}

/** Filtruje listę dokumentów aktualności wg draft + daty. */
export function filterPublishedAktualnosci<T extends AktualnoscMeta>(
  docs: T[],
  now: Date = new Date(),
): T[] {
  return docs.filter((doc) => isPublishedAktualnosc(doc, now))
}

/** Sortowanie malejąco po dacie publikacji. */
export function sortAktualnosciByDateDesc<T extends AktualnoscMeta>(docs: T[]): T[] {
  return [...docs].sort((a, b) => {
    const ta = a.date ? new Date(a.date as string | Date).getTime() : 0
    const tb = b.date ? new Date(b.date as string | Date).getTime() : 0
    return tb - ta
  })
}
