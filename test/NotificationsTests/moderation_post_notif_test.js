import CreatePostPage from "../../pages/post_page";
import globalHelpers from "./../../helpers/globalHelpers"

const softAssertion = require('soft-assert')
import NotificationsPage from "../../pages/notifications_page"
import notificationData from "../../static/notification_data"
import postData from "../../static/post_data";

const notificationsPage = new NotificationsPage()
const createPostPage = new CreatePostPage()


describe("MODERATION POST NOTIFICATIONS", function () {
  this.timeout(60000)

  let postId = ""
  let notifications = {}
  let newNotifId = []

  before('Get test user data', async function () {
    require('../MainTests/create_test_users')
  })

  beforeEach('Get user notifications count', async function () {
    await notificationsPage.GetUserNotificationsCount()
  })

  it('[C1748] Positive: Notification of an image post not passing moderation', async () => {
    createPostPage.ChangePostData(postData.postBodyData.positiveData.moderationImage)
    postId = await createPostPage.CreatePost()
    await globalHelpers.sleep(10000)
    await notificationsPage.ValidateNotificationsCount(1)
    notifications = await notificationsPage.GetUserNotifications()
    newNotifId.push(notifications[0].id)
    await notificationsPage.ValidateModerationNotification(notificationData.notificationType.moderation, postId)
    softAssertion.softAssertAll()
  })

  it('[C1749] Positive: Notification of a video post not passing moderation', async () => {
    createPostPage.ChangePostData(postData.postBodyData.positiveData.moderationVideo)
    postId = await createPostPage.CreatePost()
    await globalHelpers.sleep(20000)
    await notificationsPage.ValidateNotificationsCount(1)
    notifications = await notificationsPage.GetUserNotifications()
    newNotifId.push(notifications[0].id)
    await notificationsPage.ValidateModerationNotification(notificationData.notificationType.moderation, postId)
    softAssertion.softAssertAll()
})

  afterEach("Mark notification as seen", async function () {
    await notificationsPage.MarkNotificationAsViewed(newNotifId)

  });
})