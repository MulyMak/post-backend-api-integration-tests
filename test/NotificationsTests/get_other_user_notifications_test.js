import NotificationsPage from "../../pages/notifications_page"
import Variables from "../../variabels/variables";


const notificationsPage = new NotificationsPage()

describe("GET ANOTHER USER NOTIFICATIONS", function () {
  this.timeout(60000)


  before('Get test user data', async function () {
    require('../MainTests/create_test_users')
  })

  it('[C1738] Negative: Getting another user notifications', async () => {
    await notificationsPage.GetUserNotificationsWithInvalidData(Variables.testUsers.user2.userId, Variables.testUsers.user1.accessToken)
  });
})