import requests from "../index";
import Variables from "../../variabels/variables";


const createPost = (data, token) => {
  const url = 'api/posts'
  return requests.apiRequest.post(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`).send(data)

}

const createRepost = (data, token) => {
  const url = 'api/posts'
  return requests.apiRequest.post(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`).send(data)
}

const deletePost = (postId, token) => {
  const url = `api/posts/${postId ? postId : Variables.global.postId}`
  return requests.apiRequest.delete(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`).send()
}

const getPost = (postId, token) => {
  const url = `api/posts/${postId}`
  return requests.apiRequest.get(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`)
}

const getAllPosts = (queries, token) => {
  const url = 'api/posts'
  if (queries) {
    return requests.apiRequest.get(url).query({sort: 'createdAt,desc', ...queries}).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`)
  }
  return requests.apiRequest.get(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`)
}

const getUserPosts = (userId, token) => {
  const url = `api/posts?createdBy.id=&sort=createdAt,desc`
  return requests.apiRequest.get(url).query({
    "createdBy.id": `${userId ? userId : Variables.global.userId}`,
    sort: "createdAt,desc"
  }).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`)
}

const updatePost = (postId, data, token) => {
  const url = `api/posts/${postId ? postId : Variables.global.postId}`
  return requests.apiRequest.put(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`).send(data)
}

const getFeed = (size, userId, token) => {
  const url = `api/users/${userId ? userId : Variables.global.userId}/feed`
  if (size && typeof size === "number") {
    return requests.apiRequest.get(url).query({size: size}).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`)
  }
  return requests.apiRequest.get(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`)
}

const markPostAsViewed = (data, userId, token) => {
  const url = `api/users/${userId ? userId : Variables.global.userId}/viewed-posts`
  return requests.apiRequest.post(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`).send(data)
}

module.exports = {
  createPost,
  deletePost,
  getPost,
  getAllPosts,
  createRepost,
  updatePost,
  getFeed,
  markPostAsViewed,
  getUserPosts
}