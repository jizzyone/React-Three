import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WaterDropData {
  velocity: THREE.Vector3;
  lifetime: number;
}

interface WaterproofDemoProps {
  active: boolean;
  position: [number, number, number];
}

const WaterproofDemo: React.FC<WaterproofDemoProps> = ({ active, position }) => {
  const waterRef = useRef<THREE.Mesh | null>(null);
  const dropsRef = useRef<THREE.Mesh[]>([]);
  const { scene } = useThree();
  const timeRef = useRef(0);
  
  // Создаем эффект воды при активации
  useEffect(() => {
    if (active) {
      // Создаем "аквариум" вокруг телефона
      const waterCube = new THREE.Mesh(
        new THREE.BoxGeometry(2, 4, 0.5),
        new THREE.MeshPhysicalMaterial({
          color: 0x2389da,
          transparent: true,
          opacity: 0.2,
          roughness: 0.1,
          metalness: 0.1,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1
        })
      );
      
      waterCube.position.set(position[0], position[1], position[2]);
      scene.add(waterCube);
      waterRef.current = waterCube;
      
      // Создаем капли воды
      const createWaterDrops = () => {
        const drops: THREE.Mesh[] = [];
        const dropGeometry = new THREE.SphereGeometry(0.03, 8, 8);
        const dropMaterial = new THREE.MeshPhysicalMaterial({
          color: 0x2389da,
          transparent: true,
          opacity: 0.7,
          roughness: 0.1,
          metalness: 0.1,
          clearcoat: 1.0
        });
        
        for (let i = 0; i < 30; i++) {
          const drop = new THREE.Mesh(dropGeometry, dropMaterial);
          drop.position.set(
            position[0] + (Math.random() - 0.5) * 2,
            position[1] + (Math.random() - 0.5) * 4,
            position[2] + (Math.random() - 0.5) * 0.5
          );
          
          // Добавляем пользовательские данные к дропу
          drop.userData = {
            velocity: new THREE.Vector3(
              (Math.random() - 0.5) * 0.01,
              (Math.random() - 0.5) * 0.01,
              (Math.random() - 0.5) * 0.01
            ),
            lifetime: Math.random() * 100 + 50
          } as WaterDropData;
          
          scene.add(drop);
          drops.push(drop);
        }
        
        dropsRef.current = drops;
      };
      
      createWaterDrops();
      
      // Очистка при деактивации
      return () => {
        if (waterRef.current) {
          scene.remove(waterRef.current);
        }
        dropsRef.current.forEach(drop => scene.remove(drop));
      };
    }
  }, [active, position, scene]);
  
  // Анимация воды и капель
  useFrame(() => {
    if (active) {
      timeRef.current += 0.01;
      
      // Анимируем "аквариум"
      if (waterRef.current && 'material' in waterRef.current && 
          waterRef.current.material instanceof THREE.Material && 
          'opacity' in waterRef.current.material) {
        waterRef.current.material.opacity = 0.2 + Math.sin(timeRef.current) * 0.05;
      }
      
      // Анимируем капли воды
      dropsRef.current.forEach((drop, index) => {
        const userData = drop.userData as WaterDropData;
        
        // Движение капель
        drop.position.add(userData.velocity);
        
        // Границы "аквариума"
        const bounds = {
          x: 1,
          y: 2,
          z: 0.25
        };
        
        // Отскок от стенок
        if (Math.abs(drop.position.x - position[0]) > bounds.x) {
          userData.velocity.x *= -1;
        }
        if (Math.abs(drop.position.y - position[1]) > bounds.y) {
          userData.velocity.y *= -1;
        }
        if (Math.abs(drop.position.z - position[2]) > bounds.z) {
          userData.velocity.z *= -1;
        }
        
        // Управление временем жизни капли
        userData.lifetime -= 1;
        
        // Перезапуск капли после истечения времени
        if (userData.lifetime <= 0) {
          drop.position.set(
            position[0] + (Math.random() - 0.5) * 2,
            position[1] + (Math.random() - 0.5) * 4,
            position[2] + (Math.random() - 0.5) * 0.5
          );
          userData.lifetime = Math.random() * 100 + 50;
        }
        
        // Пульсация для более реалистичного эффекта
        drop.scale.set(
          1 + Math.sin(timeRef.current + index) * 0.1,
          1 + Math.sin(timeRef.current + index) * 0.1,
          1 + Math.sin(timeRef.current + index) * 0.1
        );
      });
    }
  });
  
  return null;
};

export default WaterproofDemo;