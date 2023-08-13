import postData from "../../static/post_data"
import CreatePostPage from '../../pages/post_page'
import userData from "../../static/user_data";
import mediaData from "../../static/media_data";
import Variables from "../../variabels/variables"


const createPostPage = new CreatePostPage()

describe("CREATE A REPOST", function () {
  this.timeout(60000)

  before('Create a new user', async function () {
    await createPostPage.SignUp()
    await createPostPage.CreateUser(await userData.username.positiveData.regularUsername())
    await createPostPage.GetExistingPostId()
  })

  it('Positive: Create Repost with no text', async () => {
    createPostPage.ChangePostData(postData.postBodyData.positiveData.noTextRepost)
    await createPostPage.CreateRepostWithValidData()
  });

  it('Positive: Create Repost with 1 char', async () => {
    createPostPage.ChangePostData(postData.postBodyData.positiveData.minCharText)
    await createPostPage.CreateRepostWithValidData()
  });


  it('Positive: Create Repost with 5000 chars', async () => {
    createPostPage.ChangePostData(postData.postBodyData.positiveData.maxCharText)
    await createPostPage.CreateRepostWithValidData()
  });

  it('Negative: Repost my own post', async () => {
    createPostPage.ChangePostData(postData.postBodyData.positiveData.minCharText)
    await createPostPage.CreatePostWithValidData()
    createPostPage.ChangePostData(postData.postBodyData.positiveData.minCharText)
    await createPostPage.CreateRepostWithInvalidData(false, true)
  });

  it('Negative: Create Repost with 5001 chars', async () => {
    createPostPage.ChangePostData(postData.postBodyData.negativeData.moreThanAllowedCharsText)
    await createPostPage.CreateRepostWithInvalidData()
  });

  it('Negative: Create Repost with invalid body content (sending media data)', async () => {
    createPostPage.ChangePostData(postData.postBodyData.negativeData.imageAndText)
    await createPostPage.CreateRepostWithInvalidData()
  });

  it('Negative: Repost a repost', async () => {
    await createPostPage.GetExistingRepostId()
    createPostPage.ChangePostData(postData.postBodyData.positiveData.minCharText)
    await createPostPage.CreateRepostWithInvalidData(createPostPage.existingRepostId)
  });
  //
  it('Negative: Repost the same post twice', async () => {
    createPostPage.ChangePostData(postData.postBodyData.positiveData.minCharText)
    await createPostPage.CreateRepostWithValidData()
    await createPostPage.CreateRepostWithInvalidData()
  });


  afterEach('Delete Repost', async () => {
    await createPostPage.DeletePost(postData.postType.repost)
  })

  after('Delete User', async function () {
    await createPostPage.DeletePost(postData.postType.regular)
    await createPostPage.DeleteUser()
  })
})


