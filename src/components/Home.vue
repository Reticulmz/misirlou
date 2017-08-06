<template>
  <div>
    <bulma-hero
      :title="appTitle"
      subtitle="A website to interact with tournaments happening right now on Ripple.">
    </bulma-hero>
    <section class="section" v-if="tournaments !== null">
      <div v-for="tournament in tournaments" :key="tournament.id" class="boxes">
        <div class="box">
          <h1 class="title">{{ tournament.name }}</h1>
          <h2 class="subtitle">{{ tournament.description }}</h2>
        </div>
        <div
          class="compact box has-text-centered"
          v-if="tournament.exclusivity_starts">
          Runs from {{ tournament.exclusivity_starts }} until (probably) {{ tournament.exclusivity_ends }} (YYYY/MM/DD).
        </div>
        <a
          class="compact box red has-text-centered"
          v-if="tournament.status_data && tournament.status_data.twitch"
          :href="'https://twitch.tv/' + tournament.status_data.twitch">
          This tournament is live! Click here to watch the live stream.
        </a>
        <div class="columns is-gapless buttonful">
          <div class="column">
            <i class="osu-icon" :class="'mode-' + osu.modesShort[tournament.mode]"></i> {{ osu.modesReadable[tournament.mode] }}
          </div>
          <router-link class="column" :to="'/feed/' + tournament.id">
            Feed
          </router-link>
          <router-link class="column" :to="'/register/' + tournament.id" v-if="tournament.status == 1">
            Register
          </router-link>
          <router-link class="column" :to="'/beatmaps/' + tournament.id" v-if="tournament.max_beatmap_requests > 0 && tournament.status <= 2">
            Request beatmaps
          </router-link>
          <router-link class="column" :to="'/teams/' + tournament.my_team" v-if="tournament.my_team">
            Your team
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import BulmaHero from "./Hero"
import backend from "../backend"
import osu from "../osu"

export default {
  name: "home",
  components: {
    BulmaHero
  },
  data() {
    return {
      tournaments: null,
      osu: osu
    }
  },
  computed: {
    appTitle() { return process.env.APP_TITLE }
  },
  mounted() {
    backend.misirlou.tournaments(0, resp => {
      this.tournaments = resp.tournaments
    })
  }
}
</script>

<style>
@font-face {
    font-family: "OsuFont";
    src: url("../assets/osu-font.woff") format('woff');
}
.osu-icon {
  display: inline-block;
  font: normal normal normal 14px/1 OsuFont;
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.mode-std:before { content: '\e800' }
.mode-taiko:before { content: '\e803' }
.mode-ctb:before { content: '\e801' }
.mode-mania:before { content: '\e802' }
.osu-logo:before { content: '\e805' }
</style>

<style src="../assets/boxes.css"></style>

<style>
.box.compact {
  padding: 0.75rem
}

.box.red {
  background: #d82502;
  color: #fff;
}

.buttonful.columns {
  background-color: white;
  -webkit-box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
  color: #4a4a4a;
}
.buttonful.columns .column {
  padding: 1.25rem;
  text-align: center;
  font-weight: 700;
}
.buttonful.columns .column:not(:last-child) {
  border-right: 1px solid rgba(10, 10, 10, 0.1);
}
.buttonful.columns a.column {
  color: #4a4a4a;
}
.buttonful.columns a.column:hover {
  background: rgba(64, 64, 64, 0.1);
}
</style>
