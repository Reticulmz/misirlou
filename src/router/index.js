import Vue from "vue"
import Router from "vue-router"
import Home from "@/components/Home"
import Register from "@/components/Register"

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
      meta: {
        title: "Home"
      }
    },
    {
      path: "/register/:id",
      name: "Register",
      component: Register,
      meta: {
        title: "Register"
      }
    }
  ]
})
