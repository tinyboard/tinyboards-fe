import { computed } from 'vue'

/**
 * Composable to process text content and convert board mentions (b/boardname) to clickable links
 */
export const useBoardLinks = () => {

  /**
   * Process text content and convert board mentions to HTML links
   * @param content - The text content to process
   * @returns Processed content with board mentions converted to links
   */
  const processBoardLinks = (content: string): string => {
    if (!content) return content

    // Replace board mentions (b/boardname) with clickable links
    // This regex matches b/ followed by alphanumeric characters, underscores, or hyphens
    return content.replace(
      /\bb\/([a-zA-Z0-9_-]+)(?!\w)/g,
      '<a href="/b/$1" class="board-link text-primary hover:text-primary-hover underline">b/$1</a>'
    )
  }

  /**
   * Process HTML content and convert board mentions to clickable links
   * This is more careful as it avoids processing content inside existing links
   * @param htmlContent - The HTML content to process
   * @returns Processed HTML content with board mentions converted to links
   */
  const processBoardLinksInHTML = (htmlContent: string): string => {
    if (!htmlContent) return htmlContent

    // Split content by existing links to avoid double-linking
    const linkRegex = /<a[^>]*>.*?<\/a>/gi
    const parts = htmlContent.split(linkRegex)
    const links = htmlContent.match(linkRegex) || []

    // Process board mentions only in non-link parts
    const processedParts = parts.map(part =>
      part.replace(
        /\bb\/([a-zA-Z0-9_-]+)(?!\w)/g,
        '<a href="/b/$1" class="board-link text-primary hover:text-primary-hover underline">b/$1</a>'
      )
    )

    // Reconstruct the HTML with original links preserved
    let result = processedParts[0] || ''
    for (let i = 0; i < links.length; i++) {
      result += links[i] + (processedParts[i + 1] || '')
    }

    return result
  }

  /**
   * Reactive computed property for processing content
   * @param content - Reactive content reference
   * @returns Computed property with processed board links
   */
  const processedContent = (content: () => string) => {
    return computed(() => processBoardLinks(content()))
  }

  /**
   * Reactive computed property for processing HTML content
   * @param htmlContent - Reactive HTML content reference
   * @returns Computed property with processed board links in HTML
   */
  const processedHTMLContent = (htmlContent: () => string) => {
    return computed(() => processBoardLinksInHTML(htmlContent()))
  }

  return {
    processBoardLinks,
    processBoardLinksInHTML,
    processedContent,
    processedHTMLContent
  }
}