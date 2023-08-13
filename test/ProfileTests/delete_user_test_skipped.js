// import {expect} from "chai";
// import authenticationManager from "../manager/requestManagers/authenticationManager";
// import profileManager from "../manager/requestManagers/profileManager";
// import userData from "../helpers/user_data";
//
//
//
// describe('Verify Existing Username and Deleting the User', function () {
//     this.timeout(60000)
//
//     it('Positive: Creating a User, verifying username then deleting the user', async () => {
//         const newUser = await authenticationManager.signUp(true)
//         let userId;
//         const data = {
//             username: userData.username.positiveData.regularUsername(),
//             authenticationProviderUserId: newUser.body.localId,
//             name: userData.profileName.positiveData.shortName
//         }
//         await profileManager.createUser(data, newUser.body.idToken).then((res) => {
//             expect(res.body).to.include(data)
//             expect(res.body.id).to.exist
//             expect(res.status).to.eq(200)
//             userId = res.body.id
//         })
//         await profileManager.verifyUsernameExists(data.username, newUser.body.idToken).then((res) => {
//             expect(res.body.alreadyInUse).to.be.true
//         })
//         await profileManager.deleteUser(userId, newUser.body.idToken).then((res) => {
//             expect(res.status).to.eq(204)
//         })
//         return await profileManager.verifyUsernameExists(data.username, newUser.body.idToken).then((res) => {
//             expect(res.body.alreadyInUse).to.be.false
//         })
//     })
// })
//
//
// //ADD SOFT ASSERTION TYPE TO CATCH ALL ERRORS IF NEEDED HERE IT"S NOT