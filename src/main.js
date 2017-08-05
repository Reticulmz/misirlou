// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue"
import App from "./App"
import router from "./router"
import timeago from "vue-timeago"
import Raven from "raven-js"
import RavenVue from "raven-js/plugins/vue"
import firebase from "./firebase"

if (process.env.SENTRY_URL !== "") {
  Raven
    .config(process.env.SENTRY_URL)
    .addPlugin(RavenVue, Vue)
    .install()
}

Vue.use(timeago, {
  name: "timeago",
  locale: "en-US",
  locales: {
    "en-US": require("vue-timeago/locales/en-US.json")
  },
})

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  document.title = (to.meta.title ? to.meta.title + " | " : "") + process.env.APP_TITLE
  next()
})

new Vue({
  el: "#app",
  router,
  template: "<App/>",
  components: { App },
})
