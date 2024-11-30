export function treeComments(comments) {
  if (comments.length === 0) {
    return [];
  }

  const repliesByID = {};
  comments.forEach((comment) => {
    if (repliesByID.hasOwnProperty(comment.parentId)) {
      repliesByID[comment.parentId].push(comment);
    } else {
      repliesByID[comment.parentId] = [comment];
    }
  });

  //console.log(JSON.stringify(repliesByID, null, 4));

  const getRepliesForComment = (comment) => {
    repliesByID[comment.id]?.forEach((reply) => {
      getRepliesForComment(reply);
    });
    comment.replies = repliesByID[comment.id] ?? [];

    return comment;
  };

  let topCommentID;
  if (Object.keys(repliesByID).includes("null")) {
    topCommentID = null;
  } else {
    const idlist = comments.map((comment) => comment.id);
    topCommentID = comments.filter(
      (comment) => !idlist.includes(comment.parentId),
    )[0].parentId;
  }

  //console.log(topCommentID);
  return repliesByID[topCommentID].map(getRepliesForComment);
}
