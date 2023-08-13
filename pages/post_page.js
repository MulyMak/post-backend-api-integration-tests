import BasePage from "../pages/base_page";
import postManager, {markPostAsViewed} from "../manager/requestManagers/postManager"
import Variables from "../variabels/variables";
import postData from "../static/post_data";
import textData from "../static/general_data"
import {expect} from "chai";
import DataHelper from "../helpers/dataHelper"
import randomGeneratorHelper from "../helpers/randomGeneratorhelper"
import MediaData from "../static/media_data";
import {logPlugin} from "@babel/preset-env/lib/debug";

let chai = require('chai');
let chaiSubset = require('chai-subset');
chai.use(chaiSubset);

class CreatePostPage extends BasePage {

  constructor() {
    super();
    this.res = {}
    this.postId = ''
    this.repostId = ''
    this.postReqData = {
      type: '',
    }
    this.postResponseBody = ''
    this.feedPosts = []
    this.viewedPosts = []
  }


  //CREATE
  ChangePostData(type) {
    let body = {}

    switch (type) {
      case postData.postBodyData.positiveData.minCharText: {
        body = {
          type: postData.postRequestBodyType.regular,
          text: textData.randomText.positiveData.shortText()
        }
        break
      }
      case postData.postBodyData.positiveData.maxCharText: {
        body = {
          type: postData.postRequestBodyType.regular,
          text: textData.randomText.positiveData.longestText()
        }
        break
      }
      case postData.postBodyData.positiveData.imageAndText: {
        body = {
          type: postData.postRequestBodyType.regular,
          text: textData.randomText.positiveData.regularText(),
          mediaFiles: postData.postFiles.makeMediaFiles(1, 0)
        }
        break
      }
      case postData.postBodyData.positiveData.maxImages: {
        body = {
          type: postData.postRequestBodyType.regular,
          mediaFiles: postData.postFiles.makeMediaFiles(5, 0)
        }
        break
      }
      case postData.postBodyData.positiveData.singleImage: {
        body = {
          type: postData.postRequestBodyType.regular,
          text: textData.randomText.positiveData.regularText(),
          mediaFiles: postData.postFiles.makeMediaFiles(1, 0)
        }
        break
      }
      case postData.postBodyData.positiveData.singleVideo: {
        body = {
          type: postData.postRequestBodyType.regular,
          text: textData.randomText.positiveData.regularText(),
          mediaFiles: postData.postFiles.makeMediaFiles(0, 1)
        }
        break
      }
      case postData.postBodyData.positiveData.maxVideos: {
        body = {
          type: postData.postRequestBodyType.regular,
          text: textData.randomText.positiveData.regularText(),
          mediaFiles: postData.postFiles.makeMediaFiles(0, 5)
        }
        break
      }
      case postData.postBodyData.positiveData.mixedFiles: {
        body = {
          type: postData.postRequestBodyType.regular,
          mediaFiles: postData.postFiles.makeMediaFiles(2, 1)
        }
        break
      }
      case postData.postBodyData.positiveData.noTextRepost: {
        body = {
          type: postData.postRequestBodyType.regular
        }
        break
      }
      case postData.postBodyData.positiveData.singleUserMention: {
        body = {
          type: postData.postRequestBodyType.regular,
          text: textData.randomText.positiveData.regularText(),
          mentionedUserIds: this.existingUserIds
        }
        break
      }
      case postData.postBodyData.positiveData.multipleUserMention: {
        body = {
          type: postData.postRequestBodyType.regular,
          mediaFiles: postData.postFiles.makeMediaFiles(1, 0),
          mentionedUserIds: this.existingUserIds
        }
        break
      }
      case postData.postBodyData.positiveData.moderationImage: {
        body = {
          type: postData.postRequestBodyType.regular,
          mediaFiles: [
            {
              position: 1,
              mediaId: '',
              fileName: MediaData.fileNames.image[7].name,
              fileFormat: MediaData.fileNames.image[7].format,
              fileType: 'image'
            }
          ],
        }
        break
      }
      case postData.postBodyData.positiveData.moderationVideo: {
        body = {
          type: postData.postRequestBodyType.regular,
          mediaFiles: [
            {
              position: 1,
              mediaId: '',
              fileName: MediaData.fileNames.video[7].name,
              fileFormat: MediaData.fileNames.video[7].format,
              fileType: 'video'
            }
          ],
        }
        break
      }
      case postData.postBodyData.negativeData.moreThanAllowedCharsText: {
        body = {
          type: postData.postRequestBodyType.regular,
          text: textData.randomText.negativeData.invalidText5001Chars()
        }
        break
      }
      case postData.postBodyData.negativeData.moreThanAllowedFileCount: {
        body = {
          type: postData.postRequestBodyType.regular,
          text: textData.randomText.positiveData.regularText(),
          mediaFiles: postData.postFiles.makeMediaFiles(6, 0)
        }
        break
      }
      case postData.postBodyData.negativeData.noTextNoMedia: {
        body = {
          type: postData.postRequestBodyType.regular
        }
        break
      }
      case postData.postBodyData.negativeData.invalidPositionMedia: {
        let mediaFiles = postData.postFiles.makeMediaFiles(3, 0)
        let invalidOrderFiles = mediaFiles.slice(1)
        body = {
          type: postData.postRequestBodyType.regular,
          mediaFiles: invalidOrderFiles
        }
        break
      }
      case postData.postBodyData.negativeData.imageAndText: {
        body = {
          type: postData.postRequestBodyType.regular,
          text: textData.randomText.positiveData.regularText(),
          mediaFiles: postData.postFiles.makeMediaFiles(1, 0)
        }
        break
      }
      case postData.postBodyData.negativeData.anotherUserMedia: {
        body = {
          type: postData.postRequestBodyType.regular,
          text: textData.randomText.positiveData.regularText(),
          mediaFiles: postData.postFiles.makeMediaFiles(1, 0)
        }
        break
      }
      case postData.postBodyData.negativeData.sameMediaTwice: {
        body = {
          type: postData.postRequestBodyType.regular,
          text: textData.randomText.positiveData.regularText(),
          mediaFiles: postData.postFiles.makeMediaFiles(1, 0)
        }
        break
      }
      case postData.postBodyData.negativeData.invalidUserMention: {
        body = {
          type: postData.postRequestBodyType.regular,
          text: textData.randomText.positiveData.regularText(),
          mentionedUserIds: [randomGeneratorHelper.generateRandomGuid()]
        }
        break
      }
    }
    this.postReqData = body
  }

  async CreatePostWithValidData() {
    if (this.postReqData.mediaFiles) {
      this.postReqData.mediaFiles = await Promise.all(this.postReqData.mediaFiles.map(async (media) => {
        const mediaId = await this.UploadMedia(media.fileName, media.fileType, media.fileFormat)

        return {
          position: media.position,
          mediaId
        }
      }))
    }

    await postManager.createPost(this.postReqData).then((res) => {
      this.postId = res.body.id
      this.postResponseBody = res.body
      expect(res.body.id).to.exist

      if (this.postReqData.mediaFiles) {
        expect(res.body.mediaFiles).to.not.be.empty
      } else {
        expect(res.body.mediaFiles).to.be.empty
      }

      if (this.postReqData.mentionedUserIds) {
        expect(res.body.mentionedUsersCount).to.eq(this.postReqData.mentionedUserIds.length)
      }

      expect(res.body.isRepost).to.be.false
      expect(res.status).to.eq(200, "Post is created")
    })

    await postManager.getPost(this.postId).then((res) => {
      expect(res.status).to.eq(200, "Post info is received")
      let omittedKeys = ["unavailable", "createdAt", "updatedAt"]
      omittedKeys.forEach(key => delete this.postResponseBody[key])
      expect(res.body).to.containSubset(this.postResponseBody)
    })

    const vars = {
      postId: this.postId
    }
    Variables.changeVariables(vars)
  }


  async CreatePostWithInvalidData(data, tokenForMedia) {
    let reqData = data ? data : this.postReqData

    if (!data && reqData.mediaFiles) {
      reqData.mediaFiles = await Promise.all(reqData.mediaFiles.map(async (media) => {
        const mediaId = await this.UploadMedia(media.fileName, media.fileType, media.fileFormat, false, tokenForMedia)

        return {
          position: media.position,
          mediaId
        }
      }))
    }
    await postManager.createPost(reqData).then((res) => {
      if (res.body.title === "Conflict") {
        expect(res.status).to.eq(409, "Post with invalid user id for user mention is not created")
        expect(res.body.cause.cause.detail).to.include('is not present in table "users".')
      } else {
        expect(res.body.violations[0].message).to.exist
        expect(res.body.title).to.be.eq("Constraint Violation")
        expect(res.status).to.eq(400, "Post with invalid data is not created")
      }
    })

    const vars = {
      postId: ''
    }
    Variables.changeVariables(vars)
  }


  async CreateRepostWithValidData(postId) {
    // AFTER OWN REPOST CANNOT BE REPOSTED IS FIXED I CAN REMOVE THE CONDITION AND LEAVE ONLY EXISTING ID
    this.postReqData.repostedPostId = postId ? postId : this.existingPostId
    await postManager.createRepost(this.postReqData).then((res) => {
      this.repostId = res.body.id
      expect(res.body.id).to.exist
      expect(res.body).to.include(this.postReqData, "Request Body data is included in the Response Body")
      expect(res.body.repostedPost.id).to.eq(this.postReqData.repostedPostId)
      expect(res.body.isRepost).to.be.true
      expect(res.status).to.eq(200, "Repost is created")
    })
    const vars = {
      repostId: this.repostId
    }
    Variables.changeVariables(vars)
  }


  //ADD PARAMETER FOR VIOLATION MESSAGE, ADD LIST IN DATA AND CHOOSE THAT DATA AS VIOLATION MESSAGE TEXT
  async CreateRepostWithInvalidData(postId, myPostId) {
    if (this.postReqData.mediaFiles) {
      this.postReqData.mediaFiles = await Promise.all(this.postReqData.mediaFiles.map(async (media) => {
        const mediaId = await this.UploadMedia(media.fileName, media.fileType, media.fileFormat)

        return {
          position: media.position,
          mediaId
        }
      }))
    }
    if (myPostId) {
      this.postReqData.repostedPostId = this.postId
    } else {
      this.postReqData.repostedPostId = postId ? postId : this.existingPostId
    }
    await postManager.createRepost(this.postReqData).then((res) => {
      expect(res.body.violations[0].message).to.exist
      expect(res.body.title).to.eq("Constraint Violation")
      expect(res.status).to.eq(400, "Repost with invalid data is not created")
    })
    const vars = {
      repostId: ''
    }
    Variables.changeVariables(vars)
  }


  //UPDATE
  async UpdatePostWithValidData() {
    if (this.postReqData.mediaFiles) {
      this.postReqData.mediaFiles = await Promise.all(this.postReqData.mediaFiles.map(async (media) => {
        const mediaId = await this.UploadMedia(media.fileName, media.fileType, media.fileFormat)

        return {
          position: media.position,
          mediaId
        }
      }))
    }

    await postManager.updatePost(this.postId, this.postReqData).then((res) => {
      this.postResponseBody = res.body
      expect(res.body.id).to.eq(this.postId)

      if (this.postReqData.mediaFiles) {
        expect(res.body.mediaFiles).to.not.be.empty
      } else {
        expect(res.body.mediaFiles).to.be.empty
      }
      if (this.postReqData.mentionedUserIds) {
        expect(res.body.mentionedUsersCount).to.eq(this.postReqData.mentionedUserIds.length)
      }
      expect(res.body.isRepost).to.be.false
      expect(res.status).to.eq(200, "Post is updated")
    })

    await postManager.getPost(this.postId).then((res) => {
      expect(res.status).to.eq(200, "Post info is received")
      delete this.postResponseBody.updatedAt
      expect(res.body).to.containSubset(this.postResponseBody)
    })
  }

  async UpdatePostWithInvalidData() {
    if (this.postReqData.mediaFiles) {
      this.postReqData.mediaFiles = await Promise.all(this.postReqData.mediaFiles.map(async (media) => {
        const mediaId = await this.UploadMedia(media.fileName, media.fileType, media.fileFormat)

        return {
          position: media.position,
          mediaId
        }
      }))
    }

    await postManager.updatePost(this.postId, this.postReqData).then((res) => {
      if (res.body.title === "Conflict") {
        expect(res.status).to.eq(409, "Post with invalid user id for user mention is not created")
        expect(res.body.cause.cause.detail).to.include('is not present in table "users".')
      } else {
        expect(res.body.violations[0].message).to.exist
        expect(res.body.title).to.eq("Constraint Violation")
        expect(res.status).to.eq(400, "Post with invalid data is not updated")
      }
    })
  }


  async UpdateRepostWithValidData() {
    await postManager.updatePost(this.repostId, this.postReqData).then((res) => {
      this.postResponseBody = res.body
      expect(res.body.id).to.eq(this.repostId)
      expect(res.body).to.include(this.postReqData, "Request Body data is included in the Response Body")
      expect(res.body.isRepost).to.be.true
      expect(res.status).to.eq(200, "Repost is updated")
    })

    await postManager.getPost(this.repostId).then((res) => {
      expect(res.status).to.eq(200, "Repost info is received")
      delete this.postResponseBody.updatedAt
      expect(res.body).to.containSubset(this.postResponseBody)

    })
  }


  async UpdateRepostWithInvalidData() {
    if (this.postReqData.mediaFiles) {
      this.postReqData.mediaFiles = await Promise.all(this.postReqData.mediaFiles.map(async (media) => {
        const mediaId = await this.UploadMedia(media.fileName, media.fileType, media.fileFormat)

        return {
          position: media.position,
          mediaId
        }
      }))
    }

    await postManager.updatePost(this.repostId, this.postReqData).then((res) => {
      expect(res.body.violations[0].message).to.exist
      expect(res.body.title).to.eq("Constraint Violation")
      expect(res.status).to.eq(400, `Repost with invalid data is not created`)
    })
  }


  async DeletePost(type, postId, token) {
    if (Variables.global.postId || postId && type === postData.postType.regular) {
      await postManager.deletePost(postId ? postId : Variables.global.postId, token ? token : Variables.global.accessToken).then((res) => {
        expect(res.status).to.eq(204, "Post is deleted")
      })
      await postManager.getPost(postId ? postId : Variables.global.postId, token ? token : Variables.global.accessToken).then((res) => {
        expect(res.status).to.eq(404)
        expect(res.body.title).to.eq("Not Found")
      })
      const vars = {
        postId: ''
      }
      Variables.changeVariables(vars)
    } else if (Variables.global.repostId || postId && type === postData.postType.repost) {
      await postManager.deletePost(postId ? postId : Variables.global.repostId, token ? token : Variables.global.accessToken).then((res) => {
        expect(res.status).to.eq(204, "Repost is deleted")
      })
      await postManager.getPost(postId ? postId : Variables.global.repostId, token ? token : Variables.global.accessToken).then((res) => {
        expect(res.status).to.eq(404)
        expect(res.body.title).to.eq("Not Found")
      })
      const vars = {
        repostId: ''
      }
      Variables.changeVariables(vars)
    } else if (Variables.global.sellableId || postId && type === postData.postType.sellable) {
      await postManager.deletePost(postId ? postId : Variables.global.sellableId, token ? token : Variables.global.accessToken).then((res) => {
        expect(res.status).to.eq(204, "Sellable post is deleted")
      })
      await postManager.getPost(postId ? postId : Variables.global.sellableId, token ? token : Variables.global.accessToken).then((res) => {
        expect(res.status).to.eq(404)
        expect(res.body.title).to.eq("Not Found")
      })
      const vars = {
        sellableId: ''
      }
      Variables.changeVariables(vars)
    }
  }

  async DeleteAnotherUserPostNegative(postId) {
    if (postId) {
      await postManager.deletePost(postId).then((res) => {
        expect(res.status).to.eq(403, "Post is not deleted")
        expect(res.body.title).to.eq("Forbidden")
      })
      await postManager.getPost(postId).then((res) => {
        expect(res.status).to.eq(200, "Post is found")

      })
    }
  }

  async GetFeed(size) {
    await postManager.getFeed(size).then((res) => {
      expect(res.status).to.eq(200, "Feed is received")
      expect(res.body.content).to.not.be.empty

      this.feedPosts = res.body.content.map(post => {
        return post.id
      })
    })
  }

  async MarkPostAsViewed(postCount) {
    if (postCount) {
      for (let i = 0; i < postCount; i++) {
        this.viewedPosts.push(this.feedPosts[i])
      }
    } else {
      this.viewedPosts = this.feedPosts
    }

    await postManager.markPostAsViewed(this.viewedPosts).then((res) => {
        expect(res.status).to.eq(200, "Post is marked as seen")
      }
    )
  }

  async ValidateFeedAfterPostsMarkedViewed(size) {
    await postManager.getFeed(size).then((res) => {
      expect(res.status).to.eq(200, "Feed is received")
      expect(res.body.content).to.not.be.empty

      let newFeedPosts = res.body.content.map((post) => {
        return post.id
      })
      const oldAndNewPostsAreSame = DataHelper.arrayEqual(newFeedPosts, this.feedPosts)
      expect(oldAndNewPostsAreSame).to.be.false

      if (this.viewedPosts.length !== this.feedPosts.length) {
        const notViewedPosts = this.feedPosts.slice(this.viewedPosts.length)
        const notViewedPostsInNew = notViewedPosts.map((id) => newFeedPosts.includes(id))
        notViewedPostsInNew.map((id) => expect(id).to.be.true)
      }
    })
  }

  //FUNCTIONS FOR GENERAL USE


  async CreatePost(token, data) {

    let reqData = data ? data : this.postReqData
    if (!data && reqData.mediaFiles) {
      reqData.mediaFiles = await Promise.all(reqData.mediaFiles.map(async (media) => {
        const mediaId = await this.UploadMedia(media.fileName, media.fileType, media.fileFormat, false, token ? token : Variables.testUsers.user1.accessToken)
        return {
          position: media.position,
          mediaId
        }
      }))
    }
    this.res = await postManager.createPost(reqData, token ? token : Variables.testUsers.user1.accessToken)
    this.postId = this.res.body.id
    expect(this.res.status).to.eq(200, "Post is created")
    return this.res.body.id
  }
}

//Make the delete function as switch case
module.exports = CreatePostPage