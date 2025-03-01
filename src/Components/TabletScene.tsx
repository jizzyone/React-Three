import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, useGLTF } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { useDeviceDetect } from '../hooks/useDeviceDetect';
import "../styles/TabletScene.css";
import TechSpecs from './TechSpecs';

// Мобильная версия TabletScene с статическим изображением
const MobileTabletScene: React.FC = () => {
  return (
    <div className="mobile-tablet-page">
      <header className="mobile-tablet-header">
        <h1>NoName Tab S8 Ultra</h1>
        <p>Инновационный планшет для творчества и продуктивности</p>
      </header>

      <div className="mobile-tablet-image-container">
        <motion.img 
          src="/Tablet_mobile_photo.png" 
          alt="NoName Tab S8 Ultra"
          className="mobile-tablet-main-image"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <div className="tablet-glow-effect"></div>
      </div>

      <div className="mobile-tablet-features">
        <div className="mobile-feature-block">
          <h2>Большой экран</h2>
          <p>14.6-дюймовый Super AMOLED дисплей с частотой 120 Гц для максимального удобства работы и развлечений.</p>
        </div>
        
        <div className="mobile-feature-block">
          <h2>Производительность</h2>
          <p>Snapdragon 8 Gen 1 для максимальной мощности и плавной работы любых приложений и игр.</p>
        </div>
        
        <div className="mobile-feature-block">
          <h2>Батарея</h2>
          <p>11200 мАч для длительной работы без подзарядки даже при интенсивном использовании.</p>
        </div>
        
        <div className="mobile-feature-block">
          <h2>S Pen</h2>
          <p>Мгновенный отклик и естественное письмо с минимальной задержкой для творчества и заметок.</p>
        </div>
      </div>
    </div>
  );
};

// Модель планшета с анимацией на основе прогресса
const TabletModelWithProgress = ({ progress }: { progress: number }) => {
  const { scene } = useGLTF('./galaxy_tab_s8_ultra.glb');
  const modelRef = useRef<THREE.Group>(null);

  const INITIAL_X = 1;
  const INITIAL_Y = -0.1; 
  const INITIAL_ROTATION = Math.PI;
  const INITIAL_ROTATION_OFFSET = -0.3;
  const INITIAL_SCALE = 1.0; 

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const material = child.material as THREE.MeshStandardMaterial;
          material.emissive = new THREE.Color(0x333333);
          material.emissiveIntensity = 0.2;
          material.needsUpdate = true;
        }
      });
      
      scene.rotation.set(-0.1, INITIAL_ROTATION + INITIAL_ROTATION_OFFSET, 0);
      scene.position.set(INITIAL_X, INITIAL_Y, 0);
      scene.scale.set(INITIAL_SCALE, INITIAL_SCALE, INITIAL_SCALE);
    }
  }, [scene]);

  useEffect(() => {
    if (!modelRef.current) return;
    
    // Первая фаза — движение влево при скролле
    if (progress <= 0.5) {
      const targetX = THREE.MathUtils.lerp(INITIAL_X, -1.5, progress * 2);
      modelRef.current.position.x = targetX;
      
      const targetRotationY = THREE.MathUtils.lerp(
        INITIAL_ROTATION + INITIAL_ROTATION_OFFSET, 
        INITIAL_ROTATION + 0.2, 
        progress * 2
      );
      modelRef.current.rotation.y = targetRotationY;
    } 
    // Вторая фаза — центрирование и масштабирование
    else {
      const centerProgress = (progress - 0.5) * 2;
      const targetX = THREE.MathUtils.lerp(-1.5, -0.2, centerProgress);
      const targetScale = THREE.MathUtils.lerp(INITIAL_SCALE, INITIAL_SCALE * 0.8, centerProgress);
      
      modelRef.current.position.x = targetX;
      modelRef.current.scale.set(targetScale, targetScale, targetScale);
    }
  }, [progress, INITIAL_X, INITIAL_Y, INITIAL_ROTATION, INITIAL_ROTATION_OFFSET, INITIAL_SCALE]);

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={INITIAL_SCALE}
      position={[INITIAL_X, INITIAL_Y, 0]} 
      rotation={[-0.1, INITIAL_ROTATION + INITIAL_ROTATION_OFFSET, 0]} 
    />
  );
};

// Десктопная версия с анимацией по скроллу
const DesktopTabletScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Обработчик скролла внутри контейнера
  const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Обновляем прогресс скролла от 0 до 1
    const newProgress = Math.max(0, Math.min(1, scrollProgress + (e.deltaY * 0.001)));
    setScrollProgress(newProgress);
    
    return false;
  };
  
  // Анимационные значения для текстовых блоков
  const featureOpacity = Math.max(0, Math.min(1, 1 - ((scrollProgress - 0.3) / 0.3)));
  const featureTranslateX = -90 + (scrollProgress * 180);
  
  const designOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.6) / 0.3));
  const designTranslateY = 100 - (scrollProgress - 0.6) * 300;
  
  return (
    <div 
      className="tablet-static-container" 
      ref={containerRef} 
      onWheel={handleScroll}
      style={{
        // Делаем контейнер на полный экран и прокручиваемым только внутри
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <div className="tablet-sticky-wrapper" style={{ marginTop: '50px' }}>
        {/* 3D модель */}
        <div className="tablet-3d-container">
          <Canvas 
            style={{ 
              background: 'transparent',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 5
            }}
          >
            <Suspense fallback={<Html center><div style={{color: "white"}}>Загрузка...</div></Html>}>
              <ambientLight intensity={0.6} />
              <directionalLight 
                position={[0, 10, 5]} 
                intensity={1.2}
                color="#ffffff"
              />
              <spotLight 
                position={[5, 5, 5]} 
                angle={0.25} 
                penumbra={1} 
                intensity={1.2}
                color="#ffffff"
              />
              <spotLight 
                position={[-5, 5, 5]} 
                angle={0.25} 
                penumbra={1} 
                intensity={0.8}
                color="#d1e6ff"
              />
              <spotLight 
                position={[0, -5, 5]} 
                angle={0.3} 
                penumbra={1} 
                intensity={0.6}
                color="#ffd1e6"
              />
              <TabletModelWithProgress progress={scrollProgress} />
              <OrbitControls 
                enableZoom={false}
                enablePan={false}
                enableRotate={false}
              />
            </Suspense>
          </Canvas>
        </div>
        
        {/* Описание характеристик */}
        <div 
          className="tablet-features"
          style={{
            opacity: featureOpacity,
            transform: `translateX(${featureTranslateX}%)`,
            visibility: featureOpacity > 0.01 ? 'visible' : 'hidden'
          }}
        >
          <h2>NoName Tab S8 Ultra</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Большой экран</h3>
              <p>14.6-дюймовый Super AMOLED дисплей с частотой 120 Гц</p>
            </div>
            <div className="feature-card">
              <h3>Производительность</h3>
              <p>Snapdragon 8 Gen 1 для максимальной мощности</p>
            </div>
            <div className="feature-card">
              <h3>Батарея</h3>
              <p>11200 мАч для длительной работы</p>
            </div>
            <div className="feature-card">
              <h3>S Pen</h3>
              <p>Мгновенный отклик и естественное письмо</p>
            </div>
          </div>
        </div>
        
        {/* Блок с описанием инновационного дизайна */}
        <div 
          className="tablet-design"
          style={{
            opacity: designOpacity,
            transform: `translate(-50%, ${designTranslateY}%)`,
            left: '50%',
            position: 'absolute',
            visibility: designOpacity > 0.01 ? 'visible' : 'hidden'
          }}
        >
          <h2>Инновационный дизайн</h2>
          <p>
            Ультратонкий корпус с минималистичным дизайном, 
            который идеально впишется в любой интерьер. 
            Легкий, но прочный материал создан для комфорта 
            и долговечности.
          </p>
        </div>
      </div>
    </div>
  );
};

// Основной компонент
const TabletScene: React.FC = () => {
  const { isMobile, isTablet } = useDeviceDetect();
  
  // Вешаем стили overflow в зависимости от устройства
  useEffect(() => {
    if (!isMobile && !isTablet) {
      // Десктоп: блокируем прокрутку body, чтобы прокручивался только контейнер
      document.body.style.overflow = 'hidden';
    } else {
      // Мобильные/планшеты: включаем обычный скролл
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, isTablet]);
  
  return (isMobile || isTablet) ? <MobileTabletScene /> : <DesktopTabletScene />;
};

// Предзагрузка модели  
useGLTF.preload('./galaxy_tab_s8_ultra.glb');

export default TabletScene;
