import BasePage from "../../pages/base_page";

describe('AUTHENTICATION', () => {
  it('[C1610] Sign up, Sign in', async () => {
    const basePage = new BasePage()
    await basePage.SignUp()
    await basePage.SignIn()
  })
})
