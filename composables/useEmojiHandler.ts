import { ref, computed, nextTick } from 'vue'

interface Emoji {
  shortcode: string;
  imageUrl: string;
  altTextDisplay: string;
}

export function useEmojiHandler() {
  const emojiCache = ref<Map<string, Emoji>>(new Map())

  // Load emoji cache (placeholder - would integrate with existing emoji system)
  const loadEmojiCache = async () => {
    // This would be implemented to load from your emoji API/service
    // For now, returning empty to maintain interface compatibility
    return emojiCache.value
  }

  // Get emoji by shortcode
  const getEmojiByShortcode = (shortcode: string): Emoji | undefined => {
    return emojiCache.value.get(shortcode)
  }

  // Convert shortcodes to emoji HTML
  const convertShortcodesToEmojis = async (text: string): Promise<string> => {
    await loadEmojiCache()

    return text.replace(/:([a-zA-Z0-9_+-]+):/g, (match, shortcode) => {
      const emoji = getEmojiByShortcode(shortcode)
      if (emoji) {
        return `<img src="${emoji.imageUrl}" alt="${emoji.altTextDisplay}" class="emoji" data-shortcode="${emoji.shortcode}" />`
      }
      return match
    })
  }

  // Convert emoji HTML back to shortcodes
  const convertEmojisToShortcodes = (html: string): string => {
    return html.replace(
      /<img[^>]*(?=.*class="emoji")(?=.*data-shortcode="([^"]*)").*?\/?>/gi,
      ':$1:'
    )
  }

  // Insert emoji at cursor position in textarea
  const insertEmojiAtCursor = (
    textarea: HTMLTextAreaElement,
    emoji: string,
    updateCallback: (value: string) => void
  ) => {
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const currentValue = textarea.value
    const newValue = currentValue.substring(0, start) + emoji + currentValue.substring(end)

    textarea.value = newValue
    updateCallback(newValue)

    nextTick(() => {
      const newCursorPos = start + emoji.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
      textarea.focus()
    })
  }

  // Create emoji HTML for rich text editor
  const createEmojiHTML = (emoji: Emoji): string => {
    return `<img src="${emoji.imageUrl}" alt="${emoji.altTextDisplay}" class="emoji" data-shortcode="${emoji.shortcode}" />&nbsp;`
  }

  return {
    emojiCache,
    loadEmojiCache,
    getEmojiByShortcode,
    convertShortcodesToEmojis,
    convertEmojisToShortcodes,
    insertEmojiAtCursor,
    createEmojiHTML
  }
}