/** Absolutny URL względem SITE_URL (już z path projektu Pages, jeśli dotyczy). */

function appBase(): string {
  try {
    return useRuntimeConfig().app.baseURL || '/'
  } catch {
    return '/'
  }
}

export function joinSiteUrl(siteUrl: string, path: string): string {
  const origin = siteUrl.replace(/\/$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${origin}${normalizedPath}`
}

/** Usuwa prefix baseURL, jeśli ścieżka już go ma (żeby nie dublować z SITE_URL). */
export function stripAppBase(path: string, baseURL?: string): string {
  if (!path || /^https?:\/\//i.test(path)) return path
  const base = baseURL ?? appBase()
  if (!base || base === '/') return path
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base
  if (path === normalizedBase) return '/'
  if (path.startsWith(`${normalizedBase}/`)) {
    return path.slice(normalizedBase.length) || '/'
  }
  return path
}

/**
 * Dokleja `app.baseURL` do ścieżek z content (`/uploads/…`),
 * żeby działały na GitHub Pages project site (atrybuty href/src).
 */
export function withAppBase(path: string, baseURL?: string): string {
  if (!path || /^https?:\/\//i.test(path) || path.startsWith('#')) return path
  const base = baseURL ?? appBase()
  if (!base || base === '/') return path
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base
  if (path.startsWith(`${normalizedBase}/`) || path === normalizedBase) return path
  return `${normalizedBase}${path.startsWith('/') ? path : `/${path}`}`
}

/** Ścieżka zasobu publicznego → absolutny URL (SITE_URL + path bez podwójnego base). */
export function absoluteAssetUrl(
  siteUrl: string,
  assetPath: string | null | undefined,
): string | undefined {
  if (!assetPath) return undefined
  if (/^https?:\/\//i.test(assetPath)) return assetPath
  return joinSiteUrl(siteUrl, stripAppBase(assetPath))
}
