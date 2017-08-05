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
  },
  logout() {
    localStorage.removeItem("session_token")
    localStorage.removeItem("access_token")
  },
  lastFCMToken() {
    return localStorage.getItem("fcm_token")
  },
  setFCMToken(token) {
      localStorage.setItem("fcm_token", token)
  },
}
