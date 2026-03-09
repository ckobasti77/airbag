"use client";

import dynamic from "next/dynamic";

const AirbagScene = dynamic(() => import("@/components/AirbagScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#0D0D0D] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-[#FF8C00]/30 border-t-[#FF8C00] rounded-full animate-spin" />
        <span className="font-mono text-xs text-zinc-600 tracking-wider">
          LOADING 3D
        </span>
      </div>
    </div>
  ),
});

export default function HeroCanvas() {
  return <AirbagScene />;
}
