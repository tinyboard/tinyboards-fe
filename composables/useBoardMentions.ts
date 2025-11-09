import { ref, computed } from 'vue'
import { useGraphQLQuery } from '@/composables/useGraphQL'

export interface BoardSuggestion {
  id: number
  name: string
  title: string
  description?: string
  subscribers?: number
}

export function useBoardMentions() {
  const suggestions = ref<BoardSuggestion[]>([])
  const isLoading = ref(false)
  const selectedIndex = ref(0)
  const query = ref('')
  const isVisible = ref(false)

  // GraphQL query for searching board names
  const searchBoards = async (searchQuery: string): Promise<BoardSuggestion[]> => {
    if (searchQuery.length < 1) {
      return []
    }

    try {
      const { data } = await useGraphQLQuery(`
        query searchBoards($searchTerm: String, $limit: Int) {
          listBoards(searchTerm: $searchTerm, limit: $limit) {
            id
            name
            title
            description
            subscribers
          }
        }
      `, {
        variables: {
          searchTerm: searchQuery,
          limit: 8
        }
      })

      return data.value?.listBoards || []
    } catch (error) {
      console.error('Error searching boards:', error)
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
        const results = await searchBoards(searchQuery)
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

  const getSelectedBoard = (): BoardSuggestion | null => {
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
    getSelectedBoard,
    reset
  }
}