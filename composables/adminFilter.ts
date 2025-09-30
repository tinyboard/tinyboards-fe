import { ref, computed } from 'vue';
import { useLoggedInUser } from '@/stores/StoreAuth';
import { requirePermission } from '@/composables/admin';

/**
 * Admin filter for hiding deleted/removed content
 * This composable provides a reactive filter state that persists across sessions
 */
export function useAdminContentFilter() {
  const userStore = useLoggedInUser();

  // Check if user is admin or mod
  const canModerate = computed(() => requirePermission('content'));

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
      // Hide posts deleted by the author from the author's own view
      if (post.isDeleted && userId === post.creator?.id) {
        return false;
      }

      // Apply admin filter if enabled
      if (canModerate.value && hideDeletedContent.value) {
        return !post.isDeleted && !post.isRemoved;
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
