// import {expect} from "chai";
// import authenticationManager from "../manager/requestManagers/authenticationManager";
// import profileManager from "../manager/requestManagers/profileManager";
// import userData from "../helpers/user_data";
// import UpdateProfilePage from "../pages/update_profile_page"
//
//
// const Variables = require('../variabels/variables')
//
// const updateProfilePage = new UpdateProfilePage()
//
// describe('Update User', function () {
//     this.timeout(60000)
//     let newUsername;
//     let newUser;
//     let createUser;
//     let data;
//     let userPageSize;
//     let userMaxElementSize = 50
//
//     beforeEach('Create a new user', async function () {
//
//         await updateProfilePage.signUp()
//         await updateProfilePage.CreateUser(await userData.username.positiveData.regularUsername(), userData.profileName.positiveData.shortName)
//
//     it('Positive: Update username, name', async () => {
//
//         const vars = {
//             userId: createUser.body.id
//         }
//         Variables.changeVariables(vars)
//
//         const verifiedUsername = await profileManager.verifyUsernameExists(userData.username.positiveData.regularUsername(), newUser.body.idToken)
//         if (verifiedUsername.body.alreadyInUse === true) {
//             newUsername = `newusername${Math.floor(Math.random() * 5000)}`
//         } else {
//             newUsername = userData.username.positiveData.regularUsername()
//         }
//
//         const newData = {
//             name: userData.profileName.positiveData.randomName(),
//             authenticationProviderUserId: newUser.body.localId,
//             username: newUsername
//         }
//         await profileManager.updateUser(newData, createUser.body.id, newUser.body.idToken).then((res) => {
//             expect(res.body).to.include(newData)
//             expect(res.body.id).to.exist
//             expect(res.status).to.eq(200, "User is updated")
//         })
//
//         await profileManager.verifyUsernameExists(data.username, newUser.body.idToken).then((res) => {
//             expect(res.body.alreadyInUse).to.be.false
//         })
//
//         await profileManager.verifyUsernameExists(newData.username, newUser.body.idToken).then((res) => {
//             expect(res.body.alreadyInUse).to.be.true
//         })
//
//     })
//
//     it('Positive: Update username only', async () => {
//
//         const verifiedUsername = await profileManager.verifyUsernameExists(userData.username.positiveData.regularUsername(), newUser.body.idToken)
//         if (verifiedUsername.body.alreadyInUse === true) {
//             newUsername = `newusername${Math.floor(Math.random() * 5000)}`
//         } else {
//             newUsername = userData.username.positiveData.regularUsername()
//             //HERE WE HAVE AN ISSUE BECAUSE WE DELETE THE USER IN THE PREVIOUS TEST
//             // AND RANDOM USERNAME IS SHOWN AS NOT EXISTING BUT BECAUSE WE HAD A USER WITH SUCH A USERNAME BEFORE AND THE UPDATE USER REQUEST
//             // SHOWS IT AS EXISTING THIS NEEDS TO BE FIXED
//         }
//
//         const newData = {
//             authenticationProviderUserId: newUser.body.localId,
//             username: newUsername
//         }
//         await profileManager.updateUser(newData, createUser.body.id, newUser.body.idToken).then((res) => {
//             expect(res.body).to.include(newData)
//             expect(res.body.id).to.exist
//             expect(res.status).to.eq(200)
//         })
//
//         await profileManager.verifyUsernameExists(data.username, newUser.body.idToken).then((res) => {
//             expect(res.body.alreadyInUse).to.be.false
//         })
//
//         await profileManager.verifyUsernameExists(newData.username, newUser.body.idToken).then((res) => {
//             expect(res.body.alreadyInUse).to.be.true
//         })
//
//     })
//
//     it('Negative: Update with invalid username and name', async () => {
//
//         const verifiedUsername = await profileManager.verifyUsernameExists(userData.username.negativeData.invalidUsername31Chars, newUser.body.idToken)
//         if (verifiedUsername.body.alreadyInUse === true) {
//             newUsername = `newusername$${Math.floor(Math.random() * 5000)}`
//         } else {
//             newUsername = userData.username.negativeData.invalidUsername31Chars
//         }
//         const newData = {
//             name: userData.profileName.negativeData.invalidName61Chars,
//             authenticationProviderUserId: newUser.body.localId,
//             username: newUsername
//         }
//
//         await profileManager.updateUser(newData, createUser.body.id, newUser.body.idToken).then((res) => {
//             expect(res.status).to.eq(400)
//             expect(res.body.violations[0]).to.include({"field": "name"})
//             expect(res.body.violations[1]).to.include({"field": "username"})
//         })
//
//         await profileManager.verifyUsernameExists(data.username, newUser.body.idToken).then((res) => {
//             expect(res.body.alreadyInUse).to.be.true
//         })
//
//         await profileManager.verifyUsernameExists(newData.username, newUser.body.idToken).then((res) => {
//             expect(res.body.alreadyInUse).to.be.false
//         })
//
//     })
//
//     it('Negative: Update User without an access token', async () => {
//
//         const verifiedUsername = await profileManager.verifyUsernameExists(userData.username.positiveData.newUsername, newUser.body.idToken)
//
//         if (verifiedUsername.body.alreadyInUse === true) {
//             newUsername = `newusername${Math.floor(Math.random() * 5000)}`
//         } else {
//             newUsername = userData.username.positiveData.regularUsername()
//         }
//         const newData = {
//             name: userData.profileName.negativeData.invalidName61Chars,
//             authenticationProviderUserId: newUser.body.localId,
//             username: newUsername
//         }
//
//         await profileManager.updateUser(newData, createUser.body.id, "notoken").then((res) => {
//             expect(res.status).to.eq(401)
//             expect(res.body.detail).to.include("Full authentication is required to access this resource")
//         })
//
//         await profileManager.verifyUsernameExists(data.username, newUser.body.idToken).then((res) => {
//             expect(res.body.alreadyInUse).to.be.true
//         })
//
//         await profileManager.verifyUsernameExists(newData.username, newUser.body.idToken).then((res) => {
//             expect(res.body.alreadyInUse).to.be.false
//         })
//
//     })
//
//     it('Positive: Get my user and a deleted user', async () => {
//         await profileManager.getUser(createUser.body.id, newUser.body.idToken).then((res) => {
//             expect(res.body).to.include(data)
//             expect(res.body.id).to.eq(createUser.body.id)
//             expect(res.status).to.eq(200, 'My user is received')
//         })
//
//         await profileManager.getUser(Variables.global.userId, newUser.body.idToken).then((res) => {
//             expect(res.body.title).to.eq("Gone")
//             expect(res.body.detail).to.eq('410 GONE "User account was deleted"')
//             expect(res.status).to.eq(410, 'Deleted user is gone')
//         })
//     })
//
//
//     it('Positive: Get all users with default parameters', async () => {
//         await profileManager.getAllUsers(newUser.body.idToken).then((res) => {
//             expect(res.body.content).to.have.lengthOf(10)
//             expect(res.body.size).to.be.eq(10)
//             expect(res.body.number).to.be.eq(0)
//             userPageSize = res.body.totalPages
//         })
//     })
//
//     it('Positive: Get all users with set parameters', async () => {
//         let pageSize = Math.floor(Math.random()* userPageSize)
//         let elementSize = Math.floor(Math.random() * userMaxElementSize)
//
//         await profileManager.getAllUsers(newUser.body.idToken, pageSize, elementSize).then((res) => {
//             expect(res.body.content).to.have.lengthOf(elementSize)
//             expect(res.body.size).to.eq(elementSize)
//             expect(res.body.number).to.eq(pageSize - 1)
//         })
//     })
//
//     afterEach('Delete user', async function () {
//         return await profileManager.deleteUser(createUser.body.id, newUser.body.idToken).then((res) => {
//             expect(res.status).to.be.eq(204)
//         })
//     })
// })
//
// ////ASK WHETHER THERE IS NEED TO VERiFY PASSWORD UPDATE
//
//
// //Positives: update all pass, name, username...update only username...update only password...negative update without authenticationproviderid, with incorrect username, with incorrect name
// //Get user ....get my profile, get some other user profile...negative...get without access token
// //get all users positive ...send without params page sort ....get with some params ....get without access token
