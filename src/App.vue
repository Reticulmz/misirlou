<template>
  <div id="app">
    <div v-if="isLoggedIn">
      <navbar></navbar>
      <router-view></router-view>
    </div>
    <section class="hero is-info is-fullheight" v-else>
      <div class="hero-body">
        <div class="container has-text-centered">
          <a
            class="button is-large is-primary"
            href="/api/oauth_flow_start"
            :class="{ 'is-loading': buttonLoading }"
            @click="buttonLoading = true">Log in with Ripple</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import router from "./router"
import store from "./store"

import Navbar from "./components/Navbar"

import backend from "./backend"
import queryString from "query-string"
import storage from "./storageHandler"

var App = {
  name: "app",
  components: {
    Navbar
  },
  data() {
    return {
      buttonLoading: false,
    }
  },
  computed: {
    isLoggedIn() {
      return storage.sessionToken() !== null
    }
  },
  mounted() {
    if (window.location.pathname === "/store_tokens") {
      storeTokens();
    }
    if (App.computed.isLoggedIn()) {
      backend.getUser("self", user => {
        store.commit("setUser", user)
      })
    }
  }
}

export default App

function storeTokens() {
  const p = queryString.parse(location.search)
  if (isUndefined(p) || isUndefined(p.access) || isUndefined(p.session))
    return
  storage.storeTokens(p.session, p.access)
  router.push("/")
  this.$forceUpdate()
}

function isUndefined(x) {
  return typeof x === "undefined"
}
</script>

<style src="bulma" lang="sass"></style>

<style lang="sass">
@import "~bulma/sass/utilities/variables.sass"
@import "~bulma/sass/utilities/mixins.sass"

.is-loading .navbar-link, .is-loading .navbar-link:after
  color: transparent !important
  pointer-events: none
  border: 0

.is-loading:not(.button):after
  +loader
  position: absolute
  left: calc(50% - (1em / 2))
  top: calc(50% - (1em / 2))
  position: absolute !important
</style>
