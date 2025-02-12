import React, { useRef, useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RotationPoint {
  x: number;
  y: number;
  timestamp: number;
}

const PhoneModel: React.FC<{ progress: number }> = ({ progress }) => {
  const { scene } = useGLTF('./samsung_galaxy_s22_ultra.glb');
  const modelRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.x = Math.sin(progress * Math.PI / 2) * Math.PI / 4;
      modelRef.current.rotation.y = Math.sin(progress * Math.PI / 2) * Math.PI;
      modelRef.current.position.y = -progress * 6;
    }
  });

  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      scene.position.sub(center);
    }
  }, [scene]);

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={2} 
      position={[0, 12, 0]} 
    />
  );
};