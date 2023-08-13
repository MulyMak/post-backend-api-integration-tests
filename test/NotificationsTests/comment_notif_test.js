const softAssertion = require('soft-assert')
import NotificationsPage from "../../pages/notifications_page"
import CreateCommentPage from "../../pages/comment_page";
import CreateVotePage from "../../pages/vote_page"
import voteData from "../../static/vote_data";
import notificationData from "../../static/notification_data"
import Variables from "../../variabels/variables";


const notificationsPage = new NotificationsPage()
const createCommentPage = new CreateCommentPage()
const createVotePage = new CreateVotePage()

describe("CREATE COMMENT / REPLY AND UPVOTE / DOWNVOTE COMMENT NOTIFICATIONS", function () {
  this.timeout(60000)

  let postIds;
  let otherUserPosts;
  let commentId;
  let replyId;
  let voteId;


  before('Get test user data', async function () {
    require('../MainTests/create_test_users')
    postIds = await notificationsPage.GetUserPosts()
    otherUserPosts = await notificationsPage.GetUserPosts(Variables.testUsers.user2.userId, Variables.testUsers.user2.accessToken)
  })

  beforeEach('Get user notifications count', async function () {
    await notificationsPage.GetUserNotificationsCount()
  })

  it('[C1739] Positive: Notification of other user commenting your post', async () => {
    commentId = await createCommentPage.CreateComment(postIds[0], "I like your post", false, Variables.testUsers.user2.accessToken)
    await notificationsPage.ValidateNotificationsCount(1)
    await notificationsPage.GetUserNotifications()
    await notificationsPage.ValidateCommentNotification(notificationData.notificationType.postComment.comment, commentId, Variables.testUsers.user2.username)
    await createCommentPage.DeleteComment(commentId, Variables.testUsers.user2.accessToken)
    commentId = ""
    softAssertion.softAssertAll()
  });

  it('[C1740] Positive: Notification of other user replying to your comment under your post', async () => {
    commentId = await createCommentPage.CreateComment(postIds[0], "I love my post")
    replyId = await createCommentPage.CreateComment(postIds[0], "I like your comment", commentId, Variables.testUsers.user2.accessToken)
    await notificationsPage.ValidateNotificationsCount(1)
    await notificationsPage.GetUserNotifications()
    await notificationsPage.ValidateCommentNotification(notificationData.notificationType.postComment.reply, commentId, Variables.testUsers.user2.username, replyId)
    await createCommentPage.DeleteComment(commentId)
    commentId = ""
    softAssertion.softAssertAll()
  });

  it('[C1741] Positive: Notification of other user replying to your comment under other user post', async () => {
    commentId = await createCommentPage.CreateComment(otherUserPosts[0], "I like your post")
    replyId = await createCommentPage.CreateComment(otherUserPosts[0], "I like your comment", commentId, Variables.testUsers.user2.accessToken)
    await notificationsPage.ValidateNotificationsCount(1)
    await notificationsPage.GetUserNotifications()
    await notificationsPage.ValidateCommentNotification(notificationData.notificationType.postComment.reply, commentId, Variables.testUsers.user2.username, replyId)
    await createCommentPage.DeleteComment(commentId)
    commentId = ""
    softAssertion.softAssertAll()
  });

  it('[C1742] Positive: Notification of other user liking your comment', async () => {
    commentId = await createCommentPage.CreateComment(postIds[0], "I love my post")
    voteId = await createVotePage.CreateVote(voteData.voteTarget.comment, voteData.voteType.upvote, commentId, Variables.testUsers.user2.accessToken)
    await notificationsPage.ValidateNotificationsCount(1)
    await notificationsPage.GetUserNotifications()
    await notificationsPage.ValidateCommentNotification(notificationData.notificationType.commentVote.upvote, commentId, Variables.testUsers.user2.username)
    //NOTE: not deleting comment as it is being used in the next case
    softAssertion.softAssertAll()
  });

  it('[C1743] Positive: No notification of other user updating like to dislike to your comment', async () => {
    await createVotePage.UpdateVote(voteData.voteType.downvote, commentId, voteId, Variables.testUsers.user2.accessToken)
    await notificationsPage.ValidateNotificationsCount(0)
    //NOTE: not deleting comment as it is being used in the next case
    softAssertion.softAssertAll()
  });

  it('[C1744] Positive: Notification of other user removing like to your comment', async () => {
    await createVotePage.DeleteVote(voteId, Variables.testUsers.user2.accessToken)
    await notificationsPage.ValidateNotificationsCount(1)
    await notificationsPage.GetUserNotifications()
    await notificationsPage.ValidateCommentNotification(notificationData.notificationType.commentVote.voteRemoved, commentId, Variables.testUsers.user2.username)
    await createCommentPage.DeleteComment(commentId)
    commentId = ""
    softAssertion.softAssertAll()
  });

  it('[C1745] Positive: Notification of other user liking your reply', async () => {
    commentId = await createCommentPage.CreateComment(otherUserPosts[0], "I like my post", false, Variables.testUsers.user2.accessToken)
    replyId = await createCommentPage.CreateComment(otherUserPosts[0], "I like your comment", commentId)
    voteId = await createVotePage.CreateVote(voteData.voteTarget.comment, voteData.voteType.upvote, replyId, Variables.testUsers.user2.accessToken)
    await notificationsPage.ValidateNotificationsCount(1)
    await notificationsPage.GetUserNotifications()
    //NOTE: for like/dislike comment the commentId in the response is the replyId unlike in case of writing a reply so give replyId as commentId in arguments below
    await notificationsPage.ValidateCommentNotification(notificationData.notificationType.commentVote.upvote, replyId, Variables.testUsers.user2.username)
    await createCommentPage.DeleteComment(commentId, Variables.testUsers.user2.accessToken)
    commentId = ""
    softAssertion.softAssertAll()
  });
})