# TypeScript 迁移 实施计划

**Goal:** 将项目从 JavaScript 迁移到 TypeScript

**Architecture:** 安装 typescript + vue-tsc，创建 tsconfig，重命名 .js → .ts，添加类型注解

**Tech Stack:** TypeScript, Vue 3, Vite 8, Three.js

---

### Task 1: 安装 TypeScript 依赖

**Files:** Modify: `package.json`

- [ ] `npm install -D typescript vue-tsc`

---

### Task 2: 创建 tsconfig.json

**Files:** Create: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["src/**/*.ts", "src/**/*.vue"]
}
```

---

### Task 3: 创建 src/vite-env.d.ts

**Files:** Create: `src/vite-env.d.ts`

```ts
/// <reference types="vite/client" />
```

---

### Task 4: 重命名并改造 src/composables/useThree.js → useThree.ts

**Files:** Create: `src/composables/useThree.ts`, Delete: `src/composables/useThree.js`

添加完整类型注解：

```ts
import { onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export function useThree(container: HTMLElement) {
  let animationId: number | null = null

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x1a1a2e)

  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  )
  camera.position.set(2, 2, 2)
  camera.lookAt(0, 0, 0)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.appendChild(renderer.domElement)

  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)

  const light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(5, 5, 5)
  scene.add(light)
  const ambientLight = new THREE.AmbientLight(0x404040)
  scene.add(ambientLight)

  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

  const controls = new OrbitControls(camera, document.body)
  controls.enableDamping = true
  controls.dampingFactor = 0.03
  controls.autoRotate = true

  function animate() {
    controls.update()
    animationId = requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()

  function onResize() {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)
  }
  window.addEventListener('resize', onResize)

  onUnmounted(() => {
    if (animationId) cancelAnimationFrame(animationId)
    window.removeEventListener('resize', onResize)
    renderer.dispose()
    geometry.dispose()
    material.dispose()
    if (container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement)
    }
  })

  return { renderer, scene, camera }
}
```

---

### Task 5: 重命名 src/main.js → src/main.ts

**Files:** Create: `src/main.ts`, Delete: `src/main.js`

内容不变，仅改扩展名。

---

### Task 6: App.vue 添加 lang="ts"

**Files:** Modify: `src/App.vue`

`<script setup>` → `<script setup lang="ts">`，ref 上加类型：

```ts
const container = ref<HTMLElement | null>(null)
```

---

### Task 7: 更新 index.html

**Files:** Modify: `index.html`

`src/main.js` → `src/main.ts`
