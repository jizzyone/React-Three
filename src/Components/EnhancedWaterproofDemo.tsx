import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

interface WaterDropUserData {
  originalPosition: THREE.Vector3;
  speed: number;
  direction: THREE.Vector3;
  phase: number;
}

interface BubbleUserData {
  speed: number;
  life: number;
}

const EnhancedWaterproofDemo = () => {
  const phoneRef = useRef<THREE.Group | null>(null);
  const waterRef = useRef<THREE.Group | null>(null);
  const dropsRef = useRef<THREE.Group | null>(null);
  const { scene } = useThree();
  
  useEffect(() => {
    // Поиск модели телефона
    scene.traverse((object) => {
      if (object instanceof THREE.Group && !phoneRef.current) {
        phoneRef.current = object;
      }
    });
    
    // Основная группа для всех водных эффектов
    const waterEffectsGroup = new THREE.Group();
    scene.add(waterEffectsGroup);
    
    // "Аквариум" с водой
    const waterGroup = new THREE.Group();
    waterEffectsGroup.add(waterGroup);
    waterRef.current = waterGroup;
    
    // Создаем видимую воду
    const waterGeometry = new THREE.BoxGeometry(3, 5, 3);
    const waterMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0077be,
      transparent: true,
      opacity: 0.3,
      roughness: 0.2,
      metalness: 0.1,
      clearcoat: 1.0,
      transmission: 0.9
    });
    
    const waterCube = new THREE.Mesh(waterGeometry, waterMaterial);
    waterGroup.add(waterCube);
    
    // Создаем группу для капель воды
    const dropletsGroup = new THREE.Group();
    waterEffectsGroup.add(dropletsGroup);
    dropsRef.current = dropletsGroup;
    
    // Создаем капли воды
    const createWaterDrops = () => {
      const dropCount = 100;
      const dropGeometry = new THREE.SphereGeometry(0.03, 8, 8);
      const dropMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x0077be,
        transparent: true,
        opacity: 0.7,
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1.0,
        transmission: 0.95
      });
      
      for (let i = 0; i < dropCount; i++) {
        const drop = new THREE.Mesh(dropGeometry, dropMaterial.clone());
        
        // Распределяем капли вокруг телефона
        const radius = 1.5 + Math.random() * 0.5;
        const theta = Math.random() * Math.PI * 2;
        const y = Math.random() * 4 - 2;
        
        drop.position.set(
          radius * Math.cos(theta),
          y,
          radius * Math.sin(theta)
        );
        
        const userData: WaterDropUserData = {
          originalPosition: drop.position.clone(),
          speed: Math.random() * 0.01 + 0.005,
          direction: new THREE.Vector3(
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.01
          ),
          phase: Math.random() * Math.PI * 2
        };
        
        drop.userData = userData;
        dropletsGroup.add(drop);
      }
    };
    
    createWaterDrops();
    
    // Создаем волны на поверхности "аквариума"
    const createWaterSurface = () => {
      const surfaceGeometry = new THREE.PlaneGeometry(3, 3, 32, 32);
      const surfaceMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x0077be,
        transparent: true,
        opacity: 0.4,
        roughness: 0.2,
        metalness: 0.1,
        clearcoat: 1.0,
        transmission: 0.9,
        side: THREE.DoubleSide
      });
      
      const topSurface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
      topSurface.position.set(0, 2.5, 0);
      topSurface.rotation.x = Math.PI / 2;
      
      const bottomSurface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
      bottomSurface.position.set(0, -2.5, 0);
      bottomSurface.rotation.x = Math.PI / 2;
      
      waterGroup.add(topSurface, bottomSurface);
      
      // Сохраняем вершины для анимации
      const positionAttribute = topSurface.geometry.attributes.position;
      const vertices = [];
      for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i);
        const z = positionAttribute.getZ(i);
        vertices.push({ x, y, z, originalZ: z });
      }
      
      topSurface.userData = { vertices };
    };
    
    createWaterSurface();
    
    // Анимируем погружение телефона в воду
    if (phoneRef.current) {
      // Сначала поднимаем телефон немного вверх
      gsap.to(phoneRef.current.position, {
        y: 1.5,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
          // Затем опускаем в воду
          if (phoneRef.current) {
            gsap.to(phoneRef.current.position, {
              y: 0,
              duration: 2,
              ease: "power2.inOut"
            });
          }
        }
      });
      
      // Поворачиваем телефон для лучшего вида
      gsap.to(phoneRef.current.rotation, {
        y: Math.PI * 2,
        duration: 6,
        repeat: -1,
        ease: "none"
      });
    }
    
    return () => {
      // Очистка при размонтировании
      scene.remove(waterEffectsGroup);
      
      // Возвращаем телефон в исходное положение
      if (phoneRef.current) {
        gsap.killTweensOf(phoneRef.current.position);
        gsap.killTweensOf(phoneRef.current.rotation);
        
        gsap.to(phoneRef.current.position, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1,
          ease: "power2.inOut"
        });
        
        gsap.to(phoneRef.current.rotation, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1,
          ease: "power2.inOut"
        });
      }
    };
  }, [scene]);
  
  // Анимация воды и капель
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Анимация капель воды
    if (dropsRef.current) {
      dropsRef.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          const userData = child.userData as WaterDropUserData;
          
          // Безопасная проверка userData
          if (!userData || !userData.originalPosition) return;
          
          // Орбитальное движение капель
          const originalPos = userData.originalPosition;
          const speed = userData.speed;
          const phase = userData.phase;
          
          child.position.x = originalPos.x + Math.sin(time * speed + phase) * 0.2;
          child.position.y = originalPos.y + Math.cos(time * speed + phase + 1) * 0.1;
          child.position.z = originalPos.z + Math.sin(time * speed + phase + 2) * 0.2;
          
          // Изменение размера капель (пульсация)
          const scale = 1 + Math.sin(time * 3 + phase) * 0.2;
          child.scale.set(scale, scale, scale);
        }
      });
    }
    
    // Анимация поверхности воды
    if (waterRef.current) {
      waterRef.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh && 
            child.geometry instanceof THREE.PlaneGeometry && 
            child.userData?.vertices) {
          
          const positionAttribute = child.geometry.attributes.position;
          const vertices = child.userData.vertices;
          
          for (let i = 0; i < vertices.length; i++) {
            const vertex = vertices[i];
            const dist = Math.sqrt(vertex.x * vertex.x + vertex.y * vertex.y);
            const wave = 0.05 * Math.sin(dist * 5 - time * 2);
            
            positionAttribute.setZ(i, vertex.originalZ + wave);
          }
          
          positionAttribute.needsUpdate = true;
        }
      });
    }
    
    // Добавим пузырьки вокруг телефона
    if (Math.random() < 0.05 && dropsRef.current && phoneRef.current) {
      const bubbleGeometry = new THREE.SphereGeometry(0.02 + Math.random() * 0.02, 8, 8);
      const bubbleMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1.0,
        transmission: 0.95
      });
      
      const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
      
      // Создаем пузырек возле телефона
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.3 + Math.random() * 0.1;
      
      bubble.position.set(
        radius * Math.cos(angle),
        -0.5 + Math.random() * 0.5, // Начинаем снизу
        radius * Math.sin(angle)
      );
      
      const bubbleUserData: BubbleUserData = {
        speed: 0.01 + Math.random() * 0.02,
        life: 0
      };
      
      bubble.userData = bubbleUserData;
      dropsRef.current.add(bubble);
    }
    
    // Анимируем движение пузырьков вверх
    if (dropsRef.current) {
      const bubblestoRemove: THREE.Mesh[] = [];
      
      dropsRef.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh && 
            child.geometry instanceof THREE.SphereGeometry && 
            child.geometry.parameters.radius < 0.04) { // Это пузырек
          
          const bubbleUserData = child.userData as BubbleUserData;
          
          // Безопасная проверка userData
          if (!bubbleUserData) return;
          
          // Движение пузырька вверх
          child.position.y += bubbleUserData.speed;
          
          // Небольшое боковое смещение
          child.position.x += Math.sin(time * 5 + child.position.y) * 0.001;
          child.position.z += Math.cos(time * 5 + child.position.y) * 0.001;
          
          // Увеличиваем время жизни
          bubbleUserData.life += 0.01;
          
          // Удаляем пузырек, когда он достигает верха или живет слишком долго
          if (child.position.y > 1.5 || bubbleUserData.life > 3) {
            bubblestoRemove.push(child);
          }
        }
      });
      
      // Удаляем старые пузырьки
      bubblestoRemove.forEach(bubble => {
        dropsRef.current?.remove(bubble);
      });
    }
  });
  
  return null;
};

export default EnhancedWaterproofDemo;