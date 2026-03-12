# Project Context: Airbag Expert Serbia (MVP)

## Tech Stack
- **Framework:** Next.js 15+ (App Router, React Compiler ENABLED)
- **Styling:** Tailwind CSS (Dark/Industrial Theme)
- **3D Engine:** React Three Fiber (R3F) + @react-three/drei
- **Animations:** GSAP 3.x (with ScrollTrigger & Lenis for smooth scroll)
- **Database:** Supabase (planned)
- **Icons:** Lucide-react

## Design Language (Slick Industrial)
- **Primary Background:** `#0D0D0D` (Deep Charcoal)
- **Accents:** `#FF8C00` (Safety Orange), `#FACC15` (Warning Yellow)
- **Typography:** Sans-serif for UI, Monospace for technical data (OEM numbers, specs)
- **Aesthetic:** High-contrast, borders like industrial labels, blueprint-style 3D wireframes, and smooth, deliberate GSAP transitions.

## Business Context
- **Product:** Car Airbags (steering wheel, dashboard, curtains, knee, seatbelts).
- **Target Market:** Serbia (Focus on VW, Audi, Škoda).
- **Key Feature:** Visual identification of parts via 3D interactive model to reduce return rates.

## Development Rules & Best Practices
- **Components:** Use `'use client'` strictly for R3F and GSAP components.
- **GSAP:** Use `useGSAP()` hook for lifecycle management. Always clean up animations.
- **3D Models:** Use `Box`, `Sphere`, and `Cylinder` primitives for the MVP to avoid external asset loading issues unless a specific GLTF is provided.
- **SEO:** Every product must have a slug-based URL structure (`/airbag/[brand]/[model]/[oem]`).
- **Safety:** Always include a disclaimer that airbags are pyrotechnic devices and require professional installation.

## Specific Task for Codex Opus 4.6
When generating the Landing Page:
1. Create a responsive layout where 3D Canvas is prominent.
2. Implement "Hotspots" on the 3D model that trigger GSAP side-drawers with part details.
3. Ensure the code is production-ready, typed with TypeScript, and optimized for the React Compiler.