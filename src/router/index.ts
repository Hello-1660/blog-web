import { createRouter, createWebHistory } from 'vue-router'

import Index from '@/views/IndexView.vue'
import LoginIn from '@/views/LoginInView.vue'

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginIn,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
