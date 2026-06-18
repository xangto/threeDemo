<template>
  <div class="flex h-full">
    <!-- 侧边菜单栏 -->
    <aside class="w-[220px] h-full bg-[#1a1a2e] overflow-y-auto shrink-0">
      <div
        class="h-[100px] flex items-center justify-center text-white text-2xl font-bold border-b border-white/10 cursor-pointer hover:text-[#409eff] transition-colors"
        @click="router.push('/')"
      >
        Three.js + Vue3
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        background-color="#1a1a2e"
        text-color="#c0c4cc"
        active-text-color="#409eff"
        class="border-r-0!"
      >
        <el-menu-item
          v-for="item in menuRoutes"
          :key="item.path"
          :index="item.path"
        >
          <el-icon>
            <component :is="iconMap[item.meta?.icon as string]" />
          </el-icon>
          <span>{{ item.meta?.title }}</span>
        </el-menu-item>
      </el-menu>
    </aside>

    <!-- 主内容区 -->
    <main class="flex-1 p-6 h-full overflow-auto bg-white">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { House, Box } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

/** 菜单项只取无 hidden 标记的路由 */
const menuRoutes = computed(() =>
  router.options.routes.filter((r) => !r.meta?.hidden),
)

const activeMenu = computed(() => route.path)

/** 图标名 → 组件映射，新增路由图标时只需在此扩展 */
const iconMap: Record<string, Component> = {
  house: House,
  box: Box,
}
</script>
