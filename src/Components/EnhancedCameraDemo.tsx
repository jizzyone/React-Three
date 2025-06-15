import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

const EnhancedCameraDemo: React.FC = () => {
  const phoneRef = useRef<THREE.Group | null>(null);
  const moonGroupRef = useRef<THREE.Group | null>(null);
  const zoomIndicatorRef = useRef<THREE.Sprite | null>(null);
  const lineRef = useRef<THREE.Line | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const { scene } = useThree();
  const timeRef = useRef(0);
  
  // Предотвращаем скролл на странице влияющий на анимацию
  useEffect(() => {
    // Находим canvas элемент (три.js рендерер)
    const canvas = document.querySelector('canvas');
    
    // Функция для блокирования событий колесика мыши
    const preventScroll = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
    
    // Добавляем обработчик для предотвращения скролла
    if (canvas) {
      canvas.addEventListener('wheel', preventScroll, { passive: false });
      
      // Также блокируем события касания для мобильных устройств
      canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    }
    
    // Очистка при размонтировании
    return () => {
      if (canvas) {
        canvas.removeEventListener('wheel', preventScroll);
        canvas.removeEventListener('touchmove', (e) => e.preventDefault());
      }
    };
  }, []);
  
  useEffect(() => {
    // Находим телефон в сцене
    scene.traverse((object) => {
      if (object instanceof THREE.Group && !phoneRef.current) {
        phoneRef.current = object;
        
        // Немедленно позиционируем телефон сильнее влево
        object.position.x = -1.2;
        
        // Начинаем демонстрацию с задержкой
        setTimeout(() => {
          setIsActive(true);
          
          // Сдвигаем телефон еще левее
          gsap.to(object.position, {
            x: -2.2, // Еще сильнее влево
            duration: 1.2,
            ease: "power2.inOut"
          });
          
          // Поворачиваем телефон как и прежде
          gsap.to(object.rotation, {
            y: -Math.PI/2, // -90 градусов
            duration: 1.2,
            ease: "power2.inOut"
          });
        }, 500);
      }
    });
    
    // Создаем собственную модель луны
    const moonGroup = new THREE.Group();
    moonGroup.position.set(4.0, 0, 0); // Смещаем правее для лучшего эффекта зумирования
    scene.add(moonGroup);
    moonGroupRef.current = moonGroup;
    
    // Создаем реалистичную модель луны с правильной текстурой
    const loader = new THREE.TextureLoader();
    
    // Создаем сферу для луны
    const moonGeometry = new THREE.SphereGeometry(1, 64, 64); // Высокая детализация
    
    // Создаем базовый материал (будет заменен на текстуру, если она загрузится)
    const moonMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc, // Светло-серый цвет для луны
      roughness: 0.8,
      metalness: 0.1,
      emissive: 0x333333, // Добавляем свечение для лучшей видимости
      emissiveIntensity: 0.2
    });
    
    // Создаем Mesh
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.scale.set(0.05, 0.05, 0.05); // Меньший начальный масштаб
    moonGroup.add(moon);
    
    // Добавляем свечение вокруг луны (используем полупрозрачную сферу)
    const glowGeometry = new THREE.SphereGeometry(1.05, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide
    });
    
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.scale.set(0.05, 0.05, 0.05); // То же масштабирование, что и у луны
    moonGroup.add(glow);
    
    // Создаем индикатор зума (1x-100x) с большим шрифтом
    const canvas = document.createElement('canvas');
    canvas.width = 150;
    canvas.height = 80;
    const context = canvas.getContext('2d');
    
    if (context) {
      context.fillStyle = 'rgba(0, 0, 0, 0)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.font = 'Bold 50px Arial'; // Увеличенный шрифт
      context.fillStyle = 'white';
      context.textAlign = 'center';
      context.fillText('1x', canvas.width/2, canvas.height/2 + 15);
      
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true
      });
      
      const sprite = new THREE.Sprite(spriteMaterial);
      
      // Размещаем индикатор зума видимым на экране
      sprite.position.set(0, 0.5, 0);
      sprite.scale.set(0.7, 0.35, 1); // Увеличенный размер
      scene.add(sprite);
      zoomIndicatorRef.current = sprite;
    }
    
    // Создаем линию от камеры телефона к объектам с увеличенной шириной
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      linewidth: 2 // Максимально возможная ширина в Three.js
    });
    
    // Начальная позиция камеры на телефоне - теперь выше
    const cameraPosition = new THREE.Vector3(-0.2, 1.0, 0); // Y увеличен с 0.5 до 1.0
    const phoneWorldPos = new THREE.Vector3();
    
    if (phoneRef.current) {
      // Вычисляем мировые координаты для начала линии
      phoneWorldPos.copy(cameraPosition);
      phoneWorldPos.applyMatrix4(phoneRef.current.matrixWorld);
    }
    
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      phoneWorldPos,
      moonGroup.position
    ]);
    
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);
    lineRef.current = line;
    
    // Добавляем яркое направленное освещение для луны
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 3, 5);
    directionalLight.lookAt(moonGroup.position);
    scene.add(directionalLight);
    
    // Добавляем рассеянное освещение для лучшей видимости деталей
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    // Загружаем текстуру луны с кратерами
    loader.load(
      './moon_texture.jpg', // URL текстуры
      (texture) => {
        // В случае успешной загрузки
        if (moon) {
          const newMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.8,
            metalness: 0.0,
            emissive: 0x222222,
            emissiveIntensity: 0.2
          });
          moon.material = newMaterial;
        }
      },
      undefined,
      () => {
        // В случае ошибки загрузки
        console.log('Не удалось загрузить текстуру луны, используем стандартный материал');
        
        // Попробуем загрузить альтернативную текстуру
        loader.load(
          'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg',
          (texture) => {
            if (moon) {
              const newMaterial = new THREE.MeshStandardMaterial({
                map: texture,
                roughness: 0.8,
                metalness: 0.0,
                emissive: 0x222222,
                emissiveIntensity: 0.2
              });
              moon.material = newMaterial;
            }
          }
        );
      }
    );
    
    // Очистка при размонтировании
    return () => {
      scene.remove(moonGroup);
      scene.remove(directionalLight);
      scene.remove(ambientLight);
      if (zoomIndicatorRef.current) scene.remove(zoomIndicatorRef.current);
      if (lineRef.current) scene.remove(lineRef.current);
      
      // Возвращаем телефон в исходное положение
      if (phoneRef.current) {
        gsap.to(phoneRef.current.position, {
          x: 0,
          duration: 0.5,
          ease: "power2.inOut"
        });
        
        gsap.to(phoneRef.current.rotation, {
          y: 0,
          duration: 0.5,
          ease: "power2.inOut"
        });
      }
    };
  }, [scene]);
  
  // Анимация зума и обновление визуальных эффектов
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    timeRef.current = time;
    
    if (!isActive) return;
    
    // Быстрый цикл зума: 1x -> 100x -> 1x с периодом около 5 секунд
    const cycleSpeed = 0.4; // Увеличено для большей скорости
    const zoomCycle = (Math.sin(time * cycleSpeed) * 0.5 + 0.5);
    const newZoomLevel = 1 + zoomCycle * 99; // Максимальный зум 100x
    setZoomLevel(newZoomLevel);
    
    // Обновляем размер модели луны при зумировании
    if (moonGroupRef.current) {
      // Создаем логарифмическую функцию для более плавного увеличения
      // Логарифмическая шкала даст быстрое увеличение в начале и замедление роста при высоких значениях
      const zoomRatio = newZoomLevel / 100;
      
      // При 23x (как на скриншоте) должен быть оптимальный размер
      // Используем логарифмическую функцию для сглаживания роста на высоких значениях
      const logFactor = Math.log(1 + 9 * zoomRatio) / Math.log(10); // log10(1 + 9*zoomRatio)
      
      // Максимальный размер при 100x должен быть примерно 0.6-0.7
      const maxScale = 0.65;
      const scale = 0.05 + logFactor * (maxScale - 0.05);
      
      // Применяем масштаб к обоим объектам (луна и свечение)
      moonGroupRef.current.children.forEach(child => {
        child.scale.set(scale, scale, scale);
      });
      
      // Медленное вращение модели луны
      if (moonGroupRef.current.children.length > 0) {
        moonGroupRef.current.children[0].rotation.y = time * 0.1;
        
        // Свечение также вращается вместе с луной
        if (moonGroupRef.current.children.length > 1) {
          moonGroupRef.current.children[1].rotation.y = time * 0.1;
        }
      }
      
      // Корректировка положения луны при увеличении
      // Чем больше луна, тем ближе она к центру экрана
      const initialX = 4.0;
      // Плавное перемещение с увеличением размера
      moonGroupRef.current.position.x = initialX - (scale - 0.05) * 3;
    }
    
    // Обновляем текст индикатора зума
    if (zoomIndicatorRef.current && zoomIndicatorRef.current.material.map instanceof THREE.CanvasTexture) {
      const texture = zoomIndicatorRef.current.material.map;
      const canvas = texture.image;
      const context = canvas.getContext('2d');
      
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'rgba(0, 0, 0, 0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = 'Bold 50px Arial'; // Крупный шрифт
        context.fillStyle = 'white';
        context.textAlign = 'center';
        
        // Показываем текущий уровень зума
        const displayZoom = Math.round(newZoomLevel);
        context.fillText(`${displayZoom}x`, canvas.width/2, canvas.height/2 + 15);
        
        texture.needsUpdate = true;
        
        // Фиксируем и обновляем позицию индикатора зума относительно телефона
        if (phoneRef.current) {
          // Когда телефон повернут задней крышкой вправо, камера находится на задней стороне и ВЫШЕ
          const cameraPosition = new THREE.Vector3(-0.2, 1.0, 0); // Y увеличен с 0.5 до 1.0
          const worldPos = cameraPosition.clone();
          worldPos.applyMatrix4(phoneRef.current.matrixWorld);
          
          // Смещаем индикатор вдоль линии зума
          const targetDir = new THREE.Vector3();
          if (moonGroupRef.current) {
            targetDir.subVectors(moonGroupRef.current.position, worldPos).normalize();
            worldPos.addScaledVector(targetDir, 0.6); // Сдвигаем индикатор вдоль линии
          }
          
          zoomIndicatorRef.current.position.copy(worldPos);
        }
      }
    }
    
    // Обновляем линию от камеры телефона к объектам
    if (lineRef.current && phoneRef.current && moonGroupRef.current) {
      // Для телефона, позиция камеры выше на задней стороне
      const cameraPosition = new THREE.Vector3(-0.2, 1.0, 0); // Y увеличен с 0.5 до 1.0
      const phoneWorldPos = new THREE.Vector3();
      
      // Вычисляем мировые координаты для начала линии
      phoneWorldPos.copy(cameraPosition);
      phoneWorldPos.applyMatrix4(phoneRef.current.matrixWorld);
      
      // Обновляем точки линии
      const positions = lineRef.current.geometry.attributes.position.array;
      positions[0] = phoneWorldPos.x;
      positions[1] = phoneWorldPos.y;
      positions[2] = phoneWorldPos.z;
      positions[3] = moonGroupRef.current.position.x;
      positions[4] = moonGroupRef.current.position.y;
      positions[5] = moonGroupRef.current.position.z;
      
      lineRef.current.geometry.attributes.position.needsUpdate = true;
      
      // Изменяем прозрачность линии в зависимости от зума
      const lineMaterial = lineRef.current.material as THREE.LineBasicMaterial;
      lineMaterial.opacity = Math.min(1, (newZoomLevel / 10) * 0.8); // Более заметная линия
    }
  });

  return null;
};

export default EnhancedCameraDemo;