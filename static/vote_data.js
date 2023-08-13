module.exports = {
  voteTarget: {
    post: 'POST',
    comment: 'COMMENT'
  },
  voteType: {
    upvote: 'UPVOTE',
    downvote: 'DOWNVOTE'
  },

  voteBodyData: {
    positiveData: {
      upvoteOwnPost: 'upvote own post',
      downvoteOwnPost: 'downvote  own post',
      upvoteOtherPost: 'upvote other user post',
      downvoteOtherPost: 'downvote other user post',
      upvoteOwnComment: 'upvote own comment',
      downvoteOwnComment: 'downvote  own comment',
      upvoteOtherComment: 'upvote other user comment',
      downvoteOtherCommentReply: 'downvote other user comment reply'
    },
    negativeData: {
      postIdForComment: 'sending post id for target comment',
      commentIdForPost: 'sending comment id for target post',
      upvoteRepost: 'upvoting a repost',
      invalidType: 'sending a type with lowercase',
      invalidTarget: 'sending a target with lowercase'
    }
  }
}