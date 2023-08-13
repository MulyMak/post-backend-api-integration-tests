const {expect} = require("chai");
const Variables = require("../variabels/variables");
const postManager = require("../manager/requestManagers/postManager");
const voteManager = require("../manager/requestManagers/voteManager")
const commentManager = require("../manager/requestManagers/commentManager")
const voteData = require("../static/vote_data")

let chai = require('chai');
let chaiSubset = require('chai-subset');
const BasePage = require("./base_page");
chai.use(chaiSubset);

class CreateVotePage extends BasePage {
  constructor() {
    super();
    this.res = {}
    this.voteReqData = {}
    this.voteId = ""
    this.voteType = ""
    this.upvoteCount = 0
    this.downvoteCount = 0

  }

  ChangeVoteData(type) {
    let body = {}

    switch (type) {
      case voteData.voteBodyData.positiveData.upvoteOwnPost: {
        body = {
          target: voteData.voteTarget.post,
          targetId: Variables.global.postId,
          type: voteData.voteType.upvote
        }
        break
      }
      case voteData.voteBodyData.positiveData.downvoteOwnPost: {
        body = {
          target: voteData.voteTarget.post,
          targetId: Variables.global.postId,
          type: voteData.voteType.downvote
        }
        break
      }
      case voteData.voteBodyData.positiveData.upvoteOtherPost: {
        body = {
          target: voteData.voteTarget.post,
          targetId: this.existingPostId,
          type: voteData.voteType.upvote
        }
        break
      }
      case voteData.voteBodyData.positiveData.downvoteOtherPost: {
        body = {
          target: voteData.voteTarget.post,
          targetId: this.existingPostId,
          type: voteData.voteType.downvote
        }
        break
      }
      case voteData.voteBodyData.positiveData.upvoteOwnComment: {
        body = {
          target: voteData.voteTarget.comment,
          targetId: Variables.global.commentId,
          type: voteData.voteType.upvote
        }
        break
      }
      case voteData.voteBodyData.positiveData.downvoteOwnComment: {
        body = {
          target: voteData.voteTarget.comment,
          targetId: Variables.global.commentId,
          type: voteData.voteType.downvote
        }
        break
      }
      case voteData.voteBodyData.positiveData.upvoteOtherComment: {
        body = {
          target: voteData.voteTarget.comment,
          targetId: this.existingCommentId,
          type: voteData.voteType.upvote
        }
        break
      }
      case voteData.voteBodyData.positiveData.downvoteOtherCommentReply: {
        body = {
          target: voteData.voteTarget.comment,
          targetId: this.existingCommentReplyId,
          type: voteData.voteType.downvote
        }
        break
      }
      case voteData.voteBodyData.negativeData.commentIdForPost: {
        body = {
          target: voteData.voteTarget.post,
          targetId: this.existingCommentId,
          type: voteData.voteType.upvote
        }
        break
      }
      case voteData.voteBodyData.negativeData.postIdForComment: {
        body = {
          target: voteData.voteTarget.comment,
          targetId: this.existingPostId,
          type: voteData.voteType.downvote
        }
        break
      }
      case voteData.voteBodyData.negativeData.invalidTarget: {
        body = {
          target: "post", //lower case not allowed that's why invalid
          targetId: Variables.global.postId,
          type: voteData.voteType.downvote
        }
        break
      }
      case voteData.voteBodyData.negativeData.invalidType: {
        body = {
          target: voteData.voteTarget.post,
          targetId: Variables.global.postId,
          type: "upvote" //lower case not allowed that's why invalid
        }
        break
      }
      case voteData.voteBodyData.negativeData.upvoteRepost: {
        body = {
          target: voteData.voteTarget.post,
          targetId: this.existingRepostId,
          type: voteData.voteType.downvote
        }
        break
      }
    }
    this.voteReqData = body
  }

  async CreateVoteWithValidData() {
    let targetId = this.voteReqData.targetId
    let res = {}
    if (this.voteReqData.target === voteData.voteTarget.post) {
      res = await postManager.getPost(targetId)
    } else if (this.voteReqData.target === voteData.voteTarget.comment) {
      res = await commentManager.getComment(targetId)
    }

    expect(res.status).to.eq(200, `${this.voteReqData.target} is received`)
    expect(res.body.upvotes).to.exist
    expect(res.body.downvotes).to.exist
    this.upvoteCount = res.body.upvotes
    this.downvoteCount = res.body.downvotes

    await voteManager.createVote(this.voteReqData).then((res) => {
      this.voteId = res.body.id
      this.voteType = res.body.type
      expect(res.status).to.eq(200, `${this.voteReqData.target} has been ${this.voteReqData.type}ed`)
      expect(res.body).to.containSubset(this.voteReqData)
    })
    const vars = {
      voteId: this.voteId
    }
    Variables.changeVariables(vars)

    if (this.voteReqData.target === voteData.voteTarget.post) {
      res = await postManager.getPost(targetId)
    } else if (this.voteReqData.target === voteData.voteTarget.comment) {
      res = await commentManager.getComment(targetId)
    }

    expect(res.status).to.eq(200, `${this.voteReqData.target} is received after voting`)

    if (this.voteReqData.type === "UPVOTE") {
      expect(res.body.upvotes).to.eq(this.upvoteCount + 1)
      expect(res.body.downvotes).to.eq(this.downvoteCount)
    } else {
      expect(res.body.downvotes).to.eq(this.downvoteCount + 1)
      expect(res.body.upvotes).to.eq(this.upvoteCount)
    }
    this.upvoteCount = res.body.upvotes
    this.downvoteCount = res.body.downvotes
  }


  async CreateVoteWithInvalidData() {
    await voteManager.createVote(this.voteReqData).then((res) => {
      if (
        (this.voteReqData.target === "POST" && this.voteReqData.targetId === this.existingCommentId)
        || (this.voteReqData.target === "COMMENT" && this.voteReqData.targetId === this.existingPostId)
      ) {
        expect(res.status).to.eq(404, 'Vote with non matching ID and target is not created')
        expect(res.body.detail).to.include(`404 NOT_FOUND`)
      } else if (
        (this.voteReqData.target !== voteData.voteTarget.post
          && this.voteReqData.target !== voteData.voteTarget.comment)
        || (this.voteReqData.type !== voteData.voteType.upvote
          && this.voteReqData.type !== voteData.voteType.downvote)
      ) {
        expect(res.status).to.eq(400, 'Vote with invalid target is not created')
        expect(res.body.cause.detail).to.include(`Cannot deserialize value of type`)
      } else if (this.voteReqData.targetId === this.existingRepostId) {
        expect(res.status).to.eq(400, 'Vote for repost is not created')
        expect(res.body.violations[0].message).to.include(`Unable to apply a vote to repost`)
      } else {
        expect(res.status).to.eq(409, `Conflict: Vote is not created`)
        expect(res.body.cause.cause.detail).to.include(`ERROR: duplicate key value violates unique constraint`)
      }
    })
    const vars = {
      voteId: ''
    }
    Variables.changeVariables(vars)
  }

  async UpdateVoteWithValidations(type) {
    let data = {
      type: type
    }
    let res = {}
    let targetId = this.voteReqData.targetId
    await voteManager.updateVote(data, this.voteId).then((res) => {
      expect(res.status).to.eq(200, `Update to ${data.type} is successful`)
      expect(res.body.id).to.eq(this.voteId)
      expect(res.body.type).to.eq(data.type)
      expect(res.body.target).to.eq(this.voteReqData.target)
    })

    if (this.voteReqData.target === voteData.voteTarget.post) {
      res = await postManager.getPost(targetId)
    } else if (this.voteReqData.target === voteData.voteTarget.comment) {
      res = await commentManager.getComment(targetId)
    }

    expect(res.status).to.eq(200, `${this.voteReqData.target} is received`)
    if (data.type === voteData.voteType.upvote) {
      expect(res.body.upvotes).to.eq(this.upvoteCount + 1)
      expect(res.body.downvotes).to.eq(this.downvoteCount - 1)
    } else {
      expect(res.body.downvotes).to.eq(this.downvoteCount + 1)
      expect(res.body.upvotes).to.eq(this.upvoteCount - 1)
    }
    this.upvoteCount = res.body.upvotes
    this.downvoteCount = res.body.downvotes
    this.voteType = type
  }

  async DeleteVoteWithValidations() {
    if (Variables.global.voteId) {
      await voteManager.deleteVote(this.voteId).then((res) => {
        expect(res.status).to.eq(204, "Vote is deleted")
      })

      let res = {}
      let targetId = this.voteReqData.targetId

      if (this.voteReqData.target === voteData.voteTarget.post) {
        res = await postManager.getPost(targetId)
      } else if (this.voteReqData.target === voteData.voteTarget.comment) {
        res = await commentManager.getComment(targetId)
      }
      expect(res.status).to.eq(200, `${this.voteReqData.target} is received`)
      if (this.voteType === voteData.voteType.upvote) {
        expect(res.body.upvotes).to.eq(this.upvoteCount - 1)
        expect(res.body.downvotes).to.eq(this.downvoteCount)
      } else {
        expect(res.body.downvotes).to.eq(this.downvoteCount - 1)
        expect(res.body.upvotes).to.eq(this.upvoteCount)
      }
      this.upvoteCount = res.body.upvotes
      this.downvoteCount = res.body.downvotes

      this.voteId = ""
      const vars = {
        voteId: ""
      }
      Variables.changeVariables(vars)
    }
  }


  /// FUNCTIONS FOR GENERAL USE

  async CreateVote(target, type, targetId, token, negativeStatus) {
    let data = {
      target,
      targetId,
      type
    }
    this.res = await voteManager.createVote(data, token ? token : Variables.testUsers.user1.accessToken)
    if (negativeStatus) {
      expect(this.res.status).to.eq(negativeStatus, "Vote is not created")
      return this.res.body
    } else {
      this.voteId = this.res.body.id
      expect(this.res.status).to.eq(200, "Vote is created")
      return this.voteId
    }
  }

  async UpdateVote(type, targetId, voteId, token) {
    let data = {
      targetId,
      type
    }
    this.res = await voteManager.updateVote(data, voteId ? voteId : this.voteId, token ? token : Variables.testUsers.user1.accessToken)
    expect(this.res.status).to.eq(200, `Update to ${data.type} is successful`)
  }

  async DeleteVote(voteId, token) {
    this.res = await voteManager.deleteVote(voteId ? voteId : this.res.body.id, token ? token : Variables.testUsers.user1.accessToken)
    expect(this.res.status).to.eq(204, "Vote is deleted")
  }
}

module.exports = CreateVotePage