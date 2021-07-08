import localeList from '@/tools/locales'
import { ref, computed, Ref, ComputedRef } from 'vue'
import { vsprintf } from 'sprintf-js'

import { languageListItem } from '@/types/languageList'

type i18n = {
  localeName: Ref<string>,
  locale: ComputedRef<languageListItem>,
  t: (q: string) => string,
  tf: (q: string, f: string[]) => string,
  tDate: (date: Date) => string,
}

/**
 * Offers data and methods for i18n and string formatting
 * @returns data and methods for i18n
 */
export default (): i18n => {
  const localeName = ref('en')

  const locale = computed(() => localeList[localeName.value])

  /**
   * Translate a string by string name
   * @param q string name
   * @returns translated string
   */
  const t = (q: string) => locale.value.strings[q]

  /**
   * Translate a string by string name and format it
   * @param q string name
   * @param f string array for formatting
   * @returns translated and formatted string
   */
  const tf = (q: string, f: string[]) => vsprintf(locale.value.strings[q], f)

  /**
   * Format a date using locale preference
   * @param date Date object
   * @returns formatted date string
   */
  const tDate = (date: Date) => {
    const yr = new Intl.DateTimeFormat(locale.value.iso, { year: 'numeric' }).format(date)
    const mo = new Intl.DateTimeFormat(locale.value.iso, { month: 'short' }).format(date)
    const da = new Intl.DateTimeFormat(locale.value.iso, { day: 'numeric' }).format(date)
    return locale.value.timeFormat(yr, mo, da)
  }

  return {
    localeName,
    locale,
    t,
    tf,
    tDate
  }
}
