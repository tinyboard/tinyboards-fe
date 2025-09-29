import type { Comment } from "@/types/types";

/**
 * Create a comment tree from a flat array of comments.
 * @param comments Array of comments from the API (can be in any order)
 * @returns A hierarchical comment tree with nested replies
 */
export function treeComments(comments: Comment[]): Comment[] {
  console.log('DEBUG treeComments: Input:', comments.map(c => ({ id: c.id, parentId: c.parentId, body: c.body?.substring(0, 20) })));

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

  console.log('DEBUG treeComments: CommentMap keys:', Array.from(commentMap.keys()));

  // Array to hold top-level comments (those with no parent)
  const topLevelComments: Comment[] = [];

  // Build the tree structure
  comments.forEach(comment => {
    const commentCopy = commentMap.get(comment.id)!;

    console.log(`DEBUG treeComments: Processing comment ${comment.id}, parentId: ${comment.parentId}`);

    if (comment.parentId === null || comment.parentId === undefined) {
      // This is a top-level comment
      console.log(`DEBUG treeComments: Adding ${comment.id} as top-level`);
      topLevelComments.push(commentCopy);
    } else {
      // This is a reply - find its parent and add it to parent's replies
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        console.log(`DEBUG treeComments: Adding ${comment.id} as reply to ${comment.parentId}`);
        parent.replies = parent.replies || [];
        parent.replies.push(commentCopy);
      } else {
        console.log(`DEBUG treeComments: Parent ${comment.parentId} not found for ${comment.id}, treating as top-level`);
        topLevelComments.push(commentCopy);
      }
    }
  });

  console.log('DEBUG treeComments: Top-level comments:', topLevelComments.map(c => ({ id: c.id, repliesCount: c.replies?.length })));
  console.log('DEBUG treeComments: Final result structure:', topLevelComments.map(c => ({
    id: c.id,
    replies: c.replies?.map(r => ({ id: r.id, parentId: r.parentId })) || []
  })));

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
