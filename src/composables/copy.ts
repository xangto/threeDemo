/*
import { onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { MeshBasicMaterial } from 'three'

/!**
 * Three.js 场景组合式函数
 * @param container - 渲染器挂载的 DOM 容器
 * @returns renderer、scene、camera 实例，供外部扩展使用
 *!/
export function useBasicGeometry(container: HTMLDivElement) {
  // 动画帧 ID，用于取消循环
  let animationId: number | null = null
  // ---- 场景 ----
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#a3a3a3')

  // ---- 相机 ----
  // 透视相机：视角 75°，近裁面 0.1，远裁面 1000
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000,
  )
  camera.position.set(15, 15, 15)
  camera.lookAt(0, 0, 0)

  // ---- 渲染器 ----
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.appendChild(renderer.domElement)

  /!* start *!/
  // 创建几何体
  const geometry = new THREE.BufferGeometry()
  // 顶点数据
  const vertices = new Float32Array([-1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0])
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  const material = new MeshBasicMaterial({
    color: '#00ff00',
  })
  const plane = new THREE.Mesh(geometry, material)
  scene.add(plane)
  /!* end *!/

  // 坐标轴辅助线，帮助定位空间方向
  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)
  // ---- 轨道控制器 ----
  // 绑定到渲染器 DOM 元素，而非 document.body，避免事件冲突
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true // 启用阻尼（惯性）
  controls.dampingFactor = 0.03 // 阻尼系数，越小惯性越明显
  // controls.autoRotate = true          // 自动旋转场景

  // ---- 容器尺寸适配（ResizeObserver 覆盖全屏/窗口缩放等所有场景） ----
  const resizeObserver = new ResizeObserver(() => {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)
  })
  resizeObserver.observe(container)

  // ---- 渲染循环 ----
  function animate() {
    controls.update() // 阻尼效果需在每帧更新
    animationId = requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }

  animate()
  // ---- 组件卸载时清理资源 ----
  onUnmounted(() => {
    if (animationId) cancelAnimationFrame(animationId) // 停止渲染循环
    resizeObserver.disconnect() // 停止尺寸监听
    renderer.dispose() // 释放 WebGL 上下文
    if (container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement) // 移除 canvas DOM
    }
  })

  return { renderer, scene, camera }
}
*/
