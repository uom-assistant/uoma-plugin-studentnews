import { nextTick, ref, Ref } from 'vue'

type postListView = {
  viewMode: Ref<string>,
  changeModeTo: (mode: string) => void
}

/**
 * Handle post list view
 * @returns data and method for changing the post list view
 */
export default (): postListView => {
  const viewMode = ref('card')

  /**
   * Change the view to the given mode
   * @param mode target mode. Can be 'card' or 'list'
   */
  const changeModeTo = (mode: string) => {
    viewMode.value = mode
    nextTick(() => {
      // Focus on the first post in the list
      const focusTarget = document.querySelector('.card, .list')
      if (focusTarget) {
        (focusTarget.getElementsByTagName('a')[0] as HTMLElement).focus()
      } else {
        (document.getElementsByClassName(`mode-${mode}`)[0] as HTMLElement).blur()
      }
    })
  }

  return {
    viewMode,
    changeModeTo
  }
}
