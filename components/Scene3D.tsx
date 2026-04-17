"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, MeshTransmissionMaterial } from "@react-three/drei";
import { useRef, useMemo, useState } from "react";
import * as THREE from "three";

function BookCover() {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    // Smooth follow mouse
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      pointer.x * 0.4 + Math.sin(t * 0.3) * 0.1,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      pointer.y * -0.2 + Math.cos(t * 0.2) * 0.05,
      0.05
    );
    // Subtle float
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.15;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} scale={1.3}>
        {/* Book cover - front */}
        <mesh position={[0, 0, 0.09]} castShadow>
          <boxGeometry args={[1.5, 2.1, 0.04]} />
          <meshPhysicalMaterial
            color="#B71C1C"
            roughness={0.15}
            metalness={0.05}
            clearcoat={0.8}
            clearcoatRoughness={0.1}
          />
        </mesh>
        {/* Book cover - back */}
        <mesh position={[0, 0, -0.09]} castShadow>
          <boxGeometry args={[1.5, 2.1, 0.04]} />
          <meshPhysicalMaterial
            color="#7f1d1d"
            roughness={0.3}
            metalness={0.05}
          />
        </mesh>
        {/* Book pages */}
        <mesh position={[0.02, 0, 0]}>
          <boxGeometry args={[1.42, 2.0, 0.14]} />
          <meshStandardMaterial color="#F5F0E8" roughness={0.9} />
        </mesh>
        {/* Spine */}
        <mesh position={[-0.77, 0, 0]}>
          <boxGeometry args={[0.06, 2.1, 0.22]} />
          <meshPhysicalMaterial
            color="#8B1A1A"
            roughness={0.2}
            metalness={0.1}
            clearcoat={1}
          />
        </mesh>
        {/* Gold accent line on cover */}
        <mesh position={[0, 0, 0.115]}>
          <boxGeometry args={[1.1, 0.015, 0.001]} />
          <meshStandardMaterial
            color="#C9A24E"
            emissive="#C9A24E"
            emissiveIntensity={0.3}
            metalness={0.8}
          />
        </mesh>
        {/* Gold accent line 2 */}
        <mesh position={[0, -0.3, 0.115]}>
          <boxGeometry args={[0.8, 0.008, 0.001]} />
          <meshStandardMaterial
            color="#C9A24E"
            emissive="#C9A24E"
            emissiveIntensity={0.3}
            metalness={0.8}
          />
        </mesh>
      </group>
    </Float>
  );
}

function FloatingParticles() {
  const count = 120;
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const { positions, scales, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const scl = new Float32Array(count);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
      scl[i] = Math.random() * 0.03 + 0.005;
      spd[i] = Math.random() * 0.5 + 0.2;
    }
    return { positions: pos, scales: scl, speeds: spd };
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const temp = new THREE.Object3D();
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      temp.position.set(
        positions[i * 3] + Math.sin(t * speeds[i] + i) * 0.5,
        positions[i * 3 + 1] + Math.cos(t * speeds[i] * 0.7 + i * 0.3) * 0.3,
        positions[i * 3 + 2] + Math.sin(t * 0.1 + i * 0.5) * 0.2
      );
      const pulse = scales[i] * (1 + Math.sin(t * 2 + i) * 0.3);
      temp.scale.setScalar(pulse);
      temp.updateMatrix();
      meshRef.current.setMatrixAt(i, temp.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshBasicMaterial color="#C62828" transparent opacity={0.35} />
    </instancedMesh>
  );
}

function GlowOrb() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.scale.setScalar(3 + Math.sin(t * 0.4) * 0.4);
      ref.current.rotation.z = t * 0.05;
    }
  });
  return (
    <mesh ref={ref} position={[1.5, -0.5, -4]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial color="#C62828" transparent opacity={0.04} />
    </mesh>
  );
}

function GlowOrb2() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.scale.setScalar(2 + Math.sin(t * 0.3 + 2) * 0.3);
    }
  });
  return (
    <mesh ref={ref} position={[-2, 1, -5]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial color="#5B7B5B" transparent opacity={0.03} />
    </mesh>
  );
}

export default function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 40 }}
      style={{ position: "absolute", inset: 0 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
    >
      {/* Lighting setup */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        color="#FAF5EB"
        castShadow
      />
      <pointLight position={[-3, 2, 4]} intensity={0.8} color="#C62828" distance={10} />
      <pointLight position={[3, -1, 3]} intensity={0.4} color="#5B7B5B" distance={8} />
      <pointLight position={[0, 3, 2]} intensity={0.3} color="#C9A24E" distance={6} />

      <BookCover />
      <FloatingParticles />
      <GlowOrb />
      <GlowOrb2 />
    </Canvas>
  );
}
