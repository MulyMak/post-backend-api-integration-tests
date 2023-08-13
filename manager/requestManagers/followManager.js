import requests from "../index";
import Variables from "../../variabels/variables";


const getFollowers = (queries, userId, token) => {
  const url = `api/users/${userId ? userId : Variables.global.userId}/followers`
  if (queries) {
    return requests.apiRequest.get(url).query(queries).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`)
  }
  return requests.apiRequest.get(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`)
}

const getFollowing = (queries, userId, token) => {
  const url = `api/users/${userId ? userId : Variables.global.userId}/following`
  if (queries) {
    return requests.apiRequest.get(url).query(queries).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`)
  }
  return requests.apiRequest.get(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`)
}

const followUser = (userIdToFollow, userId, token) => {
  const data = {
    followerId: userId ? userId : Variables.global.userId
  }
  const url = `api/users/${userIdToFollow}/followers`
  return requests.apiRequest.post(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`).send(data)
}

const unfollowUser = (userIdToUnfollow, userId, token) => {
  const url = `api/users/${userIdToUnfollow}/followers/${userId ? userId : Variables.global.userId}`
  return requests.apiRequest.delete(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`).send()
}

module.exports = {
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser
}