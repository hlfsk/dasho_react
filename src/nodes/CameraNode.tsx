import { useEffect, useRef, useState, useCallback } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { SOCKET_COLORS } from '../types'
import { signalBus } from '../store/signalBus'
import './node.css'
import './CameraNode.css'

export default function CameraNode({ id, data }: NodeProps) {
  const label = typeof data.label === 'string' ? data.label : 'Камера'

  const videoRef  = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef    = useRef<number>(0)

  const [devices,  setDevices]  = useState<MediaDeviceInfo[]>([])
  const [deviceId, setDeviceId] = useState('')
  const [mirror,   setMirror]   = useState(true)
  const [status,   setStatus]   = useState<'idle' | 'connecting' | 'live' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const drawMirror = useCallback(() => {
    const video  = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    const w = video.videoWidth, h = video.videoHeight
    if (!w || !h) { rafRef.current = requestAnimationFrame(drawMirror); return }
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h }
    const ctx = canvas.getContext('2d')
    if (!ctx) return
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

  useEffect(() => {
    if (status !== 'live') return
    cancelAnimationFrame(rafRef.current)
    if (mirror) drawMirror()
    else signalBus.publish(id, 'video', videoRef.current)
  }, [mirror, status, drawMirror, id])

  useEffect(() => () => stopStream(), [stopStream])

  return (
    <div className="dasho-node dasho-node--source">
      <div className="dasho-node__header">
        <span className="dasho-node__icon">📷</span>
        <span className="dasho-node__title">{label}</span>
        <span className="dasho-node__cat">Источник</span>
        {status === 'live' && <span className="camera-node__badge">● LIVE</span>}
      </div>

      <div className="dasho-node__body">
        {/* Превью */}
        <div className="camera-node__preview">
          <video
            ref={videoRef} playsInline muted autoPlay
            className="camera-node__video"
            style={{ display: mirror ? 'none' : 'block' }}
          />
          <canvas
            ref={canvasRef}
            className="camera-node__video"
            style={{ display: mirror ? 'block' : 'none' }}
          />
          {status !== 'live' && (
            <div className="camera-node__placeholder">
              {status === 'idle' && '📷'}
              {status === 'connecting' && '⏳'}
              {status === 'error' && '✗'}
            </div>
          )}
        </div>

        <div className="dasho-node__divider" />

        {/* Устройство */}
        <div className="dasho-node__param">
          <label>Устройство</label>
          <select
            className="dasho-node__select"
            value={deviceId}
            onChange={e => {
              const v = e.target.value
              setDeviceId(v)
              if (status === 'live') startCamera(v || undefined)
            }}
          >
            <option value="">— по умолчанию —</option>
            {devices.map(d => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || `Камера ${d.deviceId.slice(0, 6)}`}
              </option>
            ))}
          </select>
        </div>

        {/* Зеркало */}
        <div className="dasho-node__param">
          <label>Зеркало</label>
          <label className="dasho-toggle">
            <input
              type="checkbox" checked={mirror}
              onChange={e => setMirror(e.target.checked)}
            />
            <span>{mirror ? 'вкл' : 'выкл'}</span>
          </label>
        </div>

        <div className="dasho-node__divider" />

        {/* Статус + кнопка */}
        <div className="camera-node__footer">
          <span className="camera-node__status" data-status={status}>
            {status === 'idle'       && 'не запущена'}
            {status === 'connecting' && 'подключаюсь…'}
            {status === 'live'       && 'идёт ✓'}
            {status === 'error'      && `ошибка: ${errorMsg}`}
          </span>
          {status !== 'live'
            ? <button className="dasho-btn dasho-btn--primary" onClick={() => startCamera(deviceId || undefined)}>▶ Включить</button>
            : <button className="dasho-btn dasho-btn--danger"  onClick={() => { stopStream(); setStatus('idle') }}>■ Стоп</button>
          }
        </div>
      </div>

      <Handle type="source" position={Position.Right} id="video"
        style={{ background: SOCKET_COLORS.video }} />
    </div>
  )
}
