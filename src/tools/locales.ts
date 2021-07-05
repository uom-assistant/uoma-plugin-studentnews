import { languageList } from '@/types/languageList'

const languageList: languageList = {
  en: {
    iso: 'en',
    timeFormat: (yr, mo, da) => `${da} ${mo}, ${yr}`,
    strings: {
      loadMore: 'Load more',
      more: 'More',
      theEnd: 'The End',
      readingTime: 'Read: %s',
      listView: 'List view',
      cardView: 'Card view'
    }
  },
  zh: {
    iso: 'zh-CN',
    timeFormat: (yr, mo, da) => `${yr}${mo}${da}`,
    strings: {
      loadMore: '加载更多',
      more: '继续阅读',
      theEnd: '完',
      readingTime: '阅读时间 %s',
      listView: '列表视图',
      cardView: '卡片视图'
    }
  }
}

export default languageList
