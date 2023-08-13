const softAssertion = require('soft-assert')
import UserPage from '../../pages/user_page'
import CreateCommentPage from "../../pages/comment_page"
import CreateVotePage from "../../pages/vote_page"

import Variables from "../../variabels/variables";
import userData from "../../static/user_data";
import voteData from "../../static/vote_data";

const userPage = new UserPage()
const createCommentPage = new CreateCommentPage()
const createVotePage = new CreateVotePage()


describe("USER RATINGS", function () {
  this.timeout(60000)

  let initialRating;
  let newRating;
  let initialRatingPlace;
  let newRatingPlace;
  let commentId;
  let replyId;
  let postVoteId;
  let commentVoteId;


  before('Get test user data', async function () {
    require('../MainTests/create_test_users')
    //Creating a new user so that we can track the change in rating place as it is initially 0
    await userPage.SignUp()
    await userPage.CreateUser(await userData.username.positiveData.regularUsername(), userData.profileName.positiveData.shortName)
  })

  beforeEach('Get ratings data', async function () {
    initialRatingPlace = await userPage.GetUserRatingPlace(Variables.global.userId, Variables.global.accessToken)
    initialRating = await userPage.GetUserRating(Variables.testUsers.user1.userId)
  })

  it('[C1646] Positive: Own votes on own posts and comments not being counted in ratings', async () => {
    postVoteId = await createVotePage.CreateVote(voteData.voteTarget.post, voteData.voteType.upvote, Variables.testUsers.user1.postId)
    commentId = await createCommentPage.CreateComment(Variables.testUsers.user2.postId, "I like it", false, Variables.testUsers.user1.accessToken)
    commentVoteId = await createVotePage.CreateVote(voteData.voteTarget.comment, voteData.voteType.upvote, commentId)
    newRating = await userPage.GetUserRating(Variables.testUsers.user1.userId)
    softAssertion.softTrue(initialRating === newRating, "Rating did not change")
    await createCommentPage.DeleteComment(commentId)
    await createVotePage.DeleteVote(postVoteId)
    softAssertion.softAssertAll()
  });

  it('[C1647] Positive: Other user upvote on my post increases my accumulated ratings and goes back to initial when removed', async () => {
    postVoteId = await createVotePage.CreateVote(voteData.voteTarget.post, voteData.voteType.upvote, Variables.testUsers.user1.postId, Variables.testUsers.user2.accessToken)
    newRating = await userPage.GetUserRating(Variables.testUsers.user1.userId)
    softAssertion.softTrue(newRating === initialRating + 1, "Rating increased from upvote")
    await createVotePage.DeleteVote(postVoteId, Variables.testUsers.user2.accessToken)
    newRating = await userPage.GetUserRating(Variables.testUsers.user1.userId)
    softAssertion.softTrue(newRating === initialRating, "Rating equals to initial after upvote is removed")
    softAssertion.softAssertAll()
  });

  it('[C1648] Positive: Other user downvote on my comment under another user post decreases my accumulated ratings and goes back to initial when removed', async () => {
    commentId = await createCommentPage.CreateComment(Variables.testUsers.user2.postId, "I like it", false, Variables.testUsers.user1.accessToken)
    commentVoteId = await createVotePage.CreateVote(voteData.voteTarget.comment, voteData.voteType.downvote, commentId, Variables.testUsers.user2.accessToken)
    newRating = await userPage.GetUserRating(Variables.testUsers.user1.userId)
    softAssertion.softTrue(newRating === initialRating - 1, "Rating decreased from downvote")
    await createCommentPage.DeleteComment(commentId)
    newRating = await userPage.GetUserRating(Variables.testUsers.user1.userId)
    softAssertion.softTrue(newRating === initialRating, "Rating equals to initial after downvote is removed")
    softAssertion.softAssertAll()
  });

  it('[C1649] Positive: Other user upvote on my comment under my post increases my accumulated ratings and goes back to initial when removed', async () => {
    commentId = await createCommentPage.CreateComment(Variables.testUsers.user1.postId, "I like my post", false, Variables.testUsers.user1.accessToken)
    commentVoteId = await createVotePage.CreateVote(voteData.voteTarget.comment, voteData.voteType.upvote, commentId, Variables.testUsers.user2.accessToken)
    newRating = await userPage.GetUserRating(Variables.testUsers.user1.userId)
    softAssertion.softTrue(newRating === initialRating + 1, "Rating increased from upvote")
    await createCommentPage.DeleteComment(commentId)
    newRating = await userPage.GetUserRating(Variables.testUsers.user1.userId)
    softAssertion.softTrue(newRating === initialRating, "Rating equals to initial after upvote is removed")
    softAssertion.softAssertAll()
  });
  //
  // Open this test when https://post-inc.atlassian.net/browse/PST-1160 is fixed
  // it('[C1650] Positive: Other user upvote on my reply under another user post increases my accumulated ratings and goes back to initial when removed', async () => {
  //   commentId = await createCommentPage.CreateComment(Variables.testUsers.user2.postId, "I like my post", false, Variables.testUsers.user2.accessToken)
  //   replyId = await createCommentPage.CreateComment(Variables.testUsers.user2.postId, "I like your comment", commentId, Variables.testUsers.user1.accessToken)
  //   commentVoteId = await createVotePage.CreateVote(voteData.voteTarget.comment, voteData.voteType.upvote, replyId, Variables.testUsers.user2.accessToken)
  //   newRating = await userPage.GetUserRating(Variables.testUsers.user1.userId)
  //   console.log(newRating, initialRating, "+1")
  //   softAssertion.softTrue(newRating === initialRating + 1, "Rating increased from upvote")
  //   await createCommentPage.DeleteComment(commentId, Variables.testUsers.user2.accessToken)
  //   newRating = await userPage.GetUserRating(Variables.testUsers.user1.userId)
  //   console.log(newRating, initialRating, "equal")
  //   softAssertion.softTrue(newRating === initialRating, "Rating equals to initial after upvote is removed")
  //   softAssertion.softAssertAll()
  // });

  it('[C1651] Positive: Increase in rating increases the rank while decrease in rating decreases the rank', async () => {
    commentId = await createCommentPage.CreateComment(Variables.testUsers.user1.postId, "I like it", false, Variables.global.accessToken)
    commentVoteId = await createVotePage.CreateVote(voteData.voteTarget.comment, voteData.voteType.upvote, commentId, Variables.testUsers.user1.accessToken)
    newRatingPlace = await userPage.GetUserRatingPlace(Variables.global.userId, Variables.global.accessToken)
    softAssertion.softTrue(newRatingPlace < initialRatingPlace, "Rating place increased from upvote")
    await createCommentPage.DeleteComment(commentId, Variables.global.accessToken)
    newRatingPlace = await userPage.GetUserRatingPlace(Variables.global.userId, Variables.global.accessToken)
    softAssertion.softTrue(newRatingPlace >= initialRatingPlace, "Rating place back to where it was from removed upvote")
    softAssertion.softAssertAll()
  });

  it('[C1652] Positive: Blocking from both sides does not affect the ratings count if user 1 has any votes from user 2', async () => {
    commentId = await createCommentPage.CreateComment(Variables.testUsers.user2.postId, "I like it", false, Variables.testUsers.user1.accessToken)
    commentVoteId = await createVotePage.CreateVote(voteData.voteTarget.comment, voteData.voteType.upvote, commentId, Variables.testUsers.user2.accessToken)
    newRating = await userPage.GetUserRating(Variables.testUsers.user1.userId)
    softAssertion.softTrue(newRating === initialRating + 1, "Rating increased from upvote")
    await userPage.BlockProfile(Variables.testUsers.user2.userId, Variables.testUsers.user1.userId, Variables.testUsers.user1.accessToken)
    await userPage.BlockProfile(Variables.testUsers.user1.userId, Variables.testUsers.user2.userId, Variables.testUsers.user2.accessToken)
    let ratingAfterBlock = await userPage.GetUserRating(Variables.testUsers.user1.userId)
    softAssertion.softTrue(newRating === ratingAfterBlock, "Rating after block does not change")
    await createCommentPage.DeleteComment(commentId)
    await userPage.UnblockProfile(Variables.testUsers.user2.userId, Variables.testUsers.user1.userId, Variables.testUsers.user1.accessToken)
    await userPage.UnblockProfile(Variables.testUsers.user1.userId,Variables.testUsers.user2.userId, Variables.testUsers.user2.accessToken)
    softAssertion.softAssertAll()
  });

  after('Delete newly created user', async function () {
    await userPage.DeleteUser()
  })
})

//CASES WITH SELLABLE POSTS NEED TO BE HANDLED IN CASE THERE IS AN OPTIONS TO CREATE AND SELL SELLABLES IN AUTOTESTS
// - user ratings are counted both for creator and new owner...the ratings received later count only to the owner (not sure needs to be verified)

//THERE IS AN EDGE CASE THAT MIGHT NEED TO BE HANDLES, IT'S WHEN THE USER HAS MORE DOWNVOTE THAN UPVOTES AND HIS RATING IS SHOWN 0
// EVEN IF HE GETS AN UPVOTE BECAUSE THE RATINGS DOES NOT SHOW THE NEGATIVE NUMBERS