import requests from "../index";
import Variables from "../../variabels/variables";


const createComment = (data, token) => {
  const url = "api/comments"
  return requests.apiRequest.post(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`).send(data)
}

const getComment = (commentId, token) => {
  const url = `api/comments/${commentId ? commentId : Variables.global.commentId}`
  return requests.apiRequest.get(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`)
}

const getAllComments = (queries, token) => {
  const url = 'api/comments'
  if (queries) {
    return requests.apiRequest.get(url).query(queries).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`)
  }
  return requests.apiRequest.get(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`)
}

const getPostComments = (postId, token) => {
    return requests.apiRequest.get(url).query({postId: postId, size: 50}).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`)
}

const updateComment = (data, commentId, token) => {
  const url = `api/comments/${commentId ? commentId : Variables.global.commentId}`
  return requests.apiRequest.put(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`).send(data)
}

const deleteComment = (commentId, token) => {
  const url = `api/comments/${commentId ? commentId : Variables.global.commentId}`
  return requests.apiRequest.delete(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`).send()
}


module.exports = {
  createComment,
  getComment,
  getAllComments,
  getPostComments,
  updateComment,
  deleteComment
}