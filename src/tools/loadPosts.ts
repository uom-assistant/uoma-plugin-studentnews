import { nextTick, onMounted, ref, Ref } from 'vue'

import { post, tag } from '@/types/post'

type loadPosts = {
  postList: Ref<post[]>,
  page: Ref<number>,
  loading: Ref<boolean>,
  noMore: Ref<boolean>,
  loadNextPage: () => Promise<void>
}

export default (): loadPosts => {
  const postList = ref<post[]>([])
  const page = ref(1)
  const loading = ref(false)
  const noMore = ref(false)

  const loadNextPage = async (): Promise<void> => {
    if (noMore.value) {
      return
    }

    loading.value = true

    const { headers, response } = await fetch(`https://studentnews.manchester.ac.uk/wp-json/wp/v2/posts?_fields=date,title,link,excerpt,_links,_embedded&_embed=1&page=${page.value}`, {
      credentials: 'omit'
    }).then((response) => ({ headers: response.headers, response }))

    const result = await response.json()

    for (const item of result) {
      const tags: tag[] = []

      if (item._embedded['wp:term'] && item._embedded['wp:term'][0]) {
        for (const tag of item._embedded['wp:term'][0]) {
          tags.push({
            name: tag.name,
            link: tag.link
          })
        }
      }

      postList.value.push({
        title: item.title.rendered,
        href: item.link,
        img: item._embedded['wp:featuredmedia'] && item._embedded['wp:featuredmedia'][0] && item._embedded['wp:featuredmedia'][0].source_url ? item._embedded['wp:featuredmedia'][0].source_url : '',
        date: item.date,
        content: item.excerpt.rendered,
        tags
      })
    }

    if (page.value >= parseInt(headers.get('x-wp-totalpages') || '0')) {
      noMore.value = true
    }

    loading.value = false
    page.value += 1

    if (page.value > 2) {
      nextTick(() => {
        const ele = document.querySelectorAll('.card, .list')[(page.value - 2) * 10]
        if (ele) {
          (ele as HTMLElement).getElementsByTagName('a')[0].focus()
        }
      })
    }
  }

  onMounted(loadNextPage)

  return {
    postList,
    page,
    loading,
    noMore,
    loadNextPage
  }
}
