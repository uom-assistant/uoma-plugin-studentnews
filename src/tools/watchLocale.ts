import { onMounted, Ref, watch } from 'vue'

/**
 * Handle locale change
 * @param localeRef ref for locale string
 * @param localeName ref for current locale name
 */
export default (localeRef: Ref<string>, localeName: Ref<string>): void => {
  onMounted(() => {
    localeName.value = localeRef.value
  })

  watch(localeRef, () => {
    localeName.value = localeRef.value
  })
}
