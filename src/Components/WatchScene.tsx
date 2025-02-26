import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Html, useGLTF } from '@react-three/drei';
import { motion, useScroll } from 'framer-motion';
import * as THREE from 'three';
import LiquidMetalBackground from './LiquidMetalBackground';
import WatchSpecs from './WatchSpecs';
import SecondWatch from './SecondWatch';
import { useDeviceDetect } from '../hooks/useDeviceDetect';

// Мобильная версия WatchScene, полностью переработанная
const MobileWatchScene: React.FC = () => {
  // Эффект для включения прокрутки
  useEffect(() => {
    // Очищаем все что может мешать прокрутке
    const originalStyle = {
      overflow: document.body.style.overflow,
      height: document.body.style.height,
      position: document.body.style.position
    };

    // Принудительно включаем прокрутку
    document.body.style.overflow = 'visible';
    document.body.style.height = 'auto';
    document.body.style.position = 'static';
    
    // Убираем все фиксированные элементы, которые могут мешать прокрутке
    const scrollContainer = document.documentElement;
    scrollContainer.scrollTop = 0;
    
    return () => {
      // Восстанавливаем стили при размонтировании
      document.body.style.overflow = originalStyle.overflow;
      document.body.style.height = originalStyle.height;
      document.body.style.position = originalStyle.position;
    };
  }, []);

  return (
    <div className="mobile-watch-page">
      {/* Заголовок страницы */}
      <header className="mobile-watch-header">
        <h1>NoName Watch 5 Pro</h1>
        <p>Инновационные часы для активной жизни</p>
      </header>

      {/* Изображение часов */}
      <div className="mobile-watch-image-container">
        <img 
          src="/Watch_mobile_photo.png" 
          alt="NoName Watch 5 Pro"
          className="mobile-watch-main-image"
        />
      </div>

      {/* Блоки с характеристиками */}
      <div className="mobile-watch-features">
        <div className="mobile-feature-block">
          <h2>Мониторинг здоровья</h2>
          <p>Непрерывное отслеживание пульса, качества сна и уровня стресса с расширенными алгоритмами анализа данных.</p>
        </div>
        
        <div className="mobile-feature-block">
          <h2>Защита от воды</h2>
          <p>Водонепроницаемость 5ATM и защита IP68 позволяют использовать часы при плавании и занятиях водными видами спорта.</p>
        </div>
        
        <div className="mobile-feature-block">
          <h2>Батарея</h2>
          <p>До 50 часов работы без подзарядки благодаря оптимизированному энергопотреблению и емкому аккумулятору.</p>
        </div>
        
        <div className="mobile-feature-block">
          <h2>Фитнес-функции</h2>
          <p>Более 90 режимов тренировок и автоматическое распознавание активности для точного отслеживания всех ваших занятий.</p>
        </div>
      </div>

      {/* Секция с техническими характеристиками */}
      <section className="mobile-specs-section">
        <h2>Технические характеристики</h2>
        
        <div className="mobile-specs-list">
          <div className="mobile-spec-block">
            <div className="spec-icon-container display-icon">
              <span className="spec-icon">🔍</span>
            </div>
            <h3>Дисплей</h3>
            <ul>
              <li>Super AMOLED</li>
              <li>450 x 450 пикселей</li>
              <li>Всегда активный режим</li>
            </ul>
          </div>
          
          <div className="mobile-spec-block">
            <div className="spec-icon-container processor-icon">
              <span className="spec-icon">⚡</span>
            </div>
            <h3>Процессор</h3>
            <ul>
              <li>Exynos W930</li>
              <li>Dual Core 1.18GHz</li>
              <li>1.5GB RAM</li>
            </ul>
          </div>
          
          <div className="mobile-spec-block">
            <div className="spec-icon-container connection-icon">
              <span className="spec-icon">📱</span>
            </div>
            <h3>Связь</h3>
            <ul>
              <li>Bluetooth 5.2</li>
              <li>Wi-Fi</li>
              <li>NFC для платежей</li>
            </ul>
          </div>
          
          <div className="mobile-spec-block">
            <div className="spec-icon-container protection-icon">
              <span className="spec-icon">💧</span>
            </div>
            <h3>Защита</h3>
            <ul>
              <li>5ATM + IP68</li>
              <li>Закаленное стекло</li>
              <li>Прочный корпус</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Дополнительный текст в конце страницы */}
      <div className="mobile-watch-footer">
        <p>Превосходство в каждой детали</p>
      </div>
    </div>
  );
};

// Десктопная версия остается без изменений...

// Основной компонент WatchScene, который выбирает версию
const WatchScene: React.FC = () => {
  const { isMobile, isTablet } = useDeviceDetect();
  const isTouchDevice = isMobile || isTablet;

  return isTouchDevice ? <MobileWatchScene /> : <DesktopWatchScene />;
};

// Копируем весь код десктопной версии из предыдущего кода
const DesktopWatchScene: React.FC = () => {
  return (
    <div style={{ position: 'relative' }}>
      {/* Фоновый эффект */}
      <div className="canvas-background" style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: 1 
      }}>
        <Canvas camera={{ position: [0, 0, 2.5], fov: 75 }}>
          <Suspense fallback={null}>
            <LiquidMetalBackground 
              colorA={new THREE.Color('#4a0072')}
              colorB={new THREE.Color('#00d4ff')}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Первая модель часов */}
      <div style={{ 
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2
      }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <Suspense fallback={<Html center><div className="loading">Загрузка модели...</div></Html>}>
            <ambientLight intensity={1.5} />
            <directionalLight 
              position={[5, 5, 5]} 
              intensity={2} 
              castShadow={false} 
              color="#ffffff" 
            />
            <spotLight 
              position={[5, 5, 0]} 
              intensity={2} 
              angle={0.5} 
              penumbra={0.5} 
              color="#ffffff"
              castShadow={false}
            />
            <spotLight 
              position={[-5, 5, 0]} 
              intensity={1.5} 
              angle={0.5} 
              penumbra={0.5} 
              color="#ffffff"
              castShadow={false}
            />
            <spotLight 
              position={[0, -5, 5]} 
              intensity={1} 
              angle={0.5} 
              penumbra={0.5} 
              color="#4a9eff"
              castShadow={false}
            />
            <Stage
              environment="city"
              intensity={1}
              preset="rembrandt"
              adjustCamera={false}
              shadows={false}
            >
              <WatchModel />
            </Stage>
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              enableRotate={false}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Текстовый контент */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 10
      }}>
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          color: 'white',
          maxWidth: '600px'
        }}>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ 
              fontSize: '4rem',
              marginBottom: '1rem'
            }}
          >
            NoName Watch 5
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ 
              fontSize: '1.5rem',
              opacity: 0.8,
              maxWidth: '500px'
            }}
          >
            Инновационные часы для активной жизни
          </motion.p>
        </div>
      </div>

      {/* Основной контент */}
      <div style={{ 
        padding: '6rem 2rem',
        position: 'relative',
        zIndex: 20
      }}>
        <div style={{ color: 'white', width: '100%' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
          >
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>NoName Watch 5</h2>
              <div style={{ display: 'grid', gap: '2rem' }}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '1.5rem',
                    borderRadius: '15px',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <h3 style={{ marginBottom: '0.5rem' }}>Мониторинг здоровья</h3>
                  <p style={{ opacity: 0.8 }}>Непрерывное отслеживание пульса, качества сна и уровня стресса</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '1.5rem',
                    borderRadius: '15px',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <h3 style={{ marginBottom: '0.5rem' }}>Защита от воды</h3>
                  <p style={{ opacity: 0.8 }}>Водонепроницаемость 5ATM и защита IP68</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '1.5rem',
                    borderRadius: '15px',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <h3 style={{ marginBottom: '0.5rem' }}>Батарея</h3>
                  <p style={{ opacity: 0.8 }}>До 50 часов работы без подзарядки</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '1.5rem',
                    borderRadius: '15px',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <h3 style={{ marginBottom: '0.5rem' }}>Фитнес-функции</h3>
                  <p style={{ opacity: 0.8 }}>Более 90 режимов тренировок и автоматическое распознавание активности</p>
                </motion.div>
              </div>
            </div>
            
            <WatchSpecs/>
          </motion.div>
        </div>
      </div>

      {/* Вторая модель часов */}
      <div style={{ 
        height: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 21
      }}>
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ 
            position: 'absolute',
            width: '100%',
            height: '100%'
          }}
        >
          <Suspense fallback={<Html center><div className="loading">Загрузка модели...</div></Html>}>
            <ambientLight intensity={2} />
            <directionalLight 
              position={[5, 5, 5]} 
              intensity={3} 
              color="#ffffff" 
            />
            <spotLight
              position={[5, 5, 0]}
              intensity={2}
              angle={0.5}
              penumbra={0.5}
              color="#ffffff"
            />
            <spotLight
              position={[-5, 5, 0]}
              intensity={1.5}
              angle={0.5}
              penumbra={0.5}
              color="#ffffff"
            />
            <Stage
              environment="city"
              intensity={1}
              preset="rembrandt"
              adjustCamera={false}
            >
              <SecondWatch />
            </Stage>
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              enableRotate={false}
            />
          </Suspense>
        </Canvas>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'absolute',
            left: '10%',
            color: 'white',
            maxWidth: '400px',
            zIndex: 22
          }}
        >
          <h2 style={{ 
            fontSize: '2.5rem',
            marginBottom: '1rem'
          }}>
            NoName Watch 5 Pro
          </h2>
          <p style={{ 
            fontSize: '1.2rem',
            opacity: 0.8,
            lineHeight: 1.6
          }}>
            Откройте новые возможности с продвинутой версией наших умных часов
          </p>
        </motion.div>
      </div>
    </div>
  );
};

// Компонент WatchModel для десктопной версии
const WatchModel = () => {
  const { scene } = useGLTF('./samsung__galaxy__watch_5.glb');
  const modelRef = useRef<THREE.Group>(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.metalness = 0.9;
            child.material.roughness = 0.1;
            child.material.envMapIntensity = 1.5;
          }
        }
      });
    }
  }, [scene]);

  useEffect(() => {
    let animationFrameId: number;
    let rotation = 0;

    const animate = () => {
      if (modelRef.current) {
        rotation += 0.003;
        modelRef.current.rotation.y = rotation;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((progress: number) => {
      if (modelRef.current) {
        const limitedProgress = Math.min(progress, 0.7);
        
        if (progress > 0.6) {
          const fadeOutProgress = (progress - 0.6) / 0.1;
          modelRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
              child.material.transparent = true;
              child.material.opacity = 1 - fadeOutProgress;
            }
          });
        } else {
          modelRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
              child.material.opacity = 1;
            }
          });
        }

        const targetX = limitedProgress * 6;
        modelRef.current.position.x = THREE.MathUtils.lerp(0, targetX, limitedProgress);
        
        const startScale = 30.0;
        const endScale = 40.0;
        const currentScale = THREE.MathUtils.lerp(startScale, endScale, limitedProgress);
        modelRef.current.scale.setScalar(currentScale);
        
        modelRef.current.position.z = THREE.MathUtils.lerp(-1, -4, limitedProgress);
        modelRef.current.rotation.x = THREE.MathUtils.lerp(0, 0.3, limitedProgress);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={30.0}
      position={[0, 0, -1]}
    />
  );
};

// Предзагрузка моделей для десктопной версии
useGLTF.preload('./samsung__galaxy__watch_5.glb');
useGLTF.preload('./second_watch.glb');

export default WatchScene;