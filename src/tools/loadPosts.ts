import { nextTick, onMounted, ref, Ref } from 'vue'
import sanitizeHtml from 'sanitize-html'

import { post, tag, author } from '@/types/post'

type loadPosts = {
  postList: Ref<post[]>,
  page: Ref<number>,
  loading: Ref<boolean>,
  error: Ref<boolean>,
  noMore: Ref<boolean>,
  loadNextPage: (focus: boolean) => Promise<void>,
  refresh: () => Promise<void>,
}

/**
 * Handle post list loading
 * @returns data and methods for loading post list
 */
export default (): loadPosts => {
  const postList = ref<post[]>([])
  const page = ref(1)
  const noMore = ref(false)

  const loading = ref(false)
  const error = ref(false)

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
    error.value = false

    // Send request
    const { headers, response } = await fetch(`https://studentnews.manchester.ac.uk/wp-json/wp/v2/posts?_fields=id,date,title,link,excerpt,_links,_embedded&_embed=1&page=${page.value}`, {
      credentials: 'omit'
    }).then((response) => ({ headers: response.headers, response })).catch(() => {
      loading.value = false
      error.value = true
      return {
        headers: new Headers(),
        response: new Response()
      }
    })

    if (error.value) {
      return
    }

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
        title: sanitizeHtml(item.title.rendered, {
          allowedTags: [],
          allowedAttributes: {},
          enforceHtmlBoundary: true
        }),
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
    error.value = false
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

  /**
   * Refrsh the post list and looking for new posts
   * @returns Promise for the loading requesting
   */
  const refresh = async (): Promise<void> => {
    if (loading.value) {
      return
    }

    loading.value = true

    // Send request
    const response = await fetch('https://studentnews.manchester.ac.uk/wp-json/wp/v2/posts?_fields=id,date,title,link,excerpt,_links,_embedded&_embed=1&page=1', {
      credentials: 'omit'
    }).then((response) => response.json()).catch(() => {
      loading.value = false
      return false
    })

    if (!response) {
      return
    }

    loading.value = false

    // Looking for existing posts
    let findFlag = false
    const newList: post[] = []

    for (const item of response) {
      if (postList.value.find((val) => val.id === item.id) === undefined) {
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
        newList.push({
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
      } else {
        findFlag = true
        break
      }
    }

    if (findFlag) {
      // We found an existing post, combine all new posts to the head of the post list
      postList.value = newList.concat(postList.value)
    } else {
      // May have more than 10 new posts, just refresh the whole post list
      postList.value = []
      page.value = 1
      noMore.value = false

      loadNextPage()
    }
  }

  // Load the first page when mounted
  onMounted(loadNextPage)

  return {
    postList,
    page,
    loading,
    error,
    noMore,
    loadNextPage,
    refresh
  }
}
