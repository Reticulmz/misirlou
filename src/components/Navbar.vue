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
      bellActive: false,
      locations: [
        {
          title: "Invites",
          location: "/invites",
        },
        /*
        {
          title: "Request Beatmap",
          location: "/beatmaps"
        },
        {
          title: "Brackets",
          location: "/brackets"
        }*/
      ]
    }
  },
  methods: {
    bellClick() {
      this.bellActive = !this.bellActive
    },
  },
  computed: {
    user() {
      return store.state.rippleUser
    }
  },
}
</script>

<style scoped>
.avatar, .notif-bell {
  height: 2.5rem;
  width: auto;
}

.navbar-link.no-arrow::after {
  border: 0;
}
.navbar-link.no-arrow {
  padding-right: 1rem;
}

.avatar {
  border-radius: 50%;
  margin-right: 0.625rem;
}
</style>
