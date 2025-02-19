import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import '../styles/Scene.css';
import { OrbitControls, Stage, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import LiquidMetalBackground from './LiquidMetalBackground';
import { useDeviceDetect } from '../hooks/useDeviceDetect';
import MobileDeviceDisplay from './MobileDeviceDisplay';

const AnimatedLights: React.FC = () => {
  const spotLight1 = useRef<THREE.SpotLight>(null);
  const spotLight2 = useRef<THREE.SpotLight>(null);
  const spotLight3 = useRef<THREE.SpotLight>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    if (spotLight1.current) {
      spotLight1.current.position.x = Math.sin(time * 0.7) * 3;
      spotLight1.current.position.y = Math.cos(time * 0.5) * 3;
      spotLight1.current.position.z = Math.cos(time * 0.3) * 3;
    }

    if (spotLight2.current) {
      spotLight2.current.position.x = Math.cos(time * 0.3) * 3;
      spotLight2.current.position.y = Math.sin(time * 0.7) * 3;
      spotLight2.current.position.z = Math.sin(time * 0.5) * 3;
    }

    if (spotLight3.current) {
      spotLight3.current.position.x = Math.sin(time * 0.5) * 3;
      spotLight3.current.position.y = Math.cos(time * 0.3) * 3;
      spotLight3.current.position.z = Math.sin(time * 0.7) * 3;
    }
  });

  return (
    <>
      <spotLight
        ref={spotLight1}
        color="#4466ff"
        intensity={0.7}
        position={[3, 2, 1]}
        angle={0.6}
        penumbra={0.7}
        decay={2}
      />
      <spotLight
        ref={spotLight2}
        color="#ff66dd"
        intensity={0.6}
        position={[-3, -2, 2]}
        angle={0.6}
        penumbra={0.7}
        decay={2}
      />
      <spotLight
        ref={spotLight3}
        color="#ffaa00"
        intensity={0.5}
        position={[2, -3, -1]}
        angle={0.6}
        penumbra={0.7}
        decay={2}
      />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={0.4} 
        color="#ffffff"
      />
    </>
  );
};

const TextContent: React.FC<{ progress: number }> = ({ progress }) => {
  const textStages = [
    {
      title: "Почувствуйте будущее",
      description: "Технологии становятся ближе"
    },
    {
      title: "Создан для вас",
      description: "Идеальное сочетание формы и содержания"
    },
    {
      title: "Инновации в каждой детали",
      description: "Откройте новые возможности"
    }
  ];

  const clampedProgress = Math.min(progress, 1);
  
  let currentIndex = clampedProgress < 0.33 ? 0 : clampedProgress < 0.66 ? 1 : 2;
  const nextIndex = Math.min(currentIndex + 1, textStages.length - 1);
  
  const transitionProgress = clampedProgress < 0.33 
    ? clampedProgress / 0.33 
    : clampedProgress < 0.66 
      ? (clampedProgress - 0.33) / 0.33 
      : Math.min((clampedProgress - 0.66) / 0.34, 1);

  return (
    <div className="text-content-wrapper">
      {textStages.map((stage, index) => (
        <div
          key={index}
          className="text-content"
          style={{
            position: 'absolute',
            opacity: index === currentIndex ? 1 - transitionProgress : index === nextIndex ? transitionProgress : 0,
            transform: `translateY(${index === currentIndex ? transitionProgress * 30 : index === nextIndex ? (transitionProgress - 1) * 30 : 0}px)`,
            transition: 'opacity 0.5s ease-out, transform 0.5s ease-out'
          }}
        >
          <h2>{stage.title}</h2>
          <p>{stage.description}</p>
        </div>
      ))}
    </div>
  );
};

const PhoneModel: React.FC<{ progress: number }> = ({ progress }) => {
  const { scene } = useGLTF('./samsung_galaxy_s22_ultra.glb');
  const modelRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.x = Math.sin(progress * Math.PI / 2) * Math.PI / 2;
      modelRef.current.rotation.y = Math.sin(progress * Math.PI / 2) * Math.PI;
      modelRef.current.position.y = Math.sin(progress * Math.PI) * -1;
    }
  });

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={1.85} 
      position={[0, 0, 0]} 
      rotation={[0, 0, 0]}
    />
  );
};

const Scene: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const sceneRef = useRef<HTMLDivElement>(null);
  const { isMobile, isTablet } = useDeviceDetect();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const progress = sceneRef.current
    ? Math.min(scrollY / (sceneRef.current.scrollHeight - window.innerHeight), 1)
    : 0;

  return (
    <div ref={sceneRef} className="scene-container">
      <div className="canvas-background">
        <Canvas camera={{ position: [0, 0, 2], fov: 45 }}>
          <Suspense fallback={null}>
            <LiquidMetalBackground />
          </Suspense>
        </Canvas>
      </div>

      <div className="hero-text">
        Новый noNamePhone Ultra
        <span>Переосмысление технологий</span>
      </div>
      
      <div className="model-container">
        {(!isMobile && !isTablet) ? (
          <Canvas camera={{ position: [0, 6, 22], fov: 75 }}>
            <Suspense fallback={<Html center><div className="loading">Загрузка...</div></Html>}>
              <ambientLight intensity={0.2} />
              <hemisphereLight intensity={0.15} color="#ffffff" groundColor="#bbbbff" />
              <AnimatedLights />
              <Stage environment="studio" intensity={0.5} shadows preset="rembrandt" adjustCamera={false}>
                <PhoneModel progress={progress} />
              </Stage>
              <OrbitControls enableZoom={false} enablePan={false} />
            </Suspense>
          </Canvas>
        ) : (
          <div className="mobile-model-container">
            <MobileDeviceDisplay 
              deviceType="phone" 
              variant="hero" 
            />
          </div>
        )}
      </div>

      <div className="text-container">
        <div className="text-content" style={{ transform: `translateY(${(progress - 0.5) * 200}vh)` }}>
          <TextContent progress={progress} />
        </div>
      </div>
    </div>
  );
};

export default Scene;