export interface FaqPytanie {
  id: string
  q: string
  a: string
}

export interface FaqSekcja {
  id: string
  tytul: string
  pytania: FaqPytanie[]
}

export interface FaqDoc {
  sekcje?: FaqSekcja[]
}

export function matchesFaqQuery(pytanie: FaqPytanie, query: string): boolean {
  const q = query.trim().toLocaleLowerCase('pl-PL')
  if (!q) return true
  const hay = `${pytanie.q} ${pytanie.a}`.toLocaleLowerCase('pl-PL')
  return hay.includes(q)
}
