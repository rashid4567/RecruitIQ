import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 5);

    scene.add(new THREE.AmbientLight(0xdbeafe, 0.5));

    const pl1 = new THREE.PointLight(0x3b82f6, 4, 22);
    pl1.position.set(4, 3, 3);
    scene.add(pl1);

    const pl2 = new THREE.PointLight(0x0ea5e9, 2.5, 18);
    pl2.position.set(-4, -2, 2);
    scene.add(pl2);

    const pl3 = new THREE.PointLight(0x6366f1, 1.5, 14);
    pl3.position.set(0, -5, 1);
    scene.add(pl3);

    const glassMat = (color: number, opacity = 0.2) =>
      new THREE.MeshPhysicalMaterial({
        color,
        transparent: true,
        opacity,
        roughness: 0.04,
        metalness: 0.08,
        transmission: 0.88,
        thickness: 1.4,
        side: THREE.DoubleSide,
      });

    const wireMat = (color: number) =>
      new THREE.MeshBasicMaterial({
        color,
        wireframe: true,
        transparent: true,
        opacity: 0.18,
      });

    type Shape = {
      mesh: THREE.Mesh;
      wire?: THREE.Mesh;
      rotSpeed: THREE.Vector3;
      floatSpeed: number;
      floatAmp: number;
      floatOffset: number;
      baseY: number;
    };

    const shapes: Shape[] = [];

    const addShape = (
      geo: THREE.BufferGeometry,
      pos: [number, number, number],
      color: number,
      opacity: number,
      wireColor: number | null,
      rot: [number, number, number],
      fSpeed: number,
      fAmp: number,
      fOffset: number,
    ) => {
      const mesh = new THREE.Mesh(geo, glassMat(color, opacity));
      mesh.position.set(...pos);
      scene.add(mesh);

      let wire: THREE.Mesh | undefined;
      if (wireColor !== null) {
        wire = new THREE.Mesh(geo, wireMat(wireColor));
        wire.position.set(...pos);
        scene.add(wire);
      }

      shapes.push({
        mesh,
        wire,
        rotSpeed: new THREE.Vector3(...rot),
        floatSpeed: fSpeed,
        floatAmp: fAmp,
        floatOffset: fOffset,
        baseY: pos[1],
      });
    };

    addShape(
      new THREE.IcosahedronGeometry(1.15, 1),
      [2.6, 0.3, 0],
      0x3b82f6,
      0.22,
      0x60a5fa,
      [0.003, 0.005, 0.002],
      0.8,
      0.18,
      0,
    );
    addShape(
      new THREE.OctahedronGeometry(0.72),
      [-2.9, 0.7, -0.4],
      0x0284c7,
      0.25,
      0x38bdf8,
      [0.006, 0.003, 0.005],
      1.1,
      0.22,
      1.2,
    );
    addShape(
      new THREE.TorusGeometry(0.58, 0.19, 16, 64),
      [-1.3, -2.3, 0.6],
      0x6366f1,
      0.28,
      null,
      [0.01, 0.005, 0.008],
      0.65,
      0.14,
      2.5,
    );
    addShape(
      new THREE.TetrahedronGeometry(0.48),
      [1.6, 2.4, -0.7],
      0x7dd3fc,
      0.3,
      0xbae6fd,
      [0.008, 0.012, 0.004],
      1.3,
      0.28,
      0.8,
    );
    addShape(
      new THREE.SphereGeometry(0.32, 32, 32),
      [-1.9, -1.5, 1.1],
      0x2563eb,
      0.35,
      null,
      [0.005, 0.007, 0.003],
      1.0,
      0.2,
      3.8,
    );
    addShape(
      new THREE.DodecahedronGeometry(0.52),
      [0.9, -2.7, -0.2],
      0x0369a1,
      0.2,
      0x38bdf8,
      [0.004, 0.009, 0.006],
      0.9,
      0.16,
      4.5,
    );
    addShape(
      new THREE.ConeGeometry(0.4, 0.75, 6),
      [-3.2, 2.1, 0.3],
      0x6366f1,
      0.22,
      0xa5b4fc,
      [0.007, 0.004, 0.009],
      1.2,
      0.2,
      2.1,
    );

    const pCount = 280;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 18;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 13;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 7 - 2;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        color: 0x60a5fa,
        size: 0.032,
        transparent: true,
        opacity: 0.5,
      }),
    );
    scene.add(particles);

    const lPositions: number[] = [];
    const sPos = shapes.map((s) => s.mesh.position.clone());
    for (let i = 0; i < sPos.length; i++) {
      for (let j = i + 1; j < sPos.length; j++) {
        lPositions.push(
          sPos[i].x,
          sPos[i].y,
          sPos[i].z,
          sPos[j].x,
          sPos[j].y,
          sPos[j].z,
        );
      }
    }
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(lPositions), 3),
    );
    scene.add(
      new THREE.LineSegments(
        lGeo,
        new THREE.LineBasicMaterial({
          color: 0x93c5fd,
          transparent: true,
          opacity: 0.08,
        }),
      ),
    );

    let mx = 0,
      my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      camera.position.x += (mx * 0.45 - camera.position.x) * 0.032;
      camera.position.y += (my * 0.32 - camera.position.y) * 0.032;
      camera.lookAt(0, 0, 0);

      shapes.forEach(
        ({
          mesh,
          wire,
          rotSpeed,
          floatSpeed,
          floatAmp,
          floatOffset,
          baseY,
        }) => {
          mesh.rotation.x += rotSpeed.x;
          mesh.rotation.y += rotSpeed.y;
          mesh.rotation.z += rotSpeed.z;
          mesh.position.y =
            baseY + Math.sin(t * floatSpeed + floatOffset) * floatAmp;
          if (wire) {
            wire.rotation.copy(mesh.rotation);
            wire.position.copy(mesh.position);
          }
        },
      );

      particles.rotation.y = t * 0.035;
      particles.rotation.x = t * 0.012;
      pl1.intensity = 4 + Math.sin(t * 1.4) * 1;
      pl2.intensity = 2.5 + Math.cos(t * 1.1) * 0.6;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-slate-50 via-blue-50/60 to-sky-50" />

      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div
          className={`max-w-sm w-full transition-all duration-1000 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div
            className="rounded-3xl px-9 py-11 text-center"
            style={{
              background: "rgba(255,255,255,0.58)",
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
              border: "1px solid rgba(186,230,253,0.6)",
              boxShadow:
                "0 8px 64px rgba(59,130,246,0.12), 0 2px 12px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            <div className="flex justify-center mb-6">
              <span
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-bold tracking-[0.15em] uppercase text-blue-600"
                style={{
                  background: "rgba(219,234,254,0.85)",
                  border: "1px solid rgba(147,197,253,0.55)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />
                404 · Page Not Found
              </span>
            </div>

            <div
              className="relative flex justify-center items-center mb-6 select-none"
              style={{ height: 108 }}
            >
              <span
                aria-hidden
                className="absolute font-black pointer-events-none leading-none"
                style={{
                  fontSize: 110,
                  background:
                    "linear-gradient(135deg, rgba(186,230,253,0.55) 0%, rgba(147,197,253,0.3) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-6px",
                  userSelect: "none",
                }}
              >
                404
              </span>

              <div
                className="relative z-10 w-20 h-20 rounded-2xl flex flex-col items-center justify-center gap-1"
                style={{
                  background: "rgba(255,255,255,0.92)",
                  border: "1px solid rgba(147,197,253,0.5)",
                  boxShadow:
                    "0 16px 48px rgba(59,130,246,0.18), inset 0 1px 0 rgba(255,255,255,1)",
                  animation: "floatIcon 3.5s ease-in-out infinite",
                }}
              >
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7.5"
                    stroke="#bae6fd"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="11"
                    cy="11"
                    r="7.5"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    strokeDasharray="3 4"
                  />
                  <circle
                    cx="11"
                    cy="11"
                    r="2"
                    fill="#dbeafe"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="16.5"
                    y1="16.5"
                    x2="21"
                    y2="21"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="11"
                    y1="3.5"
                    x2="11"
                    y2="6"
                    stroke="#93c5fd"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="11"
                    y1="16"
                    x2="11"
                    y2="18.5"
                    stroke="#93c5fd"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="3.5"
                    y1="11"
                    x2="6"
                    y2="11"
                    stroke="#93c5fd"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="16"
                    y1="11"
                    x2="18.5"
                    y2="11"
                    stroke="#93c5fd"
                    strokeWidth="1.5"
                  />
                </svg>
                <span className="text-[9px] font-bold tracking-widest uppercase text-blue-400">
                  Not Found
                </span>
              </div>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-tight mb-2">
              Page doesn't exist
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-60 mx-auto">
              The page you're looking for has been moved, deleted, or never
              existed.
            </p>

            <button
              onClick={handleBack}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white w-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:shadow-md"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                boxShadow: "0 4px 24px rgba(59,130,246,0.35)",
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>

            <div className="mt-8 flex items-center gap-3">
              <div
                className="flex-1 h-px"
                style={{ background: "rgba(186,230,253,0.6)" }}
              />
              <span
                className="text-[11px] font-semibold tracking-widest uppercase"
                style={{ color: "#93c5fd" }}
              >
                RecruitIQ
              </span>
              <div
                className="flex-1 h-px"
                style={{ background: "rgba(186,230,253,0.6)" }}
              />
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-slate-400">
            Lost?{" "}
            <a
              href="/support"
              className="text-blue-500 underline underline-offset-2 hover:text-blue-700 transition-colors"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes floatIcon {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33%       { transform: translateY(-7px) rotate(1.5deg); }
          66%       { transform: translateY(-3px) rotate(-1deg); }
        }
      `}</style>
    </div>
  );
}
