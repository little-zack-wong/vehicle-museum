import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export interface VehicleSceneOptions {
  /** 是否自动旋转（默认 true） */
  autoRotate?: boolean
  onProgress?: (percent: number) => void
  onReady?: () => void
  onError?: (message: string) => void
}

/**
 * 轻量 three.js 车辆展示控制器。
 * 职责：创建场景/灯光/地面，加载 GLB 并居中适配，拖拽旋转 + 滚轮缩放 + 自动旋转。
 * 参考 prehistoric-animal-museum 的 ViewerController 模式（原生 three，不依赖 react-three-fiber）。
 */
export class VehicleScene {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera: THREE.PerspectiveCamera
  private controls: OrbitControls
  private rafId = 0
  private clock = new THREE.Clock()
  private container: HTMLElement
  private modelGroup = new THREE.Group()
  private resizeObserver: ResizeObserver | null = null
  private disposed = false
  private onReady: (() => void) | null = null
  private onError: ((message: string) => void) | null = null
  private onProgress: ((percent: number) => void) | null = null

  constructor(container: HTMLElement, options: VehicleSceneOptions = {}) {
    this.container = container
    this.onReady = options.onReady ?? null
    this.onError = options.onError ?? null
    this.onProgress = options.onProgress ?? null

    const width = container.clientWidth || 1
    const height = container.clientHeight || 1

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(width, height)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.1
    container.appendChild(this.renderer.domElement)

    // 初始视角参数：完整看到整车
    this.camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 200)
    this.camera.position.set(3.2, 2.4, 4.6)

    this.scene.background = new THREE.Color('#dff2fb')

    // 灯光：环境 + 主方向光（带阴影）+ 补光
    const ambient = new THREE.HemisphereLight('#dceeff', '#c9b38c', 1.1)
    this.scene.add(ambient)

    const sun = new THREE.DirectionalLight('#fff4e0', 2.6)
    sun.position.set(4, 7, 3)
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    sun.shadow.camera.near = 0.5
    sun.shadow.camera.far = 30
    sun.shadow.camera.left = -6
    sun.shadow.camera.right = 6
    sun.shadow.camera.top = 6
    sun.shadow.camera.bottom = -6
    sun.shadow.bias = -0.0005
    this.scene.add(sun)

    const fill = new THREE.DirectionalLight('#ffffff', 0.9)
    fill.position.set(-4, 3, -3)
    this.scene.add(fill)

    // 地面：圆形草甸 + 接收阴影
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(10, 64),
      new THREE.MeshStandardMaterial({ color: '#a8d68c', roughness: 1 }),
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    this.scene.add(ground)

    // 地面装饰：一圈小点（防空洞感太单调）
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2
      const r = 3.1 + (i % 3) * 0.5
      const tuft = new THREE.Mesh(
        new THREE.CircleGeometry(0.16, 8),
        new THREE.MeshStandardMaterial({ color: i % 2 ? '#8fc97a' : '#bce39f', roughness: 1 }),
      )
      tuft.rotation.x = -Math.PI / 2
      tuft.position.set(Math.cos(a) * r, 0.001, Math.sin(a) * r)
      this.scene.add(tuft)
    }

    this.scene.add(this.modelGroup)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.08
    this.controls.enablePan = false
    this.controls.minDistance = 2.2
    this.controls.maxDistance = 14
    this.controls.autoRotate = options.autoRotate ?? true
    this.controls.autoRotateSpeed = 1.4
    this.controls.maxPolarAngle = Math.PI / 2.05
    this.controls.target.set(0, 0.6, 0)

    this.resizeObserver = new ResizeObserver(() => this.handleResize())
    this.resizeObserver.observe(container)

    this.animate()
  }

  /** 加载并展示一个 GLB 模型 */
  loadModel(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader()
      loader.load(
        url,
        (gltf) => {
          if (this.disposed) return
          this.setModel(gltf.scene)
          resolve()
        },
        (event) => {
          if (event.total > 0 && this.onProgress) {
            this.onProgress(Math.round((event.loaded / event.total) * 100))
          }
        },
        (error) => {
          const message = error instanceof Error ? error.message : '模型加载失败'
          this.onError?.(message)
          reject(error)
        },
      )
    })
  }

  /** 替换当前模型（清掉旧的），并居中、缩放适配视口 */
  setModel(model: THREE.Object3D) {
    this.clearModel()

    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    this.modelGroup.add(model)

    // 适配：根据包围盒缩放，并抬高到地面上
    const box = new THREE.Box3().setFromObject(model)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 3.2 / maxDim
    model.scale.setScalar(scale)

    // 重新计算以获取缩放后的几何信息
    const scaledBox = new THREE.Box3().setFromObject(model)
    const scaledCenter = scaledBox.getCenter(new THREE.Vector3())
    const minY = scaledBox.min.y
    // 让模型底部正好落在地面，且水平居中
    model.position.x -= scaledCenter.x
    model.position.z -= scaledCenter.z
    model.position.y -= minY
    this.modelGroup.position.y = 0
    this.controls.target.set(0, scaledBox.getSize(new THREE.Vector3()).y * 0.55, 0)

    this.onReady?.()
  }

  private clearModel() {
    while (this.modelGroup.children.length > 0) {
      const child = this.modelGroup.children[0]
      this.modelGroup.remove(child)
      child.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          node.geometry?.dispose()
          const mats = Array.isArray(node.material) ? node.material : [node.material]
          mats.forEach((m) => m?.dispose())
        }
      })
    }
  }

  setAutoRotate(on: boolean) {
    this.controls.autoRotate = on
  }

  private handleResize() {
    if (this.disposed) return
    const width = this.container.clientWidth || 1
    const height = this.container.clientHeight || 1
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  private animate = () => {
    if (this.disposed) return
    this.rafId = requestAnimationFrame(this.animate)
    const dt = Math.min(this.clock.getDelta(), 0.05)
    this.controls.update(dt)
    this.renderer.render(this.scene, this.camera)
  }

  destroy() {
    this.disposed = true
    cancelAnimationFrame(this.rafId)
    this.resizeObserver?.disconnect()
    this.clearModel()
    this.controls.dispose()
    this.renderer.dispose()
    if (this.renderer.domElement.parentNode === this.container) {
      this.container.removeChild(this.renderer.domElement)
    }
  }
}
