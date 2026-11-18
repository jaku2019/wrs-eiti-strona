import matter from 'gray-matter'

/**
 * @nuxt/content nadpisuje frontmatter `excerpt` wynikiem separatora `<!--more-->`
 * (zwykle `undefined`). Przywracamy string z YAML — pole CMS dla zajawki aktualności.
 */
const stash = new Map<string, string>()

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('content:file:beforeParse', (file) => {
    if (typeof file.body !== 'string') return
    if (!file._id.includes('aktualnosci')) return
    try {
      const { data } = matter(file.body)
      if (typeof data.excerpt === 'string' && data.excerpt.length) {
        stash.set(file._id, data.excerpt)
      }
    } catch {
      // ignore malformed frontmatter — Content zgłosi własny błąd
    }
  })

  nitroApp.hooks.hook('content:file:afterParse', (file) => {
    const saved = stash.get(file._id)
    if (saved == null) return
    ;(file as { excerpt?: string }).excerpt = saved
    stash.delete(file._id)
  })
})
