import postData from "../../static/post_data"
import CreatePostPage from '../../pages/post_page'
import userData from "../../static/user_data";
import mediaData from "../../static/media_data"
import Variables from "../../variabels/variables";


const createPostPage = new CreatePostPage()


describe("CREATE A POST", function () {
  this.timeout(600000)

  before('Create a new user', async function () {
    require('../MainTests/create_test_users')
    await createPostPage.SignUp()
    await createPostPage.CreateUser(await userData.username.positiveData.regularUsername())
  })

  beforeEach('Clear Post Id Value in Global Variables', async () => {
    const vars = {
      postId: ''
    }
    Variables.changeVariables(vars)
  })

  it('[C1658] Positive: Create Only Text Post with 1 char', async () => {
    createPostPage.ChangePostData(postData.postBodyData.positiveData.minCharText)
    await createPostPage.CreatePostWithValidData()
  });

  it('[C1659] Positive: Create Only Text Post with 5000 chars', async () => {
    createPostPage.ChangePostData(postData.postBodyData.positiveData.maxCharText)
    await createPostPage.CreatePostWithValidData()
  });

  it('[C1660] Positive: Create Text and Single Image post', async () => {
    createPostPage.ChangePostData(postData.postBodyData.positiveData.imageAndText)
    await createPostPage.CreatePostWithValidData()
  });

  it('[C1661] Positive: Create Single Video Post with 1 media', async () => {
    createPostPage.ChangePostData(postData.postBodyData.positiveData.singleVideo)
    await createPostPage.CreatePostWithValidData()
  });

  it('[C1662] Positive: Create Only Image Post with 5 media', async () => {
    createPostPage.ChangePostData(postData.postBodyData.positiveData.maxImages)
    await createPostPage.CreatePostWithValidData()
  });

  it('[C1663] Positive: Create Only Video Post with 5 media', async () => {
    createPostPage.ChangePostData(postData.postBodyData.positiveData.maxVideos)
    await createPostPage.CreatePostWithValidData()
  });

  it('[C1664] Positive: Create Mixed Media Post', async () => {
    createPostPage.ChangePostData(postData.postBodyData.positiveData.mixedFiles)
    await createPostPage.CreatePostWithValidData()
  });


  it('[C1665] Positive: Create Post with single user mention', async () => {
    await createPostPage.GetExistingUserIds(1, Variables.global.userId, Variables.global.accessToken)
    createPostPage.ChangePostData(postData.postBodyData.positiveData.singleUserMention)
    await createPostPage.CreatePostWithValidData()
  });

  it('[C1666] Positive: Create Post with multiple user mention', async () => {
    await createPostPage.GetExistingUserIds(6, Variables.global.userId, Variables.global.accessToken)
    createPostPage.ChangePostData(postData.postBodyData.positiveData.multipleUserMention)
    await createPostPage.CreatePostWithValidData()
  });

  it('[C1667] Negative: Create Only Text Post with 5001 chars', async () => {
    createPostPage.ChangePostData(postData.postBodyData.negativeData.moreThanAllowedCharsText)
    await createPostPage.CreatePostWithInvalidData()
  })

  it('[C1668] Negative: Create Media Post with more than allowed file count (more than 5)', async () => {
    createPostPage.ChangePostData(postData.postBodyData.negativeData.moreThanAllowedFileCount)
    await createPostPage.CreatePostWithInvalidData()
  })

  it('[C1669] Negative: Create Post with missing position in media order', async () => {
    createPostPage.ChangePostData(postData.postBodyData.negativeData.invalidPositionMedia)
    await createPostPage.CreatePostWithInvalidData()
  })

  it('[C1670] Negative: Create Post with neither text nor media', async () => {
    createPostPage.ChangePostData(postData.postBodyData.negativeData.noTextNoMedia)
    await createPostPage.CreatePostWithInvalidData()
  })

  it('[C1671] Negative: Create Post with invalid user mention', async () => {
    createPostPage.ChangePostData(postData.postBodyData.negativeData.invalidUserMention)
    await createPostPage.CreatePostWithInvalidData()
  })

  it('[C1672] Negative: Create Post with another user media', async () => {
    createPostPage.ChangePostData(postData.postBodyData.negativeData.anotherUserMedia)
    await createPostPage.CreatePostWithInvalidData(false, Variables.testUsers.user1.accessToken)
  })

  it('[C1673] Negative: Create multi-media Post with the same media', async () => {
    let mediaId = await createPostPage.UploadMedia(mediaData.fileNames.image[0].name, mediaData.fileType.image, mediaData.fileNames.image[0].format)
    let data = {
      type: "REGULAR",
      text: "Test",
      mediaFiles: [
        {
          position: 1,
          mediaId,
        },
        {
          position: 2,
          mediaId,
        },
      ]
    }
    await createPostPage.CreatePostWithInvalidData(data)
  })

  it('[C1674] Negative: Create a second post using the media already in use', async () => {
    let mediaId = await createPostPage.UploadMedia(mediaData.fileNames.image[0].name, mediaData.fileType.image, mediaData.fileNames.image[0].format)
    let data = {
      type: "REGULAR",
      text: "Test",
      mediaFiles: [
        {
          position: 1,
          mediaId,
        }
      ]
    }
    await createPostPage.CreatePost(Variables.global.accessToken, data)
    await createPostPage.CreatePostWithInvalidData(data)
  })

  it('[C1675] Negative: Delete another user post (random type)', async () => {
    await createPostPage.GetExistingPostId()
    await createPostPage.DeleteAnotherUserPostNegative(createPostPage.existingPostId)
  })

  afterEach('Delete Post', async () => {
    await createPostPage.DeletePost(postData.postType.regular)
  })

  after('Delete User', async function () {
    await createPostPage.DeleteUser()
  })
})


//should I use loop? if yes how to delete the created ones?
//yes create loop test for positive cases and here aslo make the negatives as loop both for post
// and repost like did for profile no matter that there is only 1 negative case now Tiko says no need for loop but I think it might be better
//update another user post