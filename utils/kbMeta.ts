import type { UiIconName } from '~/components/ui/UiIcon.vue'

export type KbCategoryId =
  | 'regulaminy'
  | 'wnioski'
  | 'wybory'
  | 'pierwszy-rok'
  | 'finanse'

export type KbCategoryMeta = {
  id: KbCategoryId
  label: string
  description: string
  icon: UiIconName
}

/** Kolejność jak na home / w CMS. */
export const KB_CATEGORIES: KbCategoryMeta[] = [
  {
    id: 'regulaminy',
    label: 'Regulaminy i uchwały',
    description: 'Jak czytać dokumenty samorządu i gdzie ich szukać.',
    icon: 'fileText',
  },
  {
    id: 'wnioski',
    label: 'Wnioski i terminy',
    description: 'Procedury wniosków i typowe terminy spraw studenckich.',
    icon: 'clipboardList',
  },
  {
    id: 'wybory',
    label: 'Wybory',
    description: 'Kandydowanie, głosowanie i kalendarz wyborów.',
    icon: 'vote',
  },
  {
    id: 'pierwszy-rok',
    label: 'Pierwszy rok',
    description: 'Orientacja na starcie studiów na WEiTI.',
    icon: 'graduationCap',
  },
  {
    id: 'finanse',
    label: 'Finanse',
    description: 'Stypendia i sprawy finansowe — gdzie pytać.',
    icon: 'wallet',
  },
]

export function kbCategoryById(id: string | undefined | null): KbCategoryMeta | undefined {
  if (!id) return undefined
  return KB_CATEGORIES.find((c) => c.id === id)
}

export function kbCategoryLabel(id: string | undefined | null): string {
  return kbCategoryById(id)?.label ?? id ?? ''
}
