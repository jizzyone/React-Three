import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Html, useGLTF } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';
import LiquidMetalBackground from './LiquidMetalBackground';
import { useDeviceDetect } from '../hooks/useDeviceDetect';
import "../styles/TabletScene.css"

// Мобильная версия TabletScene с статическим изображением
const MobileTabletScene: React.FC = () => {
  // Эффект для включения прокрутки
  useEffect(() => {
    // Очищаем все, что может мешать прокрутке
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
    <div className="mobile-tablet-page">
      {/* Заголовок страницы */}
      <header className="mobile-tablet-header">
        <h1>NoName Tab S8 Ultra</h1>
        <p>Инновационный планшет для творчества и продуктивности</p>
      </header>

      {/* Изображение планшета */}
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

      {/* Блоки с характеристиками */}
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

      {/* Секция с техническими характеристиками */}
      <section className="mobile-specs-section">
        <h2>Технические характеристики</h2>
        
        <div className="mobile-specs-list">
          <div className="mobile-spec-block">
            <div className="spec-icon-container display-icon">
              <span className="spec-icon">🖥️</span>
            </div>
            <h3>Дисплей</h3>
            <ul>
              <li>Super AMOLED</li>
              <li>14.6 дюймов</li>
              <li>120 Гц</li>
              <li>2960 x 1848 (WQXGA+)</li>
            </ul>
          </div>
          
          <div className="mobile-spec-block">
            <div className="spec-icon-container processor-icon">
              <span className="spec-icon">⚡</span>
            </div>
            <h3>Процессор</h3>
            <ul>
              <li>Snapdragon 8 Gen 1</li>
              <li>8-ядерный</li>
              <li>4 нм техпроцесс</li>
              <li>До 3.0 ГГц</li>
            </ul>
          </div>
          
          <div className="mobile-spec-block">
            <div className="spec-icon-container memory-icon">
              <span className="spec-icon">💾</span>
            </div>
            <h3>Память</h3>
            <ul>
              <li>8/12/16 ГБ RAM</li>
              <li>128/256/512 ГБ ROM</li>
              <li>Слот microSD (до 1ТБ)</li>
            </ul>
          </div>
          
          <div className="mobile-spec-block">
            <div className="spec-icon-container camera-icon">
              <span className="spec-icon">📷</span>
            </div>
            <h3>Камеры</h3>
            <ul>
              <li>Основная: 13 МП</li>
              <li>Фронтальная: 12 МП</li>
              <li>Ультраширокая: 12 МП</li>
              <li>4K видео @ 60fps</li>
            </ul>
          </div>

          <div className="mobile-spec-block">
            <div className="spec-icon-container battery-icon">
              <span className="spec-icon">🔋</span>
            </div>
            <h3>Батарея</h3>
            <ul>
              <li>11200 мАч</li>
              <li>Быстрая зарядка 45 Вт</li>
              <li>До 14 часов работы</li>
            </ul>
          </div>
          
          <div className="mobile-spec-block">
            <div className="spec-icon-container connection-icon">
              <span className="spec-icon">🌐</span>
            </div>
            <h3>Связь</h3>
            <ul>
              <li>Wi-Fi 6E</li>
              <li>Bluetooth 5.2</li>
              <li>USB Type-C</li>
              <li>LTE/5G (опционально)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Дополнительный блок о S Pen */}
      <div className="mobile-tablet-spen-section">
        <div className="spen-content">
          <h2>S Pen в комплекте</h2>
          <p>Создавайте, редактируйте и управляйте контентом с максимальной точностью благодаря стилусу с минимальной задержкой.</p>
          
          <ul className="spen-features">
            <li>Задержка всего 2.8 мс</li>
            <li>4096 уровней нажатия</li>
            <li>Специальные приложения для творчества</li>
            <li>Магнитное крепление к планшету</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Оставляем оригинальную десктопную версию без изменений
// ...

// Главный компонент TabletScene, который выбирает версию
const TabletScene: React.FC = () => {
  const { isMobile, isTablet } = useDeviceDetect();
  const isTouchDevice = isMobile || isTablet;

  return isTouchDevice ? <MobileTabletScene /> : <DesktopTabletScene />;
};

// Десктопная версия TabletScene (оставляем без изменений)
const DesktopTabletScene: React.FC = () => {
  const TabletModel = () => {
    const { scene } = useGLTF('./galaxy_tab_s8_ultra.glb');
    const modelRef = useRef<THREE.Group>(null);
    const { scrollYProgress } = useScroll();
  
    const INITIAL_X = 1;
    const INITIAL_ROTATION = Math.PI;
    const INITIAL_ROTATION_OFFSET = -0.3;
  
    useEffect(() => {
      const unsubscribe = scrollYProgress.onChange((progress: number) => {
        if (modelRef.current) {
          // Первая фаза - движение влево
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
          // Вторая фаза - центрирование и масштабирование
          else {
            const centerProgress = (progress - 0.5) * 2;
            const targetX = THREE.MathUtils.lerp(-1.5, -0.2, centerProgress);
            const targetScale = THREE.MathUtils.lerp(0.8, 0.6, centerProgress);
            
            modelRef.current.position.x = targetX;
            modelRef.current.scale.set(targetScale, targetScale, targetScale);
          }
        }
      });
  
      return () => unsubscribe();
    }, [scrollYProgress]);
  
    return (
      <primitive 
        ref={modelRef}
        object={scene} 
        scale={0.8}
        position={[INITIAL_X, 0, 0]} 
        rotation={[-0.1, INITIAL_ROTATION + INITIAL_ROTATION_OFFSET, 0]} 
      />
    );
  };
  
  const TabletFeatures = () => {
    const { scrollYProgress } = useScroll();
    
    // Движение слева направо (0 -> 0.6)
    const x = useTransform(
      scrollYProgress,
      [0, 0.6],
      ['-90%', '-10%']
    );
  
    // Сохраняем полную видимость до 0.7, затем плавно исчезаем
    const opacity = useTransform(
      scrollYProgress,
      [0, 0.7, 0.8],
      [1, 1, 0]
    );
  
    return (
      <motion.div 
        style={{ 
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          maxWidth: '800px',
          width: '100%',
          zIndex: 1,
          padding: '0 10%',
          pointerEvents: 'none',
          x,
          opacity
        }}
      >
        <motion.h2 
          style={{ 
            fontSize: '3.5rem', 
            marginBottom: '2rem'
          }}
        >
          NoName Tab S8 Ultra
        </motion.h2>
        <div style={{ 
          display: 'grid', 
          gap: '2rem',
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}>
          <Feature 
            title="Большой экран" 
            description="14.6-дюймовый Super AMOLED дисплей с частотой 120 Гц"
          />
          <Feature 
            title="Производительность" 
            description="Snapdragon 8 Gen 1 для максимальной мощности"
          />
          <Feature 
            title="Батарея" 
            description="11200 мАч для длительной работы"
          />
          <Feature 
            title="S Pen" 
            description="Мгновенный отклик и естественное письмо"
          />
        </div>
      </motion.div>
    );
  };
  
  const NewSectionText = () => {
    const { scrollYProgress } = useScroll();
    
    // Начинаем появляться только после того, как первый текст исчез
    const opacity = useTransform(
      scrollYProgress,
      [0.8, 0.85, 1, 1.2],
      [0, 1, 1, 0]
    );
  
    // Движение снизу начинается позже
    const y = useTransform(
      scrollYProgress,
      [0.8, 1.2],
      ['100%', '-60%']
    );
  
    return (
      <motion.div 
        style={{
          position: 'absolute',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          maxWidth: '800px',
          width: '100%',
          textAlign: 'center',
          opacity,
          zIndex: 10,
          y
        }}
      >
        <h2 style={{ 
          fontSize: '3rem', 
          marginBottom: '1.5rem' 
        }}>
          Инновационный дизайн
        </h2>
        <p style={{ 
          fontSize: '1.2rem', 
          lineHeight: 1.6,
          opacity: 0.8 
        }}>
          Ультратонкий корпус с минималистичным дизайном, 
          который идеально впишется в любой интерьер. 
          Легкий, но прочный материал создан для комфорта 
          и долговечности.
        </p>
      </motion.div>
    );
  };

  return (
    <div style={{ 
      minHeight: '300vh'
    }}>
      <div style={{
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <Canvas 
          camera={{ position: [0, 0, 2.5], fov: 75 }}
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1
          }}
        >
          <Suspense fallback={null}>
            <LiquidMetalBackground 
              colorA={new THREE.Color('#1A237E')}
              colorB={new THREE.Color('#7986CB')}
            />
          </Suspense>
        </Canvas>
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1
          }}
        >
          <Suspense fallback={<Html center><div className="loading">Загрузка модели...</div></Html>}>
            <ambientLight intensity={0.3} />
            <spotLight 
              position={[5, 5, 5]} 
              angle={0.15} 
              penumbra={1} 
              intensity={0.8}
              color="#ffffff"
            />
            <spotLight 
              position={[-5, 5, 5]} 
              angle={0.15} 
              penumbra={1} 
              intensity={0.4}
              color="#d1e6ff"
            />
            <spotLight 
              position={[0, -5, 5]} 
              angle={0.15} 
              penumbra={1} 
              intensity={0.2}
              color="#ffd1e6"
            />
            <directionalLight 
              position={[0, 5, 5]}
              intensity={0.3}
              color="#ffffff"
            />
            <Stage
              environment="city"
              intensity={0.3}
              preset="rembrandt"
              adjustCamera={false}
            >
              <TabletModel />
            </Stage>
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              enableRotate={false}
            />
          </Suspense>
        </Canvas>
        <TabletFeatures />
        <NewSectionText />
      </div>
    </div>
  );
};

// Вспомогательный компонент Feature для десктопной версии
const Feature = ({ title, description }: { title: string; description: string }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '1.5rem',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)'
      }}
    >
      <h3 style={{ marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ opacity: 0.8 }}>{description}</p>
    </motion.div>
  );
};

// Предзагрузка модели только для десктопной версии
useGLTF.preload('./galaxy_tab_s8_ultra.glb');

export default TabletScene;