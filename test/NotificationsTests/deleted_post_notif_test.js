import NotificationsPage from "../../pages/notifications_page"
import CreatePostPage from "../../pages/post_page";
import CreateCommentPage from "../../pages/comment_page";
const softAssertion = require('soft-assert')
import Variables from "../../variabels/variables";
import postData from "../../static/post_data";
import mediaData from "../../static/media_data";

const notificationsPage = new NotificationsPage()
const createPostPage = new CreatePostPage()
const createCommentPage = new CreateCommentPage()


describe("DELETED POST NOTIFICATIONS", function () {
  this.timeout(60000)

  let mediaId;
  let postId;
  let commentId;
  let notifications = {}
  let newNotifId = []

  before('Get test user data', async function () {
    require('../MainTests/create_test_users')
  })

  beforeEach('Get user notifications count', async function () {
    await notificationsPage.GetUserNotificationsCount()
  })

  it('[C1750] Positive: Notification body updated when post is deleted', async () => {

    mediaId = await createPostPage.UploadMedia(mediaData.fileNames.image[0].name, mediaData.fileType.image, mediaData.fileNames.image[0].format, false, Variables.testUsers.user2.accessToken)
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
    postId = await createPostPage.CreatePost(Variables.testUsers.user2.accessToken, data)
    commentId = await createCommentPage.CreateComment(postId, "I like your post", false, Variables.testUsers.user1.accessToken)
    await createCommentPage.CreateComment(postId, "I like your comment", commentId, Variables.testUsers.user2.accessToken)
    notifications = await notificationsPage.GetUserNotifications()
    let notifBeforePostDeletion = notifications[0]
    softAssertion.softTrue(notifBeforePostDeletion.metadata.post.mediaFiles.length !== 0)
    await createPostPage.DeletePost(postData.postType.regular, postId, Variables.testUsers.user2.accessToken)
    notifications = await notificationsPage.GetUserNotifications()
    let notifAfterPostDeletion = notifications[0]
    softAssertion.softTrue(Object.keys(notifAfterPostDeletion.metadata).length === 0)
    softAssertion.softTrue(notifAfterPostDeletion.id === notifBeforePostDeletion.id)
    softAssertion.softAssertAll()
  })

  afterEach("Mark notification as seen", async function () {
    await notificationsPage.MarkNotificationAsViewed(newNotifId)

  });

})