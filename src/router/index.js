import Vue from "vue"
import Router from "vue-router"
import Home from "@/components/Home"
import Register from "@/components/Register"
import Invites from "@/components/Invites"

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
    },
    {
      path: "/invites",
      name: "Invites",
      component: Invites,
      meta: {
        title: "Invites"
      }
    },
  ]
})
