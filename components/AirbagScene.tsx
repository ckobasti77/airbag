"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense } from "react";
import {
  OrbitControls,
  Edges,
  Grid,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { type HotspotData, HOTSPOTS } from "@/lib/data";
import { X, Package, Hash, CircleDot } from "lucide-react";

// ─── Shared scroll state (module-level, zero re-renders) ────────────────────

const scrollState = { progress: 0 };

// ─── Constants ──────────────────────────────────────────────────────────────

const DEFAULT_CAM_POS: [number, number, number] = [3.5, 2.5, 4.5];
const DEFAULT_TARGET: [number, number, number] = [0, 0.3, 0];
const EDGE_BRIGHT = "#FF8C00";
const EDGE_MID = "#4d2a00";
const EDGE_DIM = "#2b1800";

// ═══════════════════════════════════════════════════════════════════════════════
// 3D GEOMETRY — Industrial-grade materials
// ═══════════════════════════════════════════════════════════════════════════════

function SteeringWheel() {
  return (
    <group position={[0, 0.4, 0.9]} rotation={[-Math.PI * 0.35, 0, 0]}>
      <mesh>
        <torusGeometry args={[0.38, 0.024, 16, 48]} />
        <meshStandardMaterial
          color="#1e1e1e"
          roughness={0.15}
          metalness={0.92}
          envMapIntensity={0.8}
        />
        <Edges threshold={15} color={EDGE_BRIGHT} />
      </mesh>

      <mesh>
        <cylinderGeometry args={[0.11, 0.11, 0.028, 24]} />
        <meshStandardMaterial
          color="#1c1c1c"
          roughness={0.25}
          metalness={0.85}
          envMapIntensity={0.7}
        />
        <Edges threshold={15} color={EDGE_BRIGHT} />
      </mesh>

      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
        <mesh
          key={i}
          position={[Math.cos(angle) * 0.19, 0, Math.sin(angle) * 0.19]}
          rotation={[Math.PI / 2, angle, 0]}
        >
          <boxGeometry args={[0.028, 0.38, 0.013]} />
          <meshStandardMaterial
            color="#1a1a1a"
            roughness={0.2}
            metalness={0.88}
          />
        </mesh>
      ))}

      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.035, 0.055, 0.7, 12]} />
        <meshStandardMaterial
          color="#151515"
          roughness={0.4}
          metalness={0.7}
          envMapIntensity={0.4}
        />
        <Edges threshold={15} color={EDGE_DIM} />
      </mesh>
    </group>
  );
}

function Dashboard() {
  return (
    <group>
      <mesh position={[0, 0.2, -0.2]}>
        <boxGeometry args={[3.2, 0.5, 0.8]} />
        <meshStandardMaterial
          color="#161616"
          roughness={0.55}
          metalness={0.65}
          envMapIntensity={0.5}
        />
        <Edges threshold={15} color={EDGE_DIM} />
      </mesh>

      <mesh position={[0, 0.5, -0.1]} rotation={[-0.15, 0, 0]}>
        <boxGeometry args={[3.0, 0.05, 0.9]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.65}
          metalness={0.5}
          envMapIntensity={0.3}
        />
        <Edges threshold={15} color="#241400" />
      </mesh>

      <mesh position={[-0.05, 0.45, 0.15]} rotation={[-0.4, 0, 0]}>
        <boxGeometry args={[0.55, 0.025, 0.32]} />
        <meshStandardMaterial
          color="#080808"
          roughness={0.08}
          metalness={0.95}
          emissive="#FF8C00"
          emissiveIntensity={0.04}
          envMapIntensity={1.2}
        />
      </mesh>

      <mesh position={[0.5, 0.45, 0.0]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.42, 0.018, 0.26]} />
        <meshStandardMaterial
          color="#080808"
          roughness={0.05}
          metalness={0.95}
          emissive="#FF8C00"
          emissiveIntensity={0.06}
          envMapIntensity={1.2}
        />
      </mesh>

      {[-0.7, 0.0, 0.7, 1.3].map((x, i) => (
        <mesh key={i} position={[x, 0.35, 0.2]}>
          <boxGeometry args={[0.16, 0.055, 0.035]} />
          <meshStandardMaterial
            color="#111"
            roughness={0.4}
            metalness={0.75}
          />
          <Edges threshold={15} color={EDGE_MID} />
        </mesh>
      ))}
    </group>
  );
}

function CenterConsole() {
  return (
    <group>
      <mesh position={[0, -0.15, 0.5]}>
        <boxGeometry args={[0.48, 0.32, 1.15]} />
        <meshStandardMaterial
          color="#141414"
          roughness={0.55}
          metalness={0.6}
          envMapIntensity={0.4}
        />
        <Edges threshold={15} color={EDGE_DIM} />
      </mesh>

      <mesh position={[0, 0.08, 0.6]}>
        <cylinderGeometry args={[0.022, 0.028, 0.14, 8]} />
        <meshStandardMaterial
          color="#2a2a2a"
          roughness={0.15}
          metalness={0.95}
        />
      </mesh>

      <mesh position={[0, 0.18, 0.6]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial
          color="#1e1e1e"
          roughness={0.1}
          metalness={0.95}
          envMapIntensity={1.0}
        />
      </mesh>
    </group>
  );
}

function SeatOutlines() {
  return (
    <group>
      <mesh position={[-0.5, -0.15, 1.4]}>
        <boxGeometry args={[0.55, 0.25, 0.6]} />
        <meshStandardMaterial
          color="#131313"
          roughness={0.85}
          metalness={0.2}
          transparent
          opacity={0.55}
        />
        <Edges threshold={15} color="#1f1100" />
      </mesh>
      <mesh position={[0.9, -0.15, 1.4]}>
        <boxGeometry args={[0.55, 0.25, 0.6]} />
        <meshStandardMaterial
          color="#131313"
          roughness={0.85}
          metalness={0.2}
          transparent
          opacity={0.55}
        />
        <Edges threshold={15} color="#1f1100" />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOTSPOT — GSAP pulsing spheres
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
      {/* Invisible larger touch target for mobile */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick(data);
        }}
        onPointerOver={() => {
          document.body.classList.add("hovering-3d");
        }}
        onPointerOut={() => {
          document.body.classList.remove("hovering-3d");
        }}
      >
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      <mesh ref={coreRef}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial
          color="#FF8C00"
          emissive="#FF8C00"
          emissiveIntensity={isActive ? 2.5 : 0.9}
          transparent
          opacity={0.92}
        />
      </mesh>

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

      <mesh>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshBasicMaterial color="#FF8C00" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// RESPONSIVE FOV — wider on portrait / small screens
// ═══════════════════════════════════════════════════════════════════════════════

function ResponsiveFov() {
  const { camera, size } = useThree();

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;
    cam.fov = aspect < 1 ? 62 : aspect < 1.4 ? 52 : 45;
    cam.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CAMERA RIG
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
// SCENE CONTENT — Exploded view + Environment + ContactShadows
// ═══════════════════════════════════════════════════════════════════════════════

function SceneContent({
  activeHotspot,
  onHotspotClick,
}: {
  activeHotspot: HotspotData | null;
  onHotspotClick: (d: HotspotData) => void;
}) {
  const mainRef = useRef<THREE.Group>(null!);

  // Exploded-view refs (wrap each sub-assembly)
  const steeringGrp = useRef<THREE.Group>(null!);
  const dashboardGrp = useRef<THREE.Group>(null!);
  const consoleGrp = useRef<THREE.Group>(null!);
  const leftPillarGrp = useRef<THREE.Group>(null!);
  const rightPillarGrp = useRef<THREE.Group>(null!);
  const roofGrp = useRef<THREE.Group>(null!);
  const seatsGrp = useRef<THREE.Group>(null!);

  const timeRef = useRef(0);
  const explodeRef = useRef(0);

  useFrame((_, delta) => {
    if (!mainRef.current) return;

    timeRef.current += delta;

    // ── Idle sway + scroll rotation ──
    if (!activeHotspot) {
      const autoY = Math.sin(timeRef.current * 0.25) * 0.12;
      const scrollY = scrollState.progress * Math.PI * 0.4;
      const targetY = autoY + scrollY;
      mainRef.current.rotation.y +=
        (targetY - mainRef.current.rotation.y) * 0.035;
    }

    // ── Exploded view (sin wave peaks at 50% scroll) ──
    const targetExplode = activeHotspot
      ? 0
      : Math.sin(scrollState.progress * Math.PI) * 0.55;
    explodeRef.current += (targetExplode - explodeRef.current) * 0.04;
    const e = explodeRef.current;

    // Move sub-assemblies apart
    steeringGrp.current.position.z = e * 0.55;
    steeringGrp.current.position.y = e * 0.08;

    dashboardGrp.current.position.z = e * -0.45;
    dashboardGrp.current.position.y = e * 0.12;

    consoleGrp.current.position.y = e * -0.22;

    leftPillarGrp.current.position.x = e * -0.38;
    leftPillarGrp.current.position.y = e * 0.08;

    rightPillarGrp.current.position.x = e * 0.38;
    rightPillarGrp.current.position.y = e * 0.08;

    roofGrp.current.position.y = e * 0.35;

    seatsGrp.current.position.z = e * 0.45;
    seatsGrp.current.position.y = e * -0.1;
  });

  return (
    <>
      {/* ── Lighting rig ── */}
      <ambientLight intensity={0.2} color="#e0dcd6" />
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.65}
        color="#fff5e6"
      />
      <directionalLight
        position={[-4, 3, -4]}
        intensity={0.2}
        color="#6688cc"
      />
      <pointLight
        position={[0, 2.5, 2.5]}
        intensity={0.5}
        color="#FF8C00"
        distance={7}
        decay={2}
      />
      <pointLight
        position={[3, 1, -2]}
        intensity={0.12}
        color="#88aaff"
        distance={5}
        decay={2}
      />

      {/* ── Rim / fill lights (replaces HDR environment) ── */}
      <directionalLight
        position={[-2, 4, 6]}
        intensity={0.3}
        color="#ffd4a0"
      />
      <hemisphereLight
        args={["#2a1a00", "#0a0a14", 0.35]}
      />

      {/* ── Camera ── */}
      <ResponsiveFov />
      <CameraRig focusTarget={activeHotspot} />

      {/* ── Main scene group ── */}
      <group ref={mainRef}>
        <group ref={steeringGrp}>
          <SteeringWheel />
        </group>

        <group ref={dashboardGrp}>
          <Dashboard />
        </group>

        <group ref={consoleGrp}>
          <CenterConsole />
        </group>

        {/* A-pillars inlined for individual refs */}
        <group ref={leftPillarGrp}>
          <mesh position={[-1.55, 0.7, -0.1]} rotation={[0, 0, 0.2]}>
            <boxGeometry args={[0.055, 0.95, 0.07]} />
            <meshStandardMaterial
              color="#121212"
              roughness={0.6}
              metalness={0.5}
            />
            <Edges threshold={15} color={EDGE_MID} />
          </mesh>
        </group>

        <group ref={rightPillarGrp}>
          <mesh position={[1.55, 0.7, -0.1]} rotation={[0, 0, -0.2]}>
            <boxGeometry args={[0.055, 0.95, 0.07]} />
            <meshStandardMaterial
              color="#121212"
              roughness={0.6}
              metalness={0.5}
            />
            <Edges threshold={15} color={EDGE_MID} />
          </mesh>
        </group>

        <group ref={roofGrp}>
          <mesh position={[0, 1.15, -0.2]}>
            <boxGeometry args={[3.0, 0.035, 0.09]} />
            <meshStandardMaterial
              color="#121212"
              roughness={0.6}
              metalness={0.5}
            />
            <Edges threshold={15} color={EDGE_DIM} />
          </mesh>
        </group>

        <group ref={seatsGrp}>
          <SeatOutlines />
        </group>

        {/* Hotspots */}
        {HOTSPOTS.map((hs) => (
          <Hotspot
            key={hs.id}
            data={hs}
            onClick={onHotspotClick}
            isActive={activeHotspot?.id === hs.id}
          />
        ))}
      </group>

      {/* ── ContactShadows for depth ── */}
      <Suspense fallback={null}>
        <ContactShadows
          position={[0, -0.36, 0]}
          opacity={0.3}
          scale={7}
          blur={2.2}
          far={3}
          resolution={256}
          color="#000"
        />
      </Suspense>

      {/* ── Blueprint grid floor ── */}
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
// SYSTEM LOGS — Micro-copy telemetry overlay
// ═══════════════════════════════════════════════════════════════════════════════

interface LogLine {
  prefix: string;
  text: string;
  value: string;
  variant: "ok" | "warn" | "dim";
}

function SystemLogs({ activeHotspot }: { activeHotspot: HotspotData | null }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const logs: LogLine[] = useMemo(() => {
    if (!activeHotspot) {
      return [
        { prefix: "SYS", text: "AIRBAG MODULE", value: "v2.4.1", variant: "dim" },
        { prefix: "NET", text: "OEM Database", value: "STANDBY", variant: "dim" },
      ];
    }
    return [
      { prefix: "SCN", text: `Target: ${activeHotspot.oem}`, value: "LOCKED", variant: "ok" },
      { prefix: "CHK", text: "Pressure sensor", value: "NOMINAL", variant: "ok" },
      { prefix: "CHK", text: "Igniter circuit", value: "READY", variant: "ok" },
      { prefix: "OEM", text: "Part verified", value: "MATCH", variant: "ok" },
      {
        prefix: "STS",
        text: "Availability",
        value: activeHotspot.status === "Na stanju" ? "IN STOCK" : "ON ORDER",
        variant: activeHotspot.status === "Na stanju" ? "ok" : "warn",
      },
    ];
  }, [activeHotspot]);

  useEffect(() => {
    if (!containerRef.current) return;
    const lines = containerRef.current.querySelectorAll(".syslog-line");
    gsap.fromTo(
      lines,
      { opacity: 0, x: -12 },
      {
        opacity: 1,
        x: 0,
        duration: 0.3,
        stagger: 0.06,
        ease: "power2.out",
      }
    );
  }, [logs]);

  const colorMap = { ok: "text-emerald-500", warn: "text-[#FACC15]", dim: "text-zinc-500" };

  return (
    <div
      ref={containerRef}
      className="hidden md:block absolute bottom-8 left-8 font-mono text-[10px] space-y-1 select-none pointer-events-none z-10"
    >
      {logs.map((log) => (
        <div
          key={`${log.prefix}-${log.text}`}
          className="syslog-line flex items-center gap-2"
        >
          <span className="text-[#FF8C00]/50">[{log.prefix}]</span>
          <span className="text-zinc-600">{log.text}</span>
          <span className="text-zinc-700">···</span>
          <span className={colorMap[log.variant]}>{log.value}</span>
        </div>
      ))}
    </div>
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
    const els = cardRef.current.querySelectorAll(".card-row");
    const isMobile = window.innerWidth < 768;

    gsap.fromTo(
      cardRef.current,
      isMobile ? { y: "100%", opacity: 0 } : { x: "100%", opacity: 0 },
      isMobile
        ? { y: "0%", opacity: 1, duration: 0.5, ease: "power3.out" }
        : { x: "0%", opacity: 1, duration: 0.55, ease: "power3.out" }
    );
    gsap.fromTo(
      els,
      { opacity: 0, x: isMobile ? 0 : 20, y: isMobile ? 12 : 0 },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.4,
        stagger: 0.07,
        delay: 0.3,
        ease: "power2.out",
      }
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
      className="absolute inset-x-0 bottom-0 md:inset-x-auto md:top-4 md:right-4 md:bottom-4 md:w-80 z-20"
    >
      <div className="max-h-[70vh] md:max-h-none md:h-full bg-[#0D0D0D]/95 backdrop-blur-xl border border-[#FF8C00]/25 rounded-t-xl md:rounded-lg p-5 md:p-6 flex flex-col shadow-2xl shadow-[#FF8C00]/5 overflow-y-auto">
        {/* Header */}
        <div className="card-row flex items-center justify-between mb-5">
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
            data-magnetic
          >
            <X size={16} />
          </button>
        </div>

        <div className="card-row h-px bg-gradient-to-r from-[#FF8C00]/40 via-[#FF8C00]/10 to-transparent mb-5" />

        <h3 className="card-row text-xl font-semibold text-white mb-5 tracking-tight">
          {data.part}
        </h3>

        <div className="space-y-2.5 flex-1">
          <div className="card-row flex items-center gap-3 bg-white/[0.03] border border-white/[0.04] rounded-md px-3.5 py-2.5">
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

          <div className="card-row flex items-center gap-3 bg-white/[0.03] border border-white/[0.04] rounded-md px-3.5 py-2.5">
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

          <div className="card-row flex items-start gap-3 bg-white/[0.03] border border-white/[0.04] rounded-md px-3.5 py-2.5">
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

        <button
          className="card-row mt-5 w-full bg-[#FF8C00] hover:bg-[#e67e00] active:bg-[#cc7000] text-black font-bold py-3 rounded-md transition-colors text-sm tracking-wide"
          data-magnetic
        >
          POŠALJI UPIT
        </button>

        <p className="mt-3 text-[9px] text-zinc-600 text-center font-mono leading-relaxed">
          * Airbagovi su pirotehničke naprave i zahtevaju profesionalnu ugradnju.
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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      scrollState.progress = max > 0 ? window.scrollY / max : 0;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  const handleHotspotClick = useCallback((data: HotspotData) => {
    setActiveHotspot(data);
  }, []);

  const handleClose = useCallback(() => {
    setActiveHotspot(null);
    document.body.classList.remove("hovering-3d");
  }, []);

  if (!mounted) {
    return (
      <div ref={containerRef} className="relative w-full h-full bg-[#0D0D0D]" />
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
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <SceneContent
          activeHotspot={activeHotspot}
          onHotspotClick={handleHotspotClick}
        />
      </Canvas>

      {activeHotspot && (
        <InfoCard data={activeHotspot} onClose={handleClose} />
      )}

      <SystemLogs activeHotspot={activeHotspot} />

      {!activeHotspot && (
        <div className="absolute bottom-4 right-4 md:bottom-6 md:right-8 text-zinc-600 text-[9px] md:text-[10px] font-mono flex items-center gap-2 select-none pointer-events-none">
          <span className="inline-block w-4 h-4 border border-zinc-700 rounded-full relative">
            <span
              className="absolute inset-[3px] border-t border-l border-zinc-600 rounded-full animate-spin"
              style={{ animationDuration: "3s" }}
            />
          </span>
          <span className="hidden md:inline">DRAG TO ORBIT · CLICK HOTSPOT</span>
          <span className="md:hidden">TAP HOTSPOT</span>
        </div>
      )}
    </div>
  );
}
