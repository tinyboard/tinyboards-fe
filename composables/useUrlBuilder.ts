import { computed } from 'vue';
import { useSiteStore } from '@/stores/StoreSite';

/**
 * URL builder composable for generating SEO-friendly URLs
 * Respects the boardsEnabled setting to generate appropriate URLs
 */
export function useUrlBuilder() {
  const siteStore = useSiteStore();
  const boardsEnabled = computed(() => siteStore.enableBoards);

  /**
   * Build URL for a thread post
   * @param threadId - The thread post ID
   * @param slug - The URL slug for the post
   * @param boardSlug - The board name/slug (required if boardsEnabled)
   */
  function buildThreadUrl(threadId: number, slug: string, boardSlug?: string): string {
    const safeSlug = slug || 'post';

    if (boardsEnabled.value && boardSlug) {
      return `/b/${boardSlug}/threads/${threadId}/${safeSlug}`;
    }
    return `/threads/${threadId}/${safeSlug}`;
  }

  /**
   * Build URL for a feed post
   * @param postId - The post ID
   * @param slug - The URL slug for the post
   * @param boardSlug - The board name/slug (required if boardsEnabled)
   */
  function buildFeedUrl(postId: number, slug: string, boardSlug?: string): string {
    const safeSlug = slug || 'post';

    if (boardsEnabled.value && boardSlug) {
      return `/b/${boardSlug}/feed/${postId}/${safeSlug}`;
    }
    return `/feed/${postId}/${safeSlug}`;
  }

  /**
   * Build URL for a post (generic - detects type from post object)
   * @param postId - The post ID
   * @param slug - The URL slug for the post
   * @param boardSlug - The board name/slug (required if boardsEnabled)
   * @param postType - The post type ('thread' or 'feed', defaults to generic /p/ path)
   */
  function buildPostUrl(postId: number, slug: string, boardSlug?: string, postType?: string): string {
    const safeSlug = slug || 'post';

    // Use specific builders for known types
    if (postType === 'thread') {
      return buildThreadUrl(postId, safeSlug, boardSlug);
    } else if (postType === 'feed') {
      return buildFeedUrl(postId, safeSlug, boardSlug);
    }

    // Generic post URL (current /p/ pattern)
    if (boardsEnabled.value && boardSlug) {
      return `/b/${boardSlug}/p/${postId}/${safeSlug}`;
    }
    return `/p/${postId}/${safeSlug}`;
  }

  /**
   * Build URL for a wiki page
   * @param pageSlug - The wiki page slug
   * @param boardSlug - The board name/slug (required if boardsEnabled)
   */
  function buildWikiUrl(pageSlug: string, boardSlug?: string): string {
    if (boardsEnabled.value && boardSlug) {
      return `/b/${boardSlug}/wiki/${pageSlug}`;
    }
    return `/wiki/${pageSlug}`;
  }

  /**
   * Build URL for a board section (feed, threads, etc.)
   * @param section - The section name (e.g., 'feed', 'threads')
   * @param boardSlug - The board name/slug (required if boardsEnabled)
   */
  function buildSectionUrl(section: string, boardSlug?: string): string {
    if (boardsEnabled.value && boardSlug) {
      return `/b/${boardSlug}/${section}`;
    }
    return `/${section}`;
  }

  /**
   * Build URL for a board homepage
   * @param boardSlug - The board name/slug
   */
  function buildBoardUrl(boardSlug: string): string {
    return `/b/${boardSlug}`;
  }

  return {
    buildThreadUrl,
    buildFeedUrl,
    buildPostUrl,
    buildWikiUrl,
    buildSectionUrl,
    buildBoardUrl,
    boardsEnabled,
  };
}
