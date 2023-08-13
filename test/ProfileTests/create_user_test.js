import userData from "../../static/user_data"
import UserPage from '../../pages/user_page'

const userPage = new UserPage()

describe("CREATE A USER", function () {
    this.timeout(60000)
    it('[C1611] Verify Profile is not Created', async () => {
        await userPage.SignUp()
        await userPage.VerifyProfileIsNotCreated()
        await userPage.AccessIsDenied()
    });

    it('[C1612] Positive: Create User with 3 chars & no profile name', async () => {
        await userPage.SignUp()
        await userPage.CreateUserWithPositiveData(await userData.username.positiveData.shortestUsername())
    })

    it('[C1613] Positive: Create User with 30 chars and 60 char profile name', async () => {
        await userPage.SignUp()
        await userPage.CreateUserWithPositiveData(await userData.username.positiveData.longestUsername(), userData.profileName.positiveData.longName)
    })

    it('[C1614] Positive: Create User with valid username and 1 char profile name', async () => {
        await userPage.SignUp()
        await userPage.CreateUserWithPositiveData(await userData.username.positiveData.regularUsername(), userData.profileName.positiveData.shortName)
    })

    it('[C1615] Negative: Creating a user with an existing username', async () => {
        await userPage.SignUp()
        await userPage.CreateUserWithPositiveData(await userData.username.positiveData.regularUsername())
        await userPage.GetExistingUsername()
        await userPage.CreateUserWithExistingUsername()
    })

    it('[C1616] Negative: Creating a user twice with same access credentials', async () => {
        await userPage.SignUp()
        await userPage.CreateUserWithPositiveData(await userData.username.positiveData.regularUsername(), userData.profileName.positiveData.shortName)
        await userPage.SendCreateUserRequestSecondTimeAfterSuccessfulUserCreation()

    })

    it('[C1617] Negative: Create User with valid username and invalid 61 char profile name', async () => {
        await userPage.SignUp()
        await userPage.CreateUserWithInvalidProfileNames()
    })

    it('[C1618] Negative: Create User with invalid usernames', async () => {
        await userPage.SignUp()
        await userPage.CreateUserWithInvalidUsernames()
    })

    it('[C1619] Negative: Create User without an access token', async () => {
        await userPage.CreateUserWithPositiveData(await userData.username.positiveData.regularUsername(), userData.profileName.positiveData.shortName, "notoken")
    })

    afterEach('Delete User', async function () {
       await userPage.DeleteUser()
    })
})