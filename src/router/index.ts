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
    // 基础几何体
     {
       path: '/geometry',
       name: 'geometry',
       component: () => import('@/views/Geometry.vue'),
       meta: { title: '基础几何体', icon: 'grid' },
     },
    {
      path: '/rubik-cube',
      name: 'rubikCube',
      component: () => import('@/views/RubikCube.vue'),
      meta: { title: '魔方', icon: 'grid' },
    },
  ],
})

export default router
