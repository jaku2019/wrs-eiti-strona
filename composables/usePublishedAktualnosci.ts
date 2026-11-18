import {
  filterPublishedAktualnosci,
  sortAktualnosciByDateDesc,
  type AktualnoscMeta,
} from '~/utils/contentFilters'

/**
 * Publikowane aktualności: wyklucza `draft: true` i daty w przyszłości (czas buildu).
 * Używać w stronach zamiast surowego `queryContent('aktualnosci')`.
 */
export async function fetchPublishedAktualnosci(opts?: {
  limit?: number
  now?: Date
}): Promise<AktualnoscMeta[]> {
  const now = opts?.now ?? new Date()
  const raw = await queryContent<AktualnoscMeta>('aktualnosci')
    .where({ draft: { $ne: true } })
    .find()

  const published = sortAktualnosciByDateDesc(
    filterPublishedAktualnosci(raw, now),
  )

  if (opts?.limit != null) return published.slice(0, opts.limit)
  return published
}

export function usePublishedAktualnosci(opts?: { limit?: number; key?: string }) {
  const key = opts?.key ?? `aktualnosci-published-${opts?.limit ?? 'all'}`
  return useAsyncData(key, () => fetchPublishedAktualnosci({ limit: opts?.limit }))
}
