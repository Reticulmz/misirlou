<template>
  <section class="hero is-ripple-dark-pink">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">
          {{ title }}
        </h1>
        <h2 class="subtitle" v-if="subtitle">
          {{ subtitle }}
        </h2>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: ["title", "subtitle"]
}
</script>

<style>
.hero.is-ripple-dark-pink {
  color: #FFF;
  background: #E83386;
}
.hero.is-ripple-dark-pink .subtitle, .hero.is-ripple-dark-pink .title {
  color: #FFF;
}
</style>

