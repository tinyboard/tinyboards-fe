import type { Comment } from "@/types/types";

/**
 * Create a comment tree from a flat array of comments.
 * @param comments Array of comments from the API (can be in any order)
 * @returns A hierarchical comment tree with nested replies
 */
export function treeComments(comments: Comment[]): Comment[] {

  if (comments.length === 0) {
    return [];
  }

  // Create a map to store all comments by their ID for quick lookup
  const commentMap = new Map<number, Comment>();

  // Initialize all comments with empty replies array
  comments.forEach(comment => {
    // Create a copy to avoid mutating the original
    const commentCopy = { ...comment, replies: [] };
    commentMap.set(comment.id, commentCopy);
  });

  // Array to hold top-level comments (those with no parent)
  const topLevelComments: Comment[] = [];

  // Build the tree structure
  comments.forEach(comment => {
    const commentCopy = commentMap.get(comment.id)!;

    if (comment.parentId === null || comment.parentId === undefined) {
      // This is a top-level comment
      topLevelComments.push(commentCopy);
    } else {
      // This is a reply - find its parent and add it to parent's replies
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        parent.replies = parent.replies || [];
        parent.replies.push(commentCopy);
      } else {
        topLevelComments.push(commentCopy);
      }
    }
  });

  // Sort top-level comments by creation date (newest first)
  topLevelComments.sort((a, b) =>
    new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
  );

  // Recursively sort replies within each comment tree
  const sortReplies = (comment: Comment) => {
    if (comment.replies && comment.replies.length > 0) {
      comment.replies.sort((a, b) =>
        new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime()
      );
      comment.replies.forEach(sortReplies);
    }
  };

  topLevelComments.forEach(sortReplies);

  return topLevelComments;
}
