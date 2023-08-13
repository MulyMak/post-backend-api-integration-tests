module.exports = {
  notificationType: {
    postVote: {
      upvote: {
        type: "POST_UPVOTED",
        message: "upvoted your post"
      },
      downvote: {
        type: "POST_DOWNVOTED",
        message: "downvoted your post"
      },
      voteRemoved: {
        type: "POST_VOTE_REMOVED",
        message: "removed vote from post"
      }
    },
    follow: {
      type: "USER_FOLLOWED",
      message: "started following you"
    },
    postComment: {
      comment: {
        type: "POST_COMMENTED",
        message: "commented your post"
      },
      reply: {
        type: "COMMENT_REPLIED",
        message: "replied to your comment"
      },
    },
    commentVote: {
      upvote: {
        type: "COMMENT_UPVOTED",
        message: "upvoted your comment"
      },
      downvote: {
        type: "COMMENT_DOWNVOTED",
        message: "downvoted your comment"
      },
      voteRemoved: {
        type: "COMMENT_VOTE_REMOVED",
        message: "removed vote from comment"
      }
    },
    moderation: {
      type: "POST_DELETED_AFTER_MODERATION",
      message: "Your post has been deleted due to moderation"
    }
  }
}