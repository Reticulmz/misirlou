import Vue from "vue"
import Router from "vue-router"
import Home from "@/components/Home"
import Register from "@/components/Register"
import Invites from "@/components/Invites"
import Feed from "@/components/Feed"
import Beatmaps from "@/components/Beatmaps"
import Logout from "@/components/Logout"

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
      path: "/feed/:id",
      name: "Feed",
      component: Feed,
      meta: {
        title: "Feed"
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
    {
      path: "/logout",
      name: "Log out",
      component: Logout,
      meta: {
        title: "Log out"
      }
    },
    {
      path: "/beatmaps/:id",
      name: "RequestBeatmap",
      component: Beatmaps,
      meta: {
        title: "Request a Beatmap"
      }
    },
  ]
})
