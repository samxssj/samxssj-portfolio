'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Html } from '@react-three/drei';
import { easing } from 'maath';
import * as THREE from 'three';
import { STACK, COLS_PER_ROW, type TechKey } from '@/content/stack';
import { ICONS } from './keyboardIcons';

const KEY_SIZE = 1;
const GAP = 0.18;
const PITCH = KEY_SIZE + GAP;
const MAX_COLS = Math.max(...COLS_PER_ROW);
const ROWS = COLS_PER_ROW.length;

export function keyPosition(row: number, col: number): [number, number, number] {
  // filas con menos teclas se centran con medio paso de offset
  const offset = (MAX_COLS - COLS_PER_ROW[row]) / 2;
  const x = (col + offset) * PITCH - ((MAX_COLS - 1) * PITCH) / 2;
  const z = row * PITCH - ((ROWS - 1) * PITCH) / 2;
  return [x, 0, z];
}

function useIconTexture(tech: TechKey): THREE.CanvasTexture {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = tech.color;
    ctx.fillRect(0, 0, 256, 256);
    // simple-icons usa viewBox 24×24 → icono de 150px centrado
    ctx.translate(53, 53);
    ctx.scale(6.25, 6.25);
    // blanco sobre marcas oscuras, negro sobre marcas claras (JS amarillo, Linux…)
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(tech.color.slice(1 + i, 3 + i), 16));
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    ctx.fillStyle = luminance > 160 ? '#111111' : '#ffffff';
    ctx.fill(new Path2D(ICONS[tech.iconSlug].path));
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, [tech]);
}

function Keycap({
  tech,
  pressed,
  active,
  onActivate,
  locale,
}: {
  tech: TechKey;
  pressed: boolean;
  active: boolean;
  onActivate: (id: string | null) => void;
  locale: 'es' | 'en';
}) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const texture = useIconTexture(tech);
  const [x, , z] = keyPosition(tech.row, tech.col);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  useFrame((_, delta) => {
    if (!group.current) return;
    easing.damp(group.current.position, 'y', pressed ? -0.18 : 0, 0.06, delta);
  });

  return (
    <group ref={group} position={[x, 0, z]}>
      <RoundedBox
        args={[KEY_SIZE, 0.55, KEY_SIZE]}
        radius={0.08}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onActivate(active ? null : tech.id);
        }}
      >
        <meshStandardMaterial color={hovered ? '#3d3552' : '#262033'} roughness={0.35} />
      </RoundedBox>
      <mesh position={[0, 0.281, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshBasicMaterial map={texture} toneMapped={false} transparent />
      </mesh>
      {active && (
        <Html position={[0, 0.9, 0]} center distanceFactor={8} occlude={false}>
          <div className="w-56 origin-bottom rounded-xl border border-border-soft bg-surface/95 p-3 text-center backdrop-blur-sm">
            <p className="text-xs font-extrabold text-text">{tech.label}</p>
            <p className="mt-1 text-[11px] leading-snug text-muted">{tech.experience[locale]}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

function KeyboardModel({ locale, reducedMotion }: { locale: 'es' | 'en'; reducedMotion: boolean }) {
  const board = useRef<THREE.Group>(null);
  const [pressedId, setPressedId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  // teclas físicas: solo si no hay un input/textarea enfocado
  useEffect(() => {
    function isTypingTarget() {
      const el = document.activeElement;
      return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
    }
    function onDown(e: KeyboardEvent) {
      if (isTypingTarget() || e.metaKey || e.ctrlKey || e.altKey) return;
      const tech = STACK.find((s) => s.key === e.key.toLowerCase());
      if (!tech) return;
      setPressedId(tech.id);
      setActiveId(tech.id);
    }
    function onUp() {
      setPressedId(null);
    }
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!board.current || reducedMotion) return;
    easing.dampE(
      board.current.rotation,
      [state.pointer.y * 0.06, state.pointer.x * 0.12, 0],
      0.3,
      delta,
    );
  });

  const plateWidth = MAX_COLS * PITCH + 0.5;
  const plateDepth = ROWS * PITCH + 0.5;

  return (
    <group ref={board} rotation={[0.12, 0, 0]} onPointerMissed={() => setActiveId(null)}>
      <RoundedBox args={[plateWidth, 0.4, plateDepth]} radius={0.12} position={[0, -0.45, 0]}>
        <meshStandardMaterial color="#16121f" roughness={0.5} />
      </RoundedBox>
      {STACK.map((tech) => (
        <Keycap
          key={tech.id}
          tech={tech}
          locale={locale}
          pressed={pressedId === tech.id || activeId === tech.id}
          active={activeId === tech.id}
          onActivate={setActiveId}
        />
      ))}
    </group>
  );
}

export default function KeyboardScene({
  locale,
  reducedMotion,
}: {
  locale: 'es' | 'en';
  reducedMotion: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 6.2, 5.4], fov: 38 }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 8, 4]} intensity={1.4} />
      <pointLight position={[-4, 3, -2]} intensity={8} color="#7c3aed" />
      <KeyboardModel locale={locale} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
