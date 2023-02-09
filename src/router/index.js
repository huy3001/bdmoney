import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    routes: [
      {
        path: '/',
        name: 'home'
      }, 
      {
        path: '/capdoi',
        name: 'couple'
      }
    ],
    mode: 'history'
})

export default router
