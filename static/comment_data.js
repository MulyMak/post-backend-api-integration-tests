const voteData = require("./vote_data");
const Variables = require("../variabels/variables");

module.exports = {

  commentBodyData: {
    positiveData: {
      commentMinChar: 'first level comment with 1 char',
      replyToCommentMaxChar: 'reply with 5000 chars',
      replyToReply: 'reply to reply',
      commentOwnPost: 'commenting my own post'
    },
    negativeData: {
      moreThanAllowedChars: 'first level comment with 5001 chars',
      noTextComment: 'sending empty string',
      invalidPostIdComment: 'sending invalid post id',
      invalidParentIdReply: 'sending invalid comment id',
      noPostIdComment: 'not sending post id',
      commentRepost: 'commenting a repost'
    }
  }
}