import { useEffect, useRef, useState, useCallback } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { SOCKET_COLORS } from '../types'
import { signalBus } from '../store/signalBus'
import './CameraNode.css'

export default function CameraNode({ id, data }: NodeProps) {
  const label = typeof data.label === 'string' ? data.label : 'Камера'

  const videoRef  = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef    = useRef<number>(0)

// FIX A: Corrected useState usage. The pattern is [stateVariable, setStateFunction] = useState(initialValue).
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]) 
  const [deviceId, setDeviceId] = useState('')        
  const [mirror, setMirror] = useState(true)
  const [status, setStatus] = useState<'idle' | 'connecting' | 'live' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // Рисуем зеркальный кадр на canvas каждый frame
  const drawMirror = useCallback(() => {
    const video  = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    const w = video.videoWidth, h = video.videoHeight
    if (!w || !h) { rafRef.current = requestAnimationFrame(drawMirror); return }
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h }
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    // Note: For true mirror effect, scaling might be needed here based on CSS transform, 
    // but using scale(-1, 1) in video style is simpler for this prototype loop.
    ctx.save(); ctx.scale(-1, 1); ctx.drawImage(video, -w, 0, w, h); ctx.restore()
    signalBus.publish(id, 'video', canvas)
    rafRef.current = requestAnimationFrame(drawMirror)
  }, [id])

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    cancelAnimationFrame(rafRef.current)
    signalBus.clear(id)
  }, [id])

  const startCamera = useCallback(async (selectedDeviceId?: string) => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('error'); setErrorMsg('Нужен HTTPS — камера недоступна на HTTP'); return
    }
    stopStream(); setStatus('connecting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: selectedDeviceId
          ? { deviceId: { exact: selectedDeviceId } }
          : { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => {})
      }
      setStatus('live')
      const all = await navigator.mediaDevices.enumerateDevices()
      setDevices(all.filter(d => d.kind === 'videoinput'))
      if (mirror) drawMirror()
      else signalBus.publish(id, 'video', videoRef.current)
    } catch (e) {
      setStatus('error')
      setErrorMsg(e instanceof Error ? e.message : String(e))
    }
  }, [stopStream, mirror, drawMirror, id])

  // Перезапуск зеркала при переключении toggle
  useEffect(() => {
    if (status !== 'live') return
    cancelAnimationFrame(rafRef.current)
    if (mirror) drawMirror()
    else signalBus.publish(id, 'video', videoRef.current)
  }, [mirror, status, drawMirror, id])

  useEffect(() => () => stopStream(), [stopStream])

  return (
    <div className="dasho-node">
      <div className="dasho-node__header">
        <span className="dasho-node__icon" style={{ background: 'rgba(255,107,53,0.15)', color: 'var(--cat-sources)' }}>📷</span>
        <div className="dasho-node__title-group">
          <div className="dasho-node__title">{label}</div>
          <div className="dasho-node__cat" style={{ color: 'var(--cat-sources)' }}>источник</div>
        </div>
        <span className={`dasho-node__status status-${status === 'live' ? 'live' : 'idle'} `}>
          {status === 'live' ? 'live' : 'выкл'}
        </span>
      </div>

      <div className="dasho-node__body">
        {/* Превью */}
        <div className="camera-node__preview" onClick={() => {
            if (status !== 'live') startCamera(deviceId || undefined)
          }}>
          <video
            ref={videoRef} playsInline muted autoPlay
            className="camera-node__video"
            style={{ display: mirror && status === 'live' ? 'none' : status === 'live' ? 'block' : 'none' }}
          />
          <canvas
            ref={canvasRef}
            className="camera-node__video"
            style={{ display: mirror && status === 'live' ? 'block' : 'none' }}
          />
          {status !== 'live' && (
            <div className="camera-node__placeholder">
              <div style={{ fontSize: 28 }}>📷</div>
              <div>нажми чтобы включить</div>
            </div>
          )}
          {status !== 'live' && (
            <div className="camera-node__start-btn">
              <div className="play-circle">▶</div>
            </div>
          )}
        </div>

        {/* Зеркало */}
        <div className="dasho-node__param">
          <span className="dasho-node__label">зеркало</span>
          <select className="dasho-node__select" value={mirror ? 'да' : 'нет'} onChange={e => setMirror(e.target.value === 'да')}>
            <option value="да">да</option>
            <option value="нет">нет</option>
          </select>
        </div>

        {/* Устройство */}
        <div className="dasho-node__param">
          <span className="dasho-node__label">камера</span>
          <select
            className="dasho-node__select"
            value={deviceId}
            onChange={e => {
              const v = e.target.value
              setDeviceId(v)
              if (status === 'live') startCamera(v || undefined)
            }}
          >
            <option value="">по умолчанию</option>
            {devices.map(d => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || `Камера ${d.deviceId.slice(0, 6)}`}
              </option>
            ))}
          </select>
        </div>

        {status === 'live' && (
          <div className="dasho-node__param" style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
            <button className="dasho-node__btn" onClick={() => { stopStream(); setStatus('idle') }}>■ Стоп</button>
          </div>
        )}
      </div>

      <div className="dasho-node__socket-row out" style={{ paddingBottom: 8 }}>
        <span className="dasho-node__socket-label">видео</span>
        <Handle type="source" position={Position.Right} id="video"
          style={{ background: 'rgba(255,107,53,0.2)', borderColor: 'var(--wire-video)' }} />
      </div>
    </div>
  )
}