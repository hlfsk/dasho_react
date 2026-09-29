import { useEffect, useRef, useState, useCallback } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { SOCKET_COLORS } from '../types'
// We import the new base CSS file for consistency!
import './dasho-base.css' 

/**
 * Нода Микрофон (MicInputNode).
 * Захватывает аудиопоток и преобразует его в непрерывный числовой сигнал: громкость (0..1).
 */
export default function MicInputNode({ data }: NodeProps) {
  const label = typeof data.label === 'string' ? data.label : 'Микрофон'

  // Refs for media handling and processing loop
  const audioRef   = useRef<MediaStream | null>(null)
  const analyserRef  = useRef<AudioContext | null>(null)
  const animationRef = useRef<number>();

  // State management specific to the node's UI
  const [status, setStatus] = useState<'idle' | 'connecting' | 'live' | 'error'>('idle')
  const [volume, setVolume] = useState<number>(0.0) // The actual volume output (0-1)

  // --- Core Audio Logic Functions ---

  const getVolumeLevel = useCallback(() => {
    if (!analyserRef.current || !audioRef.current) return 0.0
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate the average energy (simplified amplitude detection)
    let sumOfCubes = 0;
    for (let i = 0; i < bufferLength; i++) {
        const value = dataArray[i];
        sumOfCubes += Math.pow(value / 255, 3); // Cube the normalized value for energy detection
    }
    // The cubing gives more weight to sharp peaks (like a clap) vs consistent humming
    return Math.cbrt(sumOfCubes / bufferLength);
  }, []);

  const processAudioTick = useCallback(() => {
    if (!audioRef.current || !analyserRef.current) return;
    
    // Calculate the new volume based on the microphone data
    const detectedVolume = getVolumeLevel(); 
    setVolume(detectedVolume);
   
    // Publish the result to the signalBus (real-time update for downstream nodes!)
    import('../store/signalBus').then(module => {
        if (module.signalBus.publish && module.signalBus.clear) {
            // Primary output signal (continuous value)
            module.signalBus.publish(data.id, 'level', detectedVolume);
            const isLoud = detectedVolume > 0.1; 

            if (isLoud) {
                // A simple activity trigger: any loud sound is a trigger
                module.signalBus.publish(data.id, 'clap_trigger', true); 
            }
        }
    });

    animationRef.current = requestAnimationFrame(processAudioTick);
  }, [getVolumeLevel, data]);


  // Start/Stop function wrapper
  const startMic = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('error'); console.error('Web Audio API not supported.'); return
    }

    if (status === 'live') { 
        console.warn("Already live.");
        return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioRef.current = stream;
      setStatus('connecting');

      // Setup AudioContext and AnalyserNode
      const context = new (window.AudioContext || require('audiocontext')).AudioContext();
      const source = context.createMediaStreamSource(stream); 
      const analyser = context.createAnalyser();
      analyser.fftSize = 2048;

      source.connect(analyser);
      analyserRef.current = analyser;
      audioRef.current = stream; // Re-assign to include the necessary contexts for later cleanup
      
      // Start the continuous monitoring loop
      animationRef.current = requestAnimationFrame(processAudioTick);
      setStatus('live');

    } catch (e) {
      setStatus('error')
      console.error('Mic capture failed:', e);
    }
  }, [processAudioTick, data]);


  const stopMic = useCallback(() => {
    // Stop the continuous process loop first
    if (animationRef.current) {
        cancelAnimationFrame(animationRef.current); 
        animationRef.current = undefined;
    }

    // Clean up media tracks
    audioRef.current?.getTracks().forEach((t) => t.stop());
    audioRef.current = null;

    // Clear any signals this node was publishing
    import('../store/signalBus').then(module => { module.signalBus.clear(data.id); });
    setStatus('idle');
  }, [data.id]);


  // Global cleanup on unmount
  useEffect(() => () => {
    stopMic();
  }, [stopMic])

  // --- Render Logic and UI ---
  return (
    <div className="dasho-node dasho-node--source">
      {/* HEADER */}
      <div className="dasho-node__header">
        <span className="dasho-node__icon" style={{ background: 'rgba(255,190,11,0.15)', color: 'var(--cat-ai)' }}>🎤</span>
        <div className="dasho-node__title-group">
          <div className="dasho-node__title">{label}</div>
          <div className="dasho-node__cat" style={{ color: 'var(--cat-ai)' }}>источник</div>
        </div > 
      </div>

      {/* BODY - Display Volume Level */}
      <div className="dasho-node__body">
        {status === 'live' ? (
            <span style={{ fontSize: '14px', fontWeight: '900', color: 'var(--cat-ai)' }}>Громкость: {volume.toFixed(2)}</span>
        ) : null}
      </div>

      {/* SOCKETS - INPUT (None) */}
      <div className="dasho-node__socket-row" style={{paddingBottom: 8}}>
        <span className="dasho-node__socket-label">...</span>
      </div>

      {/* SOCKETS - OUTPUT (Audio and Data) */}
      <div className="dasho-node__body" style={{paddingTop: 0}}>
        {/* Audio Stream Output */}
         <div className="dasho-node__socket-row out">
          <span className="dasho-node__socket-label">аудио</span>
          <Handle type="source" position={Position.Right} id="audiooutput" 
            style={{ background: 'rgba(124,92,252,0.2)', borderColor: 'var(--wire-audio)' }} />
        </div>

        {/* Level Output (Numeric) */}
        <div className="dasho-node__socket-row out">
          <span className="dasho-node__socket-label">уровень</span>
           <Handle type="source" position={Position.Right} id="leveloutput" 
            style={{ background: 'rgba(255,190,11,0.2)', borderColor: 'var(--wire-data)' }} />
        </div>

        {/* Clap Trigger Output */}
         <div className="dasho-node__socket-row out">
          <span className="dasho-node__socket-label">вспышка</span>
           <Handle type="source" position={Position.Right} id="claptriggeroutput" 
            style={{ background: 'rgba(255,107,53,0.2)', borderColor: 'var(--wire-trigger)' }} />
        </div>

      </div > 
    </div> 
  )
}