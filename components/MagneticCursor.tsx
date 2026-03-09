"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function MagneticCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    document.documentElement.classList.add("has-custom-cursor");

    const mouse = { x: 0, y: 0 };
    const lerped = { x: 0, y: 0 };
    let isMagnetic = false;
    let magneticRect = { cx: 0, cy: 0, w: 0, h: 0 };
    let visible = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (!visible) {
        visible = true;
        gsap.to([outer, inner], { opacity: 1, duration: 0.3 });
      }

      // Magnetic detection via event delegation
      const target = e.target as HTMLElement;
      const mag = target.closest("[data-magnetic]") as HTMLElement | null;
      const is3D = document.body.classList.contains("hovering-3d");

      if (mag && !isMagnetic) {
        isMagnetic = true;
        const r = mag.getBoundingClientRect();
        magneticRect = {
          cx: r.left + r.width / 2,
          cy: r.top + r.height / 2,
          w: r.width,
          h: r.height,
        };
        gsap.to(outer, {
          width: r.width + 22,
          height: r.height + 22,
          borderRadius: 14,
          borderColor: "rgba(255,140,0,0.55)",
          backgroundColor: "rgba(255,140,0,0.06)",
          duration: 0.35,
          ease: "power3.out",
        });
      } else if (!mag && isMagnetic && !is3D) {
        resetOuter();
      }

      if (is3D && !isMagnetic) {
        gsap.to(outer, {
          width: 60,
          height: 60,
          borderColor: "rgba(255,140,0,0.55)",
          backgroundColor: "rgba(255,140,0,0.05)",
          duration: 0.3,
          overwrite: "auto",
        });
      } else if (!is3D && !isMagnetic && !mag) {
        resetOuter();
      }
    };

    function resetOuter() {
      isMagnetic = false;
      gsap.to(outer!, {
        width: 40,
        height: 40,
        borderRadius: "50%",
        borderColor: "rgba(255,140,0,0.3)",
        backgroundColor: "transparent",
        duration: 0.35,
        ease: "power3.out",
      });
    }

    const onLeave = () => {
      visible = false;
      gsap.to([outer, inner], { opacity: 0, duration: 0.3 });
    };

    const onDown = () => {
      gsap.to(outer, { scale: 0.85, duration: 0.15 });
      gsap.to(inner, { scale: 0.6, duration: 0.15 });
    };

    const onUp = () => {
      gsap.to(outer, { scale: 1, duration: 0.25, ease: "back.out(1.7)" });
      gsap.to(inner, { scale: 1, duration: 0.25, ease: "back.out(1.7)" });
    };

    const loop = () => {
      if (isMagnetic) {
        // Snap to element center
        lerped.x += (magneticRect.cx - lerped.x) * 0.15;
        lerped.y += (magneticRect.cy - lerped.y) * 0.15;
        gsap.set(outer, {
          x: lerped.x - (magneticRect.w + 22) / 2,
          y: lerped.y - (magneticRect.h + 22) / 2,
        });
      } else {
        lerped.x += (mouse.x - lerped.x) * 0.12;
        lerped.y += (mouse.y - lerped.y) * 0.12;
        const s = parseFloat(getComputedStyle(outer!).width) || 40;
        gsap.set(outer, { x: lerped.x - s / 2, y: lerped.y - s / 2 });
      }

      gsap.set(inner, { x: mouse.x - 4, y: mouse.y - 4 });
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={outerRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-[#FF8C00]/30 pointer-events-none z-[9999] opacity-0"
        style={{ willChange: "transform, width, height" }}
      />
      <div
        ref={innerRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#FF8C00] pointer-events-none z-[9999] opacity-0"
        style={{ willChange: "transform" }}
      />
    </>
  );
}
