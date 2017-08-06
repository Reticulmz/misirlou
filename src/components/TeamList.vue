<template>
  <div>
    <bulma-hero :title="'Teams in ' + (tournamentName ? tournamentName : '...')" subtitle="I couldn't think of anything clever to write here. Well, I guess this is kinda clever?"></bulma-hero>
    <section class="section">
      <article class="media" v-for="team in teams" :key="team.id">
        <figure class="media-left">
          <p class="image is-64x64">
            <img :src="'https://a.ripple.moe/' + team.captain">
          </p>
        </figure>
        <div class="media-content">
          <div class="content">
            <p>
              <strong><router-link :to="'/teams/' + team.id">{{ team.name }}:</router-link></strong> a team by
              <strong v-if="names[team.captain]">{{ names[team.captain] }}</strong>
              <strong v-else>...</strong>
            </p>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<script>
import backend from "../backend"
import loadUsernames from "../loadUsernames"
import BulmaHero from "./Hero"

export default {
  components: {
    BulmaHero,
  },
  data() {
    return {
      tournamentName: null,
      teams: [],
      names: {},
    }
  },
  mounted() {
    backend.misirlou.teams(this.$route.params.id, teams => {
      this.teams = teams.teams
      loadUsernames(teams.teams, i => i.captain, this)
    })
    backend.misirlou.tournaments(this.$route.params["id"], tourn => {
      if (tourn.tournaments.length < 1) {
        this.tournamentName = "Tournament not found"
        return
      }
      this.tournamentName = tourn.tournaments[0].name
    })
  },
}
</script>
