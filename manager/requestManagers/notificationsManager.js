import requests from "../index";
import Variables from "../../variabels/variables";

const getUserNotifications = (userId, queries, token) => {
  const url = `api/users/${userId ? userId : Variables.global.userId}/notifications`
  return requests.apiRequest.get(url).query(queries).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`)
}

const getUserNotificationsStatus = (userId, token) => {
  const url = `api/users/${userId ? userId : Variables.global.userId}/notifications_status`
  return requests.apiRequest.get(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`)
}

const getUserNotificationsConfig = (userId, token) => {
  const url = `api/users/${userId ? userId : Variables.global.userId}/notifications_config`
  return requests.apiRequest.get(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`)
}

const saveUserNotificationsConfig = (data, userId, token) => {
  const url = `api/users/${userId ? userId : Variables.global.userId}/notifications_config`
  return requests.apiRequest.put(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`).send(data)
}

const markNotificationAsViewed = (data, userId, token) => {
  const url = `api/users/${userId ? userId : Variables.global.userId}/viewed_notifications`
  return requests.apiRequest.post(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`).send(data)
}

module.exports = {
  getUserNotifications,
  getUserNotificationsStatus,
  getUserNotificationsConfig,
  saveUserNotificationsConfig,
  markNotificationAsViewed
}