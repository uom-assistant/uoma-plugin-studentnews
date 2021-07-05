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

export default (): i18n => {
  const localeName = ref('en')

  const locale = computed(() => localeList[localeName.value])

  const t = (q: string) => locale.value.strings[q]

  const tf = (q: string, f: string[]) => vsprintf(locale.value.strings[q], f)

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
