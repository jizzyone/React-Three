import React, { useState, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FeatureHotspotProps {
  position: [number, number, number];
  featureName: string;
  description: string;
  onActivate: (featureName: string) => void;
}

const FeatureHotspot: React.FC<FeatureHotspotProps> = ({ 
  position, 
  featureName, 
  description, 
  onActivate 
}) => {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const pointRef = useRef<THREE.Mesh>(null);
  
  // Анимация пульсации для привлечения внимания
  useFrame(() => {
    if (pointRef.current) {
      if (hovered) {
        pointRef.current.scale.set(1.2, 1.2, 1.2);
      } else {
        pointRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });
  
  const handleClick = () => {
    setActive(!active);
    if (onActivate) {
      onActivate(featureName);
    }
  };
  
  return (
    <group position={position}>
      {/* Светящаяся точка для привлечения внимания */}
      <mesh
        ref={pointRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial 
          color={active ? "#ff67e7" : "#67b2ff"} 
          emissive={hovered ? "#ffffff" : "#000000"}
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Всплывающая подсказка */}
      <Html
        position={[0, 0.2, 0]}
        center
        style={{
          display: hovered || active ? 'block' : 'none',
          width: '150px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          pointerEvents: 'none',
          fontSize: '12px',
          textAlign: 'center'
        }}
      >
        <div>
          <strong>{featureName}</strong>
          {active && <p>{description}</p>}
        </div>
      </Html>
    </group>
  );
};

export default FeatureHotspot;