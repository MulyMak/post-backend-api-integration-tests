import randomGeneratorHelper from "../helpers/randomGeneratorhelper";

const usernameCharsets = {
  positive: "abcdefghijklmnopqrstuvwxyz0123456789",
  notAllowedSymbols: '!@#$%^&*()-+=?><`~',
  allowedSymbols: '_.'
}

module.exports = {
  username: {
    positiveData: {
      shortestUsername: async () => await randomGeneratorHelper.generatePositiveUsername(3),
      longestUsername: async () => await randomGeneratorHelper.generatePositiveUsername(30),
      regularUsername: async () => await randomGeneratorHelper.generatePositiveUsername(randomGeneratorHelper.generateRandomNumber())
    },
    negativeData: {
      invalidUsernameNull: null,
      invalidUsernameEmpty: "",
      invalidUsername2Chars: "ab",
      invalidUsername31Chars: "abcdgedhsd_kbskab.dgedhsdskbsk0",
      invalidUsernamePeriodStart: `.abc`,
      invalidUsernamePeriodEnd: `h76s.`,
      invalidUsernameWithSymbols: `user${usernameCharsets.notAllowedSymbols.charAt(Math.round(usernameCharsets.notAllowedSymbols.length * Math.random()))}`,
      invalidUsernameOnlySymbols: randomGeneratorHelper.generateOnlySymbolUsername(),
      invalidUsernameNonLatin: 'теստ',
      invalidUsernameWithSpace: 'test ing'
    }
  },
  profileName: {
    positiveData: {
      shortName: "E",
      longName: "Testgedhsd_kbskab.dgedhsdskbskTestgedhsd_kbskab.dge%hsdskbsk",
      randomName: () => randomGeneratorHelper.generateName(randomGeneratorHelper.generateRandomNumber())
    },
    negativeData: {
      invalidName61Chars: "Testgedhsd_kbskab.dgedhsdskbskTestgedhsd_kbskab.dge%hsdskbska"
    }
  },
  bio: {
    positiveData: {
      shortBio: randomGeneratorHelper.generateRandomString(1),
      longestBio: randomGeneratorHelper.generateRandomString(150)
    },
    negativeData: {
      invalidBio151Chars: randomGeneratorHelper.generateRandomString(151)
    }
  },
  profileDataType: {
    username: "username",
    profileName: "profileName",
    bio: "bio",
    avatar: "avatar",
    contacts: "contacts"
  },
  testUsersCredentials: {
    user1: {
      email: 'test1@postinc.co',
      password: 'test2022?',
      returnSecureToken: true
    },
    user2: {
      email: 'test2@postinc.co',
      password: 'test2022?',
      returnSecureToken: true
    }
  }
}










