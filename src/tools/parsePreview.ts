import { watch, ref, Ref, onMounted } from 'vue'

type parsePreview = {
  readingTime: Ref<string>,
  contentText: Ref<string>
}

/**
 * Parse the preview string of a post
 * @param content ref for preview string
 * @returns data and methods for parsing the preview string
 */
export default (content: Ref<string>): parsePreview => {
  const readingTime = ref('')
  const contentText = ref('')

  /**
   * Parse the preview string of a post
   * @param content ref for preview string
   */
  const parse = (content: Ref<string>) => {
    // Parse the HTML
    const pEle = new DOMParser().parseFromString(content.value, 'text/html').body.getElementsByTagName('p')[0]

    // Get 'Reading Time'
    const readingTimeEle = pEle.getElementsByClassName('rt-reading-time')
    if (readingTimeEle.length === 1) {
      const readingTimeParsed = readingTimeEle[0].textContent?.trim().split(': ') || []
      if (readingTimeParsed.length === 2) {
        readingTime.value = readingTimeParsed[readingTimeParsed.length - 1].replace('minute', 'min').replace('hour', 'hr')
      }

      // Remove 'Reading Time' element
      if (readingTimeEle[0].parentNode !== null) {
        pEle.removeChild(readingTimeEle[0])
      }
    }

    // Replace the ellipsis
    contentText.value = pEle.textContent?.replace(/\.{0,1} \[…\]/, '…').trim() || ''
  }

  // Re-parse when the content changed
  watch(content, () => {
    parse(content)
  })

  // Parse preview when mounted
  onMounted(() => {
    parse(content)
  })

  return {
    readingTime,
    contentText
  }
}
