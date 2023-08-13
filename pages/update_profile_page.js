import BasePage from "../pages/base_page";
import {expect} from "chai";
import profileManager from "../manager/requestManagers/profileManager";
import Variables from "../variabels/variables";
import userData from "../static/user_data";
import mediaData from "../static/media_data";
import randomGenerator from "../helpers/randomGeneratorhelper";

let chai = require('chai');
let chaiSubset = require('chai-subset');
chai.use(chaiSubset);

class UpdateProfilePage extends BasePage {

  constructor() {
    super();

  }

//NAME FIELD IS AN OPTIONAL FIELD SO IT CAN BE OMITTED BUT CURRENTLY IT IS REQUIRED IN BE SO NEED TO CHANGE THIS LATER

  async UpdateProfileWithPositiveData(username, name, bio, contacts = true) {

    let data = {
      user: {
        username: username,
        avatarId: await this.UploadMedia(mediaData.fileNames.image[0].name, mediaData.fileType.image, mediaData.fileNames.image[0].format)
      }
    }
    if (bio) {
      data.bio = bio
    }

    if (name) {
      data.user.name = name
    }

    if (contacts) {
      data.contacts = [{
        type: "EMAIL", value: randomGenerator.generateEmail()
      }, {
        type: "WEBSITE", value: randomGenerator.generateRandomWebsite()
      }, {
        type: "PHONE", value: randomGenerator.generateRandomPhoneNumber()
      }]
    }

    let dataWithoutImage = data
    delete dataWithoutImage.user.avatarId

    await profileManager.updateProfile(data, Variables.global.userId, Variables.global.accessToken).then((res) => {
      expect(res.body).to.containSubset(dataWithoutImage)
      expect(res.body.id).to.be.eq(Variables.global.userId)
      expect(res.status).to.eq(200, "User Profile is updated")
    })

    await profileManager.getProfile(Variables.global.userId, Variables.global.accessToken).then((res) => {
      expect(res.body).to.containSubset(dataWithoutImage)
      expect(res.status).to.eq(200, "Profile info got after update is correct")
    })

    await profileManager.verifyUsernameExists(Variables.global.username, Variables.global.accessToken).then((res) => {
      expect(res.body.alreadyInUse).to.be.false
    })

    await profileManager.verifyUsernameExists(data.user.username, Variables.global.accessToken).then((res) => {
      expect(res.body.alreadyInUse).to.be.true
    })

    const vars = {
      username: data.user.username
    }
    Variables.changeVariables(vars)
  }

  async UpdateProfileWithInvalidData(type) {
    let data = {}

    switch (type) {
      case userData.profileDataType.username: {
        for (let i = 0; i < Object.keys(this.invalidUsernames).length; i++) {
          data = {
            user: {
              username: Object.values(this.invalidUsernames)[i]
            }
          }
          await profileManager.updateProfile(data, Variables.global.userId, Variables.global.accessToken).then((res) => {
            expect(res.body.violations[0].message).to.exist
            expect(res.body.title).to.be.eq("Constraint Violation")
            expect(res.status).to.eq(400, "User Profile with invalid username is not updated")
          })
          await profileManager.verifyUsernameExists(Variables.global.username, Variables.global.accessToken).then((res) => {
            expect(res.body.alreadyInUse).to.be.true
          })
        }
        break
      }
      case userData.profileDataType.profileName : {
        for (let i = 0; i < Object.keys(this.invalidNames).length; i++) {
          data = {
            user: {
              username: Variables.global.username,
              name: Object.values(this.invalidNames)[i]
            }
          }
          await profileManager.updateProfile(data, Variables.global.userId, Variables.global.accessToken).then((res) => {
            expect(res.body.violations[0].message).to.exist
            expect(res.body.title).to.be.eq("Constraint Violation")
            expect(res.status).to.eq(400, "User Profile with invalid profile name is not updated")
          })
        }
        break
      }
      case userData.profileDataType.bio: {
        for (let i = 0; i < Object.keys(this.invalidBios).length; i++) {
          data = {
            bio: Object.values(this.invalidBios)[i],
            user: {
              username: Variables.global.username,
            }
          }
          await profileManager.updateProfile(data, Variables.global.userId, Variables.global.accessToken).then((res) => {
            expect(res.body.violations[0].message).to.exist
            expect(res.body.title).to.be.eq("Constraint Violation")
            expect(res.status).to.eq(400, "User Profile with invalid bio is not updated")
          })
        }
        break
      }
      case userData.profileDataType.avatar : {
        let mediaId = await this.UploadMedia
        (
          mediaData.fileNames.video[3].name,
          mediaData.fileType.video,
          mediaData.fileNames.video[3].format,
          false,
          Variables.global.accessToken
        )
        data = {
          user: {
            username: Variables.global.username,
            avatarId: mediaId
          }
        }
        await profileManager.updateProfile(data, Variables.global.userId, Variables.global.accessToken).then((res) => {
          expect(res.body.violations[0].message).to.exist
          expect(res.body.title).to.be.eq("Constraint Violation")
          expect(res.status).to.eq(400, "User Profile with invalid profile name is not updated")
        })
        break
      }
      case userData.profileDataType.contacts: {
        data = {
          user: {
            username: Variables.global.username,
          },
          contacts: [
            {
              type: "EMAIL",
              value: randomGenerator.generateEmail() + "."
            },
            {
              type: "WEBSITE",
              value: "test" + randomGenerator.generateRandomWebsite()
            },
            {
              type: "PHONE",
              value: randomGenerator.generateRandomPhoneNumber() + 1233456
            }
          ]
        }
        await profileManager.updateProfile(data, Variables.global.userId, Variables.global.accessToken).then((res) => {
          expect(res.body.title).to.be.eq("Constraint Violation")
          expect(res.status).to.eq(400, "User Profile with invalid contacts is not updated")
          expect(res.body.violations.length).to.eq(2, "All violations are in place")
        })
        break
      }
    }
  }

  async UpdateProfileWithExistingUsername() {

    let data = {
      user: {
        username: this.existingUsername,
      }
    }

    await profileManager.updateProfile(data, Variables.global.userId, Variables.global.accessToken).then((res) => {
      expect(res.body.cause.cause.detail).to.include('ERROR: duplicate key value violates unique constraint \"uc_users_username\"')
      expect(res.status).to.eq(409, "User Profile with existing username is not updated")
    })

    await profileManager.verifyUsernameExists(Variables.global.username, Variables.global.accessToken).then((res) => {
      expect(res.body.alreadyInUse).to.be.true
    })

    await profileManager.verifyUsernameExists(data.user.username, Variables.global.accessToken).then((res) => {
      expect(res.body.alreadyInUse).to.be.true
    })
  }

  async UpdateAnotherUserProfile() {
    let data = {
      user: {
        username: await userData.username.positiveData.regularUsername()
      }
    }
    await profileManager.updateProfile(data, this.existingUserIds[Math.floor(Math.random() * 9)], Variables.global.accessToken).then((res) => {
      expect(res.body.detail).to.eq("Access is denied")
      expect(res.status).to.eq(403, "Cannot update another user profile is successful")
    })
  }
}

module.exports = UpdateProfilePage