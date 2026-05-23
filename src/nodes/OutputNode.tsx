import { useEffect, useRef, useState, useCallback } from 'react'
import { Handle, Position, type NodeProps, useEdges } from '@xyflow/react'
import { signalBus } from '../store/signalBus'
import { SOCKET_COLORS } from '../types'
import './node.css'
import './OutputNode.css'

export default function OutputNode({ id, data }: NodeProps) {
  const label = typeof data.label === 'string' ? data.label : 'Вывод'

  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const fullCanvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef       = useRef<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [hasSignal,    setHasSignal]    = useState(false)

  const edges = useEdges()
  const sourceEdge = edges.find(e => e.target === id && e.targetHandle === 'video')

  // Рисуем входящее видео на превью-canvas внутри ноды
  const drawPreview = useCallback(() => {
    if (!sourceEdge) {
      setHasSignal(false)
      return
    }
    const { source, sourceHandle } = sourceEdge
    const src = signalBus.read(source, sourceHandle ?? 'video') as
      HTMLCanvasElement | HTMLVideoElement | null

    const canvas = canvasRef.current
    if (!canvas) { rafRef.current = requestAnimationFrame(drawPreview); return }

    if (src && (src instanceof HTMLCanvasElement || src instanceof HTMLVideoElement)) {
      const w = src instanceof HTMLCanvasElement ? src.width  : (src as HTMLVideoElement).videoWidth
      const h = src instanceof HTMLCanvasElement ? src.height : (src as HTMLVideoElement).videoHeight
      if (w && h) {
        if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h }
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(src, 0, 0, w, h)

        // Если открыт фуллскрин — рисуем туда же
        const fc = fullCanvasRef.current
        if (fc && isFullscreen) {
          fc.width = window.innerWidth; fc.height = window.innerHeight
          const fctx = fc.getContext('2d')
          if (fctx) {
            // letterbox — сохраняем пропорции
            const scale = Math.min(fc.width / w, fc.height / h)
            const dx = (fc.width  - w * scale) / 2
            const dy = (fc.height - h * scale) / 2
            fctx.fillStyle = '#000'
            fctx.fillRect(0, 0, fc.width, fc.height)
            fctx.drawImage(src, dx, dy, w * scale, h * scale)
          }
        }
        setHasSignal(true)
      }
    } else {
      setHasSignal(false)
    }
    rafRef.current = requestAnimationFrame(drawPreview)
  }, [sourceEdge, isFullscreen])

  useEffect(() => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(drawPreview)
    return () => cancelAnimationFrame(rafRef.current)
  }, [drawPreview])

  // Fullscreen API
  const openFullscreen = useCallback(async () => {
    if (!containerRef.current) return
    try {
      await containerRef.current.requestFullscreen()
    } catch {}
  }, [])

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
  }, [])

  return (
    <div className="dasho-node dasho-node--output">
      <div className="dasho-node__header">
        <span className="dasho-node__icon">📺</span>
        <span className="dasho-node__title">{label}</span>
        <span className="dasho-node__cat">Вывод</span>
        {hasSignal && <span className="output-node__badge">●</span>}
      </div>

      <div className="dasho-node__body">
        {/* Превью */}
        <div className="output-node__preview" ref={containerRef}>
          <canvas ref={canvasRef} className="output-node__canvas" />

          {/* Полноэкранный canvas поверх превью внутри fullscreen-контейнера */}
          {isFullscreen && (
            <canvas ref={fullCanvasRef} className="output-node__fullcanvas" />
          )}

          {!hasSignal && (
            <div className="output-node__placeholder">
              <span>📺</span>
              <span>Нет сигнала</span>
            </div>
          )}

          {isFullscreen && (
            <button className="output-node__exit-btn" onClick={exitFullscreen}>
              ✕ Выйти
            </button>
          )}
        </div>

        <div className="dasho-node__divider" />

        {/* Вход сигнала */}
        <div className="dasho-node__socket-row">
          <span className="dasho-node__socket-dot dasho-node__socket-dot--video" />
          <span>Видео</span>
        </div>

        <div className="dasho-node__divider" />

        {/* Кнопка */}
        <button
          className={`dasho-btn dasho-btn--primary output-node__fs-btn${isFullscreen ? ' output-node__fs-btn--active' : ''}`}
          onClick={isFullscreen ? exitFullscreen : openFullscreen}
        >
          {isFullscreen ? '✕ Выйти из экрана' : '⛶ На весь экран'}
        </button>
      </div>

      {/* Только вход */}
      <Handle type="target" position={Position.Left} id="video"
        style={{ background: SOCKET_COLORS.video }} />
    </div>
  )
}
