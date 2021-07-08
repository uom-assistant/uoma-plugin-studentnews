import { watch, ref, Ref } from 'vue'

type darkMode = {
  dark: Ref<boolean>
}

/**
 * Handle dark mode
 * @returns dark mode ref
 */
export default (): darkMode => {
  const dark = ref(false)

  watch(dark, () => {
    // Toggle dark mode
    if (dark.value) {
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark')
    }
  })

  return {
    dark
  }
}
