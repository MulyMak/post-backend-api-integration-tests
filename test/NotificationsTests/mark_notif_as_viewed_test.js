import NotificationsPage from "../../pages/notifications_page"

const notificationsPage = new NotificationsPage()

describe("MARK NOTIFICATIONS AS VIEWED", function () {
  this.timeout(60000)

  let notViewedNotifs = {}
  let singleNotifId = []
  let multipleNotifIds = []

  before('Get test user data', async function () {
    require('../MainTests/create_test_users')
  })

  beforeEach(('Get not viewed notifications'), async function () {
    notViewedNotifs = await notificationsPage.GetNotViewedNotifications(3)
    //IN CASE THE TEST FAILS BECAUSE OF THIS HOOK MAKE SURE YOU INDEED HAVE NOT VIEWED NOTIFS ON THE PAGE OF NOTIFS REQUESTED IN THE REQUEST BODY
  })

  it('[C1746] Positive: Mark single notif as viewed', async () => {
    await notificationsPage.GetUserNotificationsCount()
    singleNotifId.push(notViewedNotifs[0].id)
    await notificationsPage.MarkNotificationAsViewed(singleNotifId)
    await notificationsPage.ValidateNotificationsCount(1, true)
    await notificationsPage.ValidateMarkedAsViewedNotifs(singleNotifId)
  });

  it('[C1747] Positive: Mark several notifs as viewed', async () => {
    await notificationsPage.GetUserNotificationsCount()
    multipleNotifIds.push(notViewedNotifs[0].id, notViewedNotifs[1].id, notViewedNotifs[2].id)
    await notificationsPage.MarkNotificationAsViewed(multipleNotifIds)
    await notificationsPage.ValidateNotificationsCount(3, true)
    await notificationsPage.ValidateMarkedAsViewedNotifs(multipleNotifIds)
  });
})