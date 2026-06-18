# TypeScript 迁移设计

**日期**: 2026-06-17
**项目**: 02-three-vue (Vue 3 + Three.js + Vite + Tailwind CSS)

## 目标

将项目从 JavaScript 迁移到 TypeScript。

## 方案

### 新增依赖

- `typescript` — TypeScript 编译器
- `vue-tsc` — Vue SFC 类型检查工具

### 新增文件

- `tsconfig.json` — TS 编译配置（root）
- `src/vite-env.d.ts` — Vite 客户端类型声明

### 文件变更

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/main.js` | 重命名为 `.ts` | 入口文件 |
| `src/composables/useThree.js` | 重命名为 `.ts` | 添加 TS 类型 |
| `src/App.vue` | 修改 | `<script setup>` → `<script setup lang="ts">` |
| `index.html` | 修改 | `<script>` src 指向 `.ts` |

### 不变更

- `vite.config.js` — 保持 `.js`
- Three.js 逻辑功能不变
- Tailwind CSS 配置不变
