import { onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/** 几何体配置 */
interface GeometryItem {
  geometry: THREE.BufferGeometry
  position: [number, number, number]
  color: string
}

/**
 * 常用几何体展示 — Three.js 场景组合式函数
 * 以 2×3 网格展示 6 种常用内置几何体
 * @param container - 渲染器挂载的 DOM 容器
 * @returns renderer、scene、camera 实例，供外部扩展使用
 */
export function useCommonGeometry(container: HTMLDivElement) {
  // 动画帧 ID
  let animationId: number | null = null

  // ---- 场景 ----
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#1a1a2e')

  // ---- 相机 ----
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000,
  )
  camera.position.set(8, 3, 10)
  camera.lookAt(0, 0, 0)

  // ---- 渲染器 ----
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.appendChild(renderer.domElement)

  // ---- 几何体列表 ----
  const geometryItems: GeometryItem[] = [
    {
      geometry: new THREE.BoxGeometry(1.5, 1.5, 1.5),
      position: [-4, 2, 0],
      color: '#ff6b6b',
    },
    {
      geometry: new THREE.SphereGeometry(1, 32, 32),
      position: [0, 2, 0],
      color: '#4ecdc4',
    },
    {
      geometry: new THREE.CylinderGeometry(0.8, 0.8, 2, 32),
      position: [4, 2, 0],
      color: '#45b7d1',
    },
    {
      geometry: new THREE.ConeGeometry(1, 2, 32),
      position: [-4, -2, 0],
      color: '#f9ca24',
    },
    {
      geometry: new THREE.PlaneGeometry(2, 2),
      position: [0, -2, 0],
      color: '#6c5ce7',
    },
    {
      geometry: new THREE.TorusGeometry(1, 0.4, 16, 32),
      position: [4, -2, 0],
      color: '#ff8c42',
    },
  ]

  // 存储所有 mesh 和材质引用，用于清理
  const meshes: THREE.Mesh[] = []
  const materials: THREE.Material[] = []

  // 批量创建 mesh 并添加到场景
  for (const item of geometryItems) {
    const material = new THREE.MeshStandardMaterial({
      color: item.color,
      roughness: 0.5,
      metalness: 0.1,
    })
    const mesh = new THREE.Mesh(item.geometry, material)
    mesh.position.set(...item.position)
    scene.add(mesh)
    meshes.push(mesh)
    materials.push(material)
  }

  // ---- 光照 ----
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)

  const ambientLight = new THREE.AmbientLight(0x404040)
  scene.add(ambientLight)

  // ---- 辅助 ----
  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

  // ---- 轨道控制器 ----
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.03

  // ---- 尺寸适配 ----
  const resizeObserver = new ResizeObserver(() => {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)
  })
  resizeObserver.observe(container)

  // ---- 渲染循环 ----
  function animate() {
    controls.update()
    animationId = requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()

  // ---- 清理 ----
  onUnmounted(() => {
    if (animationId) cancelAnimationFrame(animationId)
    resizeObserver.disconnect()
    renderer.dispose()
    for (const item of geometryItems) {
      item.geometry.dispose()
    }
    for (const material of materials) {
      material.dispose()
    }
    if (container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement)
    }
  })

  return { renderer, scene, camera }
}
