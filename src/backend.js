import axios from "axios"
import storage from "./storageHandler"
import xxhashjs from "xxhashjs"

const rippleBaseURL = "https://api.ripple.moe/api/v1"
const misirlouBaseURL = process.env.API_BASE_URL

export default {
  misirlou: {
    tournaments(id, callback) {
      request(createMisirlouRequest("/tournaments", {id: id}), callback)
    },
    rules(id, callback) {
      request(createMisirlouRequest("/tournaments/rules", {id: id}), callback)
    },
    register(data, callback, handleableErrors) {
      var req = createMisirlouRequest("/tournaments/register", {})
      req.method = "POST"
      req.data = data
      request(req, callback, handleableErrors)
    },
    invites(callback) {
      request(createMisirlouRequest("/invites", {}), callback)
    },
    inviteAct(teamID, action, callback, handleableErrors) {
      request(createMisirlouRequest("/invites/" + action, {id: teamID}), callback, handleableErrors)
    },
  },
  getUser(userID, callback) {
    request(createRippleRequest("/users", {id: userID}), callback)
  },
  getUserFullByUsername(username, callback, handle404) {
    request(createRippleRequest("/users/full", {name: username}), callback, handle404 ? [404] : false)
  },
  getUsersBulk(users, callback) {
    let path = "/users?"
    users.forEach(x => path += "iid=" + x + "&")
    request(createRippleRequest(path, {}), callback)
  },
}

function request(req, callback, handleableErrors) {
  if (handleableErrors)
    req.validateStatus = s => (s >= 200 && s < 300) || handleableErrors.includes(s)

  /*var cachedResp = cache(req.url, req.params)
  if (cachedResp) {
    callback(cachedResp)
    return;
  }*/
  axios(req)
    .then((resp) => {
      //cache(req.url, req.params, resp.data)
      callback(resp.data, resp)
    })
    .catch((err) => {
      console.error(err)
    })
}

function createRippleRequest(path, params) {
  return {
    url: rippleBaseURL + path,
    params: params,
    headers: {
      Authorization: "Bearer " + storage.accessToken()
    },
    maxContentLength: 15000,
  }
}

function createMisirlouRequest(path, params) {
  return {
    url: misirlouBaseURL + path,
    params: params,
    maxContentLength: 15000,
    headers: {
      Authorization: storage.sessionToken()
    },
  }
}
/*
var reqCache = {}

function cache(reqName, params, result) {
  if (typeof reqCache[reqName] === "undefined")
    reqCache[reqName] = {}
  params = JSON.stringify(params)

  const paramHash = xxhashjs.h32(params, 0xdeadcafe).toString(16)

  if (typeof result === "undefined")
    return reqCache[reqName][paramHash]
  else
    reqCache[reqName][paramHash] = result
}*/
