import postData from "../../static/post_data"
import CreatePostPage from '../../pages/post_page'
import userData from "../../static/user_data";
import Variables from '../../variabels/variables';

const createPostPage = new CreatePostPage()


describe("UPDATE A POST", function () {
  this.timeout(600000)

  before('Create a new user and new post', async function () {
    await createPostPage.SignUp()
    await createPostPage.CreateUser(await userData.username.positiveData.regularUsername())
    createPostPage.ChangePostData(postData.postBodyData.positiveData.imageAndText)
    await createPostPage.CreatePostWithValidData()
  })

  it('[C1676] Positive: Update media post to have no text but media', async () => {
    createPostPage.ChangePostData(postData.postBodyData.positiveData.singleImage)
    await createPostPage.UpdatePostWithValidData()
  });

  it('[C1677] Positive: Update post to have 5000 char text and no media', async () => {
    createPostPage.ChangePostData(postData.postBodyData.positiveData.maxCharText)
    await createPostPage.UpdatePostWithValidData()
  });

  it('[C1678] Positive: Update media post adding a media', async () => {
    createPostPage.ChangePostData(postData.postBodyData.positiveData.imageAndText)
    await createPostPage.UpdatePostWithValidData()
  });

  it('[C1679] Positive: Update post to have user mention', async () => {
    await createPostPage.GetExistingUserIds(1, Variables.global.userId, Variables.global.accessToken)
    createPostPage.ChangePostData(postData.postBodyData.positiveData.singleUserMention)
    await createPostPage.UpdatePostWithValidData()
  });

  it('[C1680] Negative: Update post to have 5001 char text', async () => {
    createPostPage.ChangePostData(postData.postBodyData.negativeData.moreThanAllowedCharsText)
    await createPostPage.UpdatePostWithInvalidData()
  });

  it('[C1681] Negative: Update post to have more than allowed file count (more than 5)', async () => {
    createPostPage.ChangePostData(postData.postBodyData.negativeData.moreThanAllowedFileCount)
    await createPostPage.UpdatePostWithInvalidData()
  });

  it('[C1682] Negative: Update post to have neither text nor media', async () => {
    createPostPage.ChangePostData(postData.postBodyData.negativeData.noTextNoMedia)
    await createPostPage.UpdatePostWithInvalidData()
  });

  it('[C1683] Negative: Update post with missing position in media order', async () => {
    createPostPage.ChangePostData(postData.postBodyData.negativeData.invalidPositionMedia)
    await createPostPage.UpdatePostWithInvalidData()
  });

  it('[C1684] Negative: Update post to have invalid user mention', async () => {
    createPostPage.ChangePostData(postData.postBodyData.negativeData.invalidUserMention)
    await createPostPage.UpdatePostWithInvalidData()
  });

  after('Delete User', async function () {
    await createPostPage.DeletePost(postData.postType.regular)
    await createPostPage.DeleteUser()
  })
})