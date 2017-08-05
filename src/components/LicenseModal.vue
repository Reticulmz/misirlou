<template>
  <div class="modal" :class="{ 'is-active': value }">
    <div class="modal-background" @click="close"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Info &amp; licenses</p>
        <button class="delete" @click="close"></button>
      </header>
      <section class="modal-card-body content">
        <p>
          This website runs on <b>Misirlou</b>, Ripple's tournament management
          system. It has a MIT license. The source code is available
          <a href="https://zxq.co/ripple/misirlou">here (frontend)</a> and
          <a href="https://zxq.co/ripple/misirlou-api">here (backend)</a>.
        </p>
        <p>
          Misirlou is &copy; 2017 Morgan Bazalgette.
        </p>
        <p>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></p>
        <p>aaaand a bunch of other stuff i aint got time to do this now</p>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  props: ["value"],
  methods: {
    close() {
      this.$emit("input", false)
    },
  },
}
</script>
