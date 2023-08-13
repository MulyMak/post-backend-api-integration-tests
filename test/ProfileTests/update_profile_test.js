import userData from "../../static/user_data";
import UpdateProfilePage from "../../pages/update_profile_page"


const updateProfilePage = new UpdateProfilePage()


describe('UPDATE PROFILE', function () {
    this.timeout(60000)

    before('Create a new user', async function () {
        await updateProfilePage.SignUp()
        await updateProfilePage.CreateUser(await userData.username.positiveData.regularUsername(), userData.profileName.positiveData.shortName)
    })

    it('[C1620] Positive: Update profile, full data', async () => {
        await updateProfilePage.UpdateProfileWithPositiveData(await userData.username.positiveData.regularUsername(), userData.profileName.positiveData.randomName(), userData.bio.positiveData.longestBio)
    })

    it('[C1621] Positive: Update profile twice with full then only required data', async () => {
        await updateProfilePage.UpdateProfileWithPositiveData(await userData.username.positiveData.regularUsername(), userData.profileName.positiveData.randomName(), userData.bio.positiveData.shortBio)
        await updateProfilePage.UpdateProfileWithPositiveData(await userData.username.positiveData.regularUsername(), false, false, false)
    })

    it('[C1622] Negative: Update profile, existing username', async () => {
        await updateProfilePage.GetExistingUsername()
        await updateProfilePage.UpdateProfileWithExistingUsername()
    })

    it('[C1623] Negative: Update profile, invalid usernames', async () => {
        await updateProfilePage.UpdateProfileWithInvalidData(userData.profileDataType.username)
    })

    it('[C1624] Negative: Update profile, invalid profile names', async () => {
        await updateProfilePage.UpdateProfileWithInvalidData(userData.profileDataType.profileName)
    })

    it('[C1625] Negative: Update profile, invalid bio', async () => {
        await updateProfilePage.UpdateProfileWithInvalidData(userData.profileDataType.bio)
    })

    it('[C1626] Negative: Update profile, invalid contact details (email, phone)', async () => {
        await updateProfilePage.UpdateProfileWithInvalidData(userData.profileDataType.contacts)
    })

    it('[C1627] Negative: Update profile, video file as avatar', async () => {
        await updateProfilePage.UpdateProfileWithInvalidData(userData.profileDataType.avatar)
    })

    it('[C1628] Negative: Update another user profile', async () => {
        await updateProfilePage.GetExistingUserIds(10)
        await updateProfilePage.UpdateAnotherUserProfile()
    })

    after('Delete user', async function () {
        await updateProfilePage.DeleteUser()
    })
})
