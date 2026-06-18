<template>
  <div class="min-h-full bg-white">
    <div class="flex flex-col gap-4">
      <el-card shadow="hover">
        <template #header>
          <span class="font-semibold text-base">📋 概述</span>
        </template>
        <p class="text-gray-600 leading-relaxed">
          一个基于 Vue 3 + Three.js 的学习项目，使用 Vite 构建，通过 Composable 模式封装 Three.js 逻辑，
          逐步探索 3D 图形在 Web 前端中的应用。
        </p>
      </el-card>

      <el-card shadow="hover">
        <template #header>
          <span class="font-semibold text-base">🛠 技术栈</span>
        </template>
        <div class="grid grid-cols-4 gap-3">
          <div
            v-for="tech in techStack"
            :key="tech.name"
            class="text-center py-4 px-3 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div class="text-sm font-medium text-gray-800">{{ tech.name }}</div>
            <div class="text-xs text-gray-400 mt-1">{{ tech.version }}</div>
          </div>
        </div>
      </el-card>

      <el-card shadow="hover">
        <template #header>
          <span class="font-semibold text-base">📂 项目结构</span>
        </template>
        <pre class="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 border border-gray-100 overflow-x-auto"><code>src/
  ├── main.ts              # 应用入口，注册 Vue Router、Element Plus
  ├── App.vue              # 根布局：侧边菜单 + router-view
  ├── router/
  │   └── index.ts          # Hash 路由配置
  ├── composables/
  │   └── useThree.ts       # Three.js 生命周期 Composable
  ├── views/
  │   ├── Home.vue          # 项目介绍页
  │   └── Practice.vue      # Three.js 练习页
  └── style/
      └── index.css         # Tailwind CSS 入口</code></pre>
      </el-card>

      <el-card shadow="hover">
        <template #header>
          <span class="font-semibold text-base">📦 依赖清单</span>
        </template>
        <el-table
          :data="dependencies"
          size="small"
          stripe
        >
          <el-table-column prop="name" label="包名" />
          <el-table-column prop="version" label="版本" width="100" />
          <el-table-column prop="purpose" label="用途" />
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
const techStack = [
  { name: 'Vue 3', version: '^3.5.38' },
  { name: 'Three.js', version: '^0.153.0' },
  { name: 'Vite', version: '^8.0.16' },
  { name: 'TypeScript', version: '^6.0.3' },
  { name: 'Tailwind CSS', version: '^4.3.1' },
  { name: 'Element Plus', version: 'latest' },
  { name: 'Vue Router', version: 'latest' },
  { name: 'OrbitControls', version: '内置' },
]

const dependencies = [
  { name: 'three', version: '^0.153.0', purpose: '3D 渲染引擎' },
  { name: 'vue', version: '^3.5.38', purpose: '前端框架' },
  { name: 'vite', version: '^8.0.16', purpose: '构建工具' },
  { name: 'tailwindcss', version: '^4.3.1', purpose: '原子化 CSS' },
  { name: 'element-plus', version: 'latest', purpose: 'UI 组件库' },
  { name: 'vue-router', version: 'latest', purpose: '路由管理' },
  { name: 'typescript', version: '^6.0.3', purpose: '类型系统' },
  { name: 'vue-tsc', version: '^3.3.5', purpose: 'SFC 类型检查' },
]
</script>
