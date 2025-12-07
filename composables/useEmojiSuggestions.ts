import { ref, computed } from 'vue'

interface CustomEmoji {
  id: number
  shortcode: string
  imageUrl: string
  altTextDisplay: string
  category: string
  emojiScope: string
  isActive: boolean
  usageCount: number
}

interface EmojiSuggestion extends CustomEmoji {
  altText: string // Mapped from altTextDisplay for component compatibility
  displayText: string
}

export const useEmojiSuggestions = (boardId?: number) => {
  const suggestions = ref<EmojiSuggestion[]>([])
  const isVisible = ref(false)
  const position = ref({ top: 0, left: 0 })
  const selectedIndex = ref(0)
  const currentQuery = ref('')
  const triggerPosition = ref(0)

  // Cache for loaded emojis to avoid repeated API calls
  const emojiCache = ref<CustomEmoji[]>([])
  const cacheLoaded = ref(false)

  const loadEmojis = async () => {
    if (cacheLoaded.value) return

    try {
      const query = `
        query ListEmojis($input: ListEmojisInput) {
          listEmojis(input: $input) {
            id
            shortcode
            imageUrl
            altTextDisplay
            category
            emojiScope
            isActive
            usageCount
          }
        }
      `

      const variables = {
        input: {
          boardId: boardId, // Include boardId to get board-specific emojis
          // Don't specify scope - this should return both SITE and BOARD emojis
          activeOnly: true,
          limit: 200,
          offset: 0
        }
      }

      const { useGraphQLQuery } = await import('@/composables/useGraphQL')
      const { data, error } = await useGraphQLQuery(query, { variables })

      if (error.value) {
        console.error('Failed to load emojis for suggestions:', error.value)
        return
      }

      if (data.value?.listEmojis) {
        emojiCache.value = data.value.listEmojis
        cacheLoaded.value = true
      }
    } catch (error) {
      console.error('Failed to load emojis for suggestions:', error)
    }
  }

  // Search emojis with backend query - query both SITE and BOARD scopes
  const searchEmojis = async (query: string): Promise<EmojiSuggestion[]> => {
    if (!query) return []

    try {
      const queryGql = `
        query ListEmojis($input: ListEmojisInput) {
          listEmojis(input: $input) {
            id
            shortcode
            imageUrl
            altTextDisplay
            category
            emojiScope
            isActive
            usageCount
          }
        }
      `

      const { useGraphQLQuery } = await import('@/composables/useGraphQL')

      // Query site-wide emojis
      const siteVariables = {
        input: {
          scope: "SITE",
          activeOnly: true,
          limit: 5, // Reduced limit since we're doing two queries
          offset: 0,
          search: query
        }
      }

      const { data: siteData, error: siteError } = await useGraphQLQuery(queryGql, { variables: siteVariables })

      let allEmojis: CustomEmoji[] = []

      if (siteError.value) {
        console.error('Failed to search site emojis:', siteError.value)
      } else if (siteData.value?.listEmojis) {
        allEmojis = [...siteData.value.listEmojis]
      }

      // Query board-specific emojis if boardId is provided
      if (boardId) {
        const boardVariables = {
          input: {
            boardId: boardId,
            scope: "BOARD",
            activeOnly: true,
            limit: 5,
            offset: 0,
            search: query
          }
        }

        const { data: boardData, error: boardError } = await useGraphQLQuery(queryGql, { variables: boardVariables })

        if (boardError.value) {
          console.error('Failed to search board emojis:', boardError.value)
        } else if (boardData.value?.listEmojis) {
          allEmojis = [...allEmojis, ...boardData.value.listEmojis]
        }
      }

      // Remove duplicates by id and map to component format
      const uniqueEmojis = allEmojis.filter((emoji, index, self) =>
        index === self.findIndex(e => e.id === emoji.id)
      )

      const mapped = uniqueEmojis.map((emoji: CustomEmoji) => ({
        ...emoji,
        altText: emoji.altTextDisplay,
        displayText: `:${emoji.shortcode}:`
      }))

      return mapped

    } catch (error) {
      console.error('Failed to search emojis:', error)
      return []
    }
  }

  const detectEmojiTrigger = (text: string, cursorPosition: number): { query: string; position: number } | null => {
    // Look backwards from cursor to find the last ':'
    let colonPos = -1
    for (let i = cursorPosition - 1; i >= 0; i--) {
      if (text[i] === ':') {
        colonPos = i
        break
      }
      // Stop if we hit whitespace or another colon (incomplete emoji)
      if (text[i] === ' ' || text[i] === '\n' || text[i] === '\t') {
        break
      }
    }

    if (colonPos === -1) return null

    // Extract the query between the colon and cursor
    const query = text.substring(colonPos + 1, cursorPosition)

    // Only show suggestions if we have at least 1 character and no spaces
    if (query.length >= 1 && !query.includes(' ') && !query.includes('\n')) {
      return { query, position: colonPos }
    }

    return null
  }

  // Helper function to calculate cursor position in textarea relative to textarea element
  const getTextareaCaretPosition = (textarea: HTMLTextAreaElement, caretPos: number) => {
    // Create a mirror div to calculate text position
    const div = document.createElement('div')
    const style = getComputedStyle(textarea)

    // Position the div at the same location as the textarea
    const textareaRect = textarea.getBoundingClientRect()
    div.style.position = 'absolute'
    div.style.top = `${textareaRect.top + window.scrollY}px`
    div.style.left = `${textareaRect.left + window.scrollX}px`
    div.style.visibility = 'hidden'
    div.style.whiteSpace = 'pre-wrap'
    div.style.wordWrap = 'break-word'
    div.style.font = style.font
    div.style.padding = style.padding
    div.style.border = style.border
    div.style.width = style.width
    div.style.lineHeight = style.lineHeight
    div.style.overflow = 'hidden'
    div.style.height = 'auto'

    document.body.appendChild(div)

    // Split text at caret position
    const textBeforeCaret = textarea.value.substring(0, caretPos)
    div.textContent = textBeforeCaret

    // Create a span for measuring the exact position
    const span = document.createElement('span')
    span.textContent = '|'
    div.appendChild(span)

    const spanRect = span.getBoundingClientRect()

    document.body.removeChild(div)

    // Return position relative to textarea element
    return {
      top: spanRect.top - textareaRect.top,
      left: spanRect.left - textareaRect.left
    }
  }

  const showSuggestions = async (text: string, cursorPosition: number, element: HTMLElement) => {
    const trigger = detectEmojiTrigger(text, cursorPosition)

    if (!trigger) {
      hideSuggestions()
      return
    }

    currentQuery.value = trigger.query
    triggerPosition.value = trigger.position

    // Calculate position for suggestions dropdown
    const rect = element.getBoundingClientRect()
    let cursorX = 0
    let cursorY = 0

    // Check if this is a textarea (markdown mode)
    if (element instanceof HTMLTextAreaElement) {
      const caretPos = getTextareaCaretPosition(element, cursorPosition)
      cursorX = caretPos.left
      cursorY = caretPos.top + 20 // Add some offset below the line

      // Use viewport coordinates for position: fixed dropdown
      position.value = {
        top: rect.top + cursorY,
        left: rect.left + cursorX
      }
    } else {
      // For TipTap, the element coordinates are already viewport coordinates
      // Add scroll position to convert to page coordinates for fixed positioning
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      const calculatedPosition = {
        top: rect.bottom + 5, // Position just below cursor
        left: rect.left
      };

      console.log('Emoji composable - TipTap mode positioning:', {
        rect,
        calculatedPosition,
        scrollTop,
        scrollLeft
      });

      position.value = calculatedPosition;
    }

    // Search for emojis with the current query
    const searchResults = await searchEmojis(trigger.query)
    suggestions.value = searchResults
    selectedIndex.value = 0
    isVisible.value = suggestions.value.length > 0
  }

  const hideSuggestions = () => {
    isVisible.value = false
    suggestions.value = []
    currentQuery.value = ''
    selectedIndex.value = 0
  }

  const selectSuggestion = (index?: number): EmojiSuggestion | null => {
    const suggestionIndex = index !== undefined ? index : selectedIndex.value
    const suggestion = suggestions.value[suggestionIndex]

    if (suggestion) {
      hideSuggestions()
      return suggestion
    }

    return null
  }

  const navigateUp = () => {
    if (selectedIndex.value > 0) {
      selectedIndex.value--
    }
  }

  const navigateDown = () => {
    if (selectedIndex.value < suggestions.value.length - 1) {
      selectedIndex.value++
    }
  }

  const replaceEmojiInText = (text: string, cursorPosition: number, emoji: EmojiSuggestion) => {
    const beforeEmoji = text.substring(0, triggerPosition.value)
    const afterEmoji = text.substring(cursorPosition)

    return {
      newText: beforeEmoji + emoji.displayText + afterEmoji,
      newCursorPosition: triggerPosition.value + emoji.displayText.length
    }
  }

  // Get emoji by shortcode from cache
  const getEmojiByShortcode = (shortcode: string): CustomEmoji | null => {
    return emojiCache.value.find(emoji => emoji.shortcode === shortcode) || null
  }

  // Auto-load emojis when composable is first used
  if (process.client && !cacheLoaded.value) {
    loadEmojis()
  }

  return {
    suggestions,
    isVisible,
    position,
    selectedIndex,
    currentQuery,
    showSuggestions,
    hideSuggestions,
    selectSuggestion,
    navigateUp,
    navigateDown,
    replaceEmojiInText,
    loadEmojis,
    getEmojiByShortcode
  }
}