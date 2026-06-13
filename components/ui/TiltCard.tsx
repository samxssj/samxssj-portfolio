'use client';

import { useRef } from 'react';

/** Tilt 3D sutil siguiendo el cursor. Respeta prefers-reduced-motion. */
export function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateX(${py * -6}deg) rotateY(${px * 8}deg)`;
  }

  function handleLeave() {
    const el = ref.current;
    if (el) el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="transition-transform duration-200 ease-out will-change-transform"
    >
      {children}
    </div>
  );
}
