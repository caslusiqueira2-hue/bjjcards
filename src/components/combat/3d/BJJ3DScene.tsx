import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CombatPosition } from '../../../types/combat';
import { Belt } from '../../../types/athlete';
import { build3DAthlete, Athlete3DInstance } from './BJJ3DAthleteBuilder';
import { BJJ_POSES, applyPoseToJoints, DuelScenePose } from './BJJ3DPoseLibrary';
import { createMatTexture } from './BJJ3DTextures';

interface BJJ3DSceneProps {
  position: CombatPosition;
  playerRole?: 'top' | 'bottom' | 'standing';
  playerBelt?: Belt;
  opponentBelt?: Belt;
  playerGiColor?: string;
  opponentGiColor?: string;
  className?: string;
}

export const BJJ3DScene: React.FC<BJJ3DSceneProps> = ({
  position,
  playerRole = 'standing',
  playerBelt = 'white',
  opponentBelt = 'blue',
  playerGiColor = '#ffffff',
  opponentGiColor = '#2563eb',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // References for live update without recreating WebGL context
  const athletesRef = useRef<{
    athleteA: Athlete3DInstance;
    athleteB: Athlete3DInstance;
  } | null>(null);

  const targetPoseRef = useRef<DuelScenePose>(BJJ_POSES[position] || BJJ_POSES.STANDING);
  const isPlayerTopRef = useRef<boolean>(playerRole === 'top');

  // Update target pose when position or role changes
  useEffect(() => {
    isPlayerTopRef.current = playerRole === 'top';
    const pose = BJJ_POSES[position] || BJJ_POSES.STANDING;
    targetPoseRef.current = pose;
  }, [position, playerRole]);

  // Update gi colors when props change
  useEffect(() => {
    if (athletesRef.current) {
      athletesRef.current.athleteA.updateGiColor(playerGiColor);
      athletesRef.current.athleteB.updateGiColor(opponentGiColor);
      athletesRef.current.athleteA.updateBelt(playerBelt);
      athletesRef.current.athleteB.updateBelt(opponentBelt);
    }
  }, [playerGiColor, opponentGiColor, playerBelt, opponentBelt]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animationFrameId: number;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = null; // transparent background so arena background is preserved

    const camera = new THREE.PerspectiveCamera(
      38,
      container.clientWidth / (container.clientHeight || 1),
      0.1,
      50
    );
    camera.position.set(0, 1.8, 2.8);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // 2. Lighting Setup (Cinematic Championship Arena Studio)
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.6);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight('#60a5fa', '#0f172a', 0.7);
    hemiLight.position.set(0, 5, 0);
    scene.add(hemiLight);

    // Warm key spotlight directly overhead
    const keySpotlight = new THREE.SpotLight('#fef08a', 2.8);
    keySpotlight.position.set(0, 4.2, 1.5);
    keySpotlight.angle = Math.PI / 3.8;
    keySpotlight.penumbra = 0.5;
    keySpotlight.castShadow = true;
    keySpotlight.shadow.mapSize.width = 1024;
    keySpotlight.shadow.mapSize.height = 1024;
    keySpotlight.shadow.bias = -0.0005;
    scene.add(keySpotlight);

    // Cool rim light from behind to make gi silhouettes pop
    const rimLight = new THREE.DirectionalLight('#38bdf8', 1.2);
    rimLight.position.set(-2, 3, -2);
    scene.add(rimLight);

    // 3. Official IBJJF Championship Tatame Floor
    const matGroup = new THREE.Group();
    scene.add(matGroup);

    const matTex = createMatTexture();
    const matMaterial = new THREE.MeshStandardMaterial({
      color: '#1d4ed8',
      roughness: 0.7,
      metalness: 0.1,
      map: matTex
    });

    const matMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 2.4, 0.05, 32),
      matMaterial
    );
    matMesh.position.y = -0.025;
    matMesh.receiveShadow = true;
    matGroup.add(matMesh);

    // Yellow Competition Boundary Line
    const yellowBoundary = new THREE.Mesh(
      new THREE.RingGeometry(1.8, 1.92, 32),
      new THREE.MeshBasicMaterial({ color: '#eab308', side: THREE.DoubleSide })
    );
    yellowBoundary.rotation.x = -Math.PI / 2;
    yellowBoundary.position.y = 0.002;
    matGroup.add(yellowBoundary);

    // 4. Two Articulated BJJ Athletes
    const athleteA = build3DAthlete(playerGiColor, playerBelt, 2, 'light');
    const athleteB = build3DAthlete(opponentGiColor, opponentBelt, 3, 'medium');

    scene.add(athleteA.group);
    scene.add(athleteB.group);

    athletesRef.current = { athleteA, athleteB };

    // Initial pose instant application
    const initialPose = targetPoseRef.current;
    applyPoseToJoints(athleteA.joints, isPlayerTopRef.current ? initialPose.topAthlete : initialPose.bottomAthlete, 1.0);
    applyPoseToJoints(athleteB.joints, isPlayerTopRef.current ? initialPose.bottomAthlete : initialPose.topAthlete, 1.0);

    // 5. Interactive Orbit Control via Touch / Mouse
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let orbitAzimuth = 0;
    let orbitPolar = 0.55; // radians from top
    let orbitDistance = 2.8;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      orbitAzimuth -= dx * 0.008;
      orbitPolar = Math.max(0.15, Math.min(Math.PI / 2.1, orbitPolar + dy * 0.008));
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      orbitDistance = Math.max(1.6, Math.min(4.5, orbitDistance + e.deltaY * 0.002));
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    // 6. Responsive Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      }
    });
    resizeObserver.observe(container);

    // 7. Continuous Animation Render Loop
    let clock = new THREE.Clock();
    const currentCamTarget = new THREE.Vector3(0, 0.4, 0);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const dt = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      const pose = targetPoseRef.current;
      const isTop = isPlayerTopRef.current;

      const targetPoseA = isTop ? pose.topAthlete : pose.bottomAthlete;
      const targetPoseB = isTop ? pose.bottomAthlete : pose.topAthlete;

      // Smooth joint interpolation (alpha ~ 0.08 * dt * 60 = smooth organic transition)
      const lerpAlpha = Math.min(1.0, 7.0 * dt);
      applyPoseToJoints(athleteA.joints, targetPoseA, lerpAlpha);
      applyPoseToJoints(athleteB.joints, targetPoseB, lerpAlpha);

      // Micro-Animation: Breathing and Gripping Micro-Tension
      const breath = Math.sin(time * 2.8) * 0.012;
      athleteA.joints.chest.scale.set(1.0 + breath, 1.0 + breath * 0.5, 1.0 + breath * 1.2);
      athleteB.joints.chest.scale.set(1.0 - breath, 1.0 - breath * 0.5, 1.0 - breath * 1.2);

      const microSway = Math.cos(time * 1.6) * 0.006;
      athleteA.joints.spine.rotation.z += microSway;
      athleteB.joints.spine.rotation.z -= microSway;

      // Subtle dynamic camera positioning
      const targetCamPos = pose.cameraPosition || [0, 1.8, 2.8];
      const targetLook = pose.cameraTarget || [0, 0.4, 0];

      currentCamTarget.lerp(new THREE.Vector3(...targetLook), 4.0 * dt);

      // Spherical coordinates with user orbit
      const cx = orbitDistance * Math.sin(orbitPolar) * Math.sin(orbitAzimuth);
      const cy = orbitDistance * Math.cos(orbitPolar);
      const cz = orbitDistance * Math.sin(orbitPolar) * Math.cos(orbitAzimuth);

      camera.position.lerp(new THREE.Vector3(cx, cy, cz), 6.0 * dt);
      camera.lookAt(currentCamTarget);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('wheel', onWheel);

      athleteA.dispose();
      athleteB.dispose();
      matMaterial.dispose();
      matTex.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
