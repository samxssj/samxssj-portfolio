'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

/**
 * Avatar 2D del hero con parallax: se inclina y desplaza siguiendo el cursor.
 * Escucha en window (no en el contenedor) porque el wrapper del hero tiene
 * pointer-events-none. Respeta prefers-reduced-motion (queda estático).
 */
export function AvatarParallax() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    function onMove(e: MouseEvent) {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const px = e.clientX / window.innerWidth - 0.5;
        const py = e.clientY / window.innerHeight - 0.5;
        el.style.transform = `translate3d(${px * 22}px, ${py * 16}px, 0) rotateY(${px * 10}deg) rotateX(${py * -6}deg)`;
      });
    }

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="flex h-full items-center justify-center">
      <div
        ref={ref}
        className="relative h-[60vh] max-h-[560px] w-[clamp(220px,40vw,420px)] [transform-style:preserve-3d] transition-transform duration-300 ease-out will-change-transform motion-safe:animate-float"
      >
        <Image
          src="/avatar.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 640px) 60vw, 420px"
          className="object-contain drop-shadow-[0_25px_45px_rgba(124,58,237,0.35)]"
        />
      </div>
    </div>
  );
}
