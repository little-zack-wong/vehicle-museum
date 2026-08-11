import { useEffect, useRef, useState } from 'react'
import { VehicleScene } from '../viewer/VehicleScene'
import type { Vehicle } from '../data/vehicles'

interface ViewerStageProps {
  vehicle: Vehicle
  autoRotate?: boolean
  onLoaded?: () => void
}

/**
 * 3D 查看器：场景常驻，切换车辆只换模型（不重建场景，避免闪烁）。
 */
export function ViewerStage({ vehicle, autoRotate = true, onLoaded }: ViewerStageProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<VehicleScene | null>(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  // 场景只建一次
  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const scene = new VehicleScene(host, {
      onProgress: setProgress,
      onReady: () => {
        setReady(true)
        onLoaded?.()
      },
      onError: (msg) => setError(msg),
    })
    sceneRef.current = scene

    return () => {
      scene.destroy()
      sceneRef.current = null
    }
  }, [])

  // 车辆变化 → 只换模型
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return
    setProgress(0)
    setError(null)
    setReady(false)
    void scene.loadModel(`/models/${vehicle.id}.glb`).catch(() => {
      /* 错误已通过 onError 上报 */
    })
  }, [vehicle.id])

  // 自动旋转开关
  useEffect(() => {
    sceneRef.current?.setAutoRotate(autoRotate)
  }, [autoRotate])

  return (
    <div className="viewer-stage">
      <div className="viewer-host" ref={hostRef} />
      {!ready && !error && (
        <div className="viewer-loading" role="status">
          <span className="loading-wheel" aria-hidden="true">
            {vehicle.emoji}
          </span>
          <strong>{progress > 0 ? `正在开过来… ${progress}%` : '正在开过来…'}</strong>
        </div>
      )}
      {error && (
        <div className="viewer-fallback" role="status">
          <strong>这辆车有点害羞，暂时开不出来</strong>
          <span>请点一下重试</span>
          <button
            type="button"
            className="friendly-button"
            onClick={() => window.location.reload()}
          >
            再试一次
          </button>
        </div>
      )}
    </div>
  )
}
