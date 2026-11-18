export interface SkladGrupa {
  id: string
  label: string
}

export interface SkladOsoba {
  imie: string
  funkcja: string
  grupa: string
  kluczowa?: boolean
  zdjecie?: string
}

export interface SkladPrzedstawiciel {
  organ: string
  opis?: string
  osoby: string[]
}

export interface SkladDoc {
  kadencja?: string
  aktualizacja?: string
  grupy?: SkladGrupa[]
  osoby?: SkladOsoba[]
  przedstawiciele?: SkladPrzedstawiciel[]
}

export function personKey(person: SkladOsoba, index: number): string {
  const slug = person.imie
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${slug || 'osoba'}-${index}`
}

export function matchesPersonQuery(person: SkladOsoba, query: string): boolean {
  const q = query.trim().toLocaleLowerCase('pl-PL')
  if (!q) return true
  const hay = `${person.imie} ${person.funkcja}`.toLocaleLowerCase('pl-PL')
  return hay.includes(q)
}

/** Podświetla pierwsze dopasowanie frazy w tekście (case-insensitive, pl). */
export function splitHighlight(
  text: string,
  query: string,
): Array<{ text: string; mark: boolean }> {
  const q = query.trim()
  if (!q) return [{ text, mark: false }]
  const lower = text.toLocaleLowerCase('pl-PL')
  const needle = q.toLocaleLowerCase('pl-PL')
  const idx = lower.indexOf(needle)
  if (idx < 0) return [{ text, mark: false }]
  const before = text.slice(0, idx)
  const match = text.slice(idx, idx + q.length)
  const after = text.slice(idx + q.length)
  const parts: Array<{ text: string; mark: boolean }> = []
  if (before) parts.push({ text: before, mark: false })
  parts.push({ text: match, mark: true })
  if (after) parts.push({ text: after, mark: false })
  return parts
}

export function formatSkladDate(iso?: string): string {
  if (!iso) return ''
  const d = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
