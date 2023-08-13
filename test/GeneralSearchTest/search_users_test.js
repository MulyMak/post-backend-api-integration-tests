import BasePage from "../../pages/base_page"
import Variables from "../../variabels/variables";

const basePage = new BasePage()

describe("SEARCH USERS", function () {
  this.timeout(60000)

  before('Get test user data', async function () {
    require('../MainTests/create_test_users')
  })

  it('[C1723] Positive: Search for users in general search with min 3 chars', async () => {
    await basePage.SearchForUsersWithValidations("tes")
  });

  it('[C1724] Positive: Search for users in general search with numbers', async () => {
    await basePage.SearchForUsersWithValidations("user2")
  });

  it('[C1725] Positive: Search a non-existing username/name', async () => {
    await basePage.SearchForUsersWithValidations("nonexistingusernameornamefortest")
  });

  it('[C1726] Positive: Search for myself', async () => {
    await basePage.SearchForUsersWithValidations(Variables.testUsers.user1.username)
  });
})