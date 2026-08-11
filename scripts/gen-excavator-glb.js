const fs = require('fs')
const path = require('path')
const THREE = require('three')
const path = require('path')

// 一个简单的挖掘机模型（低配版，给 3 岁小孩看足够）
const group = new THREE.Group()

// 1) 履带底座：长条形
const trackGeo = new THREE.BoxGeometry(4, 0.8, 2.8)
const trackMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 })
const track = new THREE.Mesh(trackGeo, trackMat)
track.position.set(0, 0.4, 0)
group.add(track)

// 2) 车身主体：黄色大盒子
const bodyGeo = new THREE.BoxGeometry(2.6, 1.2, 2)
const bodyMat = new THREE.MeshStandardMaterial({ color: 0xF39C12, roughness: 0.5 })
const body = new THREE.Mesh(bodyGeo, bodyMat)
body.position.set(0, 1.2, 0)
group.add(body)

// 3) 驾驶室：后上方小盒子（模拟驾驶舱）
const cabGeo = new THREE.BoxGeometry(1.2, 1.0, 1.6)
const cabMat = new THREE.MeshStandardMaterial({ color: 0xF5C842, roughness: 0.4 })
const cab = new THREE.Mesh(cabGeo, cabMat)
cab.position.set(-0.2, 2.0, 0.2)
group.add(cab)

// 窗户（简化）
const winGeo = new THREE.BoxGeometry(1.0, 0.6, 0.1)
const winMat = new THREE.MeshStandardMaterial({ color: 0x99ccff, roughness: 0.1, metalness: 0.4 })
const win = new THREE.Mesh(winGeo, winMat)
win.position.set(-0.2, 2.1, 0.85)
group.add(win)

// 4) 旋转座/关节：圆盘
const jointGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 16)
const jointMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.4, metalness: 0.4 })
const joint = new THREE.Mesh(jointGeo, jointMat)
joint.position.set(0.5, 1.5, 0)
group.add(joint)

// 5) 大臂：圆柱倾斜放置（朝后上方伸出）
const armGeo = new THREE.CylinderGeometry(0.18, 0.22, 3.0, 12)
const armMat = new THREE.MeshStandardMaterial({ color: 0xE8891B, roughness: 0.4, metalness: 0.2 })
const arm = new THREE.Mesh(armGeo, armMat)
arm.position.set(1.7, 2.4, 0)
arm.rotation.z = Math.PI * 0.28
arm.rotation.x = 0.0
group.add(arm)

// 6) 小臂：圆柱略弯向前下方
const forearmGeo = new THREE.CylinderGeometry(0.14, 0.18, 2.6, 12)
const forearmMat = new THREE.MeshStandardMaterial({ color: 0xE67E22, roughness: 0.4, metalness: 0.2 })
const forearm = new THREE.Mesh(forearmGeo, forearmMat)
forearm.position.set(3.2, 1.7, 0)
forearm.rotation.z = -Math.PI * 0.38
group.add(forearm)

// 7) 液压杆一根：细长圆柱
const hydGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.4, 6)
const hydMat = new THREE.MeshStandardMaterial({ color: 0xccc0d0, roughness: 0.2, metalness: 0.6 })
const hyd = new THREE.Mesh(hydGeo, hydMat)
hyd.position.set(2.1, 2.35, 0.1)
hyd.rotation.z = -Math.PI * 0.15
group.add(hyd)

// 8) 铲斗：简化的勺子形状（半个圆柱）
const bucketGeo = new THREE.CylinderGeometry(0.5, 0.6, 0.7, 10, 1, false, 0, Math.PI * 0.85)
const bucketMat = new THREE.MeshStandardMaterial({ color: 0xD35400, roughness: 0.6, metalness: 0.1 })
const bucket = new THREE.Mesh(bucketGeo, bucketMat)
bucket.position.set(4.1, 1.0, 0)
bucket.rotation.z = Math.PI * 0.15
bucket.rotation.x = Math.PI / 2
group.add(bucket)

// 倾斜铲斗边
const edgeGeo = new THREE.BoxGeometry(0.7, 0.08, 1.2)
const edgeMat = new THREE.MeshStandardMaterial({ color: 0xB04B1A })
const edge = new THREE.Mesh(edgeGeo, edgeMat)
edge.position.set(4.1, 1.28, 0)
edge.rotation.z = -0.1
group.add(edge)

// 合并到场景并导出
const scene = new THREE.Scene()
scene.add(group)

const exporter = new GLTFExporter()
const files = exporter.parse(
  scene,
  { binaryEncoding: 'arraybuffer' },
  (buffer) => {
    const dest = path.resolve(__dirname, '../public/models/excavator.glb')
    fs.writeFileSync(dest, buffer)
    console.log('OK', dest, buffer.length)
  },
  (err) => {
    console.error('FAILED', err)
  }
)
