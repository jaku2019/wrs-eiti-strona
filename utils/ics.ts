import type { Wydarzenie } from '~/utils/calendarSource'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

/** Format date as UTC ICS timestamp (YYYYMMDDTHHMMSSZ). */
export function toIcsUtc(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`
    + `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  )
}

function escapeIcs(text: string) {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

/** Build a minimal VCALENDAR from wydarzenia.yml items. */
export function buildIcsCalendar(
  events: Wydarzenie[],
  calendarName = 'WRS WEiTI',
): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//WRS WEiTI//Kalendarz//PL',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcs(calendarName)}`,
  ]

  for (const event of events) {
    const dtStart = toIcsUtc(event.start)
    if (!dtStart) continue
    const dtEnd = event.koniec ? toIcsUtc(event.koniec) : dtStart
    lines.push(
      'BEGIN:VEVENT',
      `UID:${escapeIcs(event.id)}@wrs-eiti`,
      `DTSTAMP:${dtStart}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${escapeIcs(event.tytul)}`,
    )
    if (event.miejsce) {
      lines.push(`LOCATION:${escapeIcs(event.miejsce)}`)
    }
    lines.push('END:VEVENT')
  }

  lines.push('END:VCALENDAR')
  return `${lines.join('\r\n')}\r\n`
}

/** Trigger a browser download of an .ics file. */
export function downloadIcs(filename: string, icsBody: string) {
  const blob = new Blob([icsBody], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
