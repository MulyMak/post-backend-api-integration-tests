import requests from "../index";
import Variables from "../../variabels/variables";
import randomGeneratorHelper from "../../helpers/randomGeneratorhelper";

const signUp = (withRandom = false, data) => {
    const url = `accounts:signUp?key=${process.env.FIREBASE_API_KEY}`
    if (withRandom) {
        const data = {
            email: randomGeneratorHelper.generateEmail(),
            password: randomGeneratorHelper.generatePassword(),
            returnSecureToken: true
        }
        return requests.authRequest.post(url).send(data)
    }

    return requests.authRequest.post(url).send(data)
}

const signIn = (data) => {
    const url = `accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`
    return requests.authRequest.post(url).send(data)
}

const getAuthenticationDetails = (token) => {
    const url = "api/authentication_details"
    return requests.apiRequest.get(url).set("Authorization", 'Bearer ' + (token ? token : Variables.global.accessToken))
}

module.exports = {
    signUp,
    signIn,
    getAuthenticationDetails,
}