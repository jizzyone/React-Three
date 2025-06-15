import React, { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

interface DropTestDemoProps {
  active: boolean;
  model: THREE.Group | null;
}

const DropTestDemo: React.FC<DropTestDemoProps> = ({ active, model }) => {
  const [dropStage, setDropStage] = useState(0); // 0: готов, 1: падение, 2: удар, 3: отскок, 4: завершено
  const { scene } = useThree();
  const originalPosition = useRef(new THREE.Vector3());
  const originalRotation = useRef(new THREE.Euler());
  const dropHeight = 2; // Высота падения
  const timeRef = useRef(0);
  const floorRef = useRef<THREE.Mesh | null>(null);
  
  // Инициализация демонстрации падения
  useEffect(() => {
    if (active && model) {
      // Сохраняем исходное положение
      originalPosition.current.copy(model.position);
      originalRotation.current.copy(model.rotation);
      
      // Поднимаем модель для начала падения
      model.position.y += dropHeight;
      
      // Создаем "пол" для демонстрации
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(5, 5),
        new THREE.MeshStandardMaterial({
          color: 0x333333,
          roughness: 0.8
        })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = originalPosition.current.y - 1;
      scene.add(floor);
      floorRef.current = floor;
      
      // Запускаем анимацию
      setDropStage(1);
      
      // Очистка при деактивации
      return () => {
        // Восстанавливаем позицию
        if (model) {
          model.position.copy(originalPosition.current);
          model.rotation.copy(originalRotation.current);
        }
        
        // Удаляем пол
        if (floorRef.current) {
          scene.remove(floorRef.current);
        }
      };
    }
  }, [active, model, scene]);
  
  // Анимация падения
  useFrame(() => {
    if (active && model && dropStage > 0 && dropStage < 4) {
      timeRef.current += 0.016; // ~60 FPS
      
      switch (dropStage) {
        case 1: // Падение
          // Симуляция гравитации
          model.position.y = originalPosition.current.y + dropHeight - (4.9 * Math.pow(timeRef.current, 2));
          
          // Вращение во время падения
          model.rotation.z += 0.01;
          
          // Проверка столкновения с полом
          if (model.position.y <= originalPosition.current.y - 0.5) {
            model.position.y = originalPosition.current.y - 0.5;
            timeRef.current = 0;
            setDropStage(2); // Переход к стадии удара
          }
          break;
          
        case 2: // Удар о поверхность
          // Вибрация и деформация для эффекта удара
          model.scale.y = 0.9 + Math.sin(timeRef.current * 30) * 0.1;
          model.scale.x = 1.1 - Math.sin(timeRef.current * 30) * 0.1;
          
          // Деформация пола
          if (floorRef.current && floorRef.current.geometry instanceof THREE.BufferGeometry && 
              floorRef.current.geometry.attributes.position) {
            const vertices = floorRef.current.geometry.attributes.position.array;
            for (let i = 0; i < vertices.length; i += 3) {
              const dx = (vertices[i] as number) - model.position.x;
              const dz = (vertices[i + 2] as number) - model.position.z;
              const distance = Math.sqrt(dx * dx + dz * dz);
              const wave = Math.sin(distance * 5 - timeRef.current * 10) * 0.1 / (1 + distance);
              vertices[i + 1] = wave;
            }
            floorRef.current.geometry.attributes.position.needsUpdate = true;
          }
          
          if (timeRef.current > 0.3) {
            timeRef.current = 0;
            setDropStage(3); // Переход к отскоку
          }
          break;
          
        case 3: // Отскок
          // Анимация отскока
          model.position.y = originalPosition.current.y - 0.5 + Math.sin(timeRef.current * 5) * 0.2 * Math.exp(-timeRef.current * 3);
          
          // Затухание вращения
          model.rotation.z *= 0.95;
          
          // Возврат к нормальной форме
          model.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
          
          // Завершение демонстрации
          if (timeRef.current > 2) {
            timeRef.current = 0;
            setDropStage(4);
            
            // Возврат в исходное положение
            setTimeout(() => {
              if (model) {
                gsap.to(model.position, {
                  x: originalPosition.current.x,
                  y: originalPosition.current.y,
                  z: originalPosition.current.z,
                  duration: 1.5,
                  ease: "power2.inOut"
                });
                
                gsap.to(model.rotation, {
                  x: originalRotation.current.x,
                  y: originalRotation.current.y,
                  z: originalRotation.current.z,
                  duration: 1.5,
                  ease: "power2.inOut"
                });
              }
            }, 1000);
          }
          break;
          
        default:
          break;
      }
    }
  });
  
  return null;
};

export default DropTestDemo;