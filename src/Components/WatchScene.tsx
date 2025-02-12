import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Html, useGLTF } from '@react-three/drei';
import { motion, useScroll } from 'framer-motion';
import * as THREE from 'three';
import LiquidMetalBackground from './LiquidMetalBackground';

const WatchModel = () => {
  const { scene } = useGLTF('./samsung__galaxy__watch_5.glb');
  const modelRef = useRef<THREE.Group>(null);
  const { scrollYProgress } = useScroll();

  // Базовая анимация вращения
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

  // Анимация перемещения при скролле
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((progress: number) => {
      if (modelRef.current) {
        // Увеличили смещение вправо для конечной позиции
        const targetX = progress * 6; // Увеличили множитель с 5 до 8
        modelRef.current.position.x = THREE.MathUtils.lerp(0, targetX, progress);
        
        // Значительное увеличение размера при скролле
        const startScale = 30.0;
        const endScale = 40.0;
        const currentScale = THREE.MathUtils.lerp(startScale, endScale, progress);
        modelRef.current.scale.setScalar(currentScale);
        
        // Большее смещение назад для эффекта глубины
        modelRef.current.position.z = THREE.MathUtils.lerp(-1, -4, progress);
        
        // Небольшой наклон для динамики
        modelRef.current.rotation.x = THREE.MathUtils.lerp(0, 0.3, progress);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={30.0} // Значительно увеличили начальный размер
      position={[0, 0, -1]}
    />
  );
};

const WatchFeatures = () => {
  return (
    <div style={{ color: 'white', maxWidth: '600px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>NoName Watch 5</h2>
        <div style={{ display: 'grid', gap: '2rem' }}>
          <Feature 
            title="Мониторинг здоровья" 
            description="Непрерывное отслеживание пульса, качества сна и уровня стресса"
          />
          <Feature 
            title="Защита от воды" 
            description="Водонепроницаемость 5ATM и защита IP68"
          />
          <Feature 
            title="Батарея" 
            description="До 50 часов работы без подзарядки"
          />
          <Feature 
            title="Фитнес-функции" 
            description="Более 90 режимов тренировок и автоматическое распознавание активности"
          />
        </div>
      </motion.div>
    </div>
  );
};

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

const WatchScene: React.FC = () => {
  return (
    <div style={{ position: 'relative' }}>
      {/* Фоновый эффект */}
      <div className="canvas-background">
        <Canvas camera={{ position: [0, 0, 2.5], fov: 75 }}>
          <Suspense fallback={null}>
            <LiquidMetalBackground 
              colorA={new THREE.Color('#4a0072')}  // Тёмно-фиолетовый
              colorB={new THREE.Color('#00d4ff')}  // Голубой
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Абсолютно позиционированный контейнер для текста */}
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

      {/* Контейнер для скроллящегося контента */}
      <div style={{ minHeight: '200vh' }}>
        <div className="hero-section" style={{ 
          height: '100vh',
          position: 'sticky',
          top: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible',
          zIndex:10
        }}>
          <div style={{ 
            position: 'absolute',
            height: '100vh', 
            width: '100%',
            overflow: 'visible'
          }}>
            <Canvas 
              camera={{ position: [0, 0, 5], fov: 50 }}
              style={{ overflow: 'visible' }}
            >
              <Suspense fallback={<Html center><div className="loading">Загрузка модели...</div></Html>}>
                <ambientLight intensity={0.3} />
                
                {/* Основной направленный свет спереди */}
                <directionalLight 
                  position={[5, 5, 5]}
                  intensity={0.7}
                  castShadow={false}
                  color="#ffffff"
                />

                {/* Задняя подсветка для объема */}
                <spotLight
                  position={[-5, 0, -5]}
                  intensity={0.5}
                  angle={0.6}
                  penumbra={1}
                  color="#4a9eff"
                />

                {/* Верхняя подсветка для бликов */}
                <spotLight
                  position={[0, 10, 0]}
                  intensity={0.8}
                  angle={0.5}
                  penumbra={0.5}
                  color="#ffffff"
                />

                {/* Нижняя подсветка для заполнения теней */}
                <spotLight
                  position={[0, -10, 0]}
                  intensity={0.2}
                  angle={0.5}
                  penumbra={1}
                  color="#4a9eff"
                />

                <WatchModel />
                <OrbitControls 
                  enableZoom={false}
                  enablePan={false}
                  enableRotate={false}
                />
              </Suspense>
            </Canvas>
          </div>
        </div>

        <div style={{ 
          padding: '6rem 2rem',
          position: 'relative',
          zIndex: 2
        }}>
          <WatchFeatures />
        </div>
      </div>
    </div>
  );
};

export default WatchScene; 