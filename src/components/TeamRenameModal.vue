<template>
  <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-background" @click="shouldClose"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Rename team</p>
        <button class="delete" @click="shouldClose"></button>
      </header>
      <form @submit.prevent="renameTeam">
        <section class="modal-card-body">
          <input class="input" type="text" placeholder="Team name..." :value="value" @input="teamName = $event.target.value">
        </section>
        <footer class="modal-card-foot">
          <button type="submit" class="button is-primary" :class="{ 'is-loading': isLoading }">Save</button>
        </footer>
      </form>
    </div>
  </div>
</template>

<script>
import backend from "../backend"

export default {
  props: ["value", "isActive", "team"],
  methods: {
    shouldClose() {
      this.$emit("close")
    },
    renameTeam() {
      this.isLoading = true
      backend.misirlou.renameTeam(this.team, this.teamName, newName => {
        this.isLoading = false
        this.$emit("input", newName.new_name)
        this.$emit("close")
      })
    },
  },
  data() {
    return {
      teamName: this.value,
      isLoading: false,
    }
  },
}
</script>
