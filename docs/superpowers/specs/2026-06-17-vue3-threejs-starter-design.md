# Vue3 + Three.js 起步项目设计

## 概述

创建一个最精简的 Vue3 项目，用于学习 Three.js（0.153.0）与 Vue3 的结合使用。不引入 Router 或状态管理库，保持轻量。

## 项目结构

```
02-three-vue/
├── index.html              # 入口 HTML
├── vite.config.js          # Vite 配置（添加 Vue 插件）
├── package.json
├── src/
│   ├── main.js             # 创建并挂载 Vue 应用
│   ├── App.vue             # 根组件，持有 canvas 容器，调用 useThree
│   └── composables/
│       └── useThree.js     # Three.js 核心逻辑封装（Composable）
```

## 各文件职责

| 文件 | 职责 |
|---|---|
| `vite.config.js` | 引入 `@vitejs/plugin-vue`，让 Vite 支持 `.vue` SFC 编译 |
| `main.js` | `createApp(App).mount('#app')`，Vue 应用入口 |
| `App.vue` | 模板：`<div ref="container">` 作为 Three.js 挂载点；`onMounted` 时调用 `useThree(container)` |
| `useThree.js` | Vue3 Composable：创建 Scene / Camera / Renderer / 动画循环，`onUnmounted` 时 dispose 清理 |

## 数据流

```
main.js → createApp → mount('#app')
                        ↓
App.vue → <div ref="container">  ← Three.js 渲染目标
              ↓ onMounted
useThree(container) → 创建 Scene、Camera、Renderer
                    → 启动 requestAnimationFrame 循环
                    → onUnmounted 时 dispose() 清理
```

## 依赖

- `vue` — Vue3 核心
- `three@0.153.0` — Three.js（已安装）
- `@vitejs/plugin-vue` — Vite 编译 .vue SFC

## 非目标

- 不含 Vue Router、Pinia
- 不含 TypeScript（保持学习门槛最低）
- 不含 UI 组件库
