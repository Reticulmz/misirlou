import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    rippleUser: null,
    snackbarMessage: null,
  },
  mutations: {
    setUser(state, user) {
      state.rippleUser = user
    },
    snackbarNotification(state, notif) {
      state.snackbarMessage = notif
    },
  }
})

export default store
