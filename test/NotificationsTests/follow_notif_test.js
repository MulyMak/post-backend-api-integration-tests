const softAssertion = require('soft-assert')
import NotificationsPage from "../../pages/notifications_page"
import FollowPage from "../../pages/follow_page"
import notificationData from "../../static/notification_data"
import Variables from "../../variabels/variables";


const notificationsPage = new NotificationsPage()
const followPage = new FollowPage()

describe("FOLLOW USER NOTIFICATIONS", function () {
  this.timeout(60000)


  before('Get test user data', async function () {
    require('../MainTests/create_test_users')
  })
  it('[C1731] Positive: Follow user notification', async () => {
    await notificationsPage.GetUserNotificationsCount()
    await followPage.FollowUser(Variables.testUsers.user1.userId, Variables.testUsers.user2.userId, Variables.testUsers.user2.accessToken)
    await notificationsPage.ValidateNotificationsCount(1)
    await notificationsPage.GetUserNotifications()
    await notificationsPage.ValidateFollowNotifications(notificationData.notificationType.follow, Variables.testUsers.user2.userId, Variables.testUsers.user2.username)
    softAssertion.softAssertAll()
  });
  it('[C1732] Positive: No notification for unfollow', async () => {
    await notificationsPage.GetUserNotificationsCount()
    await followPage.UnfollowUser(Variables.testUsers.user1.userId, Variables.testUsers.user2.userId, Variables.testUsers.user2.accessToken)
    await notificationsPage.ValidateNotificationsCount(0)
    let notifs = await notificationsPage.GetUserNotifications()
    //ADD CHECKING THAT THE NOTIF IS READ CAN ADD AFTER MARK AS VIEWED IS IN PLACE
    softAssertion.softTrue(!notifs[0].content.type.includes("UNFOLLOWED"), 'Notification for unfollow is not received')
    softAssertion.softAssertAll()
  });
})