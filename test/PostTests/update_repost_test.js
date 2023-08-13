import postData from "../../static/post_data"
import CreatePostPage from '../../pages/post_page'
import userData from "../../static/user_data";

const createPostPage = new CreatePostPage()

describe("UPDATE A REPOST", function () {
    this.timeout(60000)

    before('Create a new user', async function () {
        await createPostPage.SignUp()
        await createPostPage.CreateUser(await userData.username.positiveData.regularUsername())
        await createPostPage.GetExistingPostId()
        createPostPage.ChangePostData(postData.postBodyData.positiveData.minCharText)
        await createPostPage.CreateRepostWithValidData()
    })

    it('[C1693] Positive: Update Repost to have no text', async () => {
        createPostPage.ChangePostData(postData.postBodyData.positiveData.noTextRepost)
        await createPostPage.UpdateRepostWithValidData()
    });

    it('[C1694] Positive: Update Repost to have 5000 char text', async () => {
        createPostPage.ChangePostData(postData.postBodyData.positiveData.maxCharText)
        await createPostPage.UpdateRepostWithValidData()
    });

    it('[C1695] Negative: Update Repost to have 5001 char text', async () => {
        createPostPage.ChangePostData(postData.postBodyData.negativeData.moreThanAllowedCharsText)
        await createPostPage.UpdateRepostWithInvalidData()
    });

    it('[C1696] Negative: Update Repost to have invalid content', async () => {
        createPostPage.ChangePostData(postData.postBodyData.negativeData.imageAndText)
        await createPostPage.UpdateRepostWithInvalidData()
    });

    after('Delete User', async function () {
        await createPostPage.DeletePost(postData.postType.repost)
        await createPostPage.DeleteUser()
    })


})