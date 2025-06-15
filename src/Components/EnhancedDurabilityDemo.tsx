import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

interface ParticleData {
  velocity: THREE.Vector3;
  gravity: number;
  life: number;
}

const EnhancedDurabilityDemo = () => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const phoneRef = useRef<THREE.Group | null>(null);
  const effectsRef = useRef<THREE.Group | null>(null);
  const { scene } = useThree();
  const timeRef = useRef(0);
  const originalPosition = useRef(new THREE.Vector3());
  const originalRotation = useRef(new THREE.Euler());
  const fallVelocity = useRef(0);
  
  // Создаем и настраиваем эффект
  useEffect(() => {
    // Находим телефон в сцене
    scene.traverse((object) => {
      if (object instanceof THREE.Group && !phoneRef.current) {
        phoneRef.current = object;
        originalPosition.current.copy(object.position);
        originalRotation.current.copy(object.rotation);
      }
    });
    
    // Создаем группу для эффектов
    const effectsGroup = new THREE.Group();
    scene.add(effectsGroup);
    effectsRef.current = effectsGroup;
    
    // Создаем текстуру асфальта
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Базовый цвет асфальта
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, 512, 512);
    
    // Добавляем шум для текстуры асфальта
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = Math.random() * 3 + 1;
      const brightness = Math.random() * 0.3;
      
      ctx.fillStyle = `rgba(${brightness * 255}, ${brightness * 255}, ${brightness * 255}, ${0.3 + brightness * 0.5})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Добавляем трещины
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * 512, Math.random() * 512);
      ctx.lineTo(Math.random() * 512, Math.random() * 512);
      ctx.stroke();
    }
    
    const asphaltTexture = new THREE.CanvasTexture(canvas);
    asphaltTexture.wrapS = THREE.RepeatWrapping;
    asphaltTexture.wrapT = THREE.RepeatWrapping;
    asphaltTexture.repeat.set(2, 2);
    
    // Начинаем анимацию с паузы
    setTimeout(() => {
      setAnimationPhase(1); // Начинаем с поднятия телефона
    }, 500);
    
    return () => {
      scene.remove(effectsGroup);
      
      // Возвращаем телефон в исходное положение
      if (phoneRef.current) {
        gsap.killTweensOf(phoneRef.current.position);
        gsap.killTweensOf(phoneRef.current.rotation);
        gsap.killTweensOf(phoneRef.current.scale);
        
        gsap.to(phoneRef.current.position, {
          x: originalPosition.current.x,
          y: originalPosition.current.y,
          z: originalPosition.current.z,
          duration: 0.5,
          ease: "power2.inOut"
        });
        
        gsap.to(phoneRef.current.rotation, {
          x: originalRotation.current.x,
          y: originalRotation.current.y,
          z: originalRotation.current.z,
          duration: 0.5,
          ease: "power2.inOut"
        });
        
        gsap.to(phoneRef.current.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.5,
          ease: "power2.inOut"
        });
      }
    };
  }, [scene]);
  
  // Создаем эффект удара
  const createImpactEffect = (position: THREE.Vector3): void => {
    if (!effectsRef.current) return;
    
    // Более интенсивный эффект удара
    const ringGeometry = new THREE.RingGeometry(0, 0.05, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xff4444,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide
    });
    
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.copy(position);
    ring.position.y = -1.48;
    ring.rotation.x = Math.PI / 2;
    
    effectsRef.current.add(ring);
    
    // Быстрое расширение кольца
    gsap.to(ring.scale, {
      x: 8,
      y: 8,
      z: 1,
      duration: 0.3,
      ease: "power2.out"
    });
    
    // Быстрое исчезновение
    gsap.to(ringMaterial, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.out",
      onComplete: () => {
        if (effectsRef.current) {
          effectsRef.current.remove(ring);
        }
      }
    });
  };
  
  // Обработка разных фаз анимации
  useFrame(({ clock }) => {
    const deltaTime = clock.getDelta();
    timeRef.current += deltaTime;
    
    if (!phoneRef.current) return;
    
    switch (animationPhase) {
      case 1: // Фаза поднятия телефона
        fallVelocity.current = 0; // Сбрасываем скорость падения
        gsap.to(phoneRef.current.position, {
          y: 4, // Поднимаем выше для более зрелищного падения
          duration: 0.8, // Быстрее поднимаем
          ease: "power2.inOut",
          onComplete: () => {
            setAnimationPhase(2);
          }
        });
        // Поворачиваем телефон экраном вниз быстрее
        gsap.to(phoneRef.current.rotation, {
          x: Math.PI,
          duration: 0.8,
          ease: "power2.inOut"
        });
        setAnimationPhase(0);
        break;
        
      case 2: // Фаза подготовки к падению
        setTimeout(() => {
          setAnimationPhase(3);
        }, 200); // Уменьшаем паузу перед падением
        setAnimationPhase(0);
        break;
        
        case 3: {
          // Фаза падения
          fallVelocity.current += 400 * deltaTime;
          phoneRef.current!.position.y -= fallVelocity.current * deltaTime;
          phoneRef.current!.rotation.z += deltaTime * 20;
        
          if (phoneRef.current!.position.y < -1) {
            phoneRef.current!.position.y = -1;
            fallVelocity.current = 0;
            createImpactEffect(phoneRef.current!.position);
        
            const tl = gsap.timeline({
              onComplete: () => {
                // Останавливаем анимацию
                setAnimationPhase(0);
                fallVelocity.current = 0;
              }
            });
        
            // 1) Тряска
            tl.to(phoneRef.current!.position, {
              x: originalPosition.current.x + (Math.random() - 0.5) * 0.3,
              duration: 0.03,
              repeat: 8,
              yoyo: true,
            })
            // 2) Сплющивание
            .to(phoneRef.current!.scale, {
              x: 1.2, y: 0.5, z: 1.2,
              duration: 0.08,
              ease: "power2.out",
            }, "-=0.1")
            // 3) Восстановление формы
            .to(phoneRef.current!.scale, {
              x: 1, y: 1, z: 1,
              duration: 0.4,
              ease: "elastic.out(1.5, 0.3)",
            })
            // 4) Возвращаем позицию
            .to(phoneRef.current!.position, {
              x: originalPosition.current.x,
              y: originalPosition.current.y,
              z: originalPosition.current.z,
              duration: 1,
              ease: "power2.inOut",
            }, "-=0.2")
            // 5) И ротацию одновременно
            .to(phoneRef.current!.rotation, {
              x: originalRotation.current.x,
              y: originalRotation.current.y,
              z: originalRotation.current.z,
              duration: 1,
              ease: "power2.inOut",
            }, "<");
          }
        
          break;
        }
        
      case 4: // Фаза восстановления
        gsap.to(phoneRef.current.position, {
          x: originalPosition.current.x,
          y: originalPosition.current.y,
          z: originalPosition.current.z,
          duration: 1.2,
          ease: "power2.inOut"
        });
        
        gsap.to(phoneRef.current.rotation, {
          x: originalRotation.current.x,
          y: originalRotation.current.y,
          z: originalRotation.current.z,
          duration: 1.2,
          ease: "power2.inOut"
        });
        break;
    }
  });
  
  return null;
};

export default EnhancedDurabilityDemo;