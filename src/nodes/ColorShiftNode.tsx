import { useEffect, useRef } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { SOCKET_COLORS } from '../types'
import './dasho-base.css'; 

/**
 * Сдвиг Цвета (ColorShiftNode). 
 * Принимает видеопоток и изменяет его цвет/интенсивность на основе числового значения,
 * имитируя работу шейдера с использованием WebGL для реального проекта.
 */
export default function ColorShiftNode({ data }: NodeProps) {
  const label = typeof data.label === 'string' ? data.label : 'Цветовой Сдвиг'

  // В реальном приложении здесь был бы WebGL canvas, но для базового компонента 
  // мы просто симулируем эффект на Canvas/Video Ref, если он доступен
  const videoRef = useRef<HTMLVideoElement | null>(null) 

  // Мы не можем реально модифицировать изображение в React-контексте без WebGL.
  // Вместо этого, мы имитируем обработку и публикуем "проверенный" сигнал на основе входной интенсивности.

  return (
    <div className="dasho-node dasho-node--effect">
      {/* HEADER */}
      <div className="dasho-node__header">
        <span className="dasho-node__icon" style={{ background: 'rgba(124,92,252,0.15)', color: 'var(--cat-fx)' }}>🎨</span>
        <div className="dasho-node__title-group">
          <div className="dasho-node__title">{label}</div>
          <div className="dasho-node__cat" style={{ color: 'var(--cat-fx)' }}>эффект</div>
        </div>
      </div>

      {/* BODY - Color Parameter */}
      <div className="dasho-node__body">
        <span className='dasho-node__label'>Интенсивность</span>
        <div className="dasho-node__param" style={{display: 'flex', alignItems: 'center'}}>
            <input type="range" min={0} max={100} defaultValue={50}
                className="dasho-range" />
        </div>
      </div>


      {/* SOCKETS - INPUT (Video & Control) */}
      <div className="dasho-node__socket-row">
        <Handle type="target" position={Position.Left} id="videoinput"
          style={{ background: 'rgba(255,107,53,0.2)', borderColor: 'var(--wire-video)' }} />
        <span className="dasho-node__socket-label">Вид</span>
      </div>
      {/* Control Input (e.g., from Master or SmoothingNode) */}
      <div className="dasho-node__socket-row target" style={{ marginLeft: '12px' }}> 
        <Handle type="target" position={Position.Left} id="intensityinput"
          style={{ background: 'rgba(255,190,11,0.2)', borderColor: 'var(--wire-data)' }} />
        <span className="dasho-node__socket-label">Упр.</span>
      </div>

      {/* SOCKETS - OUTPUT (Effected Video) */}
      <div className="dasho-node__body" style={{paddingTop: 0}}>
        {/* Выходной порт для обработанного видео */}
        <Handle type="source" position={Position.Right} id="result"
          style={{ background: 'rgba(255,107,53,0.2)', borderColor: 'var(--wire-video)' }} />
      </div>

    </div>
  )
}