<template>
  <div>
    <bulma-hero
      title="Invites"
      subtitle="See whether you've been invited to any team of any tournament.">
    </bulma-hero>
    <section class="section">
      <article class="message" v-if="message" :class="{ 'is-success': !isError, 'is-danger': isError }">
        <div class="message-body">
          {{ message }}
        </div>
      </article>
      <div class="box" v-if="invites !== null && invites.length > 0">
        <div class="columns is-mobile" v-for="(invite, idx) in invites" :key="invite.id">
          <div class="column is-three-quarters">
            <article class="media">
              <figure class="media-left">
                <p class="image is-64x64">
                  <img :src="'https://a.ripple.moe/' + invite.captain">
                </p>
              </figure>
              <div class="media-content">
                <p>
                  <b v-if="names[invite.captain]">{{ names[invite.captain] }}</b><b v-else>...</b>
                  has invited you to join his team: <b>{{ invite.name }}</b><br>
                  The team will play in
                  <b><router-link :to="'/feed/' + invite.tournament.id">{{ invite.tournament.name }}</router-link></b>
                  ({{ osu.modesReadable[invite.tournament.mode] }})
                  between {{ invite.tournament.exclusivity_starts }} and
                  {{ invite.tournament.exclusivity_ends }}.
                </p>
              </div>
            </article>
          </div>
          <div class="column is-one-quarter">
            <!-- TODO: justify right, align center -->
            <button class="button is-warning" @click="openRuleModal(invite.tournament.id)">See rules</button>
            <button class="button is-success" @click="inviteAct(invite.id, idx, 'accept')">Accept</button>
            <button class="button is-danger" @click="inviteAct(invite.id, idx, 'refuse')">Refuse</button>
          </div>
        </div>
      </div>
      <div v-else-if="invites !== null && invites.length === 0">
        <h1 class="title">You don't have any invites</h1>
        <h2 class="subtitle">
          Nothing to see here; move along.
        </h2>
      </div>
      <loading-sect v-else>
      </loading-sect>
    </section>
    <div class="modal" :class="{'is-active': modalActive}">
      <div class="modal-background" @click="modalActive = false"></div>
      <div class="modal-content">
        <div class="box content" v-html="rules">
        </div>
      </div>
      <button class="modal-close is-large" @click="modalActive = false"></button>
    </div>
  </div>
</template>

<script>
import BulmaHero from "./Hero"
import LoadingSect from "./LoadingSect"
import backend from "../backend"
import osu from "../osu"
import marked from "marked"
import loadUsernames from "../loadUsernames"

export default {
  components: {
    BulmaHero,
    LoadingSect,
  },
  data() {
    return {
      invites: [],
      osu: osu,
      names: {},
      modalActive: false,
      rules: "",
      message: "",
      isError: false,
    }
  },
  methods: {
    openRuleModal(tournID) {
      this.rules = "<i>Loading...</i>"
      this.modalActive = true
      backend.misirlou.rules(tournID, rules => {
        if (rules.rules == null) {
          this.rules = "<i>Looks like this tournament has no rules!</i>"
          return
        }
        this.rules = marked(rules.rules)
      })
    },
    inviteAct(inviteID, index, action) {
      this.message = ""
      backend.misirlou.inviteAct(inviteID, action, (data) => {
        if (!data.ok) {
          this.isError = true
          this.message = data.message
          return
        }
        this.invites.splice(index, 1)
        this.isError = false
        this.message = "Invite " + (action == "accept" ? "accepted" : "refused") + " successfully."
      }, [403, 404, 413])
    },
  },
  mounted() {
    backend.misirlou.invites((invites) => {
      this.invites = invites.invites
      loadUsernames(invites.invites, i => i.captain, this)
    })
  }
}
</script>
