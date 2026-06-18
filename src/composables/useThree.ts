import {onUnmounted} from 'vue'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Three.js 场景组合式函数
 * @param container - 渲染器挂载的 DOM 容器
 * @returns renderer、scene、camera 实例，供外部扩展使用
 */
export function useThree(container: HTMLDivElement) {
  // 动画帧 ID，用于取消循环
  let animationId: number | null = null

  // ---- 场景 ----
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x1a1a2e)

  // ---- 相机 ----
  // 透视相机：视角 75°，近裁面 0.1，远裁面 1000
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  )
  camera.position.set(15, 15, 15)
  camera.lookAt(0, 0, 0)

  // ---- 渲染器 ----
  const renderer = new THREE.WebGLRenderer({antialias: true})
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.appendChild(renderer.domElement)

  // ---- 几何体 &材质 ----
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material2 = new THREE.MeshStandardMaterial({color: 'yellow'})
  const material1 = new THREE.MeshStandardMaterial({color: 'green'})
  const parentCube = new THREE.Mesh(geometry, material2)
  parentCube.position.set(-1, -1, -1)
  parentCube.scale.set(2, 2, 2)
  parentCube.rotation.x = Math.PI / 4
  const cube = new THREE.Mesh(geometry, material1)
  parentCube.add(cube)
  // cube.position.x = 2
  // cube.position.y = 1
  // cube.position.z = 1
  // 相对于父元素
  cube.position.set(2, 2, 2)
  cube.scale.set(2, 2, 3)
  cube.rotation.x = Math.PI / 4
  scene.add(parentCube)

  // ---- 光源 ----
  // 方向光：模拟太阳光，从 (5,5,5) 照射
  const light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(5, 5, 5)
  scene.add(light)
  // 环境光：提供基础亮度，避免阴影面全黑
  const ambientLight = new THREE.AmbientLight(0x404040)
  scene.add(ambientLight)

  // ---- 辅助工具 ----
  // 坐标轴辅助线，长度 5，帮助定位空间方向
  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

  // ---- 轨道控制器 ----
  // 绑定到渲染器 DOM 元素，而非 document.body，避免事件冲突
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true       // 启用阻尼（惯性）
  controls.dampingFactor = 0.03       // 阻尼系数，越小惯性越明显
  // controls.autoRotate = true          // 自动旋转场景

  // ---- 渲染循环 ----
  function animate() {
    controls.update()                  // 阻尼效果需在每帧更新
    animationId = requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }

  animate()

  // ---- 容器尺寸适配（ResizeObserver 覆盖全屏/窗口缩放等所有场景） ----
  const resizeObserver = new ResizeObserver(() => {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)
  })
  resizeObserver.observe(container)

  // ---- 组件卸载时清理资源 ----
  onUnmounted(() => {
    if (animationId) cancelAnimationFrame(animationId)  // 停止渲染循环
    resizeObserver.disconnect()                         // 停止尺寸监听
    renderer.dispose()                                  // 释放 WebGL 上下文
    geometry.dispose()                                  // 释放几何体内存
    material1.dispose()                                  // 释放材质内存
    material2.dispose()                                  // 释放材质内存
    if (container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement)        // 移除 canvas DOM
    }
  })

  return {renderer, scene, camera}
}
