import { computed, ComputedRef, nextTick, ref, Ref } from 'vue'

import { post, postPreview } from '@/types/post'

type viewPost = {
  showPostView: Ref<boolean>,
  showPostViewAnimation: Ref<boolean>,
  postViewScroll: Ref<boolean>,
  selectedPost: Ref<post | null>,
  openPost: (index: number) => void,
  closePost: () => void,
  openedIndex: Ref<number>,
  previous: ComputedRef<postPreview | undefined>,
  next: ComputedRef<postPreview | undefined>
}

/**
 * Handle post opening and closing
 * @param postList ref for post list
 * @param noMore ref 'no more page' flag
 * @param loadNextPage function for loaing the next page of the post list
 * @returns data of sanitized HTML for image captions and author descriptions
 */
export default (postList: Ref<post[]>, noMore: Ref<boolean>, loadNextPage: (focus: boolean) => Promise<void>): viewPost => {
  const showPostView = ref(false)
  const showPostViewAnimation = ref(false)
  const postViewScroll = ref(false)

  const selectedPost = ref<post | null>(null)
  const openedIndex = ref(-1)

  /**
   * Open a post
   * @param index post index in post list
   */
  const openPost = (index: number) => {
    selectedPost.value = postList.value[index]
    showPostView.value = true
    openedIndex.value = index

    nextTick(() => {
      showPostViewAnimation.value = true

      // Focus on the close button by default
      const closeBtn = document.getElementsByClassName('close')
      if (closeBtn.length > 0) {
        (closeBtn[0] as HTMLElement).focus()
      }

      // Scroll the post viewer to the top
      const viewer = document.getElementsByClassName('viewer')
      if (viewer.length > 0) {
        (viewer[0] as HTMLElement).scrollTop = 0
      }

      // Lock scroll for body and enable scroll for the post viewer
      setTimeout(() => {
        document.body.classList.add('lock-scroll')
        postViewScroll.value = true
      }, 150)
    })

    // Load next page of the post list for information about the previous post
    if (index === postList.value.length - 1 && !noMore.value) {
      loadNextPage(false)
    }
  }

  /**
   * Close the post viewer
   */
  const closePost = () => {
    showPostViewAnimation.value = false
    postViewScroll.value = false
    document.body.classList.remove('lock-scroll')

    nextTick(() => {
      // Re-focus the post in the post list
      const ele = document.querySelectorAll('.card, .list')
      if (ele[openedIndex.value]) {
        (ele[openedIndex.value] as HTMLElement).getElementsByTagName('a')[0].focus()
      }

      setTimeout(() => {
        showPostView.value = false
        openedIndex.value = -1
      }, 150)
    })
  }

  // The previous post of the currently opened post or null
  const previous = computed((): postPreview | undefined => {
    if (postList.value.length >= openedIndex.value + 2) {
      const nextPost = postList.value[openedIndex.value + 1]
      return {
        title: nextPost.title,
        img: nextPost.img.src,
        href: nextPost.href,
        date: nextPost.date
      }
    }

    // No previous post any more
    if (noMore.value) {
      // Current post is the latest post, no next post
      return undefined
    }

    // We can load next page of the post list for the previous post, so return a empty post and waut for loaing
    return {
      title: '',
      img: '',
      href: '',
      date: ''
    }
  })

  // The next post of the currently opened post or null
  const next = computed((): postPreview | undefined => {
    if (openedIndex.value > 0) {
      const previousPost = postList.value[openedIndex.value - 1]
      return {
        title: previousPost.title,
        img: previousPost.img.src,
        href: previousPost.href,
        date: previousPost.date
      }
    }
    // Current post is the latest post, no next post
    return undefined
  })

  return {
    showPostView,
    showPostViewAnimation,
    postViewScroll,
    selectedPost,
    openPost,
    closePost,
    openedIndex,
    previous,
    next
  }
}
