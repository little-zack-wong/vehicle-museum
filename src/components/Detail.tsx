import { useEffect, useRef, useState } from 'react'
import { VEHICLES, type Vehicle } from '../data/vehicles'
import { ViewerStage } from './ViewerStage'

interface DetailProps {
  vehicle: Vehicle
  onBack: () => void
  onSwitch: (vehicle: Vehicle) => void
}

/**
 * 详情页：全屏 3D 查看器 + 名字 + 喇叭语音 + 左右切换。
 * 面向 3 岁孩子：按钮巨大、无多余文字、点击喇叭才播语音。
 */
export function Detail({ vehicle, onBack, onSwitch }: DetailProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [spinning, setSpinning] = useState(true)

  const index = VEHICLES.findIndex((v) => v.id === vehicle.id)
  const prev = VEHICLES[(index - 1 + VEHICLES.length) % VEHICLES.length]
  const next = VEHICLES[(index + 1) % VEHICLES.length]

  // 切换车辆时重置语音状态
  useEffect(() => {
    setPlaying(false)
    audioRef.current?.pause()
  }, [vehicle.id])

  const playNarration = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      audio.currentTime = 0
      setPlaying(false)
      return
    }
    audio.src = `/audio/${vehicle.id}.mp3`
    audio.play().catch(() => {
      /* 静默失败：语音只是锦上添花 */
    })
    setPlaying(true)
  }

  return (
    <div className="detail">
      <audio
        ref={audioRef}
        onEnded={() => setPlaying(false)}
        preload="none"
      />

      <ViewerStage vehicle={vehicle} autoRotate={spinning} />

      {/* 顶部：返回 + 自动旋转开关 */}
      <div className="detail-topbar">
        <button type="button" className="round-button back-button" onClick={onBack} aria-label="返回">
          ←
        </button>
        <button
          type="button"
          className={`round-button spin-toggle ${spinning ? 'is-on' : ''}`}
          onClick={() => setSpinning((s) => !s)}
          aria-label={spinning ? '暂停旋转' : '继续旋转'}
          title={spinning ? '暂停旋转' : '继续旋转'}
        >
          {spinning ? '⏸' : '▶'}
        </button>
      </div>

      {/* 底部：名字 + 语音 + 简介 */}
      <div className="detail-panel">
        <div className="vehicle-title-row">
          <span className="vehicle-title-emoji" aria-hidden="true">
            {vehicle.emoji}
          </span>
          <div className="vehicle-title-text">
            <h2>{vehicle.name}</h2>
            <span className="vehicle-english">{vehicle.english}</span>
          </div>
          <button
            type="button"
            className={`sound-button ${playing ? 'is-playing' : ''}`}
            onClick={playNarration}
            aria-label={`听一听${vehicle.name}的介绍`}
          >
            <span aria-hidden="true">{playing ? '🔊' : '🔈'}</span>
            听一听
          </button>
        </div>
        <p className="vehicle-fact">{vehicle.funFact}</p>
      </div>

      {/* 左右切换：大箭头，占屏幕左右两侧 */}
      <button
        type="button"
        className="nav-arrow nav-prev"
        onClick={() => onSwitch(prev)}
        aria-label={`上一辆：${prev.name}`}
      >
        ‹
      </button>
      <button
        type="button"
        className="nav-arrow nav-next"
        onClick={() => onSwitch(next)}
        aria-label={`下一辆：${next.name}`}
      >
        ›
      </button>
    </div>
  )
}
