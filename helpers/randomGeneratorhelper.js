const profileManager = require("../manager/requestManagers/profileManager");
const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
const usernameCharsets = {
  positive: "abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789",
  notAllowedSymbols: '!@#$%^&*()-+=?><`~',
  allowedSymbols: '_.'
}
import Variables from "../variabels/variables";
import MediaData from '../static/media_data'

function generatePassword() {
  let length = 8,
    retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

function generateEmail() {
  let strEmail = "";
  let strTmp;
  for (let i = 0; i < 10; i++) {
    strTmp = charset.charAt(Math.floor(charset.length * Math.random()));
    strEmail = strEmail + strTmp;
  }
  strTmp = "";
  strEmail = strEmail + "@";
  for (let j = 0; j < 4; j++) {
    strTmp = charset.charAt(Math.floor(charset.length * Math.random()));
    strEmail = strEmail + strTmp;
  }
  strEmail = strEmail + ".com"
  return strEmail;
}

async function generatePositiveUsername(length) {
  let strUsername = "";
  if (length > 3) {
    for (let i = 0; i < length - 2; i++) {
      let strTmp = usernameCharsets.positive.charAt(Math.floor(usernameCharsets.positive.length * Math.random()));
      strUsername = strUsername + strTmp;
    }
    strUsername += '._'
  } else {
    for (let i = 0; i < length; i++) {
      let strTmp = usernameCharsets.positive.charAt(Math.floor(usernameCharsets.positive.length * Math.random()));
      strUsername = strUsername + strTmp;
    }
  }

  const verifiedUsername = await profileManager.verifyUsernameExists(strUsername, Variables.global.accessToken)

  if (verifiedUsername.body.alreadyInUse) {
    return await generatePositiveUsername(length)
  }
  return strUsername;
}

function generateOnlySymbolUsername(length = Math.floor(Math.random() * 28)) {
  let strSymbUsername = "";
  for (let i = 0; i < length; i++) {
    let strTmp = usernameCharsets.allowedSymbols.charAt(Math.floor(usernameCharsets.allowedSymbols.length * Math.random()));
    strSymbUsername = strSymbUsername + `_${strTmp}_`;
  }
  return strSymbUsername;
}


function generateName(length) {
  let strName = "";
  for (let i = 0; i < length; i++) {
    let strTmp = charset.charAt(Math.floor(charset.length * Math.random()));
    strName = strName + strTmp;
  }
  return strName;
}

function generateRandomString(length = Math.floor(1 + (Math.random() * 149))) {
  let strName = "";
  for (let i = 0; i < length; i++) {
    let strTmp = charset.charAt(Math.floor(charset.length * Math.random()));
    strName = strName + strTmp;
  }
  return strName;
}

function generateRandomNumber() {
  return Math.floor(4 + (Math.random() * 26));
}

function generateRandomPhoneNumber() {
  let numbers = [79184943348, 15415556853, 37491785684, 496976539720, 37499781267, 302187637658, 12684684600, 16476506649]
  let number = numbers[Math.floor(Math.random() * numbers.length)];
  number = "+" + number
  return number
}

function generateRandomWebsite(length = Math.floor(1 + (Math.random() * 149))) {
  const domainNames = [".co", ".com", ".io", ".uk", ".us", ".am", ".net"]
  const protocols = ["http://", "https://", "http://www.", "https://www."]
  let strName = "";
  for (let i = 0; i < length; i++) {
    let strTmp = charset.charAt(Math.floor(charset.length * Math.random()));
    strName = strName + strTmp
  }
  let domainName = domainNames[Math.floor(domainNames.length * Math.random())];
  let protocol = protocols[Math.floor(protocols.length * Math.random())];

  strName = protocol + strName + domainName

  return strName;
}

function generateRandomGuid() {
  let h = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
  let k = ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', '-', 'x', 'x', 'x', 'x', '-', '4', 'x', 'x', 'x', '-', 'y', 'x', 'x', 'x', '-', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'];
  let u = '', i = 0, rb = Math.random() * 0xffffffff | 0;
  while (i++ < 36) {
    let c = k[i - 1], r = rb & 0xf, v = c === 'x' ? r : (r & 0x3 | 0x8);
    u += (c === '-' || c === '4') ? c : h[v];
    rb = i % 8 === 0 ? Math.random() * 0xffffffff | 0 : rb >> 4
  }
  return u
}

function generateMediaFile(images, videos) {

  const files = []

  Array(images).fill(0).forEach((item, i) => files.push({
    position: i+1,
    mediaId: '',
    fileName: MediaData.fileNames.image[i].name,
    fileFormat:  MediaData.fileNames.image[i].format,
    fileType: 'image'
  }));
  Array(videos).fill(0).forEach((item, i) => files.push({
    position: i+1+images,
    mediaId: '',
    fileName: MediaData.fileNames.video[i].name,
    fileFormat:  MediaData.fileNames.video[i].format,
    fileType: 'video'
  }));

  return files
}

module.exports = {
  generateEmail,
  generatePassword,
  generatePositiveUsername,
  generateOnlySymbolUsername,
  generateName,
  generateRandomNumber,
  generateRandomString,
  generateRandomPhoneNumber,
  generateRandomGuid,
  generateMediaFile,
  generateRandomWebsite
}