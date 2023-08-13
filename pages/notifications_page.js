let chai = require('chai');
let chaiSubset = require('chai-subset');
chai.use(chaiSubset);
const {expect} = require("chai");
const softAssertion = require('soft-assert')

const BasePage = require("./base_page");
const Variables = require("../variabels/variables");
const postManager = require("../manager/requestManagers/postManager");
const commentManager = require("../manager/requestManagers/commentManager")
const notificationsManager = require("../manager/requestManagers/notificationsManager")
const commentData = require("../static/comment_data")
const generalData = require("../static/general_data")
import textData from "../static/general_data"
import randomGeneratorHelper from "../helpers/randomGeneratorhelper"




class NotificationsPage extends BasePage {
  constructor() {
    super();
    this.notifReqData = {}
    this.notifId = ""
    this.notifIds = []
    this.notifResponseBody = {}
    this.newNotification = {}
    this.newNotificationsCount = 0
    this.notViewedNotifications = []
    this.hasInvalidId = false
    this.res = {}
  }

  //
  // ChangeNotificationData(type) {
  //   let body = {}
  //
  //   switch (type) {
  //     case commentData.commentBodyData.positiveData.commentMinChar: {
  //       body = {
  //         postId: this.existingPostId,
  //         text: textData.randomText.positiveData.shortText()
  //       }
  //       this.hasInvalidId = false
  //       break
  //     }
  //   }
  //   this.notifReqData = body
  // }

  async GetUserNotificationsCount(userId, token) {
    this.res = await notificationsManager.getUserNotificationsStatus
    (
      userId ? userId : Variables.testUsers.user1.userId,
      token ? token : Variables.testUsers.user1.accessToken
    )
    expect(this.res.status).to.eq(200, "Notifications status is received")
    this.newNotificationsCount = this.res.body.newNotificationsCount
  }


  async ValidateNotificationsCount(count, markAsViewed, userId, token) {
    this.res = await notificationsManager.getUserNotificationsStatus
    (
      userId ? userId : Variables.testUsers.user1.userId,
      token ? token : Variables.testUsers.user1.accessToken
    )
    if (markAsViewed) {
      expect(this.res.body.newNotificationsCount).to.eq(this.newNotificationsCount - count)
    } else {
      expect(this.res.body.newNotificationsCount).to.eq(this.newNotificationsCount + count)
    }
  }

  async GetUserNotifications(userId, token) {
    super.ChangeQueryParamData(false, 50, generalData.sort.byCreatedAtDescending)

    this.res = await notificationsManager.getUserNotifications
    (
      userId ? userId : Variables.testUsers.user1.userId,
      this.queryParamsReqData,
      token ? token : Variables.testUsers.user1.accessToken
    )
    expect(this.res.status).to.eq(200, "Notifications list is received")
    expect(this.res.totalElements).to.not.eq(0, "Notifications list is not empty")
    this.newNotification = this.res.body.content[0]
    this.notifId = this.res.body.content[0].id
    return this.res.body.content
  }

  //get notif that is not yet read

  async GetNotViewedNotifications(count = 1, userId, token) {
    super.ChangeQueryParamData(1, 50, generalData.sort.byCreatedAtDescending)
    this.res = await notificationsManager.getUserNotifications
    (
      userId ? userId : Variables.testUsers.user1.userId,
      this.queryParamsReqData,
      token ? token : Variables.testUsers.user1.accessToken
    )
    expect(this.res.status).to.eq(200, "Notifications list is received")
    this.notViewedNotifications = []
    for (let i = 0; this.notViewedNotifications.length < count; i++) {
      if (!this.res.body.content[i].isViewed) {
        this.notViewedNotifications.push(this.res.body.content[i])
      }
    }
    expect(this.notViewedNotifications.length).to.eq(count)
    return this.notViewedNotifications
  }

  async GetUserNotificationsWithInvalidData(userId, token) {
    super.ChangeQueryParamData(false, 50, generalData.sort.byCreatedAtDescending)
    this.res = await notificationsManager.getUserNotifications
    (
      userId ? userId : Variables.testUsers.user2.userId,
      this.queryParamsReqData,
      token ? token : Variables.testUsers.user1.accessToken
    )
    expect(this.res.status).to.eq(403, "Access id denied")
    expect(this.res.body.detail).to.eq("Access is denied", "Error detail is correct")
  }

  // async MarkNotificationAsViewed(count = 1, notifIds, userId, token) {
  //   let data;
  //   if(count > 1) {
  //     data = notifIds ? notifIds : this.notifId
  //   } else {
  //     data = notifIds ? notifIds : this.notifIds
  //   }
  //
  //   this.res = await notificationsManager.markNotificationAsViewed
  //   (
  //     data,
  //     userId ? userId : Variables.testUsers.user1.userId,
  //     token ? token : Variables.testUsers.user1.accessToken
  //   )
  //   expect(this.res.status).to.eq(200)
  // }

  async MarkNotificationAsViewed(notifIds, userId, token) {

    this.res = await notificationsManager.markNotificationAsViewed
    (
      notifIds,
      userId ? userId : Variables.testUsers.user1.userId,
      token ? token : Variables.testUsers.user1.accessToken
    )
    expect(this.res.status).to.eq(200, "Notif marked as viewed")
  }

  async MarkOtherUserNotificationAsViewed(notifIds, userId, token) {

    this.res = await notificationsManager.markNotificationAsViewed
    (
      notifIds,
      userId ? userId : Variables.testUsers.user1.userId,
      token ? token : Variables.testUsers.user1.accessToken
    )
    expect(this.res.status).to.eq(403, "Access is denied")
    //or other error, need to see whether it actualy gives 403 when fixed if they fix it coz now it gives 200 but the notif is not marked as viewed
  }

  async ValidatePostVoteNotification(type, postId, username, markAsViewed) {
    softAssertion.softTrue(this.newNotification.content.type === type.type, `Notification type is correct`)
    // softAssertion.softTrue(this.newNotification.content.message === `${username} ${type.message}`, `Notification message is correct`)
    softAssertion.softTrue(this.newNotification.content.postId === postId, `Notification post is correct`)
    softAssertion.softTrue(Object.keys(this.newNotification.metadata).length === 1, "Metadata includes only 1 post")
    softAssertion.softTrue(this.newNotification.metadata.post.id === postId, `Post in metadata is correct`)
    if (markAsViewed) {
      softAssertion.softTrue(this.newNotification.isViewed)
    } else {
      softAssertion.softTrue(!this.newNotification.isViewed)
    }
  }

  async ValidateFollowNotifications(type, followerId, username, markAsViewed) {
    softAssertion.softTrue(this.newNotification.content.type === type.type, `Notification type is correct`)
    // softAssertion.softTrue(this.newNotification.content.message === `${username} ${type.message}`, `Notification message is correct`)
    softAssertion.softTrue(this.newNotification.content.followerId === followerId, `Notification post is correct`)
    softAssertion.softTrue(Object.keys(this.newNotification.metadata).length === 0, "No metadata")

    if (markAsViewed) {
      softAssertion.softTrue(this.newNotification.isViewed)
    } else {
      softAssertion.softTrue(!this.newNotification.isViewed)
    }
  }

  async ValidateCommentNotification(type, commentId, username, replyId, markAsViewed) {
    softAssertion.softTrue(this.newNotification.content.type === type.type, `Notification type is correct`)
    // softAssertion.softTrue(this.newNotification.content.message === `${username} ${type.message}`, `Notification message is correct`)
    softAssertion.softTrue(this.newNotification.content.commentId === commentId, `Notification comment is correct`)
    if (replyId) {
      softAssertion.softTrue(this.newNotification.content.replyId === replyId, `Notification reply is correct`)
    }
    if (markAsViewed) {
      softAssertion.softTrue(this.newNotification.isViewed)
    } else {
      softAssertion.softTrue(!this.newNotification.isViewed)
    }
  }

  async ValidateModerationNotification(type, postId, markAsViewed) {
    softAssertion.softTrue(this.newNotification.content.type === type.type, `Notification type is correct`)
    // softAssertion.softTrue(this.newNotification.content.message === type.message, `Notification message is correct`)
    softAssertion.softTrue(this.newNotification.content.postId === postId, `Notification post is correct`)
    softAssertion.softTrue(Object.keys(this.newNotification.metadata).length === 1, "Metadata includes only 1 post")
    softAssertion.softTrue(this.newNotification.metadata.post.id === postId, `Post in metadata is correct`)
    if (markAsViewed) {
      softAssertion.softTrue(this.newNotification.isViewed)
    } else {
      softAssertion.softTrue(!this.newNotification.isViewed)
    }
  }

  async ValidateMarkedAsViewedNotifs(notifIds, userId, token) {
    super.ChangeQueryParamData(false, 50, generalData.sort.byCreatedAtDescending)
    this.res = await notificationsManager.getUserNotifications(
      userId ? userId : Variables.testUsers.user1.userId,
      this.queryParamsReqData,
      token ? token : Variables.testUsers.user1.accessToken
    )
    expect(this.res.status).to.eq(200, "Notifications list is received")

    const notifs = this.res.body.content.filter(notif => notifIds.findIndex(id => {
      return id === notif.id
    }) >= 0)
    notifs.forEach(el => expect(el.isViewed).to.be.true)
  }
}


module.exports = NotificationsPage