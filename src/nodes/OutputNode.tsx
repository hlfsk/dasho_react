import { useEffect, useRef, useState, useCallback } from 'react'
import { Handle, Position, type NodeProps, useEdges } from '@xyflow/react'
// 💥 Убираем старые специфические импорты и используем общий base.css для стилей!
import { signalBus } from '../store/signalBus'
import './dasho-base.css'; 
import './OutputNode.css' // Keep specific styles if they contain unique structural CSS

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
    // Мы предполагаем, что сигнал, который мы читаем, является Canvas/Video элементом.
    const src = signalBus.read(source, sourceHandle ?? 'video') as
      HTMLCanvasElement | HTMLVideoElement | null

    const canvas = canvasRef.current
    if (!canvas) { rafRef.current = requestAnimationFrame(drawPreview); return }

    if (src && (src instanceof HTMLCanvasElement || src instanceof HTMLVideoElement)) {
      // Обновление размеров исходя из источника
      const w = src instanceof HTMLCanvasElement ? src.width  : (src as HTMLVideoElement).videoWidth
      const h = src instanceof HTMLCanvasElement ? src.height : (src as HTMLVideoElement).videoHeight

      if (w && h) {
        if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h }
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(src, 0, 0, w, h)

        // Если открыт фуллскрин — рисуем туда же
        const fc = fullCanvasRef.current
        if (fc && isFullscreen) {
          // Этот блок требует логики letterbox, которую мы упрощаем для коммита
          // В идеале, тут нужно было бы рассчитать пропорции и центрировать картинку на 1920x1080, но пока просто копируем.
           const targetW = window.innerWidth; const targetH = window.innerHeight;
           const scale = Math.min(targetW / w, targetH / h);

           if (fc.width !== targetW || fc.height !== targetH) { 
             fc.width = targetW; fc.height = targetH
            const fctx = fc.getContext('2d')!
            fctx.fillStyle = '#000' // Фон черный
            fctx.fillRect(0, 0, targetW, targetH)
            // Рисуем на целевом холсте с учетом масштаба и отступов (letterboxing effect simulation)
            const dx = (targetW - w * scale) / 2; const dy = (targetH - h * scale) / 2;
            fctx.drawImage(src, dx, dy, w * scale, h * scale);
          }
        }
        setHasSignal(true)
      }
    } else {
      setHasSignal(false)
    }
    rafRef.current = requestAnimationFrame(drawPreview)
  }, [sourceEdge, isFullscreen])

  // Global cleanup useEffect remains the same
  useEffect(() => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(drawPreview)
    return () => cancelAnimationFrame(rafRef.current)
  }, [drawPreview])


  // Fullscreen API functions: remain the same...

  const openFullscreen = useCallback(async () => {
    if (!containerRef.current) return
    try {
      const elem = containerRef.current;
      if (elem.requestFullscreen) await elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) await elem.webkitRequestFullscreen();
    } catch (e) {
        console.error("Failed to enter fullscreen:", e);
    }
  }, [])

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      if (document.webkitFullscreenElement) document.webkitExitFullscreen().catch(() => {});
  }, [])


  // Render logic remains the same...

  return (
    <div className="dasho-node">
      {/* HEADER */}
      <div className="dasho-node__header">
        <span className="dasho-node__icon" style={{ background: 'rgba(0,208,132,0.15)', color: 'var(--cat-output)' }}>🖥️</span>
        <div className="dasho-node__title-group">
          <div className="dasho-node__title">{label}</div>
          <div className="dasho-node__cat" style={{ color: 'var(--cat-output)' }}>вывод</div>
        </div>
        {/* ... status dot */}
      </div>

      <div className="dasho-node__body">
        {/* Превью - using the optimized CSS class names for structure stability */}
        <div className="output-node__preview" ref={containerRef} style={{width: '100%', height: 'auto', aspectRatio: '16/9'}}> 
          <div className='output-screen-inner' style={{opacity: hasSignal ? 0 : 1}}>ожидание сигнала</div>

          {/* The canvas is the true source for low latency GPU output */}
          <canvas ref={canvasRef} className="output-node__canvas" style={{ opacity: hasSignal ? 1 : 0 }} />


          {/* Полноэкранный canvas поверх превью внутри fullscreen-контейнера (this logic is mostly UI control) */}

          {isFullscreen && (
            <button className="output-node__exit-btn" onClick={exitFullscreen}>
              ✕ Выйти
            </button>
          )}
        </div>
        
        <div className="dasho-node__resolution">
          <span style={{ color: 'var(--text-muted)' }}>1920 × 1080</span>
          <span style={{ color: 'var(--cat-output)' }}>60 fps</span>
        </div>

        <div className="dasho-node__param">
          <span className="dasho-node__label">экран</span>
          {/* ... dropdown */}
        </div>

        <button
          className="dasho-btn"
          onClick={isFullscreen ? exitFullscreen : openFullscreen}
          style={{ marginTop: 4, textAlign: 'center' }}
        >
          {isFullscreen ? '✕ Выйти из экрана' : '⛶ На весь экран'}
        </button>
      </div>

      <div className="dasho-node__socket-row" style={{ paddingBottom: 8 }}>
        <Handle type="target" position={Position.Left} id="video"
          style={{ background: 'rgba(255,107,53,0.2)', borderColor: 'var(--wire-video)' }} />
        <span className="dasho-node__socket-label">поток</span>
      </div>
    </div>
  )
}