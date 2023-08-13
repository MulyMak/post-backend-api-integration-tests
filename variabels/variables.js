const startVariables = {
  dev: {
    user1: {
      username: 'testuser1',
      postId: '506624f8-8e29-41fd-bca3-1a9818d195cb',
      postText: 'test post 1',
      commentId: '55d70611-eb37-4adb-8e84-2144780a11b9'
    },
    user2: {
      username: 'testuser2',
      postId: 'b20f5c6d-90fa-48e2-89ef-82529b8cf096',
      postText: 'test post 2',
      commentId: '6019fcc8-3e20-4648-ad5e-f06f27e80a39'
    }
  },
  stage: {
    user1: {
      username: 'testuser1',
      postId: 'd51cb395-34f7-469d-8136-bc85add2e172',
      postText: 'test post 1',
      commentId: 'ba587956-f281-4178-a166-f6cf02ca4944'
    },
    user2: {
      username: 'testuser2',
      postId: 'c58cde36-1867-415e-9205-1cdf8a847b9e',
      postText: 'test post 2',
      commentId: '9deb9076-6d17-4e48-91f2-8fd205a71371'
    }
  }
}





class Variables {
  constructor() {
    this.global = {
      userEmail: '',
      userPassword: '',
      userId: '',
      accessToken: '',
      authProviderId: '',
      username: '',
      mediaId: '',
      putMediaUrl: '',
      guid: '',
      postId: '',
      repostId: '',
      sellableId: '',
      mediaKeyName: '',
      voteId: '',
      commentId: '',
    }

    this.testUsers = {
      user1: {
        accessToken: '',
        userId: '',
        username: startVariables[process.env.NODE_ENV].user1.username,
        postId: startVariables[process.env.NODE_ENV].user1.postId,
        postText: startVariables[process.env.NODE_ENV].user1.postText,
        commentId: startVariables[process.env.NODE_ENV].user1.commentId
      },
      user2: {
        accessToken: '',
        userId: '',
        username: startVariables[process.env.NODE_ENV].user2.username,
        postId: startVariables[process.env.NODE_ENV].user2.postId,
        postText: startVariables[process.env.NODE_ENV].user2.postText,
        commentId: startVariables[process.env.NODE_ENV].user2.commentId
      }
    }
  }

  changeTestUsers(testUserNumber, userData) {
    this.testUsers = {
      ...this.testUsers,
      ['user' + testUserNumber]: {
        ...this.testUsers['user' + testUserNumber],
        ...userData
      }
    }
  }

  changeVariables(obj) {
    this.global = {...this.global, ...obj}
  }

}

module.exports = new Variables()

