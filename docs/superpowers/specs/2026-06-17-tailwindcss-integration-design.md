# Tailwind CSS v4 集成设计

**日期**: 2026-06-17
**项目**: 02-three-vue (Vue 3 + Three.js + Vite)

## 目标

在现有 Vue 3 + Vite 8 + Three.js 项目中集成 Tailwind CSS v4，替换当前的内联样式和手写 CSS。

## 方案

### 新增依赖

- `tailwindcss` — Tailwind CSS v4 核心
- `@tailwindcss/vite` — Vite 插件，零配置扫描生成 CSS

### 文件变更

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `package.json` | 修改 | 新增两个依赖 |
| `vite.config.js` | 修改 | 添加 `@tailwindcss/vite` 插件 |
| `src/style/index.css` | 修改 | 替换为 `@import "tailwindcss"` |
| `src/App.vue` | 可选修改 | 内联样式逐步迁移为 Tailwind 工具类 |

### 不变更

- `src/main.js` — 保持现有 CSS 导入
- `src/composables/useThree.js` — Three.js 逻辑完全不动
- `index.html` — 保持现有 reset 样式

## 兼容性

- Tailwind CSS v4 与 Vite 8 兼容
- `@tailwindcss/vite` 自动扫描 `.vue` / `.js` 文件中的类名
- 按需生成 CSS，无额外构建配置
