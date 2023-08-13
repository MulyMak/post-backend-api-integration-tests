import requests from "../index";
import Variables from "../../variabels/variables";

const getUser = (userId, token) => {
    const url = `api/users/${userId ? userId : Variables.global.userId}`
    return requests.apiRequest.get(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`)
}

const getAllUsers = (queries, token) => {
    const url = 'api/users'
    if (queries) {
        return requests.apiRequest.get(url).query(queries).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`)
    }
    return requests.apiRequest.get(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`)
}

const createUser = (data, token) => {
    const url = 'api/users'
    if (token === "notoken") {
        return requests.apiRequest.post(url).send(data)
    }
    return requests.apiRequest.post(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`).send(data)

}
const deleteUser = (userId, token) => {
    const url = `api/users/${userId ? userId : Variables.global.userId}`
    return requests.apiRequest.delete(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`).send()
}

const verifyUsernameExists = (username, token) => {
    const url = `api/usernames/${username ? username : Variables.global.username}`
    return requests.apiRequest.get(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`)
}

const updateUser = (data, userId, token) => {
    const url = `api/users/${userId ? userId : Variables.global.userId}`
    if (token === "notoken") {
        return requests.apiRequest.put(url).send(data)
    } else {
        return requests.apiRequest.put(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`).send(data)
    }
}

const updateProfile = (data, userId, token) => {
    const url = `api/profiles/${userId ? userId : Variables.global.userId}`
    if (token === "notoken") {
        return requests.apiRequest.put(url).send(data)
    } else {
        return requests.apiRequest.put(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`).send(data)
    }
}

const getProfile = (userId, token) => {
    const url = `api/profiles/${userId ? userId : Variables.global.userId}`
    return requests.apiRequest.get(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`)
}

const blockProfile = (userToBlock, userId, token) => {
    const data = {
        profileId: userToBlock
    }
    const url = `api/profiles/${userId ? userId : Variables.global.userId}/blocks`
    return requests.apiRequest.post(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`).send(data)
}

const unblockProfile = (userToUnblock, userId, token) => {
    const url = `api/profiles/${userId ? userId : Variables.global.userId}/blocks/${userToUnblock}`
    return requests.apiRequest.delete(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`).send()
}

const getBlockedUsers = (queries, userId, token) => {
    const url = `api/profiles/${userId ? userId : Variables.global.userId}/blocks`
    if (queries) {
        return requests.apiRequest.get(url).query(queries).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`)
    }
    return requests.apiRequest.get(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`)
}


module.exports = {
    getUser,
    getAllUsers,
    createUser,
    deleteUser,
    verifyUsernameExists,
    updateUser,
    updateProfile,
    getProfile,
    blockProfile,
    unblockProfile,
    getBlockedUsers
}