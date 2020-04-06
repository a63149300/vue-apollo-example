import Vue from 'vue'
import VueRouter from 'vue-router'
import List from '../views/List.vue'
import Tags from '../views/Tags.vue'
import Random from '../views/Random.vue'
import Hello from '../views/Hello.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'list',
    component: List
  },
  {
    path: '/tags',
    name: 'tags',
    component: Tags
  },
  {
    path: '/random',
    name: 'random',
    component: Random
  },
  {
    path: '/hello',
    name: 'hello',
    component: Hello
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
