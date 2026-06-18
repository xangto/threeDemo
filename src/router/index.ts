import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { title: '项目介绍', icon: 'house' },
    },
    {
      path: '/practice',
      name: 'practice',
      component: () => import('@/views/Practice.vue'),
      meta: { title: '练习', icon: 'box' },
    },
  ],
})

export default router
