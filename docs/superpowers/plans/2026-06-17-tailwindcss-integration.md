# Tailwind CSS v4 集成 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 Vue 3 + Vite 8 + Three.js 项目中集成 Tailwind CSS v4

**Architecture:** 通过 `@tailwindcss/vite` 插件零配置集成，CSS 入口使用 `@import "tailwindcss"`，自动扫描 Vue/JS 文件中的工具类按需生成 CSS

**Tech Stack:** Vite 8, Vue 3, Tailwind CSS v4, @tailwindcss/vite

---

### Task 1: 安装依赖

**Files:**
- Modify: `package.json`

- [ ] **Step 1: 安装 tailwindcss 和 @tailwindcss/vite**

```bash
npm install tailwindcss @tailwindcss/vite
```

- [ ] **Step 2: 验证安装 — 检查 package.json**

```bash
node -e "const p = require('./package.json'); console.log(p.dependencies.tailwindcss, p.dependencies['@tailwindcss/vite'])"
```

Expected: 两个版本号输出，无报错

---

### Task 2: 配置 Vite 插件

**Files:**
- Modify: `vite.config.js`

- [ ] **Step 1: 在 vite.config.js 中添加 @tailwindcss/vite 插件**

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
})
```

---

### Task 3: 替换 CSS 入口

**Files:**
- Modify: `src/style/index.css`

- [ ] **Step 1: 将 src/style/index.css 替换为 Tailwind 入口**

```css
@import "tailwindcss";
```

原有的 reset 样式由 Tailwind 的 Preflight（类似 normalize.css）自动提供，`margin: 0` / `box-sizing: border-box` 等无需手写。

---

### Task 4: 迁移 App.vue 内联样式

**Files:**
- Modify: `src/App.vue`

- [ ] **Step 1: 将 App.vue 中的内联样式和 scoped CSS 替换为 Tailwind 工具类**

```html
<template>
  <div class="w-full h-full flex">
    <div ref="container" class="w-[80%] h-full"></div>
    <div class="w-[20%] h-full bg-black"></div>
  </div>
</template>
```

移除原有的 `<style scoped>` 块。

---

### Task 5: 验证

- [ ] **Step 1: 启动开发服务器**

```bash
npm run dev
```

- [ ] **Step 2: 打开浏览器验证**

预期：页面正常渲染，Three.js 立方体和坐标轴显示正常，左右分栏布局不变。无控制台错误。

- [ ] **Step 3: 检查 Tailwind 是否生效**

在浏览器 DevTools 的 Elements 面板中检查 `div` 元素，应看到 Tailwind 生成的对应 CSS 类（如 `.flex`, `.w-full`, `.h-full` 等）应用到了元素上。
