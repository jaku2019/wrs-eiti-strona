/** Spis treści z AST Markdown (@nuxt/content body). */

export type TocHeading = {
  id: string
  text: string
  depth: 2 | 3
}

type MdcNode = {
  type?: string
  tag?: string
  value?: string
  props?: Record<string, unknown>
  children?: MdcNode[]
}

function flattenText(node: MdcNode | undefined): string {
  if (!node) return ''
  if (node.type === 'text') return node.value ?? ''
  if (!node.children?.length) return ''
  return node.children.map(flattenText).join('')
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Wyciąga h2/h3; używa `id` z rendererów albo generuje slug. */
export function extractToc(body: unknown): TocHeading[] {
  const root = body as MdcNode | null | undefined
  if (!root?.children?.length) return []

  const items: TocHeading[] = []
  const used = new Map<string, number>()

  const walk = (nodes: MdcNode[]) => {
    for (const node of nodes) {
      if (node.type === 'element' && (node.tag === 'h2' || node.tag === 'h3')) {
        const depth = Number(node.tag[1]) as 2 | 3
        const text = flattenText(node).trim()
        if (!text) continue
        let id = typeof node.props?.id === 'string' ? node.props.id : ''
        if (!id) {
          const base = slugifyHeading(text) || 'sekcja'
          const n = (used.get(base) ?? 0) + 1
          used.set(base, n)
          id = n === 1 ? base : `${base}-${n}`
        }
        items.push({ id, text, depth })
      }
      if (node.children?.length) walk(node.children)
    }
  }

  walk(root.children)
  return items
}
