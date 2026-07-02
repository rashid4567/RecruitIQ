import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';

export default function ServerErrorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  useLayoutEffect(() => {
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

    scene.add(new THREE.AmbientLight(0xfecaca, 0.5));

    const pl1 = new THREE.PointLight(0xef4444, 4, 22);
    pl1.position.set(4, 3, 3);
    scene.add(pl1);

    const pl2 = new THREE.PointLight(0xdc2626, 2.5, 18);
    pl2.position.set(-4, -2, 2);
    scene.add(pl2);

    const pl3 = new THREE.PointLight(0xf97316, 1.5, 14);
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
      0xef4444,
      0.22,
      0xfca5a5,
      [0.003, 0.005, 0.002],
      0.8,
      0.18,
      0,
    );
    addShape(
      new THREE.OctahedronGeometry(0.72),
      [-2.9, 0.7, -0.4],
      0xdc2626,
      0.25,
      0xf87171,
      [0.006, 0.003, 0.005],
      1.1,
      0.22,
      1.2,
    );
    addShape(
      new THREE.TorusGeometry(0.58, 0.19, 16, 64),
      [-1.3, -2.3, 0.6],
      0xf97316,
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
      0xfca5a5,
      0.3,
      0xfecaca,
      [0.008, 0.012, 0.004],
      1.3,
      0.28,
      0.8,
    );
    addShape(
      new THREE.SphereGeometry(0.32, 32, 32),
      [-1.9, -1.5, 1.1],
      0xb91c1c,
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
      0xbe123c,
      0.2,
      0xf87171,
      [0.004, 0.009, 0.006],
      0.9,
      0.16,
      4.5,
    );
    addShape(
      new THREE.ConeGeometry(0.4, 0.75, 6),
      [-3.2, 2.1, 0.3],
      0xf97316,
      0.22,
      0xfed7aa,
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
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        color: 0xfca5a5,
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
      'position',
      new THREE.BufferAttribute(new Float32Array(lPositions), 3),
    );
    scene.add(
      new THREE.LineSegments(
        lGeo,
        new THREE.LineBasicMaterial({
          color: 0xfecaca,
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
    window.addEventListener('mousemove', onMouse);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

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
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-red-50/60 to-orange-50" />

      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(#ef4444 1px, transparent 1px), linear-gradient(90deg, #ef4444 1px, transparent 1px)',
          backgroundSize: '48px 48px',
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
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div
            className="rounded-3xl px-9 py-11 text-center"
            style={{
              background: 'rgba(255,255,255,0.58)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              border: '1px solid rgba(254,165,165,0.6)',
              boxShadow:
                '0 8px 64px rgba(239,68,68,0.12), 0 2px 12px rgba(239,68,68,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
            }}
          >
            <div className="flex justify-center mb-6">
              <span
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-bold tracking-[0.15em] uppercase text-red-600"
                style={{
                  background: 'rgba(254,226,226,0.85)',
                  border: '1px solid rgba(252,165,165,0.55)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
                500 · Server Error
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
                    'linear-gradient(135deg, rgba(252,165,165,0.55) 0%, rgba(248,113,113,0.3) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-6px',
                  userSelect: 'none',
                }}
              >
                500
              </span>

              <div
                className="relative z-10 w-20 h-20 rounded-2xl flex flex-col items-center justify-center gap-1"
                style={{
                  background: 'rgba(255,255,255,0.92)',
                  border: '1px solid rgba(252,165,165,0.5)',
                  boxShadow:
                    '0 16px 48px rgba(239,68,68,0.18), inset 0 1px 0 rgba(255,255,255,1)',
                  animation: 'pulseIcon 2s ease-in-out infinite',
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
                  <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.5" />
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#fca5a5"
                    strokeWidth="1.5"
                    strokeDasharray="3 4"
                  />
                  <path
                    d="M12 7v5m0 4v.01"
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="17" r="0.5" fill="#ef4444" />
                </svg>
                <span className="text-[9px] font-bold tracking-widest uppercase text-red-400">
                  Error
                </span>
              </div>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-tight mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-60 mx-auto">
              Our servers encountered an unexpected error. Our team has been
              notified and is working on a fix.
            </p>

            <div className="flex gap-3 mb-8 flex-col sm:flex-row">
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:shadow-md disabled:opacity-75"
                style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  boxShadow: '0 4px 24px rgba(239,68,68,0.35)',
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    animation: isRetrying ? 'spin 1s linear infinite' : 'none',
                  }}
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
                {isRetrying ? 'Retrying...' : 'Try Again'}
              </button>
              <Link
                to="/"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:shadow-md"
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '1.5px solid rgba(239,68,68,0.25)',
                  color: '#ef4444',
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Go Home
              </Link>
            </div>

            <div
              className="rounded-lg px-4 py-3 text-[12px] flex items-start gap-3 animate-slideIn"
              style={{
                background: 'rgba(239,68,68,0.05)',
                border: '1px solid rgba(239,68,68,0.15)',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 flex-shrink-0"
                style={{ color: '#ef4444', minWidth: 16 }}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div>
                <p style={{ color: '#7f1d1d', fontWeight: 600 }}>
                  Server Issue Detected
                </p>
                <p style={{ color: '#b91c1c', marginTop: 2 }}>
                  Our team has been automatically notified. Please try again in a few moments.
                </p>
              </div>
            </div>



            <div className="mt-6 flex items-center gap-3">
              <div
                className="flex-1 h-px"
                style={{ background: 'rgba(254,165,165,0.6)' }}
              />
              <span
                className="text-[11px] font-semibold tracking-widest uppercase"
                style={{ color: '#fca5a5' }}
              >
                Your Brand
              </span>
              <div
                className="flex-1 h-px"
                style={{ background: 'rgba(254,165,165,0.6)' }}
              />
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-slate-400">
            Need help?{' '}
            <Link
              to="/support"
              className="text-red-500 underline underline-offset-2 hover:text-red-700 transition-colors"
            >
              Contact support
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulseIcon {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 16px 48px rgba(239,68,68,0.18), inset 0 1px 0 rgba(255,255,255,1);
          }
          50% { 
            transform: scale(1.08);
            box-shadow: 0 16px 48px rgba(239,68,68,0.28), inset 0 1px 0 rgba(255,255,255,1);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.5s ease-out 0.4s both;
        }
      `}</style>
    </div>
  );
}