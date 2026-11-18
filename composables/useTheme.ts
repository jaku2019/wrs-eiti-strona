export type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'wrs-theme'

function systemTheme(): ThemeMode {
  if (!import.meta.client) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function readStored(): ThemeMode | null {
  if (!import.meta.client) return null
  const value = localStorage.getItem(STORAGE_KEY)
  return value === 'light' || value === 'dark' ? value : null
}

function applyTheme(theme: ThemeMode) {
  if (!import.meta.client) return
  const root = document.documentElement
  root.setAttribute('data-theme', theme)
  root.style.colorScheme = theme
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', theme === 'dark' ? '#212529' : '#F0F0F0')
  }
}

export function useTheme() {
  const theme = useState<ThemeMode>('wrs-theme', () => 'light')

  const resolved = computed(() => theme.value)

  function setTheme(next: ThemeMode) {
    theme.value = next
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, next)
      applyTheme(next)
    }
  }

  function toggleTheme(event?: MouseEvent) {
    const next: ThemeMode = theme.value === 'dark' ? 'light' : 'dark'
    const reduced =
      import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const run = () => setTheme(next)

    if (
      import.meta.client &&
      !reduced &&
      'startViewTransition' in document &&
      event
    ) {
      const x = event.clientX
      const y = event.clientY
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      )
      const transition = (document as Document & {
        startViewTransition: (cb: () => void) => { ready: Promise<void> }
      }).startViewTransition(run)

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 420,
            easing: 'ease-out',
            pseudoElement: '::view-transition-new(root)',
          },
        )
      }).catch(() => {})
      return
    }

    run()
  }

  onMounted(() => {
    theme.value = readStored() ?? systemTheme()
    applyTheme(theme.value)
  })

  return {
    theme: resolved,
    setTheme,
    toggleTheme,
  }
}
