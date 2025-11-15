import { ref, computed, watch } from 'vue'
import { marked } from 'marked'

export function useMarkdownEditor(initialContent = '', emit?: any) {
  const markdownContent = ref(initialContent)
  const markdownTextarea = ref<HTMLTextAreaElement>()
  const showPreview = ref(false)

  // Convert shortcodes in markdown to emoji HTML
  const convertShortcodesToEmojis = async (markdownText: string) => {
    // This would need to be implemented with your emoji system
    // For now, just return the original text
    return markdownText
  }

  // Convert HTML back to markdown with shortcodes
  const convertEmojiToShortcodes = (html: string) => {
    return html
      // Remove unnecessary whitespace and line breaks
      .replace(/\n\s*\n/g, '\n\n')
      .replace(/^\s+|\s+$/g, '')
      // Convert line breaks
      .replace(/<br\s*\/?>/gi, '\n')
      // Convert emoji images to shortcodes
      .replace(/<img[^>]*(?=.*class="emoji")(?=.*data-shortcode="([^"]*)").*?\/?>/gi, ':$1:')
      // Clean up HTML entities
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      // Remove extra whitespace
      .replace(/\n{3,}/g, '\n\n')
      .replace(/^\s+|\s+$/g, '')
  }

  // Parse markdown to HTML for preview
  const parsedMarkdown = computed(() => {
    if (!markdownContent.value) return ''

    try {
      // Configure marked options
      marked.setOptions({
        breaks: true,
        gfm: true,
      })

      return marked(markdownContent.value)
    } catch (error) {
      console.error('Markdown parsing error:', error)
      return markdownContent.value
    }
  })

  // Convert markdown to HTML for the editor
  const convertMarkdownToHTML = async (markdown: string) => {
    try {
      // First convert shortcodes to emojis, then parse markdown
      const contentWithEmojis = await convertShortcodesToEmojis(markdown)
      return marked(contentWithEmojis)
    } catch (error) {
      console.error('Markdown conversion error:', error)
      return markdown
    }
  }

  // Update markdown content
  const updateMarkdown = (content: string) => {
    markdownContent.value = content
    emit?.('update:modelValue', content)
  }

  // Insert text at caret position
  const insertAtCaret = (textarea: HTMLTextAreaElement, startPos: number, endPos: number, replacement: string) => {
    const currentValue = textarea.value
    const newValue = currentValue.substring(0, startPos) + replacement + currentValue.substring(endPos)

    textarea.value = newValue
    markdownContent.value = newValue
    emit?.('update:modelValue', newValue)

    // Set cursor position after replacement
    const newCursorPos = startPos + replacement.length
    nextTick(() => {
      textarea.setSelectionRange(newCursorPos, newCursorPos)
      textarea.focus()
    })
  }

  // Toggle preview
  const togglePreview = () => {
    showPreview.value = !showPreview.value
  }

  return {
    markdownContent,
    markdownTextarea,
    showPreview,
    parsedMarkdown,
    updateMarkdown,
    convertMarkdownToHTML,
    convertEmojiToShortcodes,
    insertAtCaret,
    togglePreview
  }
}