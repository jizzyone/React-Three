import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

const AnimatedModel: React.FC = () => {
  const meshRef = useRef<Mesh>(null);
  const [scale, setScale] = useState(1);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  const handleClick = () => {
    if (meshRef.current) {
      meshRef.current.position.y += 0.5;
      setScale((prev) => prev * 1.1);
    }
  };

  return (
    <mesh
      ref={meshRef}
      scale={scale}
      onClick={handleClick}
    >
      <torusKnotGeometry args={[1, 0.3, 128, 16]} />
      <meshPhongMaterial 
        color="royalblue"
        shininess={100}
        specular="white"
      />
    </mesh>
  );
};

export default AnimatedModel;