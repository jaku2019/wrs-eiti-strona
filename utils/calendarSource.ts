/**
 * Źródło kalendarza (A0): `content/wydarzenia.yml` w CMS.
 *
 * TODO(ICS): później dodać adapter Google Calendar → ICS przy buildzie.
 * Adapter ma dokładać / synchronizować wpisy do modelu `wydarzenia.yml`
 * (lub generować plik .ics z tych wpisów) — nie zastępować modelu CMS.
 * Nie usuwać `content/wydarzenia.yml` jako źródła prawdy dla redakcji.
 */

export type Wydarzenie = {
  id: string
  tytul: string
  start: string
  koniec?: string
  miejsce?: string
  tag?: string
}

export type WydarzeniaDoc = {
  wydarzenia?: Wydarzenie[]
}

/** Nadchodzące wydarzenia (start >= now), posortowane rosnąco. */
export function upcomingWydarzenia(
  items: Wydarzenie[] | undefined | null,
  now: Date = new Date(),
  limit = 3,
): Wydarzenie[] {
  if (!items?.length) return []
  return items
    .filter((e) => {
      const start = new Date(e.start)
      return !Number.isNaN(start.getTime()) && start.getTime() >= now.getTime()
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, limit)
}
