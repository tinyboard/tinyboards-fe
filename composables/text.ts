/**
 * Strip HTML tags from text while preserving spacing and structure
 * @param html - HTML string to strip
 * @param options - Options for stripping
 * @returns Plain text with preserved spacing
 */
export const stripHtml = (html: string, options: { removeQuotes?: boolean } = {}): string => {
    if (!html) return '';

    const { removeQuotes = true } = options;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Remove blockquotes (quoted content) if requested
    if (removeQuotes) {
        const blockquotes = doc.querySelectorAll('blockquote');
        blockquotes.forEach(bq => bq.remove());
    }

    // Replace block elements with newlines for spacing
    const blockElements = doc.querySelectorAll('p, div, br, h1, h2, h3, h4, h5, h6, li');
    blockElements.forEach(el => {
        if (el.tagName === 'BR') {
            el.replaceWith('\n');
        } else {
            // Add newline after block elements
            const textNode = document.createTextNode('\n');
            el.appendChild(textNode);
        }
    });

    // Get text content with preserved spacing
    let text = doc.body.textContent || '';

    // Clean up excessive whitespace while preserving intentional spacing
    text = text
        .replace(/\n{3,}/g, '\n\n')  // Max 2 consecutive newlines
        .replace(/[ \t]+/g, ' ')      // Multiple spaces/tabs to single space
        .trim();

    return text;
};

/**
 * Truncate text to a specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add when truncated (default: '...')
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number, suffix: string = '...'): string => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + suffix;
};
