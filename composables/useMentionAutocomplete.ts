import { ref, computed } from 'vue'
import { useGraphQLQuery } from '@/composables/useGraphQL'

export interface MentionSuggestion {
  username: string
}

export function useMentionAutocomplete() {
  const suggestions = ref<string[]>([])
  const isLoading = ref(false)
  const selectedIndex = ref(0)
  const query = ref('')
  const isVisible = ref(false)

  // GraphQL query for searching usernames
  const searchUsernames = async (searchQuery: string): Promise<string[]> => {
    if (searchQuery.length < 2) {
      return []
    }

    try {
      const { data } = await useGraphQLQuery(`
        query searchUsernames($query: String!, $limit: Int) {
          searchUsernames(query: $query, limit: $limit)
        }
      `, {
        variables: {
          query: searchQuery,
          limit: 10
        }
      })

      return data.value?.searchUsernames || []
    } catch (error) {
      console.error('Error searching usernames:', error)
      return []
    }
  }

  // Debounced search function
  let searchTimeout: NodeJS.Timeout | null = null
  const debouncedSearch = (searchQuery: string) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    searchTimeout = setTimeout(async () => {
      isLoading.value = true
      query.value = searchQuery

      try {
        const results = await searchUsernames(searchQuery)
        suggestions.value = results
        selectedIndex.value = 0
        isVisible.value = results.length > 0
      } finally {
        isLoading.value = false
      }
    }, 300) // 300ms debounce
  }

  // Handle keyboard navigation
  const selectNext = () => {
    if (selectedIndex.value < suggestions.value.length - 1) {
      selectedIndex.value++
    }
  }

  const selectPrevious = () => {
    if (selectedIndex.value > 0) {
      selectedIndex.value--
    }
  }

  const getSelectedUsername = (): string | null => {
    if (suggestions.value.length > 0 && selectedIndex.value >= 0) {
      return suggestions.value[selectedIndex.value]
    }
    return null
  }

  const reset = () => {
    suggestions.value = []
    selectedIndex.value = 0
    query.value = ''
    isVisible.value = false
    isLoading.value = false

    if (searchTimeout) {
      clearTimeout(searchTimeout)
      searchTimeout = null
    }
  }

  return {
    suggestions,
    isLoading,
    selectedIndex,
    query,
    isVisible,
    debouncedSearch,
    selectNext,
    selectPrevious,
    getSelectedUsername,
    reset
  }
}
