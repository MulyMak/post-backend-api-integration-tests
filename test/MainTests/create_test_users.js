import BasePage from "../../pages/base_page";
import userData from "../../static/user_data";
import Variables from "../../variabels/variables"


const basePage = new BasePage()

describe('GET TEST USERS', function () {
  this.timeout(6000)

  it('[C1609] Sign in existing test users', async () => {
    await basePage.SignIn(userData.testUsersCredentials.user1, 1)
    await basePage.GetUserIdViaAuthDetails(Variables.testUsers.user1.accessToken, 1)
    await basePage.SignIn(userData.testUsersCredentials.user2, 2)
    await basePage.GetUserIdViaAuthDetails(Variables.testUsers.user2.accessToken, 2)
  })
})
