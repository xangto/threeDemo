# Vue3 + Three.js 起步项目 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 搭建最小 Vue3 + Three.js(0.153.0) 项目，使用 Vite 构建，Composable 模式封装 Three.js 逻辑

**Architecture:** Vue3 SFC + Vite + Composable。`App.vue` 提供 canvas 容器，`useThree.js` composable 封装 Three.js 初始化与动画循环，组件通过 ref 获取 DOM 节点传给 composable

**Tech Stack:** Vue 3, Vite 8, Three.js 0.153.0, @vitejs/plugin-vue

---

## 文件清单

| 文件 | 操作 | 职责 |
|---|---|---|
| `package.json` | 修改 | 添加 vue 依赖、@vitejs/plugin-vue 开发依赖、dev 脚本 |
| `vite.config.js` | 新建 | Vite 配置，引入 Vue 插件 |
| `index.html` | 新建 | 入口 HTML，`<div id="app">` 挂载点 + `<script type="module" src="/src/main.js">` |
| `src/main.js` | 新建 | `createApp(App).mount('#app')` |
| `src/App.vue` | 新建 | 根组件，ref 容器，onMounted 调用 useThree |
| `src/composables/useThree.js` | 新建 | Three.js 初始化、动画循环、清理 |

---

### Task 1: 安装依赖

**Files:**
- Modify: `package.json`

- [ ] **Step 1: 安装 vue 和 @vitejs/plugin-vue**

```bash
cd "E:/WebQianDuan/threejs/learn/02-three-vue"
npm install vue
npm install -D @vitejs/plugin-vue
```

- [ ] **Step 2: 验证 package.json 包含新依赖**

```bash
node -e "const p = require('./package.json'); console.log('vue:', p.dependencies?.vue); console.log('@vitejs/plugin-vue:', p.devDependencies?.['@vitejs/plugin-vue'])"
```

Expected: 输出版本号，不是 undefined

- [ ] **Step 3: 添加 dev 和 build 脚本到 package.json**

修改 `package.json`，将 `scripts` 替换为：

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
},
```

---

### Task 2: 创建 Vite 配置文件

**Files:**
- Create: `vite.config.js`

- [ ] **Step 1: 创建 vite.config.js**

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

---

### Task 3: 创建 index.html 入口

**Files:**
- Create: `index.html`

- [ ] **Step 1: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vue3 + Three.js</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 100%; height: 100%; overflow: hidden; }
      #app { width: 100%; height: 100%; }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

---

### Task 4: 创建 Vue 应用入口

**Files:**
- Create: `src/main.js`

- [ ] **Step 1: 创建 src/main.js**

```javascript
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

---

### Task 5: 创建 useThree Composable

**Files:**
- Create: `src/composables/useThree.js`

- [ ] **Step 1: 创建 src/composables/useThree.js**

```javascript
import { ref, onUnmounted } from 'vue'
import * as THREE from 'three'

/**
 * Vue3 Composable: 管理 Three.js 场景生命周期
 * @param {HTMLElement} container - Three.js 渲染的挂载 DOM 元素
 * @returns {{ renderer: import('vue').Ref, scene: import('vue').Ref, camera: import('vue').Ref }}
 */
export function useThree(container) {
  const renderer = ref(null)
  const scene = ref(null)
  const camera = ref(null)
  let animationId = null

  // 创建场景
  scene.value = new THREE.Scene()
  scene.value.background = new THREE.Color(0x1a1a2e)

  // 创建相机
  camera.value = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  )
  camera.value.position.z = 5

  // 创建渲染器
  renderer.value = new THREE.WebGLRenderer({ antialias: true })
  renderer.value.setSize(container.clientWidth, container.clientHeight)
  renderer.value.setPixelRatio(window.devicePixelRatio)
  container.appendChild(renderer.value.domElement)

  // 示例：添加一个旋转的立方体
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff88 })
  const cube = new THREE.Mesh(geometry, material)
  scene.value.add(cube)

  // 添加光源
  const light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(5, 5, 5)
  scene.value.add(light)
  const ambientLight = new THREE.AmbientLight(0x404040)
  scene.value.add(ambientLight)

  // 动画循环
  function animate() {
    animationId = requestAnimationFrame(animate)
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    renderer.value.render(scene.value, camera.value)
  }
  animate()

  // 窗口大小自适应
  function onResize() {
    camera.value.aspect = container.clientWidth / container.clientHeight
    camera.value.updateProjectionMatrix()
    renderer.value.setSize(container.clientWidth, container.clientHeight)
  }
  window.addEventListener('resize', onResize)

  // 清理
  onUnmounted(() => {
    if (animationId) cancelAnimationFrame(animationId)
    window.removeEventListener('resize', onResize)
    renderer.value.dispose()
    geometry.dispose()
    material.dispose()
    if (container.contains(renderer.value.domElement)) {
      container.removeChild(renderer.value.domElement)
    }
  })

  return { renderer, scene, camera }
}
```

---

### Task 6: 创建 App.vue 根组件

**Files:**
- Create: `src/App.vue`

- [ ] **Step 1: 创建 src/App.vue**

```vue
<template>
  <div ref="container" class="three-container"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useThree } from './composables/useThree.js'

const container = ref(null)

onMounted(() => {
  useThree(container.value)
})
</script>

<style scoped>
.three-container {
  width: 100%;
  height: 100%;
}
</style>
```

---

### Task 7: 验证项目运行

**Files:** 无新建/修改

- [ ] **Step 1: 启动开发服务器**

```bash
cd "E:/WebQianDuan/threejs/learn/02-three-vue"
npx vite --host
```

Expected: 开发服务器启动，输出本地访问 URL（如 `http://localhost:5173`）

- [ ] **Step 2: 在浏览器打开页面确认效果**

打开浏览器访问 `http://localhost:5173`，应该看到：
- 深色背景（#1a1a2e）
- 一个绿色的旋转立方体
