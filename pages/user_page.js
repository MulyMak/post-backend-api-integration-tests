import BasePage from "../pages/base_page";
import {expect, use} from "chai";
import profileManager from "../manager/requestManagers/profileManager";
import Variables from "../variabels/variables";
import userData from "../static/user_data";
import randomGeneratorHelper from "../helpers/randomGeneratorhelper";
import generalData from "../static/general_data";
import ratingsManager from "../manager/requestManagers/ratingsManager";


//NEED TO OPTIMIZE THIS PAGE USING SWITCH CASE ABD CHANGE DATA FOR THE REQUEST
class CreateUserPage extends BasePage {

  constructor() {
    super();
    this.res = {}
    this.followings = []
    this.followers = []
    this.ratingPlace;
    this.rating;
  }

  async CreateUserWithPositiveData(username, profileName, token) {
    let data;
    let userId;
    if (profileName) {
      data = {
        username: username,
        authenticationProviderUserId: Variables.global.authProviderId,
        name: profileName
      }
    } else {
      data = {
        username: username,
        authenticationProviderUserId: Variables.global.authProviderId,
      }
    }
    if (token === "notoken") {
      await profileManager.createUser(data, "notoken").then((res) => {
        expect(res.status).to.eq(500, "No Access Token provided")
      })
    } else {
      await profileManager.createUser(data, Variables.global.accessToken).then((res) => {
        userId = res.body.id
        expect(res.body).to.include(data)
        expect(res.body.id).to.exist
        expect(res.status).to.eq(200, "User is created")
      })
    }
    const vars = {
      userId: userId,
      username: data.username
    }
    Variables.changeVariables(vars)
  }

  async CreateUserWithInvalidProfileNames() {
    for (let i = 0; i < Object.keys(this.invalidNames).length; i++) {

      let data = {
        user: {
          username: await userData.username.positiveData.regularUsername(),
          authenticationProviderUserId: Variables.global.authProviderId,
          name: Object.values(this.invalidNames)[i]
        }
      }
      await profileManager.createUser(data, Variables.global.accessToken).then((res) => {
        expect(res.status).to.eq(400, 'Profile is not created')
        expect(res.body.violations[0].message).to.exist
      })
    }
  }


  async CreateUserWithInvalidUsernames() {
    for (let i = 0; i < Object.keys(this.invalidUsernames).length; i++) {

      let data = {
        user: {
          username: Object.values(this.invalidUsernames)[i],
          authenticationProviderUserId: Variables.global.authProviderId,
        }
      }
      await profileManager.createUser(data, Variables.global.accessToken).then((res) => {
        expect(res.status).to.eq(400, `Profile is not created with "${data.username}"`)
        expect(res.body.violations[0].message).to.exist
      })
    }
  }

  async SendCreateUserRequestSecondTimeAfterSuccessfulUserCreation() {
    const newData = {
      username: await randomGeneratorHelper.generatePositiveUsername(10),
      authenticationProviderUserId: Variables.global.authProviderId
    }
    return await profileManager.createUser(newData, Variables.global.accessToken).then((res) => {
      expect(res.status).to.eq(409, "Creating user the second time after successful user creation is not successful")
      expect(res.body.cause).to.exist
    })
  }


  async CreateUserWithExistingUsername() {

    await this.SignUp()
    let newData = {
      username: this.existingUsername,
      authenticationProviderUserId: Variables.global.authProviderId,
      name: ''
    }
    await profileManager.createUser(newData, Variables.global.accessToken).then((res) => {
      expect(res.body.cause.cause.detail).to.include('ERROR: duplicate key value violates unique constraint \"uc_users_username\"')
      expect(res.status).to.eq(409, "User Profile with existing username is not updated")
    })
  }

  async BlockProfile(userToBlock, userId, token) {
    this.res = await profileManager.blockProfile
    (
      userToBlock,
      userId ? userId : Variables.testUsers.user1.userId,
      token ? token : Variables.testUsers.user1.accessToken
    )
    expect(this.res.status).to.eq(200, "Profile is blocked")
  }

  //ADD INVALID BLOCK PROFILE FUNCTION WHEN THE BUG IS FIXED https://post-inc.atlassian.net/browse/PST-829

  async UnblockProfile(userToUnblock, userId, token) {
    this.res = await profileManager.unblockProfile
    (
      userToUnblock,
      userId ? userId : Variables.testUsers.user1.userId,
      token ? token : Variables.testUsers.user1.accessToken
    )
    expect(this.res.status).to.eq(200, "Profile is unblocked")
  }

  async GetBlockedList(userId, token) {
    this.ChangeQueryParamData(false, 50, generalData.sort.byUsernameAscending)
    this.res = await profileManager.getBlockedUsers(this.queryParamsReqData, userId ? userId : Variables.testUsers.user1.userId, token ? token : Variables.testUsers.user1.accessToken)
    expect(this.res.status).to.eq(200, "Blocked user list is received")
    return this.res.body.content
  }

  async GetProfile(userId, token) {
    this.res = await profileManager.getProfile(userId ? userId : Variables.testUsers.user1.userId, token ? token : Variables.testUsers.user1.accessToken)
    expect(this.res.status).to.eq(200, "Profile info is received")
    expect(this.res.body.id).to.eq(userId ? userId : Variables.testUsers.user1.userId, "Correct user profile is received")
    return this.res.body
  }

  async GetNotAvailableProfile(userId, token) {
    this.res = await profileManager.getProfile(userId ? userId : Variables.testUsers.user1.userId, token ? token : Variables.testUsers.user1.accessToken)
    expect(this.res.status).to.eq(410, "Profile info is not received")
    expect(this.res.body.title).to.be.eq("Profile is not available")
    return this.res.body
  }

  async GetUserRatingPlace(userId, token) {
    this.res = await ratingsManager.getUserRatingPlace(userId ? userId : Variables.testUsers.user1.userId, token ? token : Variables.testUsers.user1.accessToken)
    expect(this.res.status).to.eq(200, "User rating is received")
    expect(this.res.body.profileId).to.eq(userId ? userId : Variables.testUsers.user1.userId)
    this.ratingPlace = this.res.body.ratingPlace
    return this.res.body.ratingPlace
  }

  async GetAllRatings(token, page = 1) {
    this.ChangeQueryParamData(page, 50)
    this.res = await ratingsManager.getAllRatings(this.queryParamsReqData, token ? token : Variables.testUsers.user1.accessToken)
    expect(this.res.status).to.eq(200, "Ratings list is received")
    expect(this.res.body.content.length).to.not.eq(0, "Ratings list is not empty")
    return this.res.body
  }

  async GetUserRating(userId, token) {
    this.res = await profileManager.getProfile(userId ? userId : Variables.testUsers.user1.userId, token ? token : Variables.testUsers.user1.accessToken)
    expect(this.res.status).to.eq(200, "Profile info is received")
    expect(this.res.body.id).to.eq(userId ? userId : Variables.testUsers.user1.userId, "Correct user profile is received")
    this.rating = this.res.body.rating
    return this.res.body.rating
  }
}


module.exports = CreateUserPage