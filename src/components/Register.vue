<template>
  <div>
    <bulma-hero
      title="Register"
      subtitle="So you think you're good enough for this tournament, heh?">
    </bulma-hero>
    <loading-sect v-if="tournament === null"></loading-sect>
    <section class="section" v-else-if="tournament === 404">
      <div class="box">
        <h1 class="title">That tournament could not be found.</h1>
        <h2 class="subtitle">Where'd it go?</h2>
      </div>
    </section>
    <section class="section" v-else>
      <h1 class="title is-2">{{ tournament.name }}</h1>
      <h2 class="subtitle is-4">{{ tournament.description }}</h2>
      <div v-if="rules">
        <h1 class="title">Rules</h1>
        <div class="box content" v-html="renderRules"></div>
        <!--
          Lazy method.
          .box:last-child by default doesn't have a margin-bottom. So by adding
          another child, that means that the margin-bottom is in place even if
          the new child is empty. So the content outside this div gets pushed
          down.
        -->
        <div></div>
      </div>
      <h1 class="title">Register</h1>
      <p v-if="tournament.status != 1">
        We're sorry, registrations are disabled at the moment. Perhaps try
        <router-link to="/">another tournament?</router-link>
      </p>
      <p v-else-if="rippleUser && (rippleUser.privileges & 3) != 3">
        Restricted/banned players are not allowed to play in tournaments.
      </p>
      <p v-else-if="tournament.my_team != null">
        <router-link :to="'/teams/' + tournament.my_team">You are already in a team!</router-link>
      </p>
      <div v-else>
        <form class="box" @submit.prevent="formSubmit">
          <div v-if="tournament.team_size > 1">
            <div class="field">
              <label class="label">Team name</label>
              <div class="control">
                <input
                  class="input" type="text"
                  placeholder="e.g. The Circlefighters"
                  maxlength="25" required
                  v-model="teamInformation.name">
              </div>
            </div>
            <ripple-user
              v-for="n in (tournament.team_size-1)"
              :number="n"
              :key="n"
              :mode="tournament.mode"
              @input="setTeamMember">
            </ripple-user>
            <hr>
          </div>
          <p v-if="rules">
            By pressing the "Register" button below, you declare to have read
            and agreed to the rules of the tournament (which you can find
            above).
          </p>
          <br v-if="rules">
          <div class="has-text-centered">
            <button class="button is-primary is-large" type="submit" :class="{ 'is-loading': isSubmitting }">
              Register
            </button>
          </div>
          <article class="message is-danger" v-if="errorMessage" style="margin-top: 1.5rem">
            <div class="message-header">Error while submitting the form</div>
            <div class="message-body">
              {{ errorMessage }}
            </div>
          </article>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
import BulmaHero from "./Hero"
import RippleUser from "./RippleUser"
import LoadingSect from "./LoadingSect"
import marked from "marked"
import backend from "../backend"
import store from "../store"

// Array.fill polyfill
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/fill#Polyfill
if (!Array.prototype.fill) {
  Object.defineProperty(Array.prototype, 'fill', {
    value: function(value) {

      // Steps 1-2.
      if (this == null) {
        throw new TypeError('this is null or not defined');
      }

      var O = Object(this);

      // Steps 3-5.
      var len = O.length >>> 0;

      // Steps 6-7.
      var start = arguments[1];
      var relativeStart = start >> 0;

      // Step 8.
      var k = relativeStart < 0 ?
        Math.max(len + relativeStart, 0) :
        Math.min(relativeStart, len);

      // Steps 9-10.
      var end = arguments[2];
      var relativeEnd = end === undefined ?
        len : end >> 0;

      // Step 11.
      var final = relativeEnd < 0 ?
        Math.max(len + relativeEnd, 0) :
        Math.min(relativeEnd, len);

      // Step 12.
      while (k < final) {
        O[k] = value;
        k++;
      }

      // Step 13.
      return O;
    }
  });
}

marked.setOptions({
  smartypants: true,
  sanitize: true
})

export default {
  components: {
    BulmaHero,
    RippleUser,
    LoadingSect,
  },
  data() {
    return {
      tournament: null,
      rules: null,
      teamInformation: {
        name: "",
        members: []
      },
      isSubmitting: false,
      errorMessage: ""
    }
  },
  methods: {
    setTeamMember(ru) {
      this.teamInformation.members[ru.number-1] = ru.typedUser && ru.typedUser != 404 ? ru.typedUser.id : 0
    },
    formSubmit() {
      const members = membersBase(this.teamInformation.members, this.rippleUser.id)
      if ((members.length+1) < this.tournament.min_team_size) {
        this.submitError("There are fewer team members than the minimum (" + this.tournament.min_team_size + ", including you)")
        return
      }
      this.isSubmitting = true
      backend.misirlou.register({
        tournament: this.tournament.id,
        members: this.teamInformation.members,
        name: this.teamInformation.name,
      }, (data, resp) => {
        if (!data.ok) {
          this.submitError(data.message)
          return
        }
        this.$router.push("/teams/" + data.team_id)
      }, [403, 404, 413])
    },
    submitError(err) {
      this.isSubmitting = false
      this.errorMessage = err
    },
  },
  computed: {
    renderRules() {
      if (this.rules === null)
        return
      return marked(this.rules)
    },
    rippleUser() {
      return store.state.rippleUser
    }
  },
  mounted() {
    backend.misirlou.tournaments(this.$route.params.id, tourn => {
      if (tourn.tournaments.length < 1) {
        this.tournament = 404
        return
      }
      this.tournament = tourn.tournaments[0]
      this.teamInformation.members = Array(this.tournament.team_size-1).fill(0)
      backend.misirlou.rules(this.$route.params.id, rules => {
        rules = rules.rules
        if (rules === null)
          return
        this.rules = rules
      })
    })
  }
}

function membersBase(members, userID) {
  // Who would have thought I'd one day like ES6?
  // Removes duplicates from members.
  const uniq = [...new Set(members)]

  return uniq.filter(x => x > 0 && x !== userID)
}
</script>
