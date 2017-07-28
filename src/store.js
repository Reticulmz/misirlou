import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    rippleUser: null
  },
  mutations: {
    setUser(state, user) {
      state.rippleUser = user
    }
  }
})

export default store
