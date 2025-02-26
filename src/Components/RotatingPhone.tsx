import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import '../styles/RotatingPhone.css';
import { useDeviceDetect } from '../hooks/useDeviceDetect';

const PhoneModel = () => {
  const { scene } = useGLTF('./samsung_s23_ultra_free.glb');
  const modelRef = useRef<THREE.Group>(null);

  // Используем requestAnimationFrame для плавной анимации
  useEffect(() => {
    let animationFrameId: number;
    let rotation = 0;

    const animate = () => {
      if (modelRef.current) {
        rotation += 0.005; // Медленное плавное вращение
        modelRef.current.rotation.y = rotation;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={0.8} // Уменьшили размер
      position={[1, 0, -2]} // Сдвинули вправо и назад
    />
  );
};

const OrderForm = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="order-form"
    >
      <h2>Остались вопросы?</h2>
      <form>
        <input className="input-field" type="text" placeholder="Ваше имя" />
        <input className="input-field" type="tel" placeholder="Номер телефона" />
        <motion.button
          className="submit-button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Запросить звонок
        </motion.button>
      </form>
    </motion.div>
  );
};

// Мобильная версия компонента
const MobileRotatingPhone: React.FC = () => {
  return (
    <div className="mobile-rotating-phone-container">
      <div className="mobile-background-effect"></div>
      
      <div className="mobile-form-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mobile-order-form"
        >
          <h2>Остались вопросы?</h2>
          <form>
            <input className="input-field" type="text" placeholder="Ваше имя" />
            <input className="input-field" type="tel" placeholder="Номер телефона" />
            
            <motion.button
              className="submit-button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Запросить звонок
            </motion.button>
          </form>
          
          <div className="order-benefits">
            <div className="benefit-item">
              <span className="benefit-icon">
                <img src="../chronometer.png" alt="timer" />
              </span>
              <span className="benefit-text">Быстрое решение вопросов</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">
                <img src="../support.png" alt="support" />
              </span>
              <span className="benefit-text">Поддержка с 10:00 - 19:00 (МСК) каждый день</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">
                <img src="../ask-question.png" alt="asks" />
              </span>
              <span className="benefit-text">Обрабатываем все запросы</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const RotatingPhone: React.FC = () => {
  const { isMobile, isTablet } = useDeviceDetect();
  const isTouchDevice = isMobile || isTablet;

  // Выбираем версию компонента в зависимости от устройства
  if (isTouchDevice) {
    return <MobileRotatingPhone />;
  }

  return (
    <div className="rotating-phone-container">
      <div className="form-container">
        <OrderForm />
      </div>
      <div className="model-container">
        <Canvas 
          camera={{ position: [0, 0, 8], fov: 50 }}
          className="canvas-container"
          style={{ pointerEvents: isTouchDevice ? 'none' : 'auto' }}
        >
          <Suspense fallback={<Html center><div className="loading">Загрузка модели...</div></Html>}>
            <ambientLight intensity={0.3} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.8} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            <Stage 
              environment="city" 
              intensity={0.4}
              adjustCamera={false}
            >
              <PhoneModel />
            </Stage>
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              enableRotate={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            />
          </Suspense>
          </Canvas>
      </div>
      <div className="spacer" />
    </div>
  );
};

export default RotatingPhone;