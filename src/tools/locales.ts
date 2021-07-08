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
      cardView: 'Card view',
      authors: 'Authors',
      author: 'Author',
      close: 'Close',
      share: 'Share',
      openWebsit: 'Open in website',
      published: 'Published: %s',
      previous: 'Previous',
      next: 'Next',
      noPrevious: 'No revious post',
      noNext: 'No next post',
      loading: 'Loading…',
      shareToFacebook: 'Share to Facebook',
      shareToTwitter: 'Share to Twitter',
      loadError: 'Failed to load',
      retry: 'Retry'
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
      cardView: '卡片视图',
      authors: '作者',
      author: '作者',
      close: '关闭',
      share: '分享',
      openWebsit: '在网站中打开',
      published: '发布于 %s',
      previous: '上一篇',
      next: '下一篇',
      noPrevious: '没有上一篇了',
      noNext: '没有下一篇了',
      loading: '加载中…',
      shareToFacebook: '分享到 Facebook',
      shareToTwitter: '分享到 Twitter',
      loadError: '加载失败',
      retry: '重试'
    }
  }
}

export default languageList
