import postData from "../../static/post_data"
import CreateVotePage from "../../pages/vote_page"
import CreatePostPage from "../../pages/post_page";
import userData from "../../static/user_data";
import voteData from "../../static/vote_data";


const createVotePage = new CreateVotePage()
const createPostPage = new CreatePostPage()

describe("UPVOTE / DOWNVOTE", function () {
  this.timeout(60000)

  before('Create a new user and new post', async function () {
    await createVotePage.SignUp()
    await createVotePage.CreateUser(await userData.username.positiveData.regularUsername())
    createPostPage.ChangePostData(postData.postBodyData.positiveData.imageAndText)
    await createPostPage.CreatePostWithValidData()
    await createVotePage.GetExistingPostId()
    await createVotePage.GetExistingRepostId()
    await createVotePage.GetExistingCommentId()
    await createVotePage.GetExistingCommentReplyId()
  })

  it('[C1712] Positive: Upvote own post, update vote then delete it', async () => {
    createVotePage.ChangeVoteData(voteData.voteBodyData.positiveData.upvoteOwnPost)
    await createVotePage.CreateVoteWithValidData()
    await createVotePage.UpdateVoteWithValidations(voteData.voteType.downvote)
    await createVotePage.DeleteVoteWithValidations()
  });

  it('[C1713] Positive: Downvote own post, delete vote then upvote the same post', async () => {
    createVotePage.ChangeVoteData(voteData.voteBodyData.positiveData.downvoteOwnPost)
    await createVotePage.CreateVoteWithValidData()
    await createVotePage.DeleteVoteWithValidations()
    createVotePage.ChangeVoteData(voteData.voteBodyData.positiveData.upvoteOwnPost)
    await createVotePage.CreateVoteWithValidData()
  });

  it('[C1714] Positive: Upvote other user post, update vote then delete it', async () => {
    createVotePage.ChangeVoteData(voteData.voteBodyData.positiveData.upvoteOtherPost)
    await createVotePage.CreateVoteWithValidData()
    await createVotePage.UpdateVoteWithValidations(voteData.voteType.downvote)
    await createVotePage.DeleteVoteWithValidations()
  });

  it('[C1715] Positive: Upvote other user comment', async () => {
    createVotePage.ChangeVoteData(voteData.voteBodyData.positiveData.upvoteOtherComment)
    await createVotePage.CreateVoteWithValidData()
  });

  it('[C1716] Positive: Downvote other user comment reply then update vote', async () => {
    createVotePage.ChangeVoteData(voteData.voteBodyData.positiveData.downvoteOtherCommentReply)
    await createVotePage.CreateVoteWithValidData()
    await createVotePage.UpdateVoteWithValidations(voteData.voteType.upvote)
  });

  it('[C1717] Negative: Send Create Post request twice', async () => {
    createVotePage.ChangeVoteData(voteData.voteBodyData.positiveData.upvoteOtherPost)
    await createVotePage.CreateVoteWithValidData()
    createVotePage.ChangeVoteData(voteData.voteBodyData.positiveData.downvoteOtherPost)
    await createVotePage.CreateVoteWithInvalidData()
  });

  it('[C1718] Negative: Create vote with invalid target', async () => {
    createVotePage.ChangeVoteData(voteData.voteBodyData.negativeData.invalidTarget)
    await createVotePage.CreateVoteWithInvalidData()
  });

  it('[C1719] Negative: Create vote with invalid type', async () => {
    createVotePage.ChangeVoteData(voteData.voteBodyData.negativeData.invalidType)
    await createVotePage.CreateVoteWithInvalidData()
  });

  it('[C1720] Negative: Create post vote with comment ID', async () => {
    createVotePage.ChangeVoteData(voteData.voteBodyData.negativeData.commentIdForPost)
    await createVotePage.CreateVoteWithInvalidData()
  });

  it('[C1721] Negative: Create comment vote with post ID', async () => {
    createVotePage.ChangeVoteData(voteData.voteBodyData.negativeData.postIdForComment)
    await createVotePage.CreateVoteWithInvalidData()
  });

  it('[C1722] Negative: Vote a repost', async () => {
    createVotePage.ChangeVoteData(voteData.voteBodyData.negativeData.upvoteRepost)
    await createVotePage.CreateVoteWithInvalidData()
  });

  afterEach('Delete Vote', async () => {
    await createVotePage.DeleteVoteWithValidations()
  })

  after('Delete User', async function () {
    await createPostPage.DeletePost(postData.postType.regular)
    await createVotePage.DeleteUser()
  })
})