import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraZoomDemoProps {
  active: boolean;
  position: [number, number, number];
}

const CameraZoomDemo: React.FC<CameraZoomDemoProps> = ({ active, position }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoomDirection, setZoomDirection] = useState(1);
  const zoomEffectRef = useRef<THREE.Mesh | null>(null);
  const timeRef = useRef(0);
  
  useFrame((state) => {
    if (active) {
      timeRef.current += 0.01;
      
      // Анимация зума
      if (zoomLevel >= 5) {
        setZoomDirection(-1);
      } else if (zoomLevel <= 1) {
        setZoomDirection(1);
      }
      
      setZoomLevel(prev => prev + 0.05 * zoomDirection);
      
      // Создаем визуальный эффект зума (круг с анимацией)
      if (!zoomEffectRef.current) {
        const zoomGeometry = new THREE.RingGeometry(0.2, 0.25, 32);
        const zoomMaterial = new THREE.MeshBasicMaterial({
          color: 0x67b2ff,
          transparent: true,
          opacity: 0.7,
          side: THREE.DoubleSide
        });
        
        const mesh = new THREE.Mesh(zoomGeometry, zoomMaterial);
        mesh.position.set(position[0], position[1], position[2] + 0.1);
        state.scene.add(mesh);
        zoomEffectRef.current = mesh;
        
        // Добавляем направляющие линии для иллюстрации зума
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x67b2ff });
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0.5, 0.5, 0.5)
        ]);
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        mesh.add(line);
      }
      
      // Анимируем эффект зума
      if (zoomEffectRef.current) {
        zoomEffectRef.current.scale.set(zoomLevel, zoomLevel, 1);
        zoomEffectRef.current.rotation.z = timeRef.current * 2;
        
        // Проверяем, существует ли material и имеет ли он свойство opacity
        if ('material' in zoomEffectRef.current && 
            zoomEffectRef.current.material instanceof THREE.Material && 
            'opacity' in zoomEffectRef.current.material) {
          zoomEffectRef.current.material.opacity = 0.5 + Math.sin(timeRef.current * 5) * 0.2;
        }
      }
    } else if (zoomEffectRef.current) {
      // Удаляем эффект когда неактивен
      state.scene.remove(zoomEffectRef.current);
      zoomEffectRef.current = null;
    }
  });
  
  return null;
};

export default CameraZoomDemo;