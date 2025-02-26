import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDeviceDetect } from '../hooks/useDeviceDetect';

const SecondWatch = () => {
  const { scene } = useGLTF('./second_watch.glb');
  const modelRef = useRef<THREE.Group>(null);
  const { isMobile, isTablet } = useDeviceDetect();

  // Определяем размер в зависимости от устройства
  const watchScale = isMobile || isTablet ? 1.2 : 2.0;
  // Увеличиваем первый параметр для сдвига вправо на мобильных устройствах
  const watchPosition = isMobile || isTablet ? [2.5, 0.1, 0] : [2, 0.1, 0];

  useEffect(() => {
    if (scene) {
      // Поворачиваем модель изначально в правую сторону
      scene.rotation.set(0, -Math.PI / 4, 0);
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Проверяем, что все части модели отображаются
          child.frustumCulled = false;
          
          if (child.material) {
            child.material = child.material.clone();
            if (child.material instanceof THREE.MeshStandardMaterial) {
              child.material.metalness = 0.8;
              child.material.roughness = 0.1;
              child.material.envMapIntensity = 1.5;
              // Убеждаемся, что материал обновляется
              child.material.needsUpdate = true;
            }
          }
        }
      });
    }
  }, [scene]);

  useFrame((state: { clock: { getElapsedTime: () => number } }) => {
    if (modelRef.current) {
      const time = state.clock.getElapsedTime();
      const rotationSpeed = 0.3;
      const rotationAmount = Math.sin(time * 0.5) * rotationSpeed;
      modelRef.current.rotation.y = -rotationAmount - Math.PI / 4;
    }
  });

  return (
    <group>
      <primitive 
        ref={modelRef}
        object={scene} 
        scale={watchScale}
        // Изменяем положение в зависимости от устройства
        position={watchPosition}
      />
    </group>
  );
};

// Предзагрузка модели
useGLTF.preload('./second_watch.glb');

export default SecondWatch;