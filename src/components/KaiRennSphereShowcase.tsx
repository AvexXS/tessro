"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { 
  Sparkles, 
  ExternalLink, 
  X, 
  Play, 
  Pause, 
  Maximize2, 
  Layers, 
  RotateCcw,
  Compass,
  ArrowRight
} from "lucide-react";

export interface ProjectItem {
  id: number;
  path: string;
  title: string;
  category: string;
  year: string;
  description: string;
  url: string;
}

export const SHOWCASE_MEDIA: ProjectItem[] = [
  { id: 1, path: "aaaf/glaze-motion", title: "Glaze", category: "Motion", year: "2026", description: "A three-part product story where glazed ceramics spin, drip and settle as you scroll.", url: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/aaaf/glaze-motion.mp4" },
  { id: 2, path: "a/obsisidianArea", title: "Obsidian", category: "Interactive", year: "2026", description: "An editorial hero where a winged figure breaks through the oversized wordmark.", url: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/a/obsisidianArea.mp4" },
  { id: 3, path: "aaaf/try-the-look-hero", title: "Try The Look", category: "Ecommerce", year: "2026", description: "Outfits swap on a live model the moment you hover a garment.", url: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/aaaf/try-the-look-hero.mp4" },
  { id: 4, path: "aaaf/loops-virtual-store", title: "Loops Store", category: "Ecommerce", year: "2026", description: "A virtual store you walk through room by room, with products on the shelves.", url: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/aaaf/loops-virtual-store.mp4" },
  { id: 5, path: "aaaf/vell-lookbook", title: "Runway Lookbook", category: "Interactive", year: "2026", description: "Looks walk down a runway and stop wherever your cursor lands.", url: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/aaaf/vell-lookbook.mp4" },
  { id: 6, path: "uploaded/jackportofplio", title: "3D Portfolio", category: "Portfolio", year: "2025", description: "A character-led portfolio hero with a big expressive 3D lead.", url: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/uploaded/jackportofplio.mp4" },
  { id: 7, path: "aaaf/virtualfit-arc-hero", title: "Virtual Fitting", category: "Ecommerce", year: "2026", description: "Garments arc around a mannequin and snap on when you pick one.", url: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/aaaf/virtualfit-arc-hero.mp4" },
  { id: 8, path: "aaaf/vasari-vhs-hero", title: "Shelf Hero", category: "Portfolio", year: "2026", description: "Work stored as VHS tapes on a shelf. Pull one out to play the case.", url: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/aaaf/vasari-vhs-hero.mp4" },
  { id: 9, path: "aaaf/orvante-agency", title: "Orvante Agency", category: "Agency", year: "2026", description: "A monochrome agency landing page with campaign stills and a tight grid.", url: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/aaaf/orvante-agency.mp4" },
  { id: 10, path: "designs/orbit-spher-hero-interactive", title: "Orbit Sphere", category: "Interactive", year: "2026", description: "Cards orbit a glowing core. Drag to spin it, tap a card to bring it forward.", url: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/designs/orbit-spher-hero-interactive.mp4" },
  { id: 11, path: "aaaf/reelmark-hero-interaction", title: "Reelmark", category: "Creator Platform", year: "2026", description: "A creator platform hero with a reel strip that scrubs as you move.", url: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/aaaf/reelmark-hero-interaction.mp4" },
  { id: 12, path: "aaaf/lena-varga-hero", title: "Lena Varga", category: "3D Portfolio", year: "2026", description: "A playful 3D sculptor portfolio led by a clay-soft mascot.", url: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/aaaf/lena-varga-hero.mp4" },
  { id: 13, path: "designs/ink-reveal-hover", title: "Ink Reveal", category: "Hover", year: "2026", description: "Ink blooms through the wordmark wherever the cursor passes.", url: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/designs/ink-reveal-hover.mp4" },
  { id: 14, path: "aaaf/living-portrait-hero", title: "Living Portrait", category: "Portfolio", year: "2026", description: "A portrait that blinks, breathes and follows your cursor with its eyes.", url: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/aaaf/living-portrait-hero.mp4" },
  { id: 15, path: "aaaf/lumen-roof-hero", title: "Solar Fog", category: "Interactive", year: "2026", description: "A house at dusk that switches between day and night as you toggle.", url: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/aaaf/lumen-roof-hero.mp4" },
  { id: 16, path: "aaaf/axon-hero", title: "AXON", category: "Portfolio", year: "2026", description: "A point-cloud bust drifting in a field of particles.", url: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/aaaf/axon-hero.mp4" },
  { id: 17, path: "aaaf/clothing-rail-hero", title: "Clothing Rail", category: "Ecommerce", year: "2026", description: "Garments slide along a rail. Grab one to pull it into view.", url: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/aaaf/clothing-rail-hero.mp4" },
  { id: 18, path: "aaaf/facet-glass-hero", title: "Facet Glass", category: "3D", year: "2026", description: "Faceted glass panels catch the light as the page scrolls.", url: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/aaaf/facet-glass-hero.mp4" },
  { id: 19, path: "aaaf/nomi-hero", title: "Nomi Agent", category: "AI", year: "2026", description: "A scan-lined kitten mascot introduces an inbox agent.", url: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/aaaf/nomi-hero.mp4" },
  { id: 20, path: "aaaf/stellarmind-hero", title: "Stellarmind", category: "AI", year: "2026", description: "A starfield hero for an AI research lab with a slow camera drift.", url: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/aaaf/stellarmind-hero.mp4" },
  { id: 21, path: "aaaf/vhs-arc-hero", title: "VHS Archive", category: "Portfolio", year: "2026", description: "Tapes fan out in an arc, each holding one project.", url: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/aaaf/vhs-arc-hero.mp4" },
  { id: 22, path: "designs/saffron-3d-webgl-landing", title: "Saffron Field", category: "Interactive", year: "2026", description: "Golden particles bloom into words as you move across the field.", url: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/designs/saffron-3d-webgl-landing.mp4" },
  { id: 23, path: "designs/roadster-3d-car-landing", title: "Roadster 3D", category: "3D", year: "2026", description: "A roadster turntable with paint and wheel swaps in real time.", url: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/designs/roadster-3d-car-landing.mp4" },
  { id: 24, path: "aaaf/kinestra-card-story-v2", title: "Card Story", category: "Interactive", year: "2026", description: "A story told through stacked cards that flip as you scroll.", url: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/aaaf/kinestra-card-story-v2.mp4" },
];

export default function KaiRennSphereShowcase() {
  const [activeTab, setActiveTab] = useState<"gallery" | "projects" | "about">("gallery");
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Gallery Sphere State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredProject, setHoveredProject] = useState<ProjectItem | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorBadge, setCursorBadge] = useState<string | null>(null);
  
  // Projects Grid State (Lightbox)
  const [lightboxProject, setLightboxProject] = useState<ProjectItem | null>(null);
  const [hoveredGridTile, setHoveredGridTile] = useState<number | null>(null);

  // About Track & Bot State
  const aboutContainerRef = useRef<HTMLDivElement | null>(null);
  const [aboutScrollOffset, setAboutScrollOffset] = useState(0);

  // Refs for Sphere Animation Loop
  const sphereSceneRef = useRef<{
    renderer?: THREE.WebGLRenderer;
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    group?: THREE.Group;
    planes: {
      mesh: THREE.Mesh;
      basePos: THREE.Vector3;
      video: HTMLVideoElement;
      item: ProjectItem;
    }[];
    animId?: number;
    velocity: { x: number; y: number };
    targetRot: { x: number; y: number };
    currentRot: { x: number; y: number };
    isDragging: boolean;
    hasInteracted: boolean;
    dragStart: { x: number; y: number };
    pointerTotalDist: number;
    expandProgress: { value: number };
    zoomIndex: number | null;
  }>({
    planes: [],
    velocity: { x: 0, y: 0 },
    targetRot: { x: 0, y: 0 },
    currentRot: { x: 0, y: 0 },
    isDragging: false,
    hasInteracted: false,
    dragStart: { x: 0, y: 0 },
    pointerTotalDist: 0,
    expandProgress: { value: 0 },
    zoomIndex: null,
  });

  // -------------------------------------------------------------
  // INITIALIZE THREE.JS FIBONACCI VIDEO SPHERE
  // -------------------------------------------------------------
  useEffect(() => {
    if (activeTab !== "gallery") return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 750;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0c0c0d, 1);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 0, 12);
    camera.lookAt(0, 0, 0);

    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    // Conversion factor from pixels to world units at z = 0 (camera at z=12, fov=60)
    // visibleHeight = 2 * 12 * tan(30 deg) = 24 * 0.57735 = 13.8564
    const visibleWorldHeight = 2 * 12 * Math.tan((camera.fov * Math.PI) / 360);
    const pxToWorld = (px: number) => (px * visibleWorldHeight) / height;

    // Dimensions
    const isMobile = width <= 640;
    const isTablet = width > 640 && width <= 1024;
    const baseRadiusPx = isMobile ? Math.min(width / 2 - 24, 210) : isTablet ? 230 : 280;
    const radiusWorld = pxToWorld(baseRadiusPx);

    const planeSizePx = isMobile ? 86 : isTablet ? 110 : 130;
    const planeWWorld = pxToWorld(planeSizePx);
    const planeHWorld = planeWWorld * (9 / 16); // 16:9 aspect ratio

    // 20 planes on Fibonacci sphere
    const N = 20;
    const planesData = sphereSceneRef.current.planes;
    planesData.length = 0;

    const planeGeo = new THREE.PlaneGeometry(planeWWorld, planeHWorld);

    for (let i = 0; i < N; i++) {
      const item = SHOWCASE_MEDIA[i];
      // Fibonacci sphere math
      const y = (i * (2 / N) - 1 + 1 / N);
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const angle = Math.PI * (3 - Math.sqrt(5)) * i;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;

      const basePos = new THREE.Vector3(x * radiusWorld, y * radiusWorld, z * radiusWorld);

      // Create video element with exact CORS & inline parameters
      const video = document.createElement("video");
      video.crossOrigin = "anonymous";
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      video.preload = "metadata";
      video.src = item.url;
      // Start muted playback (allowed by modern browsers)
      video.play().catch(() => {});

      const texture = new THREE.VideoTexture(video);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;

      const mat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        color: 0x1b1b1d, // placeholder until frame lands
      });

      // Update color to white once video has loaded data
      video.addEventListener("loadeddata", () => {
        mat.color.setHex(0xffffff);
      });

      const mesh = new THREE.Mesh(planeGeo, mat);
      mesh.position.copy(basePos);
      mesh.userData = { id: item.id, index: i, item };

      sphereGroup.add(mesh);
      planesData.push({ mesh, basePos, video, item });
    }

    sphereSceneRef.current.renderer = renderer;
    sphereSceneRef.current.scene = scene;
    sphereSceneRef.current.camera = camera;
    sphereSceneRef.current.group = sphereGroup;

    // Raycaster for hover & click
    const raycaster = new THREE.Raycaster();
    const mouseNdc = new THREE.Vector2(-999, -999);

    // Initial entrance tween
    sphereGroup.scale.set(0.2, 0.2, 0.2);
    gsap.to(sphereGroup.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1.2,
      ease: "power3.out",
    });

    // ---------------------------------------------------------
    // RENDER LOOP
    // ---------------------------------------------------------
    let lastTime = performance.now();
    let frameCounter = 0;

    const animate = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      frameCounter++;

      const state = sphereSceneRef.current;

      // Handle spin & inertia
      if (!state.isDragging && !state.hasInteracted && state.zoomIndex === null) {
        // Idle auto-spin 0.001 rad/frame tilted at 23 deg
        state.velocity.x = 0.0012 * Math.cos((23 * Math.PI) / 180);
        state.velocity.y = 0.0006 * Math.sin((23 * Math.PI) / 180);
      }

      // Smooth inertia
      state.velocity.x *= 0.94;
      state.velocity.y *= 0.94;

      if (state.zoomIndex === null) {
        // Apply yaw around world Y and pitch around world X
        const qYaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), state.velocity.x);
        const qPitch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), state.velocity.y);
        sphereGroup.quaternion.premultiply(qPitch).premultiply(qYaw);
      }

      // Exact prompt rule:
      // "Every plane always faces the camera: its quaternion is the inverse of the sphere group's quaternion."
      const invGroupQuat = sphereGroup.quaternion.clone().invert();

      // Expand calculation
      const isZoomed = state.zoomIndex !== null;
      const zoomIdx = state.zoomIndex;
      const expandProgress = state.expandProgress.value;

      planesData.forEach((p, idx) => {
        if (isZoomed && idx === zoomIdx) {
          // Zoomed plane faces camera and interpolates to center
          p.mesh.quaternion.copy(invGroupQuat);
          
          // Center target: (0, 0, 4) in front of sphere
          const worldCenterInGroup = new THREE.Vector3(0, overviewOpen ? 1.4 : 0, 3.5).applyQuaternion(invGroupQuat);
          p.mesh.position.lerpVectors(p.basePos, worldCenterInGroup, expandProgress);
          
          // Target scale: 70% visible height
          const targetH = visibleWorldHeight * 0.7;
          const targetScale = targetH / planeHWorld;
          const currentScale = THREE.MathUtils.lerp(1, targetScale, expandProgress);
          p.mesh.scale.set(currentScale, currentScale, currentScale);
          (p.mesh.material as THREE.MeshBasicMaterial).opacity = 1;
        } else if (isZoomed) {
          // Other planes pushed outward x1.8 and faded to 0.1 opacity
          p.mesh.quaternion.copy(invGroupQuat);
          const pushedPos = p.basePos.clone().multiplyScalar(1.8);
          p.mesh.position.lerpVectors(p.basePos, pushedPos, expandProgress);
          p.mesh.scale.set(1, 1, 1);
          (p.mesh.material as THREE.MeshBasicMaterial).opacity = THREE.MathUtils.lerp(1, 0.12, expandProgress);
        } else {
          // Normal state
          p.mesh.quaternion.copy(invGroupQuat);
          p.mesh.position.copy(p.basePos);
          p.mesh.scale.set(1, 1, 1);
          (p.mesh.material as THREE.MeshBasicMaterial).opacity = 1;
        }

        // Distance Culling:
        // "Every 300ms, videos on the far hemisphere are paused (when the plane's direction faces away:
        // z/length below -0.25; resumes above -0.1) so only around ten decode at once."
        if (frameCounter % 18 === 0) {
          if (isZoomed) {
            if (idx === zoomIdx) {
              if (p.video.paused) p.video.play().catch(() => {});
            } else {
              if (!p.video.paused) p.video.pause();
            }
          } else {
            const worldPos = p.mesh.getWorldPosition(new THREE.Vector3());
            const zRatio = worldPos.z / radiusWorld;
            if (zRatio < -0.25) {
              if (!p.video.paused) p.video.pause();
            } else if (zRatio > -0.1) {
              if (p.video.paused) p.video.play().catch(() => {});
            }
          }
        }
      });

      // Hover Raycast
      if (!state.isDragging && !isZoomed && Math.abs(mouseNdc.x) <= 1 && Math.abs(mouseNdc.y) <= 1) {
        raycaster.setFromCamera(mouseNdc, camera);
        const intersects = raycaster.intersectObjects(planesData.map((d) => d.mesh));
        if (intersects.length > 0) {
          const hit = intersects[0].object as THREE.Mesh;
          const found = planesData.find((d) => d.mesh === hit);
          if (found && (!hoveredProject || hoveredProject.id !== found.item.id)) {
            setHoveredProject(found.item);
          }
        } else {
          if (hoveredProject) setHoveredProject(null);
        }
      }

      renderer.render(scene, camera);
      state.animId = requestAnimationFrame(animate);
    };

    sphereSceneRef.current.animId = requestAnimationFrame(animate);

    // ---------------------------------------------------------
    // POINTER & TOUCH EVENT HANDLERS
    // ---------------------------------------------------------
    const onPointerDown = (e: PointerEvent) => {
      const state = sphereSceneRef.current;
      state.isDragging = true;
      state.hasInteracted = true;
      state.dragStart = { x: e.clientX, y: e.clientY };
      state.pointerTotalDist = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseNdc.set(x, y);

      setCursorPos({ x: e.clientX, y: e.clientY });

      const state = sphereSceneRef.current;
      if (state.isDragging) {
        const dx = e.clientX - state.dragStart.x;
        const dy = e.clientY - state.dragStart.y;
        state.velocity.x += dx * 0.0008;
        state.velocity.y += dy * 0.0008;
        state.pointerTotalDist += Math.sqrt(dx * dx + dy * dy);
        state.dragStart = { x: e.clientX, y: e.clientY };
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      const state = sphereSceneRef.current;
      const wasClick = state.pointerTotalDist < 8;
      state.isDragging = false;

      if (wasClick) {
        const rect = canvas.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
        const intersects = raycaster.intersectObjects(planesData.map((d) => d.mesh));

        if (intersects.length > 0) {
          const hit = intersects[0].object as THREE.Mesh;
          const hitIdx = planesData.findIndex((d) => d.mesh === hit);
          if (hitIdx !== -1) {
            handlePlaneClick(hitIdx);
          }
        } else if (state.zoomIndex !== null) {
          // Click outside zoomed plane collapses it
          collapseZoom();
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const state = sphereSceneRef.current;
      state.hasInteracted = true;
      state.velocity.x += e.deltaX * 0.0002;
      state.velocity.y += e.deltaY * 0.0002;
    };

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 750;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      if (sphereSceneRef.current.animId) {
        cancelAnimationFrame(sphereSceneRef.current.animId);
      }
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      planesData.forEach((p) => {
        p.video.pause();
        p.video.src = "";
        p.mesh.geometry.dispose();
        (p.mesh.material as THREE.Material).dispose();
      });
    };
  }, [activeTab]);

  // Expand / Zoom Handlers
  const handlePlaneClick = (planeIndex: number) => {
    const state = sphereSceneRef.current;
    if (state.zoomIndex === null) {
      // First click: Expand plane to center 70% visible height
      state.zoomIndex = planeIndex;
      const item = SHOWCASE_MEDIA[planeIndex];
      setSelectedProject(item);
      setCursorBadge("Overview");

      gsap.to(state.expandProgress, {
        value: 1,
        duration: 0.8,
        ease: "power4.out",
      });
    } else if (state.zoomIndex === planeIndex) {
      // Second click on same plane: Toggle overview panel drawer
      if (!overviewOpen) {
        setOverviewOpen(true);
        setCursorBadge("Close");
      } else {
        setOverviewOpen(false);
        setCursorBadge("Overview");
      }
    } else {
      // Click on a different plane: switch zoom to it
      state.zoomIndex = planeIndex;
      setSelectedProject(SHOWCASE_MEDIA[planeIndex]);
      setOverviewOpen(false);
      setCursorBadge("Overview");
    }
  };

  const collapseZoom = () => {
    const state = sphereSceneRef.current;
    if (state.zoomIndex !== null) {
      setOverviewOpen(false);
      setCursorBadge(null);
      gsap.to(state.expandProgress, {
        value: 0,
        duration: 0.7,
        ease: "power3.inOut",
        onComplete: () => {
          state.zoomIndex = null;
          setSelectedProject(null);
        },
      });
    }
  };

  // Keyboard shortcut Esc collapses zoom or lightbox
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        collapseZoom();
        setLightboxProject(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="relative w-full bg-[#0c0c0d] text-[#ededeb] overflow-hidden select-none font-sans min-h-[850px] flex flex-col justify-between rounded-3xl border border-white/10 shadow-2xl">
      
      {/* ------------------------------------------------------------- */}
      {/* HEADER / BRAND BADGE */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute top-6 left-6 right-6 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/10 text-xs font-mono tracking-widest uppercase flex items-center gap-2 pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-white font-medium">TESSRO / ADELINE</span>
            <span className="text-zinc-500">·</span>
            <span className="text-zinc-400">KR.ST ARCHIVE</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-zinc-400 pointer-events-auto">
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
            {activeTab === "gallery" ? "20 3D PLANES ACTIVE" : activeTab === "projects" ? "24 CLIENT SITES" : "MAGNETIC OS"}
          </span>
          <span className="text-zinc-500">60 FPS WEBGL</span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* VIEW 1: 3D FIBONACCI SPHERE GALLERY */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "gallery" && (
        <div 
          ref={containerRef}
          className="relative w-full h-[760px] sm:h-[820px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          <canvas ref={canvasRef} className="w-full h-full block" />

          {/* Floating Hover Caption (Center Bottom) */}
          {hoveredProject && !selectedProject && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full bg-black/80 backdrop-blur-xl border border-white/15 text-center pointer-events-none transition-all duration-300 shadow-2xl z-20 flex items-center gap-3">
              <span className="text-xs font-medium tracking-wide text-white uppercase font-mono">
                {hoveredProject.title}
              </span>
              <span className="text-xs italic text-zinc-400 font-serif">
                {hoveredProject.category} · {hoveredProject.year}
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                Click To Zoom
              </span>
            </div>
          )}

          {/* Drag To Explore Hint (Visible when idle) */}
          {!hoveredProject && !selectedProject && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none text-center z-10">
              <p className="text-[11px] font-mono tracking-[0.24em] text-zinc-500 uppercase">
                Drag to explore sphere · Scroll or pinch to tilt
              </p>
            </div>
          )}

          {/* Custom Cursor Follower when Zoomed */}
          {selectedProject && cursorBadge && (
            <div 
              className="hidden md:flex fixed pointer-events-none z-50 items-center justify-center px-3 py-1 rounded bg-[#ededeb] text-[#0c0c0d] text-xs font-semibold shadow-2xl transition-transform duration-75"
              style={{
                left: `${cursorPos.x + 16}px`,
                top: `${cursorPos.y + 16}px`,
              }}
            >
              {cursorBadge}
            </div>
          )}

          {/* Overview Panel (Bottom Sheet Drawer on secondary click) */}
          {selectedProject && overviewOpen && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[92%] max-w-[620px] p-6 rounded-2xl bg-[#161618]/90 backdrop-blur-2xl border border-white/10 shadow-2xl z-40 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-xl font-medium text-white flex items-center gap-2">
                    {selectedProject.title}
                    <span className="text-sm font-serif italic text-zinc-400 font-normal">
                      ({selectedProject.category}, {selectedProject.year})
                    </span>
                  </h3>
                </div>
                <button
                  onClick={() => setOverviewOpen(false)}
                  className="p-1.5 rounded-full bg-white/10 text-zinc-400 hover:text-white hover:bg-white/20 transition"
                  title="Close overview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-zinc-300 font-serif text-base sm:text-lg leading-relaxed mb-5">
                {selectedProject.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  {["Preview Video", "MotionSites", "Live WebGL"].map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-[#1c1c1e] text-[11px] font-mono text-zinc-400 border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={collapseZoom}
                    className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono text-zinc-300 transition"
                  >
                    Back to Sphere
                  </button>
                  <a
                    href={selectedProject.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-zinc-200 transition"
                  >
                    Inspect Stream <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Quick Collapse Button when Zoomed */}
          {selectedProject && !overviewOpen && (
            <button
              onClick={collapseZoom}
              className="absolute top-20 right-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/15 text-xs font-mono text-white flex items-center gap-2 hover:bg-white/20 transition z-30"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Return to Sphere
            </button>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW 2: PROJECTS INDEX GRID (24 SITES) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "projects" && (
        <div className="relative w-full min-h-[780px] p-6 sm:p-10 pt-20 overflow-y-auto max-h-[820px] custom-scrollbar">
          <div className="max-w-[1200px] mx-auto">
            {/* Curated Selection Header */}
            <div className="text-center mb-12">
              <p className="text-xs font-mono tracking-widest uppercase text-cyan-400 mb-2">
                INDEX 2019—2026
              </p>
              <h2 className="text-2xl sm:text-4xl text-white font-light">
                <span className="font-sans font-medium">A Curated Selection of </span>
                <span className="font-serif italic text-zinc-300">Motion and Interactive Sites</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-3">
                All 24 flagship projects rendered in native 16:9 WebGL viewport
              </p>
            </div>

            {/* Grid 3-col on desktop, 2 on tablet, 1 on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-20">
              {SHOWCASE_MEDIA.map((item, idx) => (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredGridTile(item.id)}
                  onMouseLeave={() => setHoveredGridTile(null)}
                  onClick={() => setLightboxProject(item)}
                  className="group relative rounded-2xl overflow-hidden bg-[#161618] border border-white/10 cursor-pointer transition-all duration-300 hover:border-white/30 hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
                >
                  {/* Video Tile (Native 16:9) */}
                  <div className="relative w-full aspect-video bg-black/60 overflow-hidden">
                    <video
                      src={item.url}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      crossOrigin="anonymous"
                      autoPlay={hoveredGridTile === item.id}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      ref={(el) => {
                        if (el) {
                          if (hoveredGridTile === item.id) {
                            el.play().catch(() => {});
                          } else {
                            el.pause();
                            el.currentTime = 0;
                          }
                        }
                      }}
                    />

                    {/* Glass Frosted Chip (Top Left) */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-md border border-white/15 text-[10px] font-mono text-zinc-300 flex items-center gap-1.5">
                      <span className="text-zinc-500">{(idx + 1).toString().padStart(2, "0")}</span>
                      <span className="font-medium text-white">{item.category}</span>
                    </div>

                    {/* View Bubble Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/90 text-black flex items-center justify-center font-serif italic text-sm font-semibold shadow-xl scale-75 group-hover:scale-100 transition-transform duration-300">
                        View
                      </div>
                    </div>
                  </div>

                  {/* Tile Metadata */}
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-white group-hover:text-cyan-400 transition">
                        {item.title}
                      </h4>
                      <p className="text-xs font-serif italic text-zinc-400 mt-0.5">
                        {item.category}, {item.year}
                      </p>
                    </div>
                    <Maximize2 className="w-4 h-4 text-zinc-500 group-hover:text-white transition" />
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="text-center pb-12 border-t border-white/10 pt-8 text-xs font-serif italic text-zinc-500">
              Kai Renn × Tessro Adeline — Index 2019–2026 · All Rights Reserved
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW 3: STUDIO & ABOUT (CHROME BOT + MAGNETIC TEXT TRACK) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "about" && (
        <div 
          ref={aboutContainerRef}
          onWheel={(e) => {
            setAboutScrollOffset((prev) => prev + e.deltaY * 0.8);
          }}
          className="relative w-full h-[760px] sm:h-[820px] flex flex-col items-center justify-center px-6 overflow-hidden"
        >
          {/* Centered Serif Headline */}
          <div className="relative z-10 text-center max-w-3xl mb-8 animate-in fade-in duration-700">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-light leading-tight text-white tracking-tight">
              Shaping quiet systems into <br />
              <span className="italic text-zinc-300">restless, precise and wildly kinetic</span> <br />
              Motion™ that people remember.
            </h1>
            <p className="mt-6 text-sm font-mono text-zinc-400 tracking-wider">
              Currently powered by <span className="text-cyan-400 underline decoration-cyan-500/50">Tessro & Adeline Autonomous Architecture</span>
            </p>
          </div>

          {/* Interactive Chrome Robot Head Simulation */}
          <div className="relative z-20 my-4 flex items-center justify-center">
            <div className="relative w-44 h-44 rounded-full bg-gradient-to-tr from-zinc-800 via-zinc-400 to-white p-1 shadow-[0_0_80px_rgba(56,189,248,0.25)] flex items-center justify-center group cursor-pointer animate-bounce duration-1000">
              <div className="w-full h-full rounded-full bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center relative overflow-hidden">
                {/* Metallic Chrome Specular Light Reflection */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(255,255,255,0.4),transparent_60%)]" />
                
                {/* Robot Visor */}
                <div className="w-28 h-12 rounded-full bg-[#040405] border border-white/20 flex items-center justify-center gap-6 shadow-inner relative z-10">
                  {/* Glowing Eyes */}
                  <span className="w-3.5 h-3.5 rounded-full bg-[#f2f2ee] shadow-[0_0_12px_#38bdf8] animate-pulse" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#f2f2ee] shadow-[0_0_12px_#38bdf8] animate-pulse" />
                </div>

                <div className="mt-3 text-[10px] font-mono tracking-widest text-cyan-400 uppercase relative z-10">
                  Adeline Core
                </div>
              </div>
            </div>
          </div>

          {/* Magnetic Horizontal Infinite Text Track */}
          <div className="relative z-10 w-full max-w-4xl overflow-hidden py-4 border-y border-white/10 mt-4">
            <div 
              className="flex items-center gap-12 whitespace-nowrap transition-transform duration-75 text-sm sm:text-base font-serif text-zinc-400"
              style={{
                transform: `translateX(${-((aboutScrollOffset * 0.5) % 1200)}px)`,
              }}
            >
              <span className="text-white font-mono uppercase text-xs tracking-widest">Part One · Craft</span>
              <span>“Loud is easy. Calm takes work.”</span>
              <span className="text-cyan-400 font-mono text-xs">06 Sites of the Day</span>
              <span>“Break something on purpose, then keep the best part.”</span>
              <span className="text-white font-mono uppercase text-xs tracking-widest">Part Two · Rhythm</span>
              <span>Interfaces are music you can touch. Timing decides how a page feels.</span>
              <span className="text-cyan-400 font-mono text-xs">14 Years In Motion</span>
            </div>
          </div>

          <p className="mt-4 text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
            Scroll mouse wheel to glide track · Hover core to pulse
          </p>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW 2 LIGHTBOX MODAL */}
      {/* ------------------------------------------------------------- */}
      {lightboxProject && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300"
          onClick={() => setLightboxProject(null)}
        >
          <div 
            className="relative w-full max-w-[1000px] bg-[#161618] rounded-2xl border border-white/15 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Video Player */}
            <div className="relative w-full aspect-video bg-black">
              <video
                src={lightboxProject.url}
                autoPlay
                controls
                loop
                playsInline
                crossOrigin="anonymous"
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setLightboxProject(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition border border-white/20"
                title="Close lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lightbox Details */}
            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-medium text-white flex items-center gap-2">
                  {lightboxProject.title}
                  <span className="text-sm font-serif italic text-zinc-400 font-normal">
                    · {lightboxProject.category} ({lightboxProject.year})
                  </span>
                </h3>
                <p className="text-sm font-serif text-zinc-300 mt-1 max-w-xl">
                  {lightboxProject.description}
                </p>
              </div>

              <a
                href={lightboxProject.url}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-full bg-cyan-400 text-black font-semibold text-xs tracking-wider uppercase hover:bg-cyan-300 transition flex items-center gap-2 whitespace-nowrap"
              >
                Full Resolution <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* FLOATING FROSTED DOCK NAVBAR (SHARED) */}
      {/* ------------------------------------------------------------- */}
      <div className="sticky bottom-6 left-0 right-0 z-40 mx-auto w-max max-w-[95%]">
        <div className="p-1.5 rounded-2xl bg-[#1c1c1e]/75 backdrop-blur-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.55)] flex items-center gap-1.5">
          {/* Wordmark */}
          <button
            onClick={() => setActiveTab("gallery")}
            className="px-3 py-1.5 text-xs font-mono font-semibold tracking-wider text-white hover:text-cyan-400 transition"
          >
            KR.ST
          </button>

          <span className="w-px h-4 bg-white/15 mx-1" />

          {/* Tab 1: Gallery */}
          <button
            onClick={() => {
              setActiveTab("gallery");
              collapseZoom();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all duration-300 ${
              activeTab === "gallery"
                ? "bg-white/15 text-white font-medium"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="font-serif italic text-sm">Gallery</span>
            <sup className="text-[10px] font-mono text-zinc-400">1</sup>
          </button>

          {/* Tab 2: Projects Grid */}
          <button
            onClick={() => {
              setActiveTab("projects");
              collapseZoom();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all duration-300 ${
              activeTab === "projects"
                ? "bg-white/15 text-white font-medium"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="font-serif italic text-sm">Projects</span>
            <sup className="text-[10px] font-mono text-zinc-400">2</sup>
          </button>

          {/* Tab 3: About / Studio */}
          <button
            onClick={() => {
              setActiveTab("about");
              collapseZoom();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all duration-300 ${
              activeTab === "about"
                ? "bg-white/15 text-white font-medium"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="font-serif italic text-sm">About</span>
            <sup className="text-[10px] font-mono text-zinc-400">3</sup>
          </button>

          <span className="w-px h-4 bg-white/15 mx-1" />

          {/* Menu Dot Button */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition"
              title="Menu"
            >
              <span className={`w-2 h-2 rounded-full bg-white transition-transform duration-300 ${menuOpen ? "scale-150 bg-cyan-400" : ""}`} />
            </button>

            {/* Menu Drawer Popup (Opens Upward) */}
            {menuOpen && (
              <div className="absolute bottom-12 right-0 w-56 p-4 rounded-xl bg-[#161618]/95 backdrop-blur-2xl border border-white/15 shadow-2xl z-50 text-xs font-mono flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <p className="text-[11px] text-zinc-400 font-sans leading-snug">
                  Available for select digital and motion projects from January.
                </p>
                <div className="border-t border-white/10 pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setActiveTab("about");
                      setMenuOpen(false);
                    }}
                    className="flex items-center justify-between text-left py-1 text-white hover:text-cyan-400"
                  >
                    <span className="font-serif italic text-sm">Studio</span>
                    <span className="text-zinc-500">03</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("projects");
                      setMenuOpen(false);
                    }}
                    className="flex items-center justify-between text-left py-1 text-white hover:text-cyan-400"
                  >
                    <span className="font-serif italic text-sm">Index</span>
                    <span className="text-zinc-500">02</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("gallery");
                      setMenuOpen(false);
                    }}
                    className="flex items-center justify-between text-left py-1 text-white hover:text-cyan-400"
                  >
                    <span className="font-serif italic text-sm">Sphere</span>
                    <span className="text-zinc-500">01</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
