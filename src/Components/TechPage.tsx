import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import LiquidMetalBackground from './LiquidMetalBackground';
import '../styles/TechPage.css';
import EnhancedCameraDemo from './EnhancedCameraDemo';
import EnhancedWaterproofDemo from './EnhancedWaterproofDemo';
import EnhancedDurabilityDemo from './EnhancedDurabilityDemo';

const TechPage = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [controlsEnabled, setControlsEnabled] = useState(true);
  
  // Функция для очистки активной функции при выборе новой
  // Функция выбора функции с отключением контролей
  const handleFeatureClick = (feature: string) => {
    console.log("Нажата кнопка:", feature);
    console.log("Текущая активная функция:", activeFeature);
    
    // Если выбираем новую функцию - отключаем возможность вращения
    if (feature !== activeFeature) {
      setControlsEnabled(false);
      console.log("Активирована функция:", feature);
    } else {
      // Если отключаем функцию - возвращаем возможность вращения
      setControlsEnabled(true);
      console.log("Деактивирована функция:", activeFeature);
    }
    
    setActiveFeature(feature === activeFeature ? null : feature);
  };

  return (
    <div className="tech-page">
      {/* Фоновый эффект */}
      <div className="background-container">
        <Canvas>
          <LiquidMetalBackground
            colorA={new THREE.Color('#1a1a2e')}
            colorB={new THREE.Color('#4a0072')}
          />
        </Canvas>
      </div>
      
      <div className="tech-content">
        <motion.h1 
          className="tech-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Передовые технологии NoName
        </motion.h1>

        <div className="tech-layout">
          {/* Левая колонка с 3D-моделью */}
          <div className="tech-model-container">
            <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
              <ambientLight intensity={0.3} />
              <spotLight position={[5, 5, 5]} intensity={0.8} />
              <spotLight position={[-5, 5, 5]} intensity={0.4} color="#b0d0ff" />
              
              <Stage environment="city" intensity={0.6} preset="soft">
                <PhoneModel />
              </Stage>
              
              {/* Активная демонстрация */}
              {activeFeature === 'camera' && <EnhancedCameraDemo />}
              {activeFeature === 'waterproof' && <EnhancedWaterproofDemo />}
              {activeFeature === 'durability' && <EnhancedDurabilityDemo />}
              
              <OrbitControls 
                enableZoom={false}
                enablePan={false}
                enabled={controlsEnabled}  // Включаем/отключаем все управление
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 1.5}
                rotateSpeed={0.5}
            />
            </Canvas>
          </div>
          
          {/* Правая колонка с описаниями функций */}
          <div className="tech-features">
            <h2>Исследуйте инновации</h2>
            <p className="tech-subtitle">
              Выберите технологию, чтобы увидеть её демонстрацию на 3D-модели
            </p>
            
            <div className="features-list">
              <motion.div 
                className={`feature-card ${activeFeature === 'camera' ? 'active' : ''}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleFeatureClick('camera')}
              >
                <div className="feature-icon">📸</div>
                <div className="feature-content">
                  <h3>200MP Камера</h3>
                  <p>Революционная камера с 100-кратным зумом и продвинутым ИИ для потрясающих снимков в любых условиях.</p>
                </div>
              </motion.div>
              
              <motion.div 
                className={`feature-card ${activeFeature === 'waterproof' ? 'active' : ''}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleFeatureClick('waterproof')}
              >
                <div className="feature-icon">💧</div>
                <div className="feature-content">
                  <h3>Защита IP68</h3>
                  <p>Полная защита от воды и пыли позволяет использовать устройство на глубине до 1.5 метров в течение 30 минут.</p>
                </div>
              </motion.div>
              
              <motion.div 
                className={`feature-card ${activeFeature === 'durability' ? 'active' : ''}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleFeatureClick('durability')}
              >
                <div className="feature-icon">🛡️</div>
                <div className="feature-content">
                  <h3>Gorilla Glass Victus+</h3>
                  <p>Ультрапрочное стекло и армированный корпус защищают от падений и царапин в повседневном использовании.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Простой компонент для отображения 3D-модели телефона
const PhoneModel = () => {
  const { scene } = useGLTF('/samsung_galaxy_s22_ultra.glb');
  return <primitive object={scene} />;
};

export default TechPage;