<template>
  <div class="field">
    <label class="label">Team member #{{ number+1 }}</label>
    <div class="control">
      <input class="input" type="text" placeholder="Type in an username" @input="username">
    </div>
    <div class="box" v-if="typedUser !== null" style="margin-top: 1.5rem">
      <div v-if="typedUser === 404">
        <h1 class="title">That user could not be found!</h1>
        <h2 class="subtitle">It's probably an L that is actually an I.</h2>
      </div>
      <div v-else-if="typedUser.id == rippleUser.id">
        <h1 class="title">That's you!</h1>
        <h2 class="subtitle">We already counted you in. There is no need to add yourself to your own team.</h2>
      </div>
      <article class="media" v-else>
        <figure class="media-left">
          <p class="image is-64x64">
            <img :src="'https://a.ripple.moe/' + typedUser.id">
          </p>
        </figure>
        <div class="media-content">
          <div class="content">
            <p><strong>{{ typedUser.username }}</strong>
            <br>
            On {{ modesReadable[mode] }}, they have
            <span v-if="modeInfo.pp">{{ modeInfo.pp }} pp</span>
            <span v-else>{{ modeInfo.ranked_score }} score</span>.</p>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import debounce from "debounce"
import backend from "../backend"
import osu from "../osu"
import store from "../store"

var component = {
  props:   ["number", "mode"],
  data() {
    return {
      typedUser: null
    }
  },
  computed: {
    modeInfo() {
      return this.typedUser[osu.modesShort[this.mode]]
    },
    modesReadable() {
      return osu.modesReadable
    },
    rippleUser() {
      return store.state.rippleUser
    }
  },
  methods: {
    username: debounce(function(e) {
      if (e.target.value == "") {
        this.typedUser = null
        this.$emit("input", this)
        return
      }
      backend.getUserFullByUsername(e.target.value, user => {
        if (user.code === 404) {
          this.typedUser = 404
          this.$emit("input", this)
          return
        }
        this.typedUser = user
        this.$emit("input", this)
      }, true)
    }, 500)
  }
}

export default component
</script>
