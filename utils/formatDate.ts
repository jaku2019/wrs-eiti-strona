/** Formatowanie dat UI po polsku (Literata / daty w kartach). */

const plMonthsShort = [
  'sty',
  'lut',
  'mar',
  'kwi',
  'maj',
  'cze',
  'lip',
  'sie',
  'wrz',
  'paź',
  'lis',
  'gru',
] as const

const plMonthsLong = [
  'stycznia',
  'lutego',
  'marca',
  'kwietnia',
  'maja',
  'czerwca',
  'lipca',
  'sierpnia',
  'września',
  'października',
  'listopada',
  'grudnia',
] as const

function toDate(value: string | Date | null | undefined): Date | null {
  if (value == null || value === '') return null
  const d = value instanceof Date ? value : new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

/** np. „18 lis 2026” */
export function formatDateShort(value: string | Date | null | undefined): string {
  const d = toDate(value)
  if (!d) return ''
  return `${d.getDate()} ${plMonthsShort[d.getMonth()]} ${d.getFullYear()}`
}

/** np. „18 listopada 2026” */
export function formatDateLong(value: string | Date | null | undefined): string {
  const d = toDate(value)
  if (!d) return ''
  return `${d.getDate()} ${plMonthsLong[d.getMonth()]} ${d.getFullYear()}`
}

/** ISO date-only for `<time datetime>` */
export function toDateTimeAttr(value: string | Date | null | undefined): string {
  const d = toDate(value)
  if (!d) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Dzień miesiąca do kafelka wydarzenia (np. „1”). */
export function formatDay(value: string | Date | null | undefined): string {
  const d = toDate(value)
  if (!d) return ''
  return String(d.getDate())
}

/** Skrót miesiąca PL do kafelka (np. „lis”). */
export function formatMonthShort(value: string | Date | null | undefined): string {
  const d = toDate(value)
  if (!d) return ''
  return plMonthsShort[d.getMonth()]
}

const timeFmt = new Intl.DateTimeFormat('pl-PL', {
  hour: '2-digit',
  minute: '2-digit',
})

/** Godzina PL, np. „17:00”. */
export function formatTimePl(value: string | Date | null | undefined): string {
  const d = toDate(value)
  if (!d) return ''
  return timeFmt.format(d)
}
