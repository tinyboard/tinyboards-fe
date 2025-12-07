// Content conversion utilities between HTML and Markdown
import { marked } from 'marked'

export function useContentConverter() {
  /**
   * Convert HTML to Markdown
   */
  const htmlToMarkdown = (html: string): string => {
    return html
      // Remove wrapping <p> tags but preserve line breaks
      .replace(/<p>/gi, '')
      .replace(/<\/p>/gi, '\n\n')
      // Convert headings
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
      .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
      .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
      .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')
      // Convert bold and italic
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
      // Convert links
      .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
      // Convert code
      .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
      .replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n\n')
      .replace(/<pre[^>]*>(.*?)<\/pre>/gis, '```\n$1\n```\n\n')
      // Convert blockquotes
      .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (match, content) => {
        return content.split('\n').map((line: string) => `> ${line.trim()}`).join('\n') + '\n\n'
      })
      // Convert lists
      .replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, content) => {
        return content.replace(/<li[^>]*>(.*?)<\/li>/gis, '- $1\n') + '\n'
      })
      .replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match, content) => {
        let counter = 1
        return content.replace(/<li[^>]*>(.*?)<\/li>/gis, () => `${counter++}. $1\n`) + '\n'
      })
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
      .replace(/&#39;/gi, "'")
      // Remove any remaining HTML tags
      .replace(/<[^>]*>/gi, '')
      // Clean up extra whitespace
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim()
  }

  /**
   * Convert Markdown to HTML
   */
  const markdownToHtml = async (markdown: string): Promise<string> => {
    return marked.parse(markdown)
  }

  return {
    htmlToMarkdown,
    markdownToHtml
  }
}
