import axios from 'axios'
import storage from './storageHandler'

const rippleBaseURL = "https://api.ripple.moe/api/v1"
const misirlouBaseURL = process.env.API_BASE_URL

export default {
  misirlou: {
    // functions related to misirlou-api will go here
  },
  getUser(userID, callback) {
    axios(createRippleRequest("/users", {id: "self"}))
      .then((resp) => {
        callback(resp.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }
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
