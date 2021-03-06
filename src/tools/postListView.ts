import { nextTick, ref, Ref } from 'vue'

type postListView = {
  viewMode: Ref<string>,
  changeModeTo: (mode: 'card' | 'list') => void
}

/**
 * Handle post list view
 * @returns data and method for changing the post list view
 */
export default (): postListView => {
  const viewMode = ref<'card' | 'list'>('card')

  /**
   * Change the view to the given mode
   * @param mode target mode
   */
  const changeModeTo = (mode: 'card' | 'list') => {
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
