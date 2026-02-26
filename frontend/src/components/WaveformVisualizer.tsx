import React, { useRef, useEffect } from "react";

interface WaveformVisualizerProps {
  analyserNode: AnalyserNode | null;
  isActive: boolean;
  height?: number;
}

export default function WaveformVisualizer({ analyserNode, isActive, height = 80 }: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = "rgba(10, 10, 20, 0.85)";
      ctx.fillRect(0, 0, W, H);

      if (!analyserNode || !isActive) {
        // Draw flat line
        ctx.beginPath();
        ctx.strokeStyle = "rgba(251, 191, 36, 0.3)";
        ctx.lineWidth = 1.5;
        ctx.moveTo(0, H / 2);
        ctx.lineTo(W, H / 2);
        ctx.stroke();
        return;
      }

      const bufferLength = analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserNode.getByteTimeDomainData(dataArray);

      // Waveform gradient
      const gradient = ctx.createLinearGradient(0, 0, W, 0);
      gradient.addColorStop(0, "rgba(6, 182, 212, 0.9)");
      gradient.addColorStop(0.5, "rgba(251, 191, 36, 1)");
      gradient.addColorStop(1, "rgba(6, 182, 212, 0.9)");

      ctx.beginPath();
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;

      const sliceWidth = W / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * H) / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }

      ctx.lineTo(W, H / 2);
      ctx.stroke();

      // Glow effect
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(251, 191, 36, 0.5)";
      ctx.stroke();
      ctx.shadowBlur = 0;

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [analyserNode, isActive]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={height}
      className="w-full rounded-xl border border-white/10"
      style={{ height: `${height}px` }}
    />
  );
}
