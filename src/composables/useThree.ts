import {onUnmounted} from 'vue'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

export function useThree(container: HTMLDivElement) {
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

  const renderer = new THREE.WebGLRenderer({antialias: true})
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.appendChild(renderer.domElement)

  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshStandardMaterial({color: 0x00ff00})
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)

  const light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(5, 5, 5)
  scene.add(light)
  const ambientLight = new THREE.AmbientLight(0x404040)
  scene.add(ambientLight)

  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

  // const controls = new OrbitControls(camera, document.body)
  const controls = new OrbitControls(camera, renderer.domElement)
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

  return {renderer, scene, camera}
}
