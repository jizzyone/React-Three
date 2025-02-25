import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, Html, useGLTF } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';
import LiquidMetalBackground from './LiquidMetalBackground';
import { useDeviceDetect } from '../hooks/useDeviceDetect';

// Компонент Feature для обеих версий
const Feature = ({ title, description }: { title: string; description: string }) => {
  const { isMobile, isTablet } = useDeviceDetect();
  const isTouchDevice = isMobile || isTablet;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: isTouchDevice ? '1rem' : '1.5rem',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)'
      }}
    >
      <h3 style={{ 
        marginBottom: '0.5rem',
        fontSize: isTouchDevice ? '1rem' : 'inherit'
      }}>{title}</h3>
      <p style={{ 
        opacity: 0.8,
        fontSize: isTouchDevice ? '0.9rem' : 'inherit'
      }}>{description}</p>
    </motion.div>
  );
};

// Мобильная версия компонента модели планшета (новая)
const TabletModelMobile = () => {
  const { scene } = useGLTF('./galaxy_tab_s8_ultra.glb');
  const modelRef = useRef<THREE.Group>(null);
  
  // Упрощенная анимация для мобильных устройств
  useEffect(() => {
    if (modelRef.current && scene) {
      modelRef.current.rotation.y = Math.PI;
    }
  }, [scene]);

  // Автоматическое вращение для мобильных устройств
  useFrame((state: { clock: { getElapsedTime: () => number } }) => {
    if (modelRef.current) {
      const time = state.clock.getElapsedTime();
      modelRef.current.rotation.y = Math.PI + Math.sin(time * 0.2) * 0.2;
    }
  });

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={0.5}
      position={[0, 0, 0]} 
      rotation={[0, Math.PI, 0]} 
    />
  );
};

// Мобильная версия компонента TabletScene (новая)
const MobileTabletScene = () => {
  return (
    <div className="tablet-scene-container" style={{ 
      minHeight: '100vh',
      overflowX: 'hidden',
      maxWidth: '100vw',
      position: 'relative',
      backgroundColor: '#1a1a2e'
    }}>
      {/* Фоновый градиент */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(to bottom, #1A237E 0%, #3949AB 70%, #1a1a2e 100%)',
        opacity: 0.6,
        zIndex: 0
      }} />
      
      {/* Заголовок */}
      <div style={{
        position: 'relative',
        padding: '120px 20px 40px',
        textAlign: 'center',
        color: 'white',
        zIndex: 2
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          marginBottom: '1rem' 
        }}>
          NoName Tab S8 Ultra
        </h1>
        <p style={{ 
          fontSize: '1rem',
          opacity: 0.8,
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          Инновационный планшет для творчества и продуктивности
        </p>
      </div>
      
      {/* Модель планшета с характеристиками */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        minHeight: '70vh',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Колонка с моделью */}
        <div style={{
          width: '100%',
          height: '40vh',
          position: 'relative'
        }}>
          <Canvas 
            camera={{ position: [0, 0, 5], fov: 50 }}
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none'
            }}
          >
            <Suspense fallback={<Html center><div className="loading">Загрузка модели...</div></Html>}>
              <ambientLight intensity={0.6} />
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
              <Stage
                environment="city"
                intensity={0.3}
                preset="rembrandt"
                adjustCamera={false}
              >
                <TabletModelMobile />
              </Stage>
            </Suspense>
          </Canvas>
        </div>
        
        {/* Колонка с характеристиками */}
        <div style={{
          width: '100%',
          padding: '20px'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            color: 'white',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            Характеристики
          </h2>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
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
        </div>
      </div>
      
      {/* Дополнительный раздел */}
      <div style={{
        padding: '60px 0',
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom, transparent, rgba(26, 26, 46, 0.8))'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '800px',
          textAlign: 'center',
          color: 'white',
          padding: '0 20px'
        }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            marginBottom: '1.5rem' 
          }}>
            Инновационный дизайн
          </h2>
          <p style={{ 
            fontSize: '1rem', 
            lineHeight: 1.6,
            opacity: 0.8
          }}>
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

// ПК версия TabletScene - ОРИГИНАЛ из прикрепленного файла
const DesktopTabletScene = () => {
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
      ['-90%', '-10%']  // Добавляем запас справа
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
      [0.8, 0.85, 1, 1.2],  // Сдвигаем начало появления
      [0, 1, 1, 0]
    );
  
    // Движение снизу начинается позже
    const y = useTransform(
      scrollYProgress,
      [0.8, 1.2],  // Синхронизируем с началом появления
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
              colorA={new THREE.Color('#1A237E')}  // Темно-синий
              colorB={new THREE.Color('#7986CB')}  // Светло-фиолетовый
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

// Главный компонент TabletScene, который выбирает между мобильной и ПК версиями
const TabletScene: React.FC = () => {
  const { isMobile, isTablet } = useDeviceDetect();
  const isTouchDevice = isMobile || isTablet;

  // Выбираем версию компонента в зависимости от типа устройства
  return isTouchDevice ? <MobileTabletScene /> : <DesktopTabletScene />;
};

export default TabletScene;