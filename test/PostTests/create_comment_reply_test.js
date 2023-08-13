import postData from "../../static/post_data"
import CreateCommentPage from "../../pages/comment_page"
import CreatePostPage from "../../pages/post_page";
import userData from "../../static/user_data";
import commentData from "../../static/comment_data"
import textData from "../../static/general_data"
import Variables from "../../variabels/variables";


const createCommentPage = new CreateCommentPage()
const createPostPage = new CreatePostPage()

describe("COMMENT / REPLY", function () {
  this.timeout(60000)

  before('Create a new user and new post', async function () {
    require('../MainTests/create_test_users')
    await createCommentPage.SignUp()
    await createCommentPage.CreateUser(await userData.username.positiveData.regularUsername())
    createPostPage.ChangePostData(postData.postBodyData.positiveData.imageAndText)
    await createPostPage.CreatePostWithValidData()
    await createCommentPage.GetExistingPostId()
    await createCommentPage.GetExistingRepostId()
    await createCommentPage.GetExistingCommentId()
    await createCommentPage.GetExistingCommentReplyId()
  })

  it('[C1697] Positive: Create first level comment for own post and update it', async () => {
    createCommentPage.ChangeCommentData(commentData.commentBodyData.positiveData.commentOwnPost)
    await createCommentPage.CreateCommentWithValidData()
    await createCommentPage.UpdateComment(textData.randomText.positiveData.shortText())
  });

  it('[C1698] Positive: Create first level comment with 1 char', async () => {
    createCommentPage.ChangeCommentData(commentData.commentBodyData.positiveData.commentMinChar)
    await createCommentPage.CreateCommentWithValidData()
  });

  it('[C1699] Positive: Create reply to comment with 5000 chars', async () => {
    createCommentPage.ChangeCommentData(commentData.commentBodyData.positiveData.replyToCommentMaxChar)
    await createCommentPage.CreateCommentWithValidData()
  });

  it('[C1700] Positive: Create reply to reply', async () => {
    createCommentPage.ChangeCommentData(commentData.commentBodyData.positiveData.replyToReply)
    await createCommentPage.CreateCommentWithValidData()
  });

  it('[C1701] Positive: Delete other user comment under my own post', async () => {
    await createCommentPage.CreateComment(Variables.testUsers.user1.postId, "I like your post", false, Variables.testUsers.user2.accessToken)
    await createCommentPage.DeleteComment(false, Variables.testUsers.user1.accessToken)
  });

  it('[C1702] Positive: Deleting comment deletes its replies', async () => {
    let commentId = await createCommentPage.CreateComment(Variables.testUsers.user1.postId, "I like your post", false, Variables.testUsers.user2.accessToken)
    let replyId = await createCommentPage.CreateComment(Variables.testUsers.user1.postId, "I like your post", commentId, Variables.testUsers.user1.accessToken)
    await createCommentPage.DeleteComment(commentId, Variables.testUsers.user1.accessToken)
    await createCommentPage.GetDeletedComment(replyId, Variables.testUsers.user1.accessToken)
  });

  it('[C1703] Negative: Create comment with 5001 chars', async () => {
    createCommentPage.ChangeCommentData(commentData.commentBodyData.negativeData.moreThanAllowedChars)
    await createCommentPage.CreateCommentWithInvalidData()
  });

  it('[C1704] Negative: Create comment with no text', async () => {
    createCommentPage.ChangeCommentData(commentData.commentBodyData.negativeData.noTextComment)
    await createCommentPage.CreateCommentWithInvalidData()
  });

  it('[C1705] Negative: Create comment for a repost', async () => {
    createCommentPage.ChangeCommentData(commentData.commentBodyData.negativeData.commentRepost)
    await createCommentPage.CreateCommentWithInvalidData()
  });

  it('[C1706] Negative: Create comment with invalid post id', async () => {
    createCommentPage.ChangeCommentData(commentData.commentBodyData.negativeData.invalidPostIdComment)
    await createCommentPage.CreateCommentWithInvalidData()
  });

  it('[C1707] Negative: Create reply with invalid parent id', async () => {
    createCommentPage.ChangeCommentData(commentData.commentBodyData.negativeData.invalidParentIdReply)
    await createCommentPage.CreateCommentWithInvalidData()
  });

  it('[C1708] Negative: Create comment with no post id', async () => {
    createCommentPage.ChangeCommentData(commentData.commentBodyData.negativeData.noPostIdComment)
    await createCommentPage.CreateCommentWithInvalidData()
  });

  it('[C1709] Negative: Update comment to 5001 char text', async () => {
    createCommentPage.ChangeCommentData(commentData.commentBodyData.positiveData.commentMinChar)
    await createCommentPage.CreateCommentWithValidData()
    await createCommentPage.UpdateComment(textData.randomText.negativeData.invalidText5001Chars())
  });

  it('[C1710] Negative: Update reply to no text', async () => {
    createCommentPage.ChangeCommentData(commentData.commentBodyData.positiveData.replyToCommentMaxChar)
    await createCommentPage.CreateCommentWithValidData()
    await createCommentPage.UpdateComment("")
  });

  it('[C1711] Negative: Delete other user comment under another user post', async () => {
    await createCommentPage.CreateComment(Variables.testUsers.user2.postId, "I like your post", false, Variables.testUsers.user2.accessToken)
    await createCommentPage.DeleteCommentForbidden(false, Variables.testUsers.user1.accessToken)
  });

  afterEach('Delete Comment', async () => {
    await createCommentPage.DeleteCommentWithValidations()
  })

  after('Delete User', async function () {
    await createPostPage.DeletePost(postData.postType.regular)
    await createCommentPage.DeleteUser()
  })
})