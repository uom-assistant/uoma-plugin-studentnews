import { ref, Ref } from 'vue'
import sanitizeHtml from 'sanitize-html'

type loadPost = {
  content: Ref<string>,
  readingTime: Ref<string>
  loading: Ref<boolean>,
  error: Ref<boolean>,
  load: (link: string) => Promise<void>
}

/**
 * Handle post loading
 * @returns data and methods for loading a post
 */
export default (): loadPost => {
  const content = ref('')
  const readingTime = ref('')
  const loading = ref(false)
  const error = ref(false)

  /**
   * Load content of a post
   * @param link post link
   * @returns Promise for the loading requesting
   */
  const load = async (link: string): Promise<void> => {
    if (loading.value) {
      return
    }

    loading.value = true
    error.value = false

    const result = await fetch(`${link}?_fields=content`, {
      credentials: 'omit'
    }).then((response) => response.json()).catch(() => {
      loading.value = false
      error.value = true
      return false
    })

    if (result === false) {
      // Error, return
      return
    }

    error.value = false

    // Sanitize the result
    content.value = sanitizeHtml(result.content.rendered, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'iframe']),
      allowedAttributes: {
        a: ['href', 'target', 'style', 'rel'],
        img: ['src', 'srcset', 'data-src', 'data-srcset', 'style', 'class'],
        iframe: ['src', 'loading', 'width', 'height', 'srcdoc', 'allowfullscreen', 'sandbox', 'style'],
        figure: ['class', 'style'],
        '*': ['style']
      },
      allowedIframeDomains: ['zoom.us', 'youtube.com', 'vimeo.com', 'man.ac.uk', 'manchester.ac.uk'],
      transformTags: {
        img: (tagName, attribs) => {
          // Transform all src and srcset to lazyload format
          attribs['data-src'] = attribs.src || ''
          delete attribs.src
          attribs['data-srcset'] = attribs.srcset || ''
          delete attribs.srcset

          // Add class for lazyload
          attribs.class = 'lazyload'

          return {
            tagName,
            attribs
          }
        },
        a: (tagName, attribs) => {
          // Make sure all links will be opened in a new tab
          if (!attribs.target || attribs.target !== '_blank') {
            attribs.target = '_blank'
          }
          return {
            tagName,
            attribs
          }
        },
        iframe: (tagName, attribs) => {
          // Add sandbox for iframes
          if (!attribs.sandbox) {
            attribs.sandbox = 'allow-scripts allow-same-origin allow-popups allow-presentation'
          }
          return {
            tagName,
            attribs
          }
        },
        figure: (tagName, attribs) => {
          // Handle video iframes
          if (attribs.class && attribs.class.includes('wp-block-embed') && attribs.class.includes('is-type-video')) {
            if (attribs.class.includes('wp-embed-aspect-16-9')) {
              attribs.class = 'video-iframe video-16-9'
            } else if (attribs.class.includes('wp-embed-aspect-16-10')) {
              attribs.class = 'video-iframe video-16-10'
            } else if (attribs.class.includes('wp-embed-aspect-4-3')) {
              attribs.class = 'video-iframe video-4-3'
            } else {
              attribs.class = 'video-iframe video-unknown'
            }
          } else {
            delete attribs.class
          }
          return {
            tagName,
            attribs
          }
        }
      },
      exclusiveFilter: (frame) => {
        // Get 'Reading Time' and remove the element
        if (frame.tag === 'span' && frame.tagPosition === 0 && frame.text.includes('Reading Time')) {
          const readingTimeParsed = frame.text.trim().split(': ') || []
          if (readingTimeParsed.length === 2) {
            readingTime.value = readingTimeParsed[readingTimeParsed.length - 1].replace('minute', 'min').replace('hour', 'hr')
          }
          return true
        }

        // Remove empty elements
        return (frame.tag === 'a' || frame.tag === 'p' || frame.tag === 'b' || frame.tag === 'i' || frame.tag === 'em' || frame.tag === 'strong' || frame.tag === 'code' || frame.tag === 'sub' || frame.tag === 'sup' || frame.tag === 'ol' || frame.tag === 'ul' || frame.tag === 'li' || frame.tag === 'h1' || frame.tag === 'h2' || frame.tag === 'h3' || frame.tag === 'h4' || frame.tag === 'h5' || frame.tag === 'h6') && !frame.text.trim()
      },
      enforceHtmlBoundary: true
    })

    loading.value = false
  }

  return {
    content,
    readingTime,
    loading,
    error,
    load
  }
}
