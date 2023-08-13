import axios from "axios";
import requests from "../index";
import Variables from "../../variabels/variables";
import randomGeneratorHelper from "../../helpers/randomGeneratorhelper";


const createMedia = (data, token) => {
  const url = `api/media/${randomGeneratorHelper.generateRandomGuid()}`
  return requests.apiRequest.put(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`).send(data)
}

const uploadFile = async (putMediaUrl, file, fileFormat) => {
   try {
     return await axios({
       method: 'put',
       headers: {
         'Content-Type': fileFormat,
       },
       url: putMediaUrl, //API url
       data: file, // Buffer
     })
   } catch (e) {
     return e.response
   }

}
// STAS SAID WILL NEED TO REMOVE THIS REQUEST AS FILES WILL BE AUTODELETED WHEN IDOLING FOR SOME TIME
// const deleteMedia = (mediaId, token) => {
//   const url = `api/media/${mediaId ? mediaId : Variables.global.mediaId}`
//   return requests.apiRequest.delete(url).set("Authorization", `Bearer ${token ? token : Variables.global.accessToken}`).send()
// }

module.exports = {
  uploadFile,
  createMedia
}