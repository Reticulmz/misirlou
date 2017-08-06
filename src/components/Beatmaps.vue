<template>
  <div>
    <bulma-hero
      title="Request a beatmap"
      :subtitle="'You would like to see some beatmaps being played in ' + (tournament ? tournament.name : 'a tournament') + '? Cool!'">
    </bulma-hero>
    <section class="section">
      <loading-sect v-if="tournament === null"></loading-sect>
      <div v-else-if="tournament === 404">
        <h1 class="title">That tournament could not be found!</h1>
        <h2 class="subtitle">Have you checked in the cupboard?</h2>
      </div>
      <div v-else-if="tournament.max_beatmap_requests < 1 || tournament.status > 2">
        <h1 class="title">This tournament does not allow beatmap requests at the moment.</h1>
        <h2 class="subtitle">Sorry about that!</h2>
      </div>
      <div v-else class="box">
        <p>
          Here you can suggest beatmaps to play in the tournament.<br>
          Please remember to place only <strong>beatmap links</strong>, not
          beatmap sets links. This means you should only write links starting
          with "https://osu.ppy.sh/b/", not "https://osu.ppy.sh/s/".<br>
          We also allow links starting with "https://ripple.moe/b/", so that you
          can get the beatmaps from osu! quite easily.<br>
          You can suggest up to <b>{{ tournament.max_beatmap_requests }} beatmaps.</b>
        </p>
        <br>
        <form @submit.prevent="onSubmit">
          <div v-for="(request, index) in requests" :key="index" class="field is-grouped">
            <div class="control is-expanded">
              <input
                class="input"
                type="text"
                placeholder="Place a beatmap URL here, e.g. https://osu.ppy.sh/b/75"
                v-model="request.beatmap"
                @input="createNewLastElement"
                :class="{ 'is-danger': isBeatmapLinkDanger(request.beatmap) }">
            </div>
            <category-dropdown :mode="tournament.mode" v-model="request.category"></category-dropdown>
          </div>
          <br>
          <div class="field is-grouped is-grouped-right">
            <p class="control">
              <button class="button is-primary" type="submit" :class="{ 'is-loading': isLoading, 'is-success': isSuccess }">
                <span v-if="isSuccess">Saved!</span><span v-else>Save</span>
              </button>
            </p>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
import BulmaHero from "./Hero"
import LoadingSect from "./LoadingSect"
import CategoryDropdown from "./CategoryDropdown"
import backend from "../backend"

function createNewLastElement(component) {
  if (
    (component.requests.length === 0 || component.requests[component.requests.length - 1].beatmap !== "") &&
    component.requests.length < component.tournament.max_beatmap_requests
  ) {
    component.requests.push({beatmap: "", category: "0"})
  }
}

function responseHandler(component, saving) {
  return requests => {
    requests.requests.forEach((v, k) => {
      requests.requests[k].beatmap = "https://osu.ppy.sh/b/" + v.beatmap
    })
    component.requests = requests.requests
    component.isLoading = false
    if (saving) {
      component.isSuccess = true
      setTimeout(() => {
        component.isSuccess = false
      }, 2500)
    }
  }
}

// using the same regexp object to do .test and .match is not deterministic
// see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test#Description
function getBeatmapRegex() {
  return /^https?:\/\/(?:osu\.ppy\.sh|ripple\.moe)\/b\/(\d+)$/g
}

export default {
  components: {
    BulmaHero,
    LoadingSect,
    CategoryDropdown,
  },
  data() {
    return {
      tournament: null,
      requests: [],
      isLoading: false,
      isSuccess: false,
    }
  },
  watch: {
    requests() {
      createNewLastElement(this)
    },
  },
  methods: {
    createNewLastElement() {
      createNewLastElement(this)
    },
    onSubmit() {
      this.isLoading = true
      this.isSuccess = false
      let requests = []
      this.requests.forEach(req => {
        const id = getBeatmapRegex().exec(req.beatmap)
        if (id === null)
          return
        requests.push({
          beatmap: +id[1],
          category: +req.category,
        })
      })
      backend.misirlou.sendBeatmapRequests(this.tournament.id, requests, responseHandler(this, true))
    },
    isBeatmapLinkDanger(value) {
      if (value === "")
        return false
      return !getBeatmapRegex().test(value)
    },
  },
  mounted() {
    backend.misirlou.tournaments(this.$route.params["id"], tourn => {
      if (tourn.tournaments.length < 1) {
        this.tournament = 404
        return
      }
      this.tournament = tourn.tournaments[0]
      backend.misirlou.beatmapRequests(this.$route.params["id"], responseHandler(this))
    })
  },
}
</script>
