/**
 * @author Emma
 * @date 08-20-2020
 */

const {expect} = require('chai');
const fs = require('fs');
const randomGeneratorHelper = require('../helpers/randomGeneratorhelper');
const authenticationManager = require('../manager/requestManagers/authenticationManager');
const Variables = require('../variabels/variables');
const profileManager = require('../manager/requestManagers/profileManager');
const postManager = require('../manager/requestManagers/postManager');
const mediaManager = require('../manager/requestManagers/mediaManager');
const commentManager = require('../manager/requestManagers/commentManager')
const generalSearchManager = require('../manager/requestManagers/generalSearchManager')
const userData = require('../static/user_data');

let chai = require('chai');
let chaiSubset = require('chai-subset');
const generalData = require('../static/general_data');
chai.use(chaiSubset);

class BasePage {

  constructor() {
    this.data = {}
    this.existingUsername = ''
    this.existingUserIds = []
    this.existingPostId = ''
    this.existingRepostId = ''
    this.existingCommentId = ''
    this.invalidUsernames = userData.username.negativeData
    this.invalidNames = userData.profileName.negativeData
    this.invalidBios = userData.bio.negativeData
    this.existingCommentReplyId = ''
    this.queryParamsReqData = {}
    this.followings = []
    this.followers = []
    this.res = {}
    this.userPostsIds = []
  }


  async SignUp() {

    const data = {
      email: randomGeneratorHelper.generateEmail(),
      password: randomGeneratorHelper.generatePassword(),
      returnSecureToken: true
    }

    this.data = data
    return authenticationManager.signUp(false, data).then((res) => {
      expect(res.status).to.eq(200, 'Sign up is successful')
      const vars = {
        accessToken: res.body.idToken,
        userEmail: data.email,
        userPassword: data.password,
        authProviderId: res.body.localId,
        userId: ''
      }
      Variables.changeVariables(vars)
    })
  }


  async SignIn(credentials, testUserNumber) {
    return authenticationManager.signIn(credentials ? credentials : this.data).then((res) => {
      expect(res.status).to.eq(200, 'Sign in is successful')
      const vars = {
        accessToken: res.body.idToken
      }

      if (credentials) {
        const user = {
          accessToken: res.body.idToken,
        }
        Variables.changeTestUsers(testUserNumber, user)
      } else {
        Variables.changeVariables(vars)
      }
    })
  }

  async GetUserIdViaAuthDetails(token, testUserNumber) {
    await authenticationManager.getAuthenticationDetails(token ? token : Variables.global.accessToken).then((res) => {
      expect(res.status).to.eq(200, 'Auth details are received')
      const vars = {
        userId: res.body.userId
      }

      if (token) {
        const user = {
          userId: res.body.userId,
        }
        Variables.changeTestUsers(testUserNumber, user)
      } else {
        Variables.changeVariables(vars)
      }
    })
  }


  ChangeQueryParamData(page, size, sort, username, text) {
    let data = {}

    if (page || page === 1) {
      data.page = page
    }
    if (size) {
      data.size = size
    }
    if (sort) {
      data.sort = sort
    }
    if (username) {
      data.username = username
    }
    if (text) {
      data.text = text
    }
    this.queryParamsReqData = data
    return data
  }


  async VerifyProfileIsNotCreated() {
    return await authenticationManager.getAuthenticationDetails().then((res) => {
      expect(res.body.isProfileCreated).to.be.false
      const vars = {
        authProviderId: res.body.authenticationProviderUserId
      }
      Variables.changeVariables(vars)
    })
  }

  async AccessIsDenied() {
    return await profileManager.getAllUsers().then((res) => {
      expect(res.body.status).to.eq(403)
      expect(res.body.detail).to.eq('Access is denied')
    })
  }

  async CreateUser(username, profileName) {
    let userId;
    let data = {
      username: username,
      authenticationProviderUserId: Variables.global.authProviderId,
      name: profileName ? profileName : ''
    }
    await profileManager.createUser(data, Variables.global.accessToken).then((res) => {
      userId = res.body.id
      expect(res.body).to.include(data)
      expect(res.body.id).to.exist
      expect(res.status).to.eq(200, 'User is created')
    })
    const vars = {
      userId: userId,
      username: data.username
    }
    Variables.changeVariables(vars)
  }


  async GetExistingUsername() {
    await profileManager.getAllUsers().then((res) => {
      expect(res.status).to.eq(200, 'All users list is received')
      for (let i = 0; i < res.body.content.length; i++) {
        let user = res.body.content[Math.floor(Math.random() * res.body.content.length)]
        if (!user.deletedAt) {
          this.existingUsername = user.username
          return this.existingUsername
        }
      }
    })
  }

  async GetExistingUserIds(idCount = 1, userId, token, page = 1) {
    const queries = {
      size: 50,
      page
    }
    await profileManager.getAllUsers(queries, token ? token : Variables.testUsers.user1.accessToken).then(async (res) => {
      expect(res.status).to.eq(200, 'All users list is received')
      for (let i = 0; this.existingUserIds.length < idCount && i < res.body.content.length; i++) {
        if (
          !res.body.content[i].deletedAt
          && !res.body.content[i].username.includes('admin')
          && res.body.content[i].id !== (userId ? userId : Variables.testUsers.user1.userId)
        ) {
          this.existingUserIds.push(res.body.content[i].id)
        }
      }
      if (this.existingUserIds.length < idCount) {
       return await this.GetExistingUserIds(idCount, userId, token, page + 1)
      }
    })
    return this.existingUserIds
  }

  async GetUserPosts(userId, token) {
    this.res = await postManager.getUserPosts
    (
      userId ? userId : Variables.testUsers.user1.userId,
      token ? token : Variables.testUsers.user1.accessToken
    )
    expect(this.res.status).to.eq(200, 'All posts list is received')
    this.userPostsIds = []
    this.res.body.content.forEach(post => {
      if (!post.isRepost) {
        this.userPostsIds.push(post.id)
      }
    })
    return this.userPostsIds
  }

  async GetExistingPostId(page = 1) {
    const queries = {
      size: 50,
      page
    }
    await postManager.getAllPosts(queries).then((res) => {
      expect(res.status).to.eq(200, 'All posts list is received')
      let bodyContent = res.body.content.find((el) => {
        return el.isRepost === false && el.ownedBy.id !== Variables.global.userId //BECAUSE OF THE LOGIC CHANGE I NEED TO THINK TO HOW
        // TO MAKE SURE IT FILTERS MY POSTS FOR THE TEST USERS 1 /2 IF NEEDED, CURRENTLY WORKING FOR THE NEWLY CREATED USER
      })
      this.existingPostId = bodyContent.id
    })
  }

  async GetExistingRepostId(page = 1) {
    const queries = {
      size: 50,
      page
    }
    await postManager.getAllPosts(queries).then(async (res) => {
      expect(res.status).to.eq(200, 'All posts list is received')
      let bodyContent = res.body.content.find((el) => {
        return el.isRepost === true
      })
      if (bodyContent) {
        this.existingRepostId = bodyContent.id
      } else {
        await this.GetExistingRepostId(page + 1)
      }
    })
  }

  async GetExistingCommentId() {
    this.ChangeQueryParamData(0, 40, generalData.sort.byCreatedAtDescending)
    await commentManager.getAllComments(this.queryParamsReqData).then((res) => {
      expect(res.status).to.eq(200, 'All comments list is received')
      this.existingCommentId = res.body.content[0].id
    })
  }

  async GetExistingCommentReplyId(page = 1) {
    this.ChangeQueryParamData(page, 40, generalData.sort.byCreatedAtDescending)
    await commentManager.getAllComments(this.queryParamsReqData).then(async (res) => {
      expect(res.status).to.eq(200, 'All comments list is received')

      let comment = res.body.content.find((el) => {
        return el.children.length !== 0
      })

      if (comment) {
        this.existingCommentReplyId = comment.children[0].id
      } else {
        await this.GetExistingCommentReplyId(page + 1)
      }
    })
  }


  async DeleteUser() {
    if (Variables.global.userId) {
      await profileManager.deleteUser().then((res) => {
        expect(res.status).to.eq(204, 'User is Deleted')
      })
      const vars = {
        userId: '',
        accessToken: ''
      }
      Variables.changeVariables(vars)
    }
  }


  async UploadMedia(fileName, fileType, fileFormat, negativeFormat, token) {
    let mediaData = {
      originalFileName: fileName,
      mimeType: fileFormat
    }

    const res = await mediaManager.createMedia(mediaData, token ? token : Variables.global.accessToken)
    let putMediaUrl = res.body.putURL
    expect(res.status).to.eq(200, 'Media is Created')
    expect(res.body).to.exist

    const file = fs.readFileSync(`${process.env.MEDIA_FILES_BASE_PATH}${fileType}/${fileName}`)

    if (negativeFormat) {
      await mediaManager.uploadFile(putMediaUrl, file, negativeFormat).then((res) => {
        expect(res.status).to.eq(403, 'File is Not Uploaded')
      })

    } else {
      await mediaManager.uploadFile(putMediaUrl, file, fileFormat).then((res) => {
        expect(res.status).to.eq(200, 'File is Uploaded')
      })
    }

    const vars = {
      mediaId: res.body.id
    }
    Variables.changeVariables(vars)

    return res.body.id
  }

  async SearchForUsersWithValidations(username, token) {
    this.ChangeQueryParamData(false, 50, false, username)
    this.res = await generalSearchManager.searchUsers(this.queryParamsReqData, token ? token : Variables.testUsers.user1.accessToken)
    expect(this.res.status).to.eq(200, 'Searched list of users is received')
    if (username === 'nonexistingusernameornamefortest') {
      expect(this.res.body.content.length).to.eq(0)
      expect(this.res.body.totalElements).to.eq(0)
    } else if (username === Variables.testUsers.user1.username) {
      if (this.res.body.totalElements !== 0) {
        this.res.body.content.map(user => {
          let lowercaseUsername = username.toLowerCase()
          if (!user.username.includes(username)) {
            expect(user.name.toLowerCase()).to.not.eq(lowercaseUsername)
          } else {
            expect(user.username.toLowerCase()).to.not.eq(lowercaseUsername)
          }
        })
      }
    } else {
      expect(this.res.body.totalElements).to.not.eq(0, 'Results for the user search are found')
      this.res.body.content.map(user => {
        let lowercaseUsername = username.toLowerCase()
        if (!user.username.includes(username)) {
          expect(user.name.toLowerCase()).to.include(lowercaseUsername)
        } else {
          expect(user.username.toLowerCase()).to.include(lowercaseUsername)
        }
      })
    }
  }

  async SearchForPostsWithValidations(text, token) {
    this.ChangeQueryParamData(false, 50, generalData.sort.byCreatedAtDescending, false, text)
    this.res = await generalSearchManager.searchPosts(this.queryParamsReqData, token ? token : Variables.testUsers.user1.accessToken)
    expect(this.res.status).to.eq(200, 'Searched list of posts is received')
    if (text === 'nonexistingpostfortest') {
      expect(this.res.body.content.length).to.eq(0)
      expect(this.res.body.totalElements).to.eq(0)
    } else {
      expect(this.res.body.totalElements).to.not.eq(0, 'Results for the post search are found')
      this.res.body.content.map(post => {
        let lowercaseText = text.toLowerCase()
        expect(post.text.toLowerCase()).to.include(lowercaseText)
      })
    }
  }


  //FUNCTIONS FOR GENERAL USE

  async SearchForPosts(text, token) {
    this.ChangeQueryParamData(false, 50, generalData.sort.byCreatedAtDescending, false, text)
    this.res = await generalSearchManager.searchPosts(this.queryParamsReqData, token ? token : Variables.testUsers.user1.accessToken)
    expect(this.res.status).to.eq(200, 'Searched list of posts is received')
    return this.res.body
  }

  async SearchForUsers(username, token) {
    this.ChangeQueryParamData(false, 50, false, username)
    this.res = await generalSearchManager.searchUsers(this.queryParamsReqData, token ? token : Variables.testUsers.user1.accessToken)
    expect(this.res.status).to.eq(200, 'Searched list of users is received')
    return this.res.body
  }

}

module.exports = BasePage