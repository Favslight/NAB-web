'use client';

import { useEffect, useState } from 'react';

const FLAKE_COUNT = 50;

type Flake = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
};

function useSnowflakes() {
  const [flakes, setFlakes] = useState<Flake[]>([]);

  useEffect(() => {
    setFlakes(
      Array.from({ length: FLAKE_COUNT }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 3,
        duration: 8 + Math.random() * 12,
        delay: Math.random() * -20,
        opacity: 0.05 + Math.random() * 0.12,
      }))
    );
  }, []);

  return flakes;
}

export default function SnowBackground() {
  const flakes = useSnowflakes();

  if (flakes.length === 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden"
      aria-hidden
    >
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake absolute top-0 rounded-full bg-white"
          style={{
            left: `${flake.left}%`,
            width: flake.size,
            height: flake.size,
            opacity: flake.opacity,
            animation: `snow-fall ${flake.duration}s linear ${flake.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
