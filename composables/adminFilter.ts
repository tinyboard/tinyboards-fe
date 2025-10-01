import { ref, computed } from 'vue';
import { useLoggedInUser } from '@/stores/StoreAuth';
import { useBoardStore } from '@/stores/StoreBoard';
import { requirePermission } from '@/composables/admin';
import { requireModPermission } from '@/composables/mod';

/**
 * Admin filter for hiding deleted/removed content
 * This composable provides a reactive filter state that persists across sessions
 * Works for both site admins and board moderators
 */
export function useAdminContentFilter() {
  const userStore = useLoggedInUser();
  const boardStore = useBoardStore();

  // Check if user is admin or mod (board-specific if on board page)
  const canModerate = computed(() => {
    const isAdmin = requirePermission('content');
    const isBoardMod = boardStore.hasBoard && requireModPermission(boardStore.modPermissions, 'content');
    return isAdmin || isBoardMod;
  });

  // Get filter preference from cookie (defaults to false - show all content)
  const hideDeletedContent = useCookie('admin_hide_deleted', {
    default: () => false,
    maxAge: 60 * 60 * 24 * 365 // 1 year
  });

  // Toggle the filter
  const toggleFilter = () => {
    hideDeletedContent.value = !hideDeletedContent.value;
  };

  // Filter function for posts
  const filterPosts = (posts: any[]) => {
    const userId = userStore.user?.id;

    return posts.filter(post => {
      // If user is admin/mod with filter ON, hide all deleted/removed content
      if (canModerate.value && hideDeletedContent.value) {
        return !post.isDeleted && !post.isRemoved;
      }

      // If user is admin/mod with filter OFF, show everything (including own deleted posts)
      if (canModerate.value && !hideDeletedContent.value) {
        return true;
      }

      // Regular users: hide posts they deleted themselves
      if (post.isDeleted && userId === post.creator?.id) {
        return false;
      }

      return true;
    });
  };

  // Filter function for comments
  const filterComments = (comments: any[]) => {
    if (!canModerate.value || !hideDeletedContent.value) {
      return comments;
    }
    return comments.filter(comment => !comment.isDeleted && !comment.isRemoved);
  };

  return {
    canModerate,
    hideDeletedContent,
    toggleFilter,
    filterPosts,
    filterComments
  };
}
