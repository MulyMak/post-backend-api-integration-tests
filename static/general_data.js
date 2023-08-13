import randomGeneratorHelper from "../helpers/randomGeneratorhelper";

module.exports = {

  randomText: {
    positiveData: {
      shortText: () => randomGeneratorHelper.generateRandomString(1),
      longestText: () => randomGeneratorHelper.generateRandomString(5000),
      regularText: () => randomGeneratorHelper.generateRandomString(Math.floor(1 + (Math.random() * 4998)))
    },
    negativeData: {
      invalidText5001Chars: () => randomGeneratorHelper.generateRandomString(5001),
      invalidTextEmptyString: ""
    }
  },

  sort: {
    byUsernameAscending: "username,asc",
    byUsernameDescending: "username,desc",
    byCreatedAtAscending:"createdAt,asc",
    byCreatedAtDescending: "createdAt,desc"
  }
}