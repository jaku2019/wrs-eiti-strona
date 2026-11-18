export function useReducedMotion() {
  const reduced = useState('wrs-reduced-motion', () => false)

  onMounted(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      reduced.value = mq.matches
    }
    sync()
    mq.addEventListener('change', sync)
    onBeforeUnmount(() => mq.removeEventListener('change', sync))
  })

  return { reduced: computed(() => reduced.value) }
}
