import requests from "../index";
import Variables from "../../variabels/variables";


const getVote = (voteId, token) => {
  const url = `api/votes/${voteId ? voteId : Variables.global.voteId}`
  return requests.apiRequest.get(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`).send()
}

const getAllVotes = (voteId, queries, token) => {
  const url = `api/votes`
  if (queries) {
    return requests.apiRequest.get(url).query(queries).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`)
  }
  return requests.apiRequest.get(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`)
}

const createVote = (data, token) => {
  const url = 'api/votes'
  return requests.apiRequest.post(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`).send(data)
}


const updateVote = (data, voteId, token) => {
  const url = `api/votes/${voteId ? voteId : Variables.global.voteId}`
  return requests.apiRequest.put(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`).send(data)
}

const deleteVote = (voteId, token) => {
  const url = `api/votes/${voteId ? voteId : Variables.global.voteId}`
  return requests.apiRequest.delete(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`).send()
}

module.exports = {
  getVote,
  getAllVotes,
  createVote,
  updateVote,
  deleteVote
}