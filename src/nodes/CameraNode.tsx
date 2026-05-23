import { useEffect, useRef, useState, useCallback } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import './node.css'
import './CameraNode.css'

const VIDEO_SOCKET_COLOR = '#a78bfa'

export default function CameraNode({ data }: NodeProps) {
  const label = typeof data.label === 'string' ? data.label : 'Камера'

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number>(0)

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [deviceId, setDeviceId] = useState('')
  const [mirror, setMirror] = useState(true)
  const [status, setStatus] = useState<'idle' | 'connecting' | 'live' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // Рисуем зеркальный кадр на canvas каждый animation frame
  const drawMirror = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    const w = video.videoWidth
    const h = video.videoHeight
    if (!w || !h) {
      rafRef.current = requestAnimationFrame(drawMirror)
      return
    }
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.save()
    ctx.scale(-1, 1)
    ctx.drawImage(video, -w, 0, w, h)
    ctx.restore()
    rafRef.current = requestAnimationFrame(drawMirror)
  }, [])

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    cancelAnimationFrame(rafRef.current)
  }, [])

  const startCamera = useCallback(
    async (selectedDeviceId?: string) => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus('error')
        setErrorMsg('Нужен HTTPS — камера недоступна на HTTP')
        return
      }
      stopStream()
      setStatus('connecting')
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
        // После разрешения браузер отдаёт реальные имена устройств
        const all = await navigator.mediaDevices.enumerateDevices()
        setDevices(all.filter((d) => d.kind === 'videoinput'))
        if (mirror) drawMirror()
      } catch (e) {
        setStatus('error')
        setErrorMsg(e instanceof Error ? e.message : String(e))
      }
    },
    [stopStream, mirror, drawMirror],
  )

  // Перезапускаем mirror RAF при переключении toggle
  useEffect(() => {
    if (status !== 'live') return
    cancelAnimationFrame(rafRef.current)
    if (mirror) drawMirror()
  }, [mirror, status, drawMirror])

  // Cleanup при размонтировании
  useEffect(() => () => stopStream(), [stopStream])

  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setDeviceId(val)
    if (status === 'live') startCamera(val || undefined)
  }

  return (
    <div className="dasho-node">
      <div className="dasho-node__header">
        <span className="dasho-node__icon">📷</span>
        <span className="dasho-node__title">{label}</span>
        {status === 'live' && <span className="camera-node__badge">● LIVE</span>}
      </div>

      <div className="dasho-node__body">
        {/* Превью 16:9 */}
        <div className="camera-node__preview">
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
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

        {/* Выбор устройства */}
        <div className="dasho-node__param">
          <label>Устройство</label>
          <select
            className="dasho-node__select"
            value={deviceId}
            onChange={handleDeviceChange}
          >
            <option value="">— по умолчанию —</option>
            {devices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || `Камера ${d.deviceId.slice(0, 6)}`}
              </option>
            ))}
          </select>
        </div>

        {/* Зеркало */}
        <div className="dasho-node__param">
          <label>Зеркало</label>
          <label className="camera-node__toggle">
            <input
              type="checkbox"
              checked={mirror}
              onChange={(e) => setMirror(e.target.checked)}
            />
            <span>{mirror ? 'вкл' : 'выкл'}</span>
          </label>
        </div>

        {/* Статус + кнопка */}
        <div className="camera-node__footer">
          <span className="camera-node__status" data-status={status}>
            {status === 'idle' && 'не запущена'}
            {status === 'connecting' && 'подключаюсь…'}
            {status === 'live' && 'идёт ✓'}
            {status === 'error' && `ошибка: ${errorMsg}`}
          </span>
          {status !== 'live' ? (
            <button
              className="camera-node__btn"
              onClick={() => startCamera(deviceId || undefined)}
            >
              ▶ Включить
            </button>
          ) : (
            <button
              className="camera-node__btn camera-node__btn--stop"
              onClick={() => {
                stopStream()
                setStatus('idle')
              }}
            >
              ■ Стоп
            </button>
          )}
        </div>
      </div>

      {/* Выходной сокет: видео */}
      <Handle
        type="source"
        position={Position.Right}
        id="video"
        style={{ background: VIDEO_SOCKET_COLOR }}
      />
    </div>
  )
}
