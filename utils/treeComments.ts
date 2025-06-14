import type { Comment } from "~/types/types";

/**
 * Create a comment tree.
 * @param comments Array of comments not ordered into a tree, typically from the API.
 * @returns A comment tree.
 */
export function treeComments(comments: Comment[]): Comment[] {
  if (comments.length === 0) {
    return [];
  }

  const repliesByID: {
    [index: number]: Comment[]
  } = {};

  comments.forEach((comment: Comment) => {
    // top level comment's parent ID is null => treat it as -1
    let parentID = comment.parentId ?? -1;
    if (!!repliesByID[parentID]) {
      repliesByID[parentID].push(comment);
    } else {
      repliesByID[parentID] = [comment];
    }
  });

  //console.log(JSON.stringify(repliesByID, null, 4));

  const getRepliesForComment = (comment: Comment) => {
    repliesByID[comment.id]?.forEach((reply) => {
      getRepliesForComment(reply);
    });
    comment.replies = repliesByID[comment.id] ?? [];

    return comment;
  };

  // locate the top comment, which should be the root of the tree
  // if there are no top-level comments (comments directly under the post), find the ID of the comment which doesn't have a parent comment
  let topCommentID: number;
  if (Object.keys(repliesByID).includes("-1")) {
    topCommentID = -1;
  } else {
    const idlist = comments.map((comment) => comment.id);
    topCommentID = comments.filter(
      (comment) => !idlist.includes(comment.parentId ?? -1),
    )[0]?.parentId ?? -1;
  }

  //console.log(topCommentID);
  return repliesByID[topCommentID].map(getRepliesForComment);
}
