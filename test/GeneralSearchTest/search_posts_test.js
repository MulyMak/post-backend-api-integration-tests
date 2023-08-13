import BasePage from "../../pages/base_page"

const basePage = new BasePage()

describe("SEARCH POSTS", function () {
  this.timeout(60000)

  before('Get test user data', async function () {
    require('../MainTests/create_test_users')
  })

  it('[C1727] Positive: Search for posts in general search with min 3 chars', async () => {
    await basePage.SearchForPostsWithValidations("tes")
  });

  it('[C1728] Positive: Search for posts in general search with numbers', async () => {
    await basePage.SearchForPostsWithValidations("123")
  });

  //WILL NEED TO OPEN THESE TESTS WHEN THEY DECIDE TO FIX THE SEARCH OF OWN POSTS, NO BUG YET
  // it('[C1729] Positive: Search for my post', async () => {
  //   await basePage.SearchForPostsWithValidations("test post 1")
  // });
  //
  // it('[C1893] Positive: Search for my repost', async () => {
  //   await basePage.SearchForPostsWithValidations("test repost")
  // });

  it('[C1730] Positive: Search a non-existing post', async () => {
    await basePage.SearchForPostsWithValidations("nonexistingpostfortest")
  });

})