import { nextTick, onMounted, ref, Ref } from 'vue'

import { post, tag, author } from '@/types/post'

type loadPosts = {
  postList: Ref<post[]>,
  page: Ref<number>,
  loading: Ref<boolean>,
  noMore: Ref<boolean>,
  loadNextPage: (focus: boolean) => Promise<void>
}

/**
 * Handle post list loading
 * @returns data and methods for loading post list
 */
export default (): loadPosts => {
  const postList = ref<post[]>([])
  const page = ref(1)
  const loading = ref(false)
  const noMore = ref(false)

  /**
   * Load next page for post list
   * @param focus whether to focus the first post when loaded
   * @returns Promise for the loading requesting
   */
  const loadNextPage = async (focus = true): Promise<void> => {
    if (noMore.value || loading.value) {
      return
    }

    loading.value = true

    // Send request
    const { headers, response } = await fetch(`https://studentnews.manchester.ac.uk/wp-json/wp/v2/posts?_fields=id,date,title,link,excerpt,_links,_embedded&_embed=1&page=${page.value}`, {
      credentials: 'omit'
    }).then((response) => ({ headers: response.headers, response }))

    // Read result
    const result = await response.json()

    // Get tags
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

      // Get authors
      const authors: author[] = []

      if (item._embedded.author) {
        for (const author of item._embedded.author) {
          authors.push({
            name: author.name,
            link: author.link,
            description: author.description,
            avatar: (Object.values(author.avatar_urls)[Object.values(author.avatar_urls).length - 1] as string).replace(/(\?|&)s=\d{1,2}/, 's=256') || ''
          })
        }
      }

      // Add a new post to the list
      postList.value.push({
        id: item.id,
        title: item.title.rendered,
        href: item.link,
        link: item._links.self[0]?.href || '',
        img: {
          src: item._embedded['wp:featuredmedia'] && item._embedded['wp:featuredmedia'][0] && item._embedded['wp:featuredmedia'][0].source_url ? item._embedded['wp:featuredmedia'][0].source_url : '',
          caption: item._embedded['wp:featuredmedia'] && item._embedded['wp:featuredmedia'][0] && item._embedded['wp:featuredmedia'][0].caption && item._embedded['wp:featuredmedia'][0].caption.rendered ? item._embedded['wp:featuredmedia'][0].caption.rendered : ''
        },
        date: item.date,
        content: item.excerpt.rendered,
        authors,
        tags
      })
    }

    // No more pages, hide load button
    if (page.value >= parseInt(headers.get('x-wp-totalpages') || '0')) {
      noMore.value = true
    }

    loading.value = false
    page.value += 1

    // Focus the first post of the new page
    if (page.value > 2 && focus) {
      nextTick(() => {
        const ele = document.querySelectorAll('.card, .list')[(page.value - 2) * 10]
        if (ele) {
          (ele as HTMLElement).getElementsByTagName('a')[0].focus()
        }
      })
    }
  }

  // Load the first page when mounted
  onMounted(loadNextPage)

  return {
    postList,
    page,
    loading,
    noMore,
    loadNextPage
  }
}
