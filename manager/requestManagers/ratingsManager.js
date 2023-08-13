import requests from "../index";
import Variables from "../../variabels/variables";


const getUserRatingPlace = (userId, token) => {
  const url = `api/profile_ratings/${userId ? userId : Variables.testUsers.user1.userId}`
  return requests.apiRequest.get(url).set("Authorization", `Bearer ${token ? token : Variables.testUsers.user1.accessToken}`)
}

const getAllRatings = (queries, token) => {
  const url = `api/profile_ratings`
    return requests.apiRequest.get(url).query(queries ? queries : {size : 50}).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`)
  }



module.exports = {
  getUserRatingPlace,
  getAllRatings
}