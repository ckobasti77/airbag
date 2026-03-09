"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Edges, Grid } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { type HotspotData, HOTSPOTS } from "@/lib/data";
import { X, Package, Hash, CircleDot } from "lucide-react";

// ─── Shared scroll state (module-level, avoids re-renders) ──────────────────

const scrollState = { progress: 0 };

// ─── Constants ──────────────────────────────────────────────────────────────

const DEFAULT_CAM_POS: [number, number, number] = [3.5, 2.5, 4.5];
const DEFAULT_TARGET: [number, number, number] = [0, 0.3, 0];
const EDGE_COLOR = "#FF8C00";

// ═══════════════════════════════════════════════════════════════════════════════
// 3D GEOMETRY COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function SteeringWheel() {
  return (
    <group position={[0, 0.4, 0.9]} rotation={[-Math.PI * 0.35, 0, 0]}>
      {/* Wheel ring */}
      <mesh>
        <torusGeometry args={[0.38, 0.022, 16, 48]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.3}
          metalness={0.8}
        />
        <Edges threshold={15} color={EDGE_COLOR} />
      </mesh>

      {/* Center hub */}
      <mesh>
        <cylinderGeometry args={[0.11, 0.11, 0.025, 24]} />
        <meshStandardMaterial
          color="#1c1c1c"
          roughness={0.4}
          metalness={0.7}
        />
        <Edges threshold={15} color={EDGE_COLOR} />
      </mesh>

      {/* Spokes */}
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
        <mesh
          key={i}
          position={[Math.cos(angle) * 0.19, 0, Math.sin(angle) * 0.19]}
          rotation={[Math.PI / 2, angle, 0]}
        >
          <boxGeometry args={[0.028, 0.38, 0.012]} />
          <meshStandardMaterial
            color="#1a1a1a"
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
      ))}

      {/* Steering column */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.035, 0.055, 0.7, 12]} />
        <meshStandardMaterial
          color="#151515"
          roughness={0.5}
          metalness={0.6}
        />
        <Edges threshold={15} color="#FF8C0040" />
      </mesh>
    </group>
  );
}

function Dashboard() {
  return (
    <group>
      {/* Main dashboard body */}
      <mesh position={[0, 0.2, -0.2]}>
        <boxGeometry args={[3.2, 0.5, 0.8]} />
        <meshStandardMaterial
          color="#141414"
          roughness={0.6}
          metalness={0.5}
        />
        <Edges threshold={15} color="#FF8C0025" />
      </mesh>

      {/* Dashboard top surface */}
      <mesh position={[0, 0.5, -0.1]} rotation={[-0.15, 0, 0]}>
        <boxGeometry args={[3.0, 0.05, 0.9]} />
        <meshStandardMaterial
          color="#181818"
          roughness={0.7}
          metalness={0.4}
        />
        <Edges threshold={15} color="#FF8C0018" />
      </mesh>

      {/* Instrument cluster */}
      <mesh position={[-0.05, 0.45, 0.15]} rotation={[-0.4, 0, 0]}>
        <boxGeometry args={[0.55, 0.025, 0.32]} />
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.2}
          metalness={0.9}
          emissive="#FF8C00"
          emissiveIntensity={0.03}
        />
      </mesh>

      {/* Center infotainment display */}
      <mesh position={[0.5, 0.45, 0.0]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.42, 0.018, 0.26]} />
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.1}
          metalness={0.9}
          emissive="#FF8C00"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Air vents */}
      {[-0.7, 0.0, 0.7, 1.3].map((x, i) => (
        <mesh key={i} position={[x, 0.35, 0.2]}>
          <boxGeometry args={[0.16, 0.055, 0.035]} />
          <meshStandardMaterial
            color="#111111"
            roughness={0.5}
            metalness={0.7}
          />
          <Edges threshold={15} color="#FF8C0035" />
        </mesh>
      ))}
    </group>
  );
}

function CenterConsole() {
  return (
    <group>
      {/* Console body */}
      <mesh position={[0, -0.15, 0.5]}>
        <boxGeometry args={[0.48, 0.32, 1.15]} />
        <meshStandardMaterial
          color="#131313"
          roughness={0.6}
          metalness={0.5}
        />
        <Edges threshold={15} color="#FF8C0018" />
      </mesh>

      {/* Gear shifter base */}
      <mesh position={[0, 0.08, 0.6]}>
        <cylinderGeometry args={[0.022, 0.028, 0.14, 8]} />
        <meshStandardMaterial color="#222" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Gear knob */}
      <mesh position={[0, 0.18, 0.6]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
}

function APillars() {
  return (
    <group>
      {/* Left A-pillar */}
      <mesh position={[-1.55, 0.7, -0.1]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.055, 0.95, 0.07]} />
        <meshStandardMaterial color="#111" roughness={0.7} metalness={0.4} />
        <Edges threshold={15} color="#FF8C0035" />
      </mesh>

      {/* Right A-pillar */}
      <mesh position={[1.55, 0.7, -0.1]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.055, 0.95, 0.07]} />
        <meshStandardMaterial color="#111" roughness={0.7} metalness={0.4} />
        <Edges threshold={15} color="#FF8C0035" />
      </mesh>

      {/* Roof crossbeam */}
      <mesh position={[0, 1.15, -0.2]}>
        <boxGeometry args={[3.0, 0.035, 0.09]} />
        <meshStandardMaterial color="#111" roughness={0.7} metalness={0.4} />
        <Edges threshold={15} color="#FF8C0025" />
      </mesh>
    </group>
  );
}

function SeatOutlines() {
  return (
    <group>
      {/* Driver seat */}
      <mesh position={[-0.5, -0.15, 1.4]}>
        <boxGeometry args={[0.55, 0.25, 0.6]} />
        <meshStandardMaterial
          color="#111"
          roughness={0.8}
          metalness={0.3}
          transparent
          opacity={0.6}
        />
        <Edges threshold={15} color="#FF8C0015" />
      </mesh>

      {/* Passenger seat */}
      <mesh position={[0.9, -0.15, 1.4]}>
        <boxGeometry args={[0.55, 0.25, 0.6]} />
        <meshStandardMaterial
          color="#111"
          roughness={0.8}
          metalness={0.3}
          transparent
          opacity={0.6}
        />
        <Edges threshold={15} color="#FF8C0015" />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOTSPOT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function Hotspot({
  data,
  onClick,
  isActive,
}: {
  data: HotspotData;
  onClick: (d: HotspotData) => void;
  isActive: boolean;
}) {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const core = coreRef.current;
    const ring = ringRef.current;
    if (!core) return;

    const tweens: gsap.core.Tween[] = [];

    // Core pulse
    tweens.push(
      gsap.to(core.scale, {
        x: 1.35,
        y: 1.35,
        z: 1.35,
        duration: 0.9,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })
    );

    if (ring) {
      // Ring expand/contract
      tweens.push(
        gsap.to(ring.scale, {
          x: 1.6,
          y: 1.6,
          z: 1.6,
          duration: 1.3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
      );

      // Ring opacity pulse
      const mat = ring.material as THREE.MeshStandardMaterial;
      tweens.push(
        gsap.to(mat, {
          opacity: 0.12,
          duration: 1.3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
      );
    }

    return () => {
      tweens.forEach((t) => t.kill());
    };
  }, []);

  return (
    <group position={data.position}>
      {/* Core sphere */}
      <mesh
        ref={coreRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(data);
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial
          color="#FF8C00"
          emissive="#FF8C00"
          emissiveIntensity={isActive ? 2.5 : 0.9}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Pulse ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.095, 0.006, 8, 32]} />
        <meshStandardMaterial
          color="#FF8C00"
          emissive="#FF8C00"
          emissiveIntensity={0.5}
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* Glow sphere */}
      <mesh>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshBasicMaterial color="#FF8C00" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CAMERA CONTROLLER
// ═══════════════════════════════════════════════════════════════════════════════

function CameraRig({ focusTarget }: { focusTarget: HotspotData | null }) {
  const { camera } = useThree();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (focusTarget) {
      controls.enabled = false;

      gsap.to(camera.position, {
        x: focusTarget.focusPosition[0],
        y: focusTarget.focusPosition[1],
        z: focusTarget.focusPosition[2],
        duration: 1.2,
        ease: "power2.inOut",
      });

      gsap.to(controls.target, {
        x: focusTarget.position[0],
        y: focusTarget.position[1],
        z: focusTarget.position[2],
        duration: 1.2,
        ease: "power2.inOut",
        onUpdate: () => controls.update(),
      });
    } else {
      gsap.to(camera.position, {
        x: DEFAULT_CAM_POS[0],
        y: DEFAULT_CAM_POS[1],
        z: DEFAULT_CAM_POS[2],
        duration: 1.0,
        ease: "power2.inOut",
      });

      gsap.to(controls.target, {
        x: DEFAULT_TARGET[0],
        y: DEFAULT_TARGET[1],
        z: DEFAULT_TARGET[2],
        duration: 1.0,
        ease: "power2.inOut",
        onUpdate: () => controls.update(),
        onComplete: () => {
          controls.enabled = true;
        },
      });
    }
  }, [focusTarget, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      maxPolarAngle={Math.PI * 0.65}
      minPolarAngle={Math.PI * 0.15}
      maxDistance={8}
      minDistance={2}
      dampingFactor={0.05}
      enableDamping
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE CONTENT (inside Canvas)
// ═══════════════════════════════════════════════════════════════════════════════

function SceneContent({
  activeHotspot,
  onHotspotClick,
}: {
  activeHotspot: HotspotData | null;
  onHotspotClick: (d: HotspotData) => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current || activeHotspot) return;

    timeRef.current += delta;

    // Gentle idle sway
    const autoY = Math.sin(timeRef.current * 0.25) * 0.12;
    // Scroll-driven rotation
    const scrollY = scrollState.progress * Math.PI * 0.4;
    // Combine & interpolate
    const targetY = autoY + scrollY;
    groupRef.current.rotation.y +=
      (targetY - groupRef.current.rotation.y) * 0.035;
  });

  return (
    <>
      {/* Lighting rig */}
      <ambientLight intensity={0.25} color="#e8e0d8" />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.75}
        color="#fff5e6"
      />
      <directionalLight
        position={[-3, 3, -3]}
        intensity={0.25}
        color="#4488ff"
      />
      <pointLight
        position={[0, 2, 2]}
        intensity={0.45}
        color="#FF8C00"
        distance={6}
        decay={2}
      />

      {/* Camera rig */}
      <CameraRig focusTarget={activeHotspot} />

      {/* Car interior group */}
      <group ref={groupRef}>
        <SteeringWheel />
        <Dashboard />
        <CenterConsole />
        <APillars />
        <SeatOutlines />

        {HOTSPOTS.map((hs) => (
          <Hotspot
            key={hs.id}
            data={hs}
            onClick={onHotspotClick}
            isActive={activeHotspot?.id === hs.id}
          />
        ))}
      </group>

      {/* Blueprint grid floor */}
      <Grid
        position={[0, -0.35, 0]}
        args={[12, 12]}
        cellSize={0.35}
        cellThickness={0.4}
        cellColor="#FF8C00"
        sectionSize={1.75}
        sectionThickness={0.8}
        sectionColor="#FF8C00"
        fadeDistance={8}
        fadeStrength={1.2}
        infiniteGrid
        followCamera={false}
      />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// OVERLAY INFO CARD
// ═══════════════════════════════════════════════════════════════════════════════

function InfoCard({
  data,
  onClose,
}: {
  data: HotspotData;
  onClose: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { x: "100%", opacity: 0 },
      { x: "0%", opacity: 1, duration: 0.55, ease: "power3.out" }
    );
  }, [data.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      ref={cardRef}
      className="absolute top-4 right-4 bottom-4 w-80 max-w-[calc(100%-2rem)] z-20"
    >
      <div className="h-full bg-[#0D0D0D]/92 backdrop-blur-xl border border-[#FF8C00]/25 rounded-lg p-6 flex flex-col shadow-2xl shadow-[#FF8C00]/5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-[#FF8C00] border border-[#FF8C00]/40 px-2 py-0.5 rounded font-bold">
              {data.label}
            </span>
            <span className="text-[#FACC15] font-mono text-[10px] uppercase tracking-[0.15em]">
              {data.partEn}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors p-1"
          >
            <X size={16} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-[#FF8C00]/40 via-[#FF8C00]/10 to-transparent mb-5" />

        {/* Part name */}
        <h3 className="text-xl font-semibold text-white mb-5 tracking-tight">
          {data.part}
        </h3>

        {/* Data rows */}
        <div className="space-y-2.5 flex-1">
          <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.04] rounded-md px-3.5 py-2.5">
            <Hash size={13} className="text-[#FF8C00] shrink-0" />
            <div>
              <span className="text-zinc-500 text-[10px] uppercase tracking-wider block">
                OEM Broj
              </span>
              <span className="font-mono text-sm text-white font-medium">
                {data.oem}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.04] rounded-md px-3.5 py-2.5">
            <CircleDot size={13} className="text-[#FF8C00] shrink-0" />
            <div>
              <span className="text-zinc-500 text-[10px] uppercase tracking-wider block">
                Status
              </span>
              <span
                className={`text-sm font-semibold ${
                  data.status === "Na stanju"
                    ? "text-emerald-400"
                    : "text-[#FACC15]"
                }`}
              >
                {data.status}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white/[0.03] border border-white/[0.04] rounded-md px-3.5 py-2.5">
            <Package size={13} className="text-[#FF8C00] shrink-0 mt-0.5" />
            <div>
              <span className="text-zinc-500 text-[10px] uppercase tracking-wider block">
                Opis
              </span>
              <span className="text-[13px] text-zinc-300 leading-relaxed">
                {data.description}
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button className="mt-5 w-full bg-[#FF8C00] hover:bg-[#e67e00] active:bg-[#cc7000] text-black font-bold py-3 rounded-md transition-colors text-sm tracking-wide">
          POŠALJI UPIT
        </button>

        {/* Safety disclaimer */}
        <p className="mt-3 text-[9px] text-zinc-600 text-center font-mono leading-relaxed">
          ⚠ Airbagovi su pirotehničke naprave i zahtevaju profesionalnu
          ugradnju.
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTED COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function AirbagScene() {
  const [activeHotspot, setActiveHotspot] = useState<HotspotData | null>(null);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Client-only mount (Canvas needs WebGL)
  useEffect(() => {
    setMounted(true);
  }, []);

  // ScrollTrigger for scroll progress
  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      scrollState.progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };

    // Use GSAP-style scroll tracking via passive listener
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial

    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  const handleHotspotClick = useCallback((data: HotspotData) => {
    setActiveHotspot(data);
  }, []);

  const handleClose = useCallback(() => {
    setActiveHotspot(null);
  }, []);

  if (!mounted) {
    return (
      <div
        ref={containerRef}
        className="relative w-full h-full bg-[#0D0D0D]"
      />
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <Canvas
        camera={{
          position: DEFAULT_CAM_POS,
          fov: 45,
          near: 0.1,
          far: 100,
        }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <SceneContent
          activeHotspot={activeHotspot}
          onHotspotClick={handleHotspotClick}
        />
      </Canvas>

      {/* Info overlay */}
      {activeHotspot && (
        <InfoCard data={activeHotspot} onClose={handleClose} />
      )}

      {/* Interaction hint */}
      {!activeHotspot && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-zinc-500 text-xs font-mono flex items-center gap-2 select-none pointer-events-none">
          <span className="inline-block w-5 h-5 border border-zinc-600 rounded-full relative">
            <span className="absolute inset-1 border-t border-l border-zinc-500 rounded-full animate-spin" style={{ animationDuration: "3s" }} />
          </span>
          Klikni na hotspot · Skroluj za rotaciju
        </div>
      )}
    </div>
  );
}
