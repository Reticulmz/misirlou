<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link class="navbar-item" to="/">
        <b>{{ appTitle }}</b>
      </router-link>

      <div class="navbar-burger burger" data-target="navMenu" @click="burgerActive = !burgerActive">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <div id="navMenu" class="navbar-menu" :class="{ 'is-active': burgerActive }">
      <div class="navbar-start">
        <router-link
          v-for="(loc, index) in locations"
          class="navbar-item"
          :to="loc.location"
          :item="loc"
          :index="index"
          :key="loc.location">
          {{ loc.title }}
        </router-link>
      </div>
      <div class="navbar-end">
        <div
          class="navbar-item has-dropdown"
          :class="{ 'is-loading': !user, 'is-hoverable': !!user }">
          <div class="navbar-link" v-if="user">
            <img :src="'https://a.ripple.moe/' + user.id" class="avatar">
            {{ user.username }}
          </div>
          <div class="navbar-dropdown">
            <router-link class="navbar-item" to="/logout">
              Log out
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import store from "../store"

export default {
  name: "navbar",
  data () {
    return {
      appTitle: process.env.APP_TITLE,
      burgerActive: false,
      locations: [
        {
          title: "Register",
          location: "/register"
        },
        {
          title: "Request Beatmap",
          location: "/beatmaps"
        },
        {
          title: "Brackets",
          location: "/brackets"
        }
      ]
    }
  },
  computed: {
    user() {
      return store.state.rippleUser
    }
  }
}
</script>

<style lang="sass">
@import "~bulma/sass/utilities/variables.sass"
@import "~bulma/sass/utilities/mixins.sass"

.navbar-item.is-loading .navbar-link, .navbar-item.is-loading .navbar-link:after
  color: transparent !important
  pointer-events: none
  border: 0

.navbar-item.is-loading:after
  +loader
  position: absolute
  left: calc(50% - (1em / 2))
  top: calc(50% - (1em / 2))
  position: absolute !important
</style>

<style scoped>
.avatar {
  height: 2.5rem;
  width: auto;
  border-radius: 50%;
  margin-right: 0.625rem;
}
</style>
