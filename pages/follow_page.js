const BasePage = require("./base_page");
const randomGeneratorHelper = require("../helpers/randomGeneratorhelper");
const authenticationManager = require("../manager/requestManagers/authenticationManager");
const Variables = require("../variabels/variables");
const profileManager = require("../manager/requestManagers/profileManager");
const postManager = require("../manager/requestManagers/postManager");
const followManager = require("../manager/requestManagers/followManager")
const userData = require("../static/user_data");
const generalData = require("../static/general_data");

const {expect} = require("chai");
let chai = require('chai');
let chaiSubset = require('chai-subset');
chai.use(chaiSubset);

class FollowPage extends BasePage {

  constructor() {
    super();
    this.followersCount = 0
    this.followingCount = 0
    this.res = {}
  }

  async GetFollowingList(userId, username, page, size, sort) {

    let res = {}
    if (username || page || size || sort) {
      this.ChangeQueryParamData(page, size, sort, username)
      res = await followManager.getFollowing(this.queryParamsReqData, userId ? userId : Variables.testUsers.user1.userId, Variables.testUsers.user1.accessToken)
    } else {
      res = await followManager.getFollowing(false, userId ? userId : Variables.testUsers.user1.userId, Variables.testUsers.user1.accessToken)
    }
    expect(res.status).to.eq(200, "Following list is received")
    this.followings = res.body.content.map(user => {
      return user.id
    })
    return this.followings
  }

  async GetFollowersList(userId, username, page, size, sort) {

    let res = {}
    if (username || page || size || sort) {
      this.ChangeQueryParamData(page, size, sort, username)
      res = await followManager.getFollowers(this.queryParamsReqData, userId ? userId : Variables.testUsers.user1.userId, Variables.testUsers.user1.accessToken)
    } else {
      res = await followManager.getFollowers(false, userId ? userId : Variables.testUsers.user1.userId, Variables.testUsers.user1.accessToken)
    }
    expect(res.status).to.eq(200, "Followers list is received")
    this.followers = res.body.content.map(user => {
      return user.id
    })
    return this.followers
  }

  //CHECK WITH TIKO HOW IT"S BETTER >>WHAT IF THERE AAR MORE THAN 10
  async SearchInFollowing(username, userId) {
    this.ChangeQueryParamData(false, 50, generalData.sort.byUsernameAscending, username)
    await followManager.getFollowing(this.queryParamsReqData, userId ? userId : Variables.testUsers.user1.userId, Variables.testUsers.user1.accessToken).then((res) => {
      expect(res.status).to.eq(200, "Searched list in Following is received")
      if (username === "nonexistingusernameornamefortest") {
        expect(res.body.content.length).to.eq(0)
        expect(res.body.totalElements).to.eq(0)
      } else {
        expect(res.body.totalElements).to.not.eq(0, "Results for the following search are found")
        res.body.content.map(user => {
          let lowercaseUsername = username.toLowerCase()
          if (!user.username.includes(username)) {
            expect(user.name.toLowerCase()).to.include(lowercaseUsername)
          } else {
            expect(user.username.toLowerCase()).to.include(lowercaseUsername)
          }
        })
      }
    })
  }

  async SearchInFollowers(username, userId) {
    this.ChangeQueryParamData(false, 50, generalData.sort.byUsernameAscending, username)
    await followManager.getFollowers(this.queryParamsReqData, userId ? userId : Variables.testUsers.user1.userId, Variables.testUsers.user1.accessToken).then((res) => {
      expect(res.status).to.eq(200, "Searched list in Followers is received")
      if (username === "nonexistingusernameornamefortest") {
        expect(res.body.content.length).to.eq(0)
        expect(res.body.totalElements).to.eq(0)
      } else {
        expect(res.body.totalElements).to.not.eq(0, "Results for the followers search are found")
        res.body.content.map(user => {
          let lowercaseUsername = username.toLowerCase()
          if (!user.username.includes(username)) {
            expect(user.name.toLowerCase()).to.include(lowercaseUsername)
          } else {
            expect(user.username.toLowerCase()).to.include(lowercaseUsername)
          }
        })
      }
    })
  }


  async FollowWithValidData(userToFollow) {
    //Getting prior count of followers and following of user who is followed and who follows
    await profileManager.getProfile(Variables.testUsers.user1.userId, Variables.testUsers.user1.accessToken).then((res) => {
      expect(res.status).to.eq(200, "Profile of user who follows is received before follow")
      expect(res.body.followersCount).to.exist
      this.followingCount = res.body.followingCount
    })
    await profileManager.getProfile(userToFollow ? userToFollow : Variables.testUsers.user2.userId, Variables.testUsers.user1.accessToken).then((res) => {
      expect(res.status).to.eq(200, "Profile of user to follow is received before follow")
      expect(res.body.followersCount).to.exist
      this.followersCount = res.body.followersCount
    })

    await followManager.followUser(userToFollow ? userToFollow : Variables.testUsers.user2.userId, Variables.testUsers.user1.userId, Variables.testUsers.user1.accessToken).then((res) => {
      expect(res.status).to.eq(200, "User is followed")
    })
    //Getting after count of followers and following of user who is followed and who follows
    await profileManager.getProfile(userToFollow ? userToFollow : Variables.testUsers.user2.userId, Variables.testUsers.user1.accessToken).then((res) => {
      expect(res.status).to.eq(200, "Profile of user to follow is received after follow")
      expect(res.body.followersCount).to.eq(this.followersCount + 1)
      this.followersCount = res.body.followersCount
    })
    await profileManager.getProfile(Variables.testUsers.user1.userId, Variables.testUsers.user1.accessToken).then((res) => {
      expect(res.status).to.eq(200, "Profile of user who follows is received after follow")
      expect(res.body.followingCount).to.eq(this.followingCount + 1)
      this.followingCount = res.body.followingCount
    })
  }


  async UnfollowWithValidData(userToUnfollow) {
    await followManager.unfollowUser(userToUnfollow ? userToUnfollow : Variables.testUsers.user2.userId, Variables.testUsers.user1.userId, Variables.testUsers.user1.accessToken).then((res) => {
      expect(res.status).to.eq(204, "User is unfollowed")
    })
    //Getting after count of followers and following of user who is unfollowed and who unfollows
    await profileManager.getProfile(userToUnfollow ? userToUnfollow : Variables.testUsers.user2.userId, Variables.testUsers.user1.accessToken).then((res) => {
      expect(res.status).to.eq(200, "Profile of user to follow is received after follow")
      expect(res.body.followersCount).to.eq(this.followersCount - 1)
      this.followersCount = res.body.followersCount
    })
    await profileManager.getProfile(Variables.testUsers.user1.userId, Variables.testUsers.user1.accessToken).then((res) => {
      expect(res.status).to.eq(200, "Profile of user who follows is received after follow")
      expect(res.body.followingCount).to.eq(this.followingCount - 1)
      this.followingCount = res.body.followingCount
    })
  }


  async FollowWithInvalidData(userToFollow, invalidUser) {
    this.res = await followManager.followUser(userToFollow ? userToFollow : Variables.testUsers.user2.userId, Variables.testUsers.user1.userId, Variables.testUsers.user1.accessToken)
    if (invalidUser) {
      expect(this.res.status).to.eq(404, "Invalid user was not found")
      expect(this.res.body.detail).to.include('User not found')
    } else if (userToFollow === Variables.testUsers.user1.userId) {
      expect(this.res.status).to.eq(403, "Invalid user was not found")
      expect(this.res.body.detail).to.include('Access is denied')
    } else {
      expect(this.res.status).to.eq(400, "User already followed is not followed again")
      expect(this.res.body.detail).to.include('User is already follоwed')
    }
  }


  //FUNCTIONS FOR GENERAL USE


  async FollowUser(userToFollow, userThatFollows, token) {
    this.res = await followManager.followUser(userToFollow ? userToFollow : Variables.testUsers.user2.userId, userThatFollows ? userThatFollows : Variables.testUsers.user1.userId, token ? token : Variables.testUsers.user1.accessToken)
    expect(this.res.status).to.eq(200, "User is followed")
  }

  async UnfollowUser(userToUnfollow, userThatUnfollows, token) {
    this.res = await followManager.unfollowUser(userToUnfollow ? userToUnfollow : Variables.testUsers.user2.userId, userThatUnfollows ? userThatUnfollows : Variables.testUsers.user1.userId, token ? token : Variables.testUsers.user1.accessToken)
    expect(this.res.status).to.eq(204, "User is unfollowed")
  }

  async GetFollowersCount(userId, token) {
    this.res = await profileManager.getProfile(userId ? userId : Variables.testUsers.user1.userId, token ? token : Variables.testUsers.user1.accessToken)
    expect(this.res.status).to.eq(200, "Profile of user to follow is received before follow")
    expect(this.res.body.followersCount).to.exist
    this.followersCount = this.res.body.followersCount
    return this.followersCount
  }

  async GetFollowingCount(userId, token) {
    this.res = await profileManager.getProfile(userId ? userId : Variables.testUsers.user1.userId, token ? token : Variables.testUsers.user1.accessToken)
    expect(this.res.status).to.eq(200, "Profile of user who follows is received before follow")
    expect(this.res.body.followersCount).to.exist
    this.followingCount = this.res.body.followingCount
    return this.followingCount
  }


  //FOR FOLLOWING LOTS OF USERS NEED TO BE DELETED LATER
  // async GetExistingUsers() {
  //   await this.GetExistingUserIds(21)
  //
  // }
  //
  // async FollowAListOfUsers() {
  //   let users = [
  //     '2786b222-f0fd-45b7-8abf-c5280169a0be',
  //     '70acf875-20f7-4db8-abbb-87d60d69965e',
  //     '104414c2-1668-4d89-a919-8468339ac5f2',
  //     '25a63adc-c1f6-470b-9155-cc105c5c077f',
  //     'e9e49ad5-8d2f-493d-9305-f86d1c8db128',
  //     '814558ba-3317-495c-b25c-8009a396744c',
  //     'ac985944-7588-444e-a404-7c2d1bbb14f6',
  //     '7bb7efe2-ce80-4d80-b038-74ae3810c616',
  //     'd8985ec7-f0b8-4958-9f70-7d8ddce1d978',
  //     '63583387-4c74-4ee3-9c41-013272e38a5c',
  //     '8e2e90af-2d6b-4b21-93c6-d970f031bc1a',
  //     'ba97f37f-1b56-401a-b7ab-bcd4c886d392',
  //     '2dea4c8c-00fa-4270-815e-25f6f51096cd',
  //     '759722fb-44e3-405d-a54e-fb47c70b87d1',
  //     '1b30b67d-fc12-44bd-9971-fe0d63ca2107',
  //     '0784609f-13e1-4955-b970-d435069e37b2',
  //     'd16ff825-27dd-47b4-99be-0439d6fd5c09',
  //     '28a5321c-1b56-428e-9bef-b8371c39c113',
  //     'fc62d89b-0cf0-487e-8ef4-69e76bb5c0fb',
  //     'e32b5f45-508b-478e-8584-11549bca6655',
  //     '6b70c3b4-5799-4537-98bc-cb474e6405b5'
  //   ]
  //   for (let i = 0; i < users.length; i++) {
  //     await followManager.followUser(users[i], Variables.testUsers.user1.userId, Variables.testUsers.user1.accessToken).then((res) => {
  //       console.log(res.body, "body")
  //       expect(res.status).to.eq(200, "User is followed")
  //     })
  //   }
  //   await profileManager.getProfile(Variables.testUsers.user1.userId, Variables.testUsers.user1.accessToken).then((res) => {
  //     expect(res.status).to.eq(200, "Profile of user who follows is received after follow")
  //   })
  // }
}

module.exports = FollowPage