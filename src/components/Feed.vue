<template>
  <div>
    <bulma-hero
      :title="tournament.name"
      :subtitle="tournament.description">
    </bulma-hero>
    <section class="section">
      <div class="columns">
        <div class="column is-one-quarter">
          <div class="card">
            <header class="card-header">
              <p class="card-header-title">
                {{ tournament.name }}
              </p>
            </header>
            <div class="card-content">
              <div class="content">
                Runs from <strong>{{ tournament.exclusivity_starts }}</strong> to
                <strong>{{ tournament.exclusivity_ends }}</strong>.
                <br>
                Created <strong><timeago :since="tournament.created_at"></timeago></strong>.<br>
                Mode: <strong>{{ modesReadable[tournament.mode] }}</strong>.<br>
                <div v-if="tournament.my_team">
                  You are currently enrolled in
                  <strong><router-link :to="'/teams/' + tournament.my_team">
                    {{ tournament.my_team_name }}.
                  </router-link></strong>
                </div>
              </div>
            </div>
            <footer class="card-footer">
              <a class="card-footer-item" @click="showRules">Rules</a>
              <router-link :to="'/register/' + tournament.id" class="card-footer-item">Register</router-link>
              <router-link :to="'/beatmaps/' + tournament.id" class="card-footer-item">Beatmaps</router-link>
            </footer>
          </div>
        </div>
        <div class="column is-three-quarters">
          <article class="media" v-for="item in feedItems" :key="item.id">
            <figure class="media-left" v-if="item.author">
              <a class="image is-64x64" :href="'https://ripple.moe/u/' + item.author" target="_blank">
                <img :src="'http://a.ripple.moe/' + item.author">
              </a>
            </figure>
            <div class="media-content">
              <div v-if="item.author">
                <b v-if="names[item.author]">{{ names[item.author] }}</b><b v-else>...</b>
                posted:
              </div>
              <div class="content" v-html="marked(item.content)">
              </div>
            </div>
            <div class="media-right">
              <timeago :since="item.created_at"></timeago>
            </div>
          </article>
        </div>
      </div>
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
import backend from "../backend"
import marked from "marked"
import osu from "../osu"
import loadUsernames from "../loadUsernames"

export default {
  components: {
    BulmaHero,
  },
  data() {
    return {
      tournament: {
        name: "Loading...",
        description: "If this takes a long time, it means there's either been an error or your connection sucks.",
      },
      feedItems: [],
      rules: null,
      modalActive: false,
      modesReadable: osu.modesReadable,
      names: {},
    }
  },
  methods: {
    showRules() {
      this.modalActive = true
      if (this.rules != null)
        return;
      this.rules = "<i>Loading...</i>"
      backend.misirlou.rules(this.tournament.id, rules => {
        if (!rules.rules) {
          this.rules = "<i>Looks like this tournament has no rules!</i>"
          return
        }
        this.rules = marked(rules.rules)
      })
    },
    marked: marked,
  },
  mounted() {
    backend.misirlou.tournaments(this.$route.params.id, tourn => {
      if (tourn.tournaments.length < 1) {
        this.tournament.name = "Not found"
        this.tournament.description = "Looks like that tournament doesn't exist!"
        return
      }
      tourn = tourn.tournaments[0]
      this.tournament = tourn
    })
    backend.misirlou.feedItems(this.$route.params.id, items => {
      this.feedItems = items.items
      loadUsernames(items.items, i => i.author, this)
    })
  },
}
</script>

<style>

</style>
