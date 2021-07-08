import { onMounted, ref, Ref, watch } from 'vue'
import sanitizeHtml from 'sanitize-html'

import { author, featuredImage } from '@/types/post'

type sanitize = {
  cleanedCaption: Ref<string>
}

/**
 * Sanitize HTML for image captions and author descriptions
 * @param imgRef ref for featured image
 * @param authorRef ref for author list
 * @returns data of sanitized HTML for image captions and author descriptions
 */
export default (imgRef: Ref<featuredImage>, authorRef: Ref<author[]>): sanitize => {
  const cleanedCaption = ref('')

  /**
   * Sanitize a HTML string
   * @param html HTML string
   * @returns sanitizedL string
   */
  const sanitizeHtmlString = (html: string) => {
    return sanitizeHtml(html, {
      allowedTags: ['b', 'em', 'i', 'strong', 'a'],
      allowedAttributes: {
        a: ['href', 'target', 'rel']
      },
      transformTags: {
        // Make sure all links will be opened in a new tab
        a: (tagName, attribs) => {
          if (!attribs.target || attribs.target !== '_blank') {
            attribs.target = '_blank'
          }
          return {
            tagName,
            attribs
          }
        }
      },
      exclusiveFilter: (frame) => {
        return !frame.text.trim()
      },
      enforceHtmlBoundary: true
    })
  }

  /**
   * Sanitize HTML for image captions
   */
  const cleanCaption = () => {
    if (imgRef.value.caption !== '') {
      cleanedCaption.value = sanitizeHtmlString(imgRef.value.caption)
    } else {
      cleanedCaption.value = ''
    }
  }

  /**
   * Sanitize HTML for author descriptions
   */
  const cleanDescription = () => {
    for (const author of authorRef.value) {
      if (author.description !== '') {
        author.cleanedDescription = sanitizeHtmlString(author.description)
      } else {
        author.cleanedDescription = ''
      }
    }
  }

  watch(imgRef, cleanCaption)
  watch(authorRef, cleanDescription)

  onMounted(() => {
    cleanCaption()
    cleanDescription()
  })

  return {
    cleanedCaption
  }
}
