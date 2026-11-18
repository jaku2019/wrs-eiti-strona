import type { UiIconName } from '~/components/ui/UiIcon.vue'

export type DokumentTyp = 'regulamin' | 'uchwala' | 'protokol' | 'sprawozdanie'

export type DokumentMeta = {
  tytul: string
  typ: DokumentTyp | string
  data: string
  plik: string
  rozmiar?: string
}

export type DokumentTypMeta = {
  id: DokumentTyp
  label: string
  icon: UiIconName
}

export const DOKUMENT_TYPY: DokumentTypMeta[] = [
  { id: 'regulamin', label: 'Regulamin', icon: 'scrollText' },
  { id: 'uchwala', label: 'Uchwała', icon: 'fileCheck' },
  { id: 'protokol', label: 'Protokół', icon: 'fileText' },
  { id: 'sprawozdanie', label: 'Sprawozdanie', icon: 'notebook' },
]

export function dokumentTypMeta(typ: string | undefined | null): DokumentTypMeta {
  const found = DOKUMENT_TYPY.find((t) => t.id === typ)
  return (
    found ?? {
      id: 'regulamin',
      label: typ || 'Dokument',
      icon: 'fileText',
    }
  )
}
