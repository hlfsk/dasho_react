import { Handle, Position, type NodeProps } from '@xyflow/react'
import { SOCKET_COLORS } from '../types'
import './dasho-base.css'

/**
 * Мастер (MasterNode) — центральный коммутатор и интерпретатор тела (Face/Hands/Body).
 * Он преобразует сырые данные в высокоуровневые, осмысленные команды шоу.
 * Эту ноду не нужно программировать логически; она является симуляцией сложного AI-интерпретатора.
 */
export default function MasterNode({ data }: NodeProps) {
  const label = typeof data.label === 'string' ? data.label : 'Мастер Шоу'

  return (
    <div className="dasho-node dasho-node--control">
      {/* HEADER */}
      <div className="dasho-node__header">
        <span className="dasho-node__icon" style={{ background: 'rgba(255,190,11,0.15)', color: 'var(--cat-control)' }}>👑</span>
        <div className="dasho-node__title-group">
          <div className="dasho-node__title">{label}</div>
          {/* Это не просто Трансформатор; это интерпретатор */}
          <div className="dasho-node__cat" style={{ color: 'var(--cat-control)' }}>интерпретация</div> 
        </div>
      </div>

      {/* BODY - Input multiplexing (Mock UI for conceptual inputs) */}
      <div className="dasho-node__body">
        <span className="dasho-node__label" style={{ textTransform: 'uppercase' }}>ИСТОЧНИКИ ДАННЫХ</span >
        
        {/* Face/Point Input Selection */}
        <div className='dasho-node__param'>
          <span className="dasho-node__label">Точка</span>
          <select className="dasho-node__select" defaultValue="pt_right_eye">
            <option value="pt_right_eye">правый глаз</option> 
            <option value="pt_nose">нос (максимум)</option>
            <option value="hands">ладони (расстояние)</option>
          </select>
        </div>

        {/* Command Scope Selection */}
        <div className='dasho-node__param'>
          <span className="dasho-node__label">Команда</span>
          <select className="dasho-node__select" defaultValue="size_intensity">
            <option value="size_intensity">Размер/Сила</option> 
            <option value="active_trigger">Вспышка/Активность</option>
            <option value="angular_movement">Угловое движение</option>
          </select>
        </div>

      </div>


      {/* SOCKETS - INPUT (Multiplexed Targets) */}
      <div className="dasho-node__socket-row" style={{paddingBottom: 8}}>
        <!-- Input for Point/Motion Data -->
        <Handle type="target" position={Position.Left} id="pt_input"
          style={{ background: 'rgba(192,132,252,0.2)', borderColor: 'var(--wire-point)' }} />
        <span className="dasho-node__socket-label">Ввод</span>
      </div>

      {/* SOCKETS - OUTPUT (Symbolic commands) */}
      <div className="dasho-node__body" style={{paddingTop: 0}}>
        {/* Command 1: Size/Intensity (Number) */}
         <div className="dasho-node__socket-row out">
          <span className="dasho-node__socket-label">Сила</span>
          <Handle type="source" position={Position.Right} id="size_intensity_output" style={{ background: 'rgba(255,190,11,0.2)', borderColor: 'var(--wire-data)' }} />
        </div>
        {/* Command 2 & 3 (Examples of different signal types) */}
        <div className="dasho-node__socket-row out">
          <span className="dasho-node__socket-label">Триггер</span>
          <Handle type="source" position={Position.Right} id="active_trigger_output" style={{ background: 'rgba(255,107,53,0.2)', borderColor: 'var(--wire-trigger)' }} />
        </div>
      </div>

    </div>
  )
}