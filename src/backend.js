import axios from "axios"
import storage from "./storageHandler"
import xxhashjs from "xxhashjs"
import Raven from "raven-js"
import store from "./store"

const rippleBaseURL = "https://api.ripple.moe/api/v1"
const misirlouBaseURL = process.env.API_BASE_URL

export default {
  misirlou: {
    tournaments(id, callback) {
      request(createMisirlouRequest("/tournaments", {id: id}), callback)
    },
    teams(tournID, callback) {
      request(createMisirlouRequest("/teams", {tourn_id: tournID}), callback)
    },
    rules(id, callback) {
      request(createMisirlouRequest("/tournaments/rules", {id: id}), callback)
    },
    team(id, callback, handleableErrors) {
      request(createMisirlouRequest("/teams/team", {id: id}), callback, handleableErrors)
    },
    renameTeam(id, newName, callback) {
      request(createMisirlouRequest("/teams/rename", {team: id, name: newName}), callback)
    },
    disbandTeam(id, callback) {
      request(createMisirlouRequest("/teams/disband", {team: id}), callback)
    },
    kickFromTeam(target, teamID, callback) {
      request(createMisirlouRequest("/teams/kick", {target: target, team: teamID}), callback)
    },
    inviteToTeam(target, teamID, callback, handleableErrors) {
      request(createMisirlouRequest("/teams/invite", {target: target, team: teamID}), callback, handleableErrors)
    },
    register(data, callback, handleableErrors) {
      let req = createMisirlouRequest("/tournaments/register", {})
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
    feedItems(tourn, callback) {
      request(createMisirlouRequest("/feed/items", {tourn_id: tourn}), callback)
    },
    createNewFeedPost(tourn, newPost, callback) {
      let req = createMisirlouRequest("/feed/post", {})
      req.method = "POST"
      req.data = {
        tournament: tourn,
        content: newPost,
      }
      request(req, callback)
    },
    deleteFeedPost(id, callback) {
      request(createMisirlouRequest("/feed/delete", {post_id: id}), callback)
    },
    setFCMToken(token, callback) {
      request(createMisirlouRequest("/set_fcm_token", {fcm_token: token}), callback)
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
    users.forEach(x => path += "ids=" + x + "&")
    request(createRippleRequest(path, {}), callback)
  },
}

function request(req, callback, handleableErrors) {
  if (handleableErrors)
    req.validateStatus = s => (s >= 200 && s < 300) || handleableErrors.indexOf(s) !== -1

  /*var cachedResp = cache(req.url, req.params)
  if (cachedResp) {
    callback(cachedResp)
    return
  }*/
  axios(req)
    .then(resp => {
      //cache(req.url, req.params, resp.data)
      callback(resp.data, resp)
    })
    .catch(err => {
      if (process.env.SENTRY_URL !== "") {
        Raven.captureException(err)
      }
      console.error(err)
      store.commit("snackbarNotification", "An error occurred while contacting the API, and we have been informed of this. Perhaps try refreshing the page?")
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
