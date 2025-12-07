// Core suggestion logic shared by all suggestion types (emoji, mentions, boards)
import { ref, reactive, readonly } from 'vue'

export interface SuggestionState<T> {
  suggestions: T[]
  isVisible: boolean
  selectedIndex: number
  isLoading: boolean
  triggerPos: number
  query: string
}

export interface SuggestionOptions {
  minQueryLength: number
  maxSuggestions: number
  debounceMs: number
}

export function useSuggestionCore<T>(
  searchFn: (query: string) => Promise<T[]>,
  options: Partial<SuggestionOptions> = {}
) {
  const config = {
    minQueryLength: 1,
    maxSuggestions: 10,
    debounceMs: 300,
    ...options
  }

  const state = reactive<SuggestionState<T>>({
    suggestions: [],
    isVisible: false,
    selectedIndex: 0,
    isLoading: false,
    triggerPos: 0,
    query: ''
  })

  let searchTimeout: ReturnType<typeof setTimeout> | null = null

  const search = async (query: string, triggerPos: number) => {
    state.query = query
    state.triggerPos = triggerPos

    if (query.length < config.minQueryLength) {
      hide()
      return
    }

    if (searchTimeout) clearTimeout(searchTimeout)

    searchTimeout = setTimeout(async () => {
      state.isLoading = true
      try {
        const results = await searchFn(query)
        state.suggestions = results.slice(0, config.maxSuggestions)
        state.selectedIndex = 0
        state.isVisible = state.suggestions.length > 0
      } catch (error) {
        console.error('Suggestion search failed:', error)
        hide()
      } finally {
        state.isLoading = false
      }
    }, config.debounceMs)
  }

  const hide = () => {
    state.isVisible = false
    state.suggestions = []
    state.selectedIndex = 0
    state.query = ''
    state.triggerPos = 0
  }

  const navigateUp = () => {
    if (state.selectedIndex > 0) {
      state.selectedIndex--
    } else {
      state.selectedIndex = state.suggestions.length - 1
    }
  }

  const navigateDown = () => {
    if (state.selectedIndex < state.suggestions.length - 1) {
      state.selectedIndex++
    } else {
      state.selectedIndex = 0
    }
  }

  const selectCurrent = (): T | null => {
    if (state.suggestions.length > 0 && state.selectedIndex >= 0) {
      return state.suggestions[state.selectedIndex]
    }
    return null
  }

  const handleKeydown = (event: KeyboardEvent): boolean => {
    if (!state.isVisible) return false

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault()
        navigateUp()
        return true
      case 'ArrowDown':
        event.preventDefault()
        navigateDown()
        return true
      case 'Escape':
        event.preventDefault()
        hide()
        return true
      default:
        return false
    }
  }

  return {
    state: readonly(state),
    search,
    hide,
    navigateUp,
    navigateDown,
    selectCurrent,
    handleKeydown
  }
}
