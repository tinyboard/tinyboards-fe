/**
 * Tests for useUrlBuilder composable
 *
 * To run these tests, first install Vitest:
 * npm install -D vitest @vue/test-utils
 *
 * Then add to package.json scripts:
 * "test": "vitest"
 *
 * Run with: npm test
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useUrlBuilder } from '@/composables/useUrlBuilder';
import { useSiteStore } from '@/stores/StoreSite';

// Mock the site store
vi.mock('@/stores/StoreSite', () => ({
  useSiteStore: vi.fn()
}));

describe('useUrlBuilder', () => {
  describe('with boards enabled', () => {
    beforeEach(() => {
      vi.mocked(useSiteStore).mockReturnValue({
        enableBoards: true
      } as any);
    });

    it('builds thread URL with board', () => {
      const { buildThreadUrl } = useUrlBuilder();
      const url = buildThreadUrl(123, 'my-awesome-thread', 'programming');
      expect(url).toBe('/b/programming/threads/123/my-awesome-thread');
    });

    it('builds feed URL with board', () => {
      const { buildFeedUrl } = useUrlBuilder();
      const url = buildFeedUrl(456, 'cool-post', 'gaming');
      expect(url).toBe('/b/gaming/feed/456/cool-post');
    });

    it('builds generic post URL with board', () => {
      const { buildPostUrl } = useUrlBuilder();
      const url = buildPostUrl(789, 'test-post', 'general');
      expect(url).toBe('/b/general/p/789/test-post');
    });

    it('builds wiki URL with board', () => {
      const { buildWikiUrl } = useUrlBuilder();
      const url = buildWikiUrl('getting-started', 'docs');
      expect(url).toBe('/b/docs/wiki/getting-started');
    });

    it('builds section URL with board', () => {
      const { buildSectionUrl } = useUrlBuilder();
      const url = buildSectionUrl('threads', 'programming');
      expect(url).toBe('/b/programming/threads');
    });

    it('builds board URL', () => {
      const { buildBoardUrl } = useUrlBuilder();
      const url = buildBoardUrl('programming');
      expect(url).toBe('/b/programming');
    });

    it('uses fallback slug when slug is empty', () => {
      const { buildPostUrl } = useUrlBuilder();
      const url = buildPostUrl(123, '', 'general');
      expect(url).toBe('/b/general/p/123/post');
    });

    it('builds thread-specific URL when postType is thread', () => {
      const { buildPostUrl } = useUrlBuilder();
      const url = buildPostUrl(123, 'my-thread', 'general', 'thread');
      expect(url).toBe('/b/general/threads/123/my-thread');
    });

    it('builds feed-specific URL when postType is feed', () => {
      const { buildPostUrl } = useUrlBuilder();
      const url = buildPostUrl(123, 'my-post', 'general', 'feed');
      expect(url).toBe('/b/general/feed/123/my-post');
    });
  });

  describe('with boards disabled', () => {
    beforeEach(() => {
      vi.mocked(useSiteStore).mockReturnValue({
        enableBoards: false
      } as any);
    });

    it('builds thread URL without board', () => {
      const { buildThreadUrl } = useUrlBuilder();
      const url = buildThreadUrl(123, 'my-awesome-thread');
      expect(url).toBe('/threads/123/my-awesome-thread');
    });

    it('builds feed URL without board', () => {
      const { buildFeedUrl } = useUrlBuilder();
      const url = buildFeedUrl(456, 'cool-post');
      expect(url).toBe('/feed/456/cool-post');
    });

    it('builds generic post URL without board', () => {
      const { buildPostUrl } = useUrlBuilder();
      const url = buildPostUrl(789, 'test-post');
      expect(url).toBe('/p/789/test-post');
    });

    it('builds wiki URL without board', () => {
      const { buildWikiUrl } = useUrlBuilder();
      const url = buildWikiUrl('getting-started');
      expect(url).toBe('/wiki/getting-started');
    });

    it('builds section URL without board', () => {
      const { buildSectionUrl } = useUrlBuilder();
      const url = buildSectionUrl('threads');
      expect(url).toBe('/threads');
    });

    it('uses fallback slug when slug is empty', () => {
      const { buildPostUrl } = useUrlBuilder();
      const url = buildPostUrl(123, '');
      expect(url).toBe('/p/123/post');
    });

    it('ignores board parameter when boards are disabled', () => {
      const { buildPostUrl } = useUrlBuilder();
      const url = buildPostUrl(123, 'my-post', 'ignored-board');
      expect(url).toBe('/p/123/my-post');
    });
  });

  describe('boardsEnabled computed property', () => {
    it('returns true when boards are enabled', () => {
      vi.mocked(useSiteStore).mockReturnValue({
        enableBoards: true
      } as any);

      const { boardsEnabled } = useUrlBuilder();
      expect(boardsEnabled.value).toBe(true);
    });

    it('returns false when boards are disabled', () => {
      vi.mocked(useSiteStore).mockReturnValue({
        enableBoards: false
      } as any);

      const { boardsEnabled } = useUrlBuilder();
      expect(boardsEnabled.value).toBe(false);
    });
  });

  describe('edge cases', () => {
    beforeEach(() => {
      vi.mocked(useSiteStore).mockReturnValue({
        enableBoards: true
      } as any);
    });

    it('handles special characters in slugs', () => {
      const { buildPostUrl } = useUrlBuilder();
      const url = buildPostUrl(123, 'hello-world-2024', 'general');
      expect(url).toBe('/b/general/p/123/hello-world-2024');
    });

    it('handles numeric IDs correctly', () => {
      const { buildPostUrl } = useUrlBuilder();
      const url = buildPostUrl(999999, 'test', 'board');
      expect(url).toBe('/b/board/p/999999/test');
    });

    it('handles board parameter for thread when boards enabled', () => {
      const { buildThreadUrl } = useUrlBuilder();
      const url = buildThreadUrl(123, 'thread', 'myboard');
      expect(url).toBe('/b/myboard/threads/123/thread');
    });

    it('handles missing board parameter when boards disabled', () => {
      vi.mocked(useSiteStore).mockReturnValue({
        enableBoards: false
      } as any);

      const { buildThreadUrl } = useUrlBuilder();
      const url = buildThreadUrl(123, 'thread', 'ignored');
      expect(url).toBe('/threads/123/thread');
    });
  });
});
