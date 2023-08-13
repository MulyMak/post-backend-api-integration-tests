import CreatePostPage from '../../pages/post_page'
import userData from "../../static/user_data";

const createPostPage = new CreatePostPage()


//THIS TEST NEEDS TO BE DISCUSSED AND CHANGES AS THE WAY FEED WORKS NOW HAS CHANGED, NOT RETURNING THE SAME POSTS EACH TIME



describe("MARK POSTS AS VIEWED", function () {
  this.timeout(60000)

  before('Create a new user', async function () {
    await createPostPage.SignUp()
    await createPostPage.CreateUser(await userData.username.positiveData.regularUsername())
  })

  it('Positive: Get Feed and Mark Posts as Seen', async () => {
    //Mark as many posts you want to mar viewed, not setting any number marks all the posts from the Feed you get the 1st time as viewed
    await createPostPage.GetFeed(5)
    await createPostPage.MarkPostAsViewed(3)
    await createPostPage.ValidateFeedAfterPostsMarkedViewed(5)
  });

  after('Delete User', async function () {
    await createPostPage.DeleteUser()
  })
})