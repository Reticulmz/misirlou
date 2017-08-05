<template>
  <div class="snack-container" :class="{'hidden': !isVisible}">
    <a class="snackbar" @click="isVisible = false">
      {{ notification }}
    </a>
  </div>
</template>

<script>
import store from "../store"

export default {
  watch: {
    notification() {
      this.isVisible = true
      setTimeout(() => this.isVisible = false, 10000)
    }
  },
  data() {
    return {
      isVisible: false,
    }
  },
  computed: {
    notification() {
      return store.state.snackbarMessage
    },
  },
}
</script>

<style scoped>
.snack-container {
  position: fixed;
  width: 100%;
  bottom: 10px;
  transition: bottom 600ms;
}
.snack-container.hidden {
  bottom: -500px; /* Good enough. */
}
.snackbar {
  display: block;
  background: #444;
  max-width: 550px;
  width: 100%;
  border-radius: 3px;
  -webkit-box-shadow: 0 2px 6px 0 #666666;
  box-shadow: 0 2px 6px 0 #666666;
  color: #EEE;
  margin: 0 auto;
  line-height: 1.5;
  padding: 1rem;
}
</style>
