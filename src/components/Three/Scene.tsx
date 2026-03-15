"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Float, MeshDistortMaterial, PerspectiveCamera } from "@react-three/drei";

function FloatingShape() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[10, 3, 100, 16]} />
        <MeshDistortMaterial
          color="#1a1a1a"
          roughness={0.1}
          metalness={1}
          distort={0.4}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

export default function Scene() {
  return (
    <div className="fixed inset-0 -z-10 bg-black">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 50]} fov={50} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#333333" />
        <FloatingShape />
      </Canvas>
    </div>
  );
}
