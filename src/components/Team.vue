<template>
  <div>
    <bulma-hero
      :title="team ? (team == 404 ? 'Not found' : team.name) : 'Loading...'"
      :subtitle="'A team of wonderful people competing in ' + (team && team != 404 ? team.tournament.name : 'a tournament')">
    </bulma-hero>
    <loading-sect v-if="team === null"></loading-sect>
    <section class="section" v-else-if="team == 404">
      <h1 class="title">That team could not be found</h1>
      <h2 class="subtitle">How did you get this link?</h2>
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
                This page doesn't contain much yet, eventually there will be more things.
              </div>
            </div>
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
                  <span v-else-if="member.attributes === 2">Owner</span>
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import BulmaHero from "./Hero"
import LoadingSect from "./LoadingSect"
import backend from "../backend"
import osu from "../osu"
import loadUsernames from "../loadUsernames"

export default {
  components: {
    BulmaHero,
    LoadingSect,
  },
  data() {
    return {
      team: null,
      modesReadable: osu.modesReadable,
      names: {},
    }
  },
  mounted() {
    backend.misirlou.team(this.$route.params.id, team => {
      if (team.ok == false) {
        this.team = 404
        return;
      }
      this.team = team.team
      loadUsernames(team.team.members, i => i.user, this)
    }, [404, 403])
  },
}
</script>

<style scoped>
.unconfirmed {
  opacity: 0.6;
}
</style>
