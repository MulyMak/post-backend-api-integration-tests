import requests from "../index";
import Variables from "../../variabels/variables";

const searchPosts = (queries, token) => {
  const url = `api/search/posts`
  return requests.apiRequest.get(url).query(queries).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`)
}

const searchUsers = (queries, token) => {
  const url = `api/search/users`
  return requests.apiRequest.get(url).query(queries).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`)
}


module.exports = {
  searchPosts,
  searchUsers
}