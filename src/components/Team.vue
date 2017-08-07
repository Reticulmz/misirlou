<template>
  <div>
    <bulma-hero
      :title="team ? (team.id ? team.name : 'Not found') : 'Loading...'"
      :subtitle="'A team of wonderful people competing in ' + (team && team.id ? team.tournament.name : 'a tournament')">
    </bulma-hero>
    <loading-sect v-if="team === null"></loading-sect>
    <section class="section" v-else-if="team == 404">
      <h1 class="title">That team could not be found</h1>
      <h2 class="subtitle">How did you get this link?</h2>
    </section>
    <section class="section" v-else-if="team == 'disbanded'">
      <h1 class="title">What?</h1>
      <h2 class="subtitle">Never heard of that team. Nope.</h2>
    </section>
    <section class="section" v-else-if="team == 'left'">
      <h1 class="title">Team left</h1>
      <h2 class="subtitle">Might be interested in joining <router-link to="/">another tournament?</router-link></h2>
    </section>
    <section class="section" v-else>
      <div class="columns">
        <div class="column is-one-quarter">
          <div class="card">
            <header class="card-header">
              <p class="card-header-title">
                {{ team.name }}
              </p>
            </header>
            <div class="card-content">
              <div class="content">
                A team playing in
                <strong><router-link :to="'/feed/' + team.tournament.id">
                  {{ team.tournament.name }}
                </router-link></strong>
                from <strong>{{ team.tournament.exclusivity_starts }}</strong>
                to <strong>{{ team.tournament.exclusivity_ends }}</strong>.
                <br>
                Created <strong><timeago :since="team.created_at"></timeago></strong>
                by <strong v-if="names[team.captain]">{{ names[team.captain]}}</strong>
                <strong v-else>...</strong>.<br>
                Playing <strong>{{ modesReadable[team.tournament.mode] }}</strong>.<br>
                <div v-if="team.members.length < team.tournament.min_team_size">
                  <strong>This team won't be able to play in the tournament!</strong>
                  There needs to be at least {{ team.tournament.min_team_size }}
                  members to be part of it.
                </div>
              </div>
            </div>
            <footer class="card-footer">
              <a class="card-footer-item" @click="renameModalActive  = true" v-if="isCaptain && team.tournament.team_size > 1 && team.tournament.status < 2">Rename</a>
              <a class="card-footer-item" @click="disbandModalActive = true" v-if="isCaptain && team.tournament.status > 1 && team.tournament.status < 2">Disband</a>
              <a class="card-footer-item" @click="leaveModalActive   = true" v-if="isInTeam && !isCaptain && team.tournament.status < 2">Leave</a>
            </footer>
          </div>
        </div>
        <div class="column is-three-quarters">
          <h1 class="title">Members</h1>
          <div class="box">
            <article class="media" v-for="member in team.members" :key="member.user" :class="{ unconfirmed: member.attributes === 0 }">
              <figure class="media-left">
                <a :href="'https://ripple.moe/u/' + member.user">
                  <img :src="'https://a.ripple.moe/' + member.user" class="image is-64x64">
                </a>
              </figure>
              <div class="media-content">
                <p>
                  <strong v-if="names[member.user]">{{ names[member.user] }}</strong>
                  <strong v-else>...</strong><br>
                  <span v-if="member.attributes === 0">
                    Invite is pending! Please tell them to visit their "Invites"
                    section on this website, otherwise they won't be able to
                    take part in the tournament.
                  </span>
                  <span v-else-if="member.attributes === 2">Captain</span>
                </p>
              </div>
              <div class="media-right">
                <small><a @click="kickUser(member.user)" v-if="isCaptain && member.attributes !== 2">Kick user</a></small>
              </div>
            </article>
          </div>
          <div v-if="team.members.length < team.tournament.team_size && isCaptain">
            <h1 class="title">Invite new member</h1>
            <div class="box">
              <article class="message is-danger" v-if="userInviteErrorMessage">
                <div class="message-body">
                  {{ userInviteErrorMessage }}
                </div>
              </article>
              <form @submit.prevent="inviteMember">
                <ripple-user
                  :number="team.members.length"
                  :mode="team.tournament.mode"
                  @input="setTeamMember">
                </ripple-user>
                <button type="submit" class="button is-primary"
                  :class="{ 'is-loading': invitingUser }" :disabled="newMember === 0">Invite</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <team-rename-modal v-model="team.name" :team="team.id" :is-active="renameModalActive" @close="renameModalActive = false">
      </team-rename-modal>
      <are-you-sure v-model="disbandModalActive" @yes="disband" description="Are you sure you want to disband this team? This will remove it from the tournament!"></are-you-sure>
      <are-you-sure v-model="leaveModalActive" @yes="leave" description="Are you sure you want to leave this team?"></are-you-sure>
    </section>
  </div>
</template>

<script>
import BulmaHero from "./Hero"
import LoadingSect from "./LoadingSect"
import TeamRenameModal from "./TeamRenameModal"
import AreYouSure from "./AreYouSure"
import RippleUser from "./RippleUser"
import backend from "../backend"
import osu from "../osu"
import loadUsernames from "../loadUsernames"
import store from "../store"

export default {
  components: {
    BulmaHero,
    LoadingSect,
    TeamRenameModal,
    AreYouSure,
    RippleUser,
  },
  data() {
    return {
      team: null,
      modesReadable: osu.modesReadable,
      names: {},
      leaveModalActive: false,
      renameModalActive: false,
      disbandModalActive: false,
      newMember: 0,
      invitingUser: false,
      userInviteErrorMessage: null,
    }
  },
  computed: {
    isCaptain() {
      return store.state.rippleUser !== null && this.team !== null &&
        store.state.rippleUser.id === this.team.captain
    },
    isInTeam() {
      // This is a clever method, but anyway if there is the ID in names it
      // means the user exists among the members.
      return store.state.rippleUser !== null && !!this.names[store.state.rippleUser.id]
    },
  },
  methods: {
    disband() {
      backend.misirlou.disbandTeam(this.team.id, () => {
        this.team = "disbanded"
      })
    },
    leave() {
      backend.misirlou.kickFromTeam(store.state.rippleUser.id, this.team.id, () => {
        this.team = "left"
      })
    },
    kickUser(user) {
      backend.misirlou.kickFromTeam(user, this.team.id, () => {
        var userIndex = -1
        this.team.members.forEach((value, i) => {
          if (value.user == user) {
            userIndex = i
            return false
          }
        })
        if (userIndex !== -1) {
          this.team.members.splice(userIndex, 1)
        }
      })
    },
    setTeamMember(ru) {
      this.newMember = ru.typedUser && ru.typedUser != 404 ? ru.typedUser.id : 0
    },
    inviteMember() {
      if (!this.newMember)
        return
      this.invitingUser = true
      backend.misirlou.inviteToTeam(this.newMember, this.team.id, resp => {
        this.invitingUser = false
        if (!resp.ok) {
          this.userInviteErrorMessage = resp.message
          return
        }
        this.team.members.push(resp.new_user)
        loadUsernames([resp.new_user.user], i => i, this)
      }, [403, 409])
    },
  },
  mounted() {
    backend.misirlou.team(this.$route.params.id, team => {
      if (team.ok == false) {
        this.team = 404
        return
      }
      this.team = team.team
      loadUsernames(team.team.members, i => i.user, this)
    }, [404, 403, 422]) // 422 is returned in the case of /teams/0
  },
}
</script>

<style scoped>
.unconfirmed {
  opacity: 0.6;
}
</style>
