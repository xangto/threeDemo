import { onUnmounted, ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/** 魔方六个面的颜色（标准配色） */
const COLORS = {
  right: 0xb71234, // 红 +X
  left: 0xff5800, // 橙 -X
  up: 0xffffff, // 白 +Y
  down: 0xffd500, // 黄 -Y
  front: 0x009b48, // 绿 +Z
  back: 0x0046ad, // 蓝 -Z
  inner: 0x111111, // 内部面黑色
}

const CUBIE_SIZE = 0.85
const GAP = 0.08
const SPACING = CUBIE_SIZE + GAP

/**
 * 魔方组合式函数
 * @param container - 渲染器挂载的 DOM 容器
 */
export function useRubikCube(container: HTMLDivElement) {
  let animationId: number | null = null
  const isSolved = ref(false)
  const isAnimating = ref(false)

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x1a1a2e)

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100,
  )
  camera.position.set(6, 5, 8)
  camera.lookAt(0, 0, 0)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.appendChild(renderer.domElement)

  // 光照
  scene.add(new THREE.AmbientLight(0x404040))
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
  dirLight.position.set(5, 10, 7)
  scene.add(dirLight)
  const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.6)
  dirLight2.position.set(-5, -2, -5)
  scene.add(dirLight2)

  // OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.target.set(0, 0, 0)

  // 魔方主组
  const cubeGroup = new THREE.Group()
  scene.add(cubeGroup)

  // 所有小方块 + 射线检测器
  const cubies: THREE.Mesh[] = []
  const raycaster = new THREE.Raycaster()

  /** 创建方块面材质 */
  function createFaceMaterials(x: number, y: number, z: number): THREE.MeshStandardMaterial[] {
    const mat = (color: number) => new THREE.MeshStandardMaterial({ color, roughness: 0.4 })
    return [
      mat(x === 1 ? COLORS.right : COLORS.inner), // +X
      mat(x === -1 ? COLORS.left : COLORS.inner), // -X
      mat(y === 1 ? COLORS.up : COLORS.inner), // +Y
      mat(y === -1 ? COLORS.down : COLORS.inner), // -Y
      mat(z === 1 ? COLORS.front : COLORS.inner), // +Z
      mat(z === -1 ? COLORS.back : COLORS.inner), // -Z
    ]
  }

  /** 构建魔方 */
  function buildCube() {
    cubies.forEach(c => {
      cubeGroup.remove(c)
      c.geometry.dispose()
      if (Array.isArray(c.material)) c.material.forEach(m => m.dispose())
    })
    cubies.length = 0
    cubeGroup.rotation.set(0, 0, 0)

    const geometry = new THREE.BoxGeometry(CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE)

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue
          const mesh = new THREE.Mesh(geometry, createFaceMaterials(x, y, z))
          mesh.position.set(x * SPACING, y * SPACING, z * SPACING)
          mesh.userData = {
            initialPosition: mesh.position.clone(),
            gridPos: { x, y, z },
          }
          cubeGroup.add(mesh)
          cubies.push(mesh)
        }
      }
    }
  }

  /** 根据世界坐标获取某层所有方块 */
  function getFaceCubies(axis: 'x' | 'y' | 'z', layer: number): THREE.Mesh[] {
    const threshold = 0.5
    const target = layer * SPACING
    return cubies.filter(c => {
      const pos = new THREE.Vector3()
      c.getWorldPosition(pos)
      cubeGroup.worldToLocal(pos)
      return Math.abs((axis === 'x' ? pos.x : axis === 'y' ? pos.y : pos.z) - target) < threshold
    })
  }

  /** 旋转一个面（带动画） */
  function rotateLayer(
    axis: 'x' | 'y' | 'z',
    layer: number,
    angle: number,
    duration = 250,
  ): Promise<void> {
    return new Promise(resolve => {
      const faceCubies = getFaceCubies(axis, layer)
      if (faceCubies.length === 0) {
        resolve()
        return
      }

      const pivot = new THREE.Group()
      cubeGroup.add(pivot)

      faceCubies.forEach(c => {
        const wp = c.getWorldPosition(new THREE.Vector3())
        const wq = c.getWorldQuaternion(new THREE.Quaternion())
        cubeGroup.worldToLocal(wp)
        pivot.attach(c)
        c.position.copy(wp)
        c.quaternion.copy(wq)
        const pq = new THREE.Quaternion()
        pivot.getWorldQuaternion(pq)
        pq.invert()
        c.quaternion.premultiply(pq)
      })

      const start = performance.now()
      const axisVec = new THREE.Vector3(
        axis === 'x' ? 1 : 0,
        axis === 'y' ? 1 : 0,
        axis === 'z' ? 1 : 0,
      )

      function step(now: number) {
        const p = Math.min((now - start) / duration, 1)
        const t = p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2
        pivot.quaternion.setFromAxisAngle(axisVec, angle * t)
        if (p < 1) {
          requestAnimationFrame(step)
        } else {
          faceCubies.forEach(c => {
            const wp = c.getWorldPosition(new THREE.Vector3())
            cubeGroup.worldToLocal(wp)
            cubeGroup.attach(c)
            c.position.copy(wp)
          })
          cubeGroup.remove(pivot)
          resolve()
        }
      }
      requestAnimationFrame(step)
    })
  }

  /** 随机打乱 */
  async function scramble(moveCount = 20) {
    if (isAnimating.value) return
    isAnimating.value = true
    isSolved.value = false
    const axes: ('x' | 'y' | 'z')[] = ['x', 'y', 'z']
    for (let i = 0; i < moveCount; i++) {
      const axis = axes[Math.floor(Math.random() * 3)]
      const layer = [-1, 1][Math.floor(Math.random() * 2)]
      const angle = ((Math.random() > 0.5 ? 1 : -1) * Math.PI) / 2
      await rotateLayer(axis, layer, angle, 80)
    }
    isAnimating.value = false
    checkSolved()
  }

  /** 检测是否已还原 */
  function checkSolved() {
    for (const c of cubies) {
      if (c.position.distanceTo(c.userData.initialPosition as THREE.Vector3) > 0.1) {
        isSolved.value = false
        return
      }
      const q = c.quaternion
      if (Math.abs(q.x) > 0.01 || Math.abs(q.y) > 0.01 || Math.abs(q.z) > 0.01) {
        isSolved.value = false
        return
      }
    }
    if (cubies.length > 0) isSolved.value = true
  }

  /** 重置 */
  function reset() {
    buildCube()
    isSolved.value = false
  }

  // ---- 点击旋转 ----
  const mouse = new THREE.Vector2()
  let pointerDown = new THREE.Vector2()
  const DRAG_THRESHOLD = 3 // 像素，区分拖拽和点击

  function onPointerDown(e: PointerEvent) {
    pointerDown.set(e.clientX, e.clientY)
  }

  async function onPointerUp(e: PointerEvent) {
    if (isAnimating.value) return
    const dx = e.clientX - pointerDown.x
    const dy = e.clientY - pointerDown.y
    if (Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) return // 拖拽，不处理

    const rect = renderer.domElement.getBoundingClientRect()
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

    raycaster.setFromCamera(mouse, camera)
    const hits = raycaster.intersectObjects(cubies, false)
    if (hits.length === 0) return

    const hit = hits[0]
    const cubie = hit.object as THREE.Mesh

    // 将面法线转换到 cubeGroup 局部坐标
    const normalLocal = hit.face!.normal.clone()
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(cubie.matrixWorld)
    normalLocal.applyMatrix3(normalMatrix)
    // 再转到 cubeGroup 局部
    const invMatrix = new THREE.Matrix3().getNormalMatrix(cubeGroup.matrixWorld).invert()
    normalLocal.applyMatrix3(invMatrix)
    normalLocal.normalize()

    // 找出法线的主轴
    const absX = Math.abs(normalLocal.x)
    const absY = Math.abs(normalLocal.y)
    const absZ = Math.abs(normalLocal.z)

    let axis: 'x' | 'y' | 'z'
    let sign: number
    if (absX >= absY && absX >= absZ) {
      axis = 'x'
      sign = Math.sign(normalLocal.x)
    } else if (absY >= absX && absY >= absZ) {
      axis = 'y'
      sign = Math.sign(normalLocal.y)
    } else {
      axis = 'z'
      sign = Math.sign(normalLocal.z)
    }

    // 确定层：取方块当前在 cubeGroup 局部坐标中该轴的位置
    const localPos = new THREE.Vector3()
    cubie.getWorldPosition(localPos)
    cubeGroup.worldToLocal(localPos)
    const layer = Math.round(
      (axis === 'x' ? localPos.x : axis === 'y' ? localPos.y : localPos.z) / SPACING,
    )

    // 角度：顺时针（面对该面看）为 -PI/2 * sign
    // Shift 键反向
    const reverse = e.shiftKey ? -1 : 1
    const angle = (-Math.PI / 2) * sign * reverse

    isAnimating.value = true
    await rotateLayer(axis, layer, angle, 200)
    isAnimating.value = false
    checkSolved()
  }

  renderer.domElement.addEventListener('pointerdown', onPointerDown)
  renderer.domElement.addEventListener('pointerup', onPointerUp)

  // ---- 渲染循环 ----
  function animate() {
    controls.update()
    animationId = requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }

  // ---- 容器尺寸适配（ResizeObserver 覆盖全屏/窗口缩放等所有场景） ----
  const resizeObserver = new ResizeObserver(() => {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)
  })
  resizeObserver.observe(container)

  // ---- 清理 ----
  onUnmounted(() => {
    if (animationId) cancelAnimationFrame(animationId)
    resizeObserver.disconnect()
    renderer.domElement.removeEventListener('pointerdown', onPointerDown)
    renderer.domElement.removeEventListener('pointerup', onPointerUp)
    cubies.forEach(c => {
      c.geometry.dispose()
      if (Array.isArray(c.material)) c.material.forEach(m => m.dispose())
    })
    renderer.dispose()
    if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
  })

  // 初始化
  buildCube()
  animate()
  setTimeout(() => scramble(20), 500)

  return { isSolved, isAnimating, scramble: () => scramble(20), reset }
}
