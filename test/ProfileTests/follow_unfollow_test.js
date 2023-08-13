import FollowPage from '../../pages/follow_page'
import Variables from '../../variabels/variables';
import randomGeneratorHelper from '../../helpers/randomGeneratorhelper';

const {expect} = require('chai');

const followPage = new FollowPage()

describe('FOLLOW / UNFOLLOW', function () {
  this.timeout(60000)

  before('Get test user data', async function () {
    require('../MainTests/create_test_users')
    await followPage.FollowUser(Variables.testUsers.user1.userId, Variables.testUsers.user2.userId, Variables.testUsers.user2.accessToken)
  })

  it('[C1629] Positive: Follow and unfollow existing user', async () => {
    await followPage.FollowWithValidData(Variables.testUsers.user2.userId)
    expect((await followPage.GetFollowingList(Variables.testUsers.user1.userId)).length).to.not.eq(0)
    expect((await followPage.GetFollowersList(Variables.testUsers.user2.userId)).length).to.not.eq(0)
    await followPage.UnfollowWithValidData(Variables.testUsers.user2.userId)
  });

  it('[C1630] Positive: Get my followers and other user\'s following lists', async () => {
    await followPage.GetFollowersList()
    await followPage.GetFollowingList(Variables.testUsers.user2.userId)
  });

  it('[C1631] Positive: Search in my following with 1 char', async () => {
    await followPage.SearchInFollowing('k')
  });

  it('[C1632] Positive: Search in my followers with several chars', async () => {
    await followPage.SearchInFollowers('test')
  });

  it('[C1633] Positive: Search in my followers & followings with a username not in their lists', async () => {
    await followPage.SearchInFollowing('nonexistingusernameornamefortest')
    await followPage.SearchInFollowers('nonexistingusernameornamefortest')
  });

  it('[C1634] Positive: Search in another user following with a number "1"', async () => {
    await followPage.SearchInFollowing('1', Variables.testUsers.user2.userId)
  });

  it('[C1635] Positive: Search in another user followers with several chars', async () => {
    await followPage.FollowWithValidData(Variables.testUsers.user2.userId)
    await followPage.SearchInFollowing('user', Variables.testUsers.user2.userId)
  });

  it('[C1636] Negative: Follow / unfollow myself', async () => {
    await followPage.FollowWithInvalidData(Variables.testUsers.user1.userId)
  });

  it('[C1637] Negative: Follow invalid user', async () => {
    let invalidUser = randomGeneratorHelper.generateRandomGuid()
    await followPage.FollowWithInvalidData(invalidUser, true)
  });

  it('[C1638] Negative: Follow the same person twice', async () => {
    await followPage.FollowWithValidData()
    await followPage.FollowWithInvalidData()
  });

  //
  // if time, change the request so that it does a loop and follows and
  // unfollows as many times as there are ids in existing user ids and test with following several
  //

  afterEach('User 1 Unfollows User 2', async function () {
    await followPage.UnfollowUser()
  })

  after('User 2 Unfollows User 1', async function () {
    await followPage.UnfollowUser(Variables.testUsers.user1.userId, Variables.testUsers.user2.userId, Variables.testUsers.user2.accessToken)
  })
})