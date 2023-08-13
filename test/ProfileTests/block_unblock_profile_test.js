const softAssertion = require('soft-assert')
import UserPage from '../../pages/user_page'
import FollowPage from "../../pages/follow_page"
import CommentPage from "../../pages/comment_page"
import VotePage from "../../pages/vote_page"
import voteData from "../../static/vote_data"
import Variables from "../../variabels/variables"


const userPage = new UserPage()
const followPage = new FollowPage()
const commentPage = new CommentPage()
const votePage = new VotePage()

describe("BLOCK / UNBLOCK", function () {
  this.timeout(60000)
  let profile;
  let blockerFollowerCount = 0
  let blockerFollowingCount = 0
  let blockedFollowerCount = 0
  let blockedFollowingCount = 0
  let negativeCommentBody;
  let negativeVoteBody;

  before('Get test user data', async function () {
    await followPage.FollowUser(Variables.testUsers.user2.userId, Variables.testUsers.user1.userId, Variables.testUsers.user1.accessToken)
    await followPage.FollowUser(Variables.testUsers.user1.userId, Variables.testUsers.user2.userId, Variables.testUsers.user2.accessToken)
    blockerFollowerCount = await followPage.GetFollowersCount()
    blockerFollowingCount = await followPage.GetFollowingCount()
    blockedFollowerCount = await followPage.GetFollowersCount(Variables.testUsers.user2.userId, Variables.testUsers.user2.accessToken)
    blockedFollowingCount = await followPage.GetFollowingCount(Variables.testUsers.user2.userId, Variables.testUsers.user2.accessToken)
  })

  it('[C1639] Positive: Block user', async () => {
    await userPage.BlockProfile(Variables.testUsers.user2.userId)
    profile = await userPage.GetProfile(Variables.testUsers.user2.userId) //user who blocks can get blocked user profile
    softAssertion.softTrue(profile.isBlocked, "Profile is blocked")
    await userPage.GetNotAvailableProfile(Variables.testUsers.user1.userId, Variables.testUsers.user2.accessToken) //blocked user cannot get profile of the user who blocked
    let blockedList = await userPage.GetBlockedList()
    softAssertion.softTrue(blockedList.length !== 0)
    softAssertion.softTrue(blockedList[0].id === Variables.testUsers.user2.userId)
    softAssertion.softAssertAll()
  });

  it('[C1640] Positive: Blocking a user both disappear from each other follower/following lists', async () => {
    let newBlockerFollowerCount = await followPage.GetFollowersCount()
    let newBlockerFollowingCount = await followPage.GetFollowingCount()
    let newBlockedFollowerCount = await followPage.GetFollowersCount(Variables.testUsers.user2.userId, Variables.testUsers.user2.accessToken)
    let newBlockedFollowingCount = await followPage.GetFollowingCount(Variables.testUsers.user2.userId, Variables.testUsers.user2.accessToken)
    softAssertion.softTrue(newBlockerFollowerCount === blockerFollowerCount - 1)
    softAssertion.softTrue(newBlockerFollowingCount === blockerFollowingCount - 1)
    softAssertion.softTrue(newBlockedFollowerCount === blockedFollowerCount - 1)
    softAssertion.softTrue(newBlockedFollowingCount === blockedFollowingCount - 1)
    softAssertion.softAssertAll()
  });

  it('[C1641] Positive: Blocking user can search blocked user but blocked user cannot search blocking one', async () => {
    let searchForBlockedUser = await userPage.SearchForUsers(Variables.testUsers.user2.username, Variables.testUsers.user1.accessToken)
    softAssertion.softTrue(searchForBlockedUser.content.length !== 0)
    softAssertion.softTrue(searchForBlockedUser.content[0].username === Variables.testUsers.user2.username)

    let searchForBlockingUser = await userPage.SearchForUsers(Variables.testUsers.user1.username, Variables.testUsers.user2.accessToken, "Username of the blocked user is found")
    if (searchForBlockingUser.content.length !== 0) {
      softAssertion.softTrue(searchForBlockedUser.content[0].username !== Variables.testUsers.user1.username, "Username of the blocking user is not found")
    }
    softAssertion.softAssertAll()
  });

  it('[C1642] Negative: Blocking and blocked users searching each other posts', async () => {
    let searchForBlockedUserPost = await userPage.SearchForPosts(Variables.testUsers.user2.postText, Variables.testUsers.user1.accessToken)
    if (searchForBlockedUserPost.content.length !== 0) {
      for (let i = 0; i < searchForBlockedUserPost.content.length; i++) {
        softAssertion.softTrue(searchForBlockedUserPost.content[i].ownedBy.username !== Variables.testUsers.user2.username, "Post of the blocked user is not found")
      }
    }

    let searchForBlockingUserPost = await userPage.SearchForPosts(Variables.testUsers.user1.postText, Variables.testUsers.user2.accessToken)
    if (searchForBlockingUserPost.content.length !== 0) {
      for (let i = 0; i < searchForBlockingUserPost.content.length; i++) {
        softAssertion.softTrue(searchForBlockingUserPost.content[i].ownedBy.username !== Variables.testUsers.user1.username, "Post of the blocking user is not found")
      }
    }
    softAssertion.softAssertAll()
  });

  it('[C1643] Negative: Blocking and blocked users not able to comment and vote each other posts', async () => {
    //User 1 who blocked commenting and voting user 2 post
    negativeCommentBody = await commentPage.CreateComment(Variables.testUsers.user2.postId, "comment post of user I blocked", false, Variables.testUsers.user1.accessToken, 403)
    softAssertion.softTrue(negativeCommentBody.reason === "USER_IS_BLOCKED_BY_RESOURCE_CREATOR", "Blocking user not able to comment blocked")
    negativeVoteBody = await votePage.CreateVote(voteData.voteTarget.post, voteData.voteType.upvote, Variables.testUsers.user2.postId, Variables.testUsers.user1.accessToken, 403)
    softAssertion.softTrue(negativeVoteBody.reason === "USER_IS_BLOCKED_BY_RESOURCE_CREATOR", "Blocking user not able to vote blocked")
    //User 2 who is blocked commenting and voting user 1 post
    negativeCommentBody = await commentPage.CreateComment(Variables.testUsers.user1.postId, "comment post of user I blocked", false, Variables.testUsers.user2.accessToken, 403)
    softAssertion.softTrue(negativeCommentBody.reason === "USER_IS_BLOCKED_BY_RESOURCE_CREATOR", "Blocked user not able to comment blocking")
    negativeVoteBody = await votePage.CreateVote(voteData.voteTarget.post, voteData.voteType.downvote, Variables.testUsers.user1.postId, Variables.testUsers.user2.accessToken, 403)
    softAssertion.softTrue(negativeVoteBody.reason === "USER_IS_BLOCKED_BY_RESOURCE_CREATOR", "Blocked user not able to vote blocking")
    softAssertion.softAssertAll()
  });

  it('[C1644] Negative: Blocking and blocked users not able to vote each other comments', async () => {
    //User 1 who blocked voting user 2 comment under user 1 post
    negativeVoteBody = await votePage.CreateVote(voteData.voteTarget.comment, voteData.voteType.downvote, Variables.testUsers.user2.commentId, Variables.testUsers.user1.accessToken, 403)
    softAssertion.softTrue(negativeVoteBody.reason === "USER_IS_BLOCKED_BY_RESOURCE_CREATOR")
    //User 2 who is blocked voting user 1 comment under user 2 post
    negativeVoteBody = await votePage.CreateVote(voteData.voteTarget.comment, voteData.voteType.upvote, Variables.testUsers.user1.commentId, Variables.testUsers.user2.accessToken, 403)
    softAssertion.softTrue(negativeVoteBody.reason === "USER_IS_BLOCKED_BY_RESOURCE_CREATOR")
    softAssertion.softAssertAll()
  });


  it('[C1645] Positive: Unblock user', async () => {
    await userPage.UnblockProfile(Variables.testUsers.user2.userId)
    await userPage.GetProfile(Variables.testUsers.user1.userId, Variables.testUsers.user2.accessToken) //user unblocked can now get the profile
    let blockedList = await userPage.GetBlockedList()
    softAssertion.softTrue(blockedList.length === 0)
    softAssertion.softAssertAll()
  });

  after('Unfollow each other', async function () {
    await userPage.UnblockProfile(Variables.testUsers.user2.userId)
    await followPage.UnfollowUser(Variables.testUsers.user2.userId, Variables.testUsers.user1.userId, Variables.testUsers.user1.accessToken)
    await followPage.UnfollowUser(Variables.testUsers.user1.userId, Variables.testUsers.user2.userId, Variables.testUsers.user2.accessToken)
  })
})