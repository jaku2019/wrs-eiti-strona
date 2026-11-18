/** Inicjały do placeholderów zdjęć składu (RODO — bez prawdziwych zdjęć na start). */
export function useInitials() {
  function initials(name: string, max = 2): string {
    const parts = name
      .trim()
      // Sample CMS names may be prefixed with TODO until A7 — skip for initials only.
      .replace(/^TODO(\([^)]*\))?\s+/i, '')
      .split(/\s+/)
      .filter(Boolean)
    if (!parts.length) return '?'
    return parts
      .slice(0, max)
      .map((p) => p[0]!.toLocaleUpperCase('pl-PL'))
      .join('')
  }

  return { initials }
}
