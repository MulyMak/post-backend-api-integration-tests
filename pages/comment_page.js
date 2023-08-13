import voteManager from "../manager/requestManagers/voteManager";

const BasePage = require("./base_page");
const Variables = require("../variabels/variables");
const postManager = require("../manager/requestManagers/postManager");
const commentManager = require("../manager/requestManagers/commentManager")
const commentData = require("../static/comment_data")
import textData from "../static/general_data"
import randomGeneratorHelper from "../helpers/randomGeneratorhelper"
import {logPlugin} from "@babel/preset-env/lib/debug";
import {log} from "mochawesome/src/utils";

let chai = require('chai');
let chaiSubset = require('chai-subset');
chai.use(chaiSubset);
const {expect} = require("chai");


class CreateCommentPage extends BasePage {
  constructor() {
    super();
    this.res = {}
    this.commentReqData = {}
    this.commentId = ""
    this.commentResponseBody = {}
    this.commentsCount = 0
    this.hasInvalidId = false
  }

  ChangeCommentData(type) {
    let body = {}

    switch (type) {
      case commentData.commentBodyData.positiveData.commentMinChar: {
        body = {
          postId: this.existingPostId,
          text: textData.randomText.positiveData.shortText()
        }
        this.hasInvalidId = false
        break
      }
      case commentData.commentBodyData.positiveData.replyToCommentMaxChar: {
        body = {
          postId: this.existingPostId,
          text: textData.randomText.positiveData.longestText(),
          parentId: this.existingCommentId
        }
        this.hasInvalidId = false
        break
      }
      case commentData.commentBodyData.positiveData.replyToReply: {
        body = {
          postId: this.existingPostId,
          text: textData.randomText.positiveData.regularText(),
          parentId: this.existingCommentReplyId
        }
        this.hasInvalidId = false
        break
      }
      case commentData.commentBodyData.positiveData.commentOwnPost: {
        body = {
          postId: Variables.global.postId,
          text: textData.randomText.positiveData.regularText(),
        }
        this.hasInvalidId = false
        break
      }
      case commentData.commentBodyData.negativeData.noTextComment: {
        body = {
          postId: Variables.global.postId,
          text: textData.randomText.negativeData.invalidTextEmptyString,
        }
        this.hasInvalidId = false
        break
      }
      case commentData.commentBodyData.negativeData.moreThanAllowedChars: {
        body = {
          postId: this.existingPostId,
          text: textData.randomText.negativeData.invalidText5001Chars(),
        }
        this.hasInvalidId = false
        break
      }
      case commentData.commentBodyData.negativeData.noPostIdComment: {
        body = {
          text: textData.randomText.positiveData.regularText(),
        }
        this.hasInvalidId = false
        break
      }
      case commentData.commentBodyData.negativeData.commentRepost: {
        body = {
          postId: this.existingRepostId,
          text: textData.randomText.positiveData.regularText(),
        }
        this.hasInvalidId = false
        break
      }
      case commentData.commentBodyData.negativeData.invalidPostIdComment: {
        body = {
          postId: randomGeneratorHelper.generateRandomGuid(),
          text: textData.randomText.positiveData.regularText(),
        }
        this.hasInvalidId = true
        break
      }
      case commentData.commentBodyData.negativeData.invalidParentIdReply: {
        body = {
          postId: Variables.global.postId,
          text: textData.randomText.positiveData.regularText(),
          parentId: randomGeneratorHelper.generateRandomGuid()
        }
        this.hasInvalidId = true
        break
      }
    }
    this.commentReqData = body
  }

  async CreateCommentWithValidData() {
//IF I CAN CREATE A REQUEST THAT STORES ALL THE DATA FROM THE GET RESPONSE THEN TO USE FOR COMPARISON WHEN NEEDED
    await postManager.getPost(this.commentReqData.postId).then((res) => {
      expect(res.status).to.eq(200, "Post is received before comment creation")
      this.commentsCount = res.body.commentsCount
    })
    await commentManager.createComment(this.commentReqData).then((res) => {
      expect(res.status).to.eq(200, "Comment is created")
      expect(res.body.id).to.exist
      this.commentId = res.body.id
      this.commentResponseBody = res.body

      if (this.commentReqData.parentId) {
        expect(res.body.parentId).to.exist
      } else {
        expect(res.body.parentId).not.to.exist
      }
    })

    await commentManager.getComment(this.commentId).then((res) => {
      expect(res.status).to.eq(200, "Comment info is received")
      let omittedKeys = ["createdAt", "updatedAt"]
      omittedKeys.forEach(key => delete this.commentResponseBody[key])
      expect(res.body).to.containSubset(this.commentResponseBody)
    })

    await postManager.getPost(this.commentReqData.postId).then((res) => {
      expect(res.status).to.eq(200, "Post is received after comment creation")
      expect(res.body.commentsCount).to.eq(this.commentsCount + 1)
      this.commentsCount = res.body.commentsCount
    })
    const vars = {
      commentId: this.commentId
    }
    Variables.changeVariables(vars)
  }

  async CreateCommentWithInvalidData() {
    await commentManager.createComment(this.commentReqData).then((res) => {
      if (this.hasInvalidId) {
        expect(res.status).to.eq(404, 'Comment with invalid post or parent id is not created')
        expect(res.body.detail).to.include(`404 NOT_FOUND`)
      } else {
        expect(res.body.violations[0].message).to.exist
        expect(res.body.title).to.be.eq("Constraint Violation")
        expect(res.status).to.eq(400, "Comment with invalid data is not created")
      }
    })
    const vars = {
      commentId: ''
    }
    Variables.changeVariables(vars)
  }

  async UpdateComment(text) {

    let data = {
      text: text
    }
    await commentManager.updateComment(data, this.commentId).then((res) => {
      if (text.length > 5000 || text === "") {
        expect(res.body.violations[0].message).to.exist
        expect(res.body.title).to.be.eq("Constraint Violation")
        expect(res.status).to.eq(400, "Comment with invalid data is not updated")
      } else {
        expect(res.status).to.eq(200, `Update of the comment is successful`)
        expect(res.body.id).to.eq(this.commentId)
        expect(res.body.text).to.eq(data.text)
        commentManager.getComment(this.commentId).then((res) => {
          expect(res.status).to.eq(200, "Comment info is received after update")
          expect(res.body.text).to.eq(data.text)
        })
      }
    })
  }

  async DeleteCommentWithValidations() {
    if (Variables.global.commentId) {
      await commentManager.deleteComment(this.commentId).then((res) => {
        expect(res.status).to.eq(204, "Comment is deleted")
      })

      await commentManager.getComment(this.commentId).then((res) => {
        expect(res.status).to.eq(404, "Comment was no found")
        expect(res.body.detail).to.include(`404 NOT_FOUND`)
      })

      await postManager.getPost(this.commentReqData.postId).then((res) => {
        expect(res.status).to.eq(200, "Post is received after comment is deleted")
        expect(res.body.commentsCount).to.eq(this.commentsCount - 1)
        this.commentsCount = 0
      })

      this.commentId = ""
      const vars = {
        commentId: ""
      }
      Variables.changeVariables(vars)
    }
  }

  /// FUNCTIONS FOR GENERAL USE

  async CreateComment(postId, text, parentId, token, negativeStatus) {
    let data = {
      postId,
      text
    }
    if (parentId) {
      data.parentId = parentId
    }

    this.res = await commentManager.createComment(data, token ? token : Variables.testUsers.user1.accessToken)
    if (negativeStatus) {
      expect(this.res.status).to.eq(negativeStatus, "Comment is not created")
      return this.res.body
    } else {
      this.commentId = this.res.body.id
      expect(this.res.status).to.eq(200, "Comment is created")
      return this.commentId
    }
  }

  async DeleteComment(commentId, token) {
    this.res = await commentManager.deleteComment(commentId ? commentId : this.res.body.id, token ? token : Variables.testUsers.user1.accessToken)
    expect(this.res.status).to.eq(204, "Comment is deleted")
  }

  async DeleteCommentForbidden(commentId, token) {
    this.res = await commentManager.deleteComment(commentId ? commentId : this.res.body.id, token ? token : Variables.testUsers.user1.accessToken)
    expect(this.res.status).to.eq(403, "Comment is not allowed to be deleted")
  }

  async GetDeletedComment(commentId, token) {
    this.res = await commentManager.getComment(commentId, token ? token : Variables.testUsers.user1.accessToken)
      expect(this.res.status).to.eq(404, "Comment was no found")
      expect(this.res.body.detail).to.include(`404 NOT_FOUND`)
  }
}

module.exports = CreateCommentPage