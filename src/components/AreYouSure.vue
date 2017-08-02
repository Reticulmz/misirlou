<template>
  <div class="modal" :class="{ 'is-active': value }">
    <div class="modal-background" @click="shouldClose"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Are you sure?</p>
        <button class="delete" @click="shouldClose"></button>
      </header>
      <section class="modal-card-body has-text-centered" v-if="description">
        {{ description }}
      </section>
      <footer class="modal-card-foot">
        <button type="submit" class="button is-info" @click="yes">Yes</button>
        <button type="submit" class="button is-danger" @click="shouldClose">No</button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  props: ["value", "description"],
  methods: {
    shouldClose() {
      this.$emit("input", false)
    },
    yes() {
      this.$emit("yes")
      this.$emit("input", false)
    },
  },
}
</script>
