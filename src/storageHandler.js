export default {
  sessionToken() {
    return localStorage.getItem("session_token")
  },
  accessToken() {
    return localStorage.getItem("access_token")
  },
  storeTokens(session, access) {
    localStorage.setItem("session_token", session)
    localStorage.setItem("access_token", access)
  }
}
