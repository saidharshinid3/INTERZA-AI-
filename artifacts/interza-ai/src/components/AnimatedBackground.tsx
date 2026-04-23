import { useMemo } from "react";

interface Props {
  particleCount?: number;
  className?: string;
}

export function AnimatedBackground({ particleCount = 18, className = "" }: Props) {
  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = 8 + Math.random() * 10;
        const tx = (Math.random() - 0.5) * 120;
        const size = 2 + Math.random() * 3;
        return { i, left, delay, duration, tx, size };
      }),
    [particleCount],
  );

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute inset-0 gradient-shift opacity-90" />
      <div className="absolute inset-0 neural-grid" />
      <div className="absolute inset-0 radial-glow" />
      {particles.map((p) => (
        <span
          key={p.i}
          className="particle"
          style={{
            left: `${p.left}%`,
            bottom: `-10px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            // @ts-expect-error css var
            "--tx": `${p.tx}px`,
          }}
        />
      ))}
    </div>
  );
}
