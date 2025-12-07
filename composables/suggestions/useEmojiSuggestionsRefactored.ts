// Refactored emoji suggestions using the core suggestion logic
import { useSuggestionCore } from './useSuggestionCore'

export interface EmojiSuggestion {
  id: number
  shortcode: string
  imageUrl: string
  altText: string
  altTextDisplay: string
  category: string
  emojiScope: string
}

export function useEmojiSuggestionsRefactored(boardId?: number) {
  // GraphQL search function
  const searchEmojis = async (query: string): Promise<EmojiSuggestion[]> => {
    try {
      const gqlQuery = `
        query ListEmojis($input: ListEmojisInput) {
          listEmojis(input: $input) {
            id
            shortcode
            imageUrl
            altTextDisplay
            category
            emojiScope
          }
        }
      `

      const variables = {
        input: {
          boardId: boardId,
          activeOnly: true,
          limit: 200,
          offset: 0
        }
      }

      const { data, error } = await useGraphQLQuery(gqlQuery, { variables })

      if (error.value) {
        console.error('Emoji list error:', error.value)
        return []
      }

      const emojis = data.value?.listEmojis || []

      // Filter by query locally
      if (!query) return emojis.slice(0, 8)

      const lowerQuery = query.toLowerCase()
      return emojis
        .filter((e: any) => e.shortcode.toLowerCase().includes(lowerQuery))
        .slice(0, 8)
        .map((e: any) => ({
          ...e,
          altText: e.altTextDisplay
        }))
    } catch (error) {
      console.error('Failed to list emojis:', error)
      return []
    }
  }

  // Use base suggestion core
  const {
    state,
    search,
    hide,
    navigateUp,
    navigateDown,
    selectCurrent,
    handleKeydown
  } = useSuggestionCore<EmojiSuggestion>(searchEmojis, {
    minQueryLength: 1,
    maxSuggestions: 8,
    debounceMs: 200
  })

  /**
   * Detect emoji trigger pattern in text
   */
  const detectTrigger = (text: string, cursorPos: number) => {
    const textBefore = text.substring(0, cursorPos)
    const match = textBefore.match(/:([a-zA-Z0-9_+-]*)$/)

    if (match && match[1].length >= 1) {
      return {
        query: match[1],
        triggerPos: cursorPos - match[0].length
      }
    }
    return null
  }

  return {
    state,
    search,
    hide,
    navigateUp,
    navigateDown,
    selectCurrent,
    handleKeydown,
    detectTrigger,
    searchEmojis
  }
}
