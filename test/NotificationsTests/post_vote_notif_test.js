const softAssertion = require('soft-assert')
import NotificationsPage from "../../pages/notifications_page"
import CreateVotePage from "../../pages/vote_page"
import voteData from "../../static/vote_data";
import notificationData from "../../static/notification_data"
import Variables from "../../variabels/variables";


const notificationsPage = new NotificationsPage()
const createVotePage = new CreateVotePage()

describe("UPVOTE / DOWNVOTE POST NOTIFICATIONS", function () {
  this.timeout(60000)

  let postIds = ""
  let voteId1 = ""
  let voteId2 = ""

  before('Get test user data', async function () {
    require('../MainTests/create_test_users')
    postIds = await notificationsPage.GetUserPosts()
  })

  it('[C1733] Positive: Upvote post notification', async () => {
    await notificationsPage.GetUserNotificationsCount()
    voteId1 = await createVotePage.CreateVote(voteData.voteTarget.post, voteData.voteType.upvote, postIds[0], Variables.testUsers.user2.accessToken)
    await notificationsPage.ValidateNotificationsCount(1)
    await notificationsPage.GetUserNotifications()
    await notificationsPage.ValidatePostVoteNotification(notificationData.notificationType.postVote.upvote, postIds[0], Variables.testUsers.user2.username)
    await createVotePage.DeleteVote(voteId1, Variables.testUsers.user2.accessToken)
    voteId1 = ""
    softAssertion.softAssertAll()
  });

  it('[C1734] Positive: Downvote post notification', async () => {
    //User does not get notification for downvote/update to downvote
    voteId1 = await createVotePage.CreateVote(voteData.voteTarget.post, voteData.voteType.upvote, postIds[0], Variables.testUsers.user2.accessToken)
    await notificationsPage.GetUserNotificationsCount()
    await createVotePage.UpdateVote(voteData.voteType.downvote, postIds[0], voteId1, Variables.testUsers.user2.accessToken)
    await notificationsPage.ValidateNotificationsCount(0)
    await createVotePage.DeleteVote(voteId1, Variables.testUsers.user2.accessToken)
    voteId1 = ""
    softAssertion.softAssertAll()
  });

  it('[C1735] Positive: Remove post vote notification', async () => {
    voteId1 = await createVotePage.CreateVote(voteData.voteTarget.post, voteData.voteType.upvote, postIds[0], Variables.testUsers.user2.accessToken)
    await notificationsPage.GetUserNotificationsCount()
    await createVotePage.DeleteVote(voteId1, Variables.testUsers.user2.accessToken)
    voteId1 = ""
    await notificationsPage.ValidateNotificationsCount(1)
    await notificationsPage.GetUserNotifications()
    await notificationsPage.ValidatePostVoteNotification(notificationData.notificationType.postVote.voteRemoved, postIds[0], Variables.testUsers.user2.username)
    softAssertion.softAssertAll()
  });

  it('[C1736] Positive: Upvote post notification from downvote to upvote', async () => {
    //No notif for downvote, notif for update to upvote
    await notificationsPage.GetUserNotificationsCount()
    voteId1 = await createVotePage.CreateVote(voteData.voteTarget.post, voteData.voteType.downvote, postIds[0], Variables.testUsers.user2.accessToken)
    await notificationsPage.ValidateNotificationsCount(0)
    await createVotePage.UpdateVote(voteData.voteType.upvote, postIds[0], voteId1, Variables.testUsers.user2.accessToken)
    await notificationsPage.ValidateNotificationsCount(1)
    await notificationsPage.GetUserNotifications()
    await notificationsPage.ValidatePostVoteNotification(notificationData.notificationType.postVote.upvote, postIds[0], Variables.testUsers.user2.username)
    await createVotePage.DeleteVote(voteId1, Variables.testUsers.user2.accessToken)
    voteId1 = ""
    softAssertion.softAssertAll()
  });

  it('[C1737] Positive: No notification for your own vote on post', async () => {
    await notificationsPage.GetUserNotificationsCount()
    voteId2 = await createVotePage.CreateVote(voteData.voteTarget.post, voteData.voteType.upvote, postIds[0])
    await notificationsPage.ValidateNotificationsCount(0)
    let notifs = await notificationsPage.GetUserNotifications()
    softAssertion.softTrue(notifs[0].createdBy.username !== Variables.testUsers.user1.username, 'The notification is not from other user')
    await createVotePage.DeleteVote(voteId2)
    voteId2 = ""
    softAssertion.softAssertAll()
  });

  afterEach('Delete Vote', async function () {

    if(voteId1) {
      await createVotePage.DeleteVote(voteId1, Variables.testUsers.user2.accessToken)
    }
    if(voteId2) {
      await createVotePage.DeleteVote(voteId2)
    }
  })
})