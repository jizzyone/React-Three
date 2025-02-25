import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Html, useGLTF } from '@react-three/drei';
import { motion, useScroll } from 'framer-motion';
import * as THREE from 'three';
import LiquidMetalBackground from './LiquidMetalBackground';
import WatchSpecs from './WatchSpecs';
import SecondWatch from './SecondWatch';
import { useDeviceDetect } from '../hooks/useDeviceDetect';

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
        // Ограничиваем прогресс значением 0.7
        const limitedProgress = Math.min(progress, 0.7);
        
        // Вычисляем прозрачность
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

const WatchFeatures = () => {
  return (
    <div style={{ color: 'white', width: '100%' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1 }}
      >
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
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
        </div>
        
        <WatchSpecs/>
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
  const { isMobile, isTablet } = useDeviceDetect();
  const isTouchDevice = isMobile || isTablet;

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
        <Canvas 
          camera={{ position: [0, 0, 2.5], fov: 75 }}
          style={{ pointerEvents: isTouchDevice ? 'none' : 'auto' }}
        >
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
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ pointerEvents: isTouchDevice ? 'none' : 'auto' }}
        >
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
        // background: 'linear-gradient(to bottom, rgba(26, 26, 46, 0.8), rgba(15, 15, 30, 0.9))',
        zIndex: 20
      }}>
        <WatchFeatures />
      </div>

      {/* Вторая модель часов */}
      <div style={{ 
        height: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // background: 'linear-gradient(to bottom, rgba(26, 26, 46, 0.8), rgba(15, 15, 30, 0.9))',
        zIndex: 21
      }}>
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ 
            position: 'absolute',
            width: '100%',
            height: '100%',
            pointerEvents: isTouchDevice ? 'none' : 'auto'
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

// Предзагрузка моделей
useGLTF.preload('./samsung__galaxy__watch_5.glb');
useGLTF.preload('./second_watch.glb');

export default WatchScene;