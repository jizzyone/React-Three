import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import FeatureHotspot from './FeatureHotspot';
import CameraZoomDemo from './CameraZoomDemo';
import WaterproofDemo from './WaterproofDemo';
import DropTestDemo from './DropTestDemo';
import '../styles/InteractiveFeatures.css';

interface FeatureData {
  id: string;
  name: string;
  description: string;
  position: [number, number, number];
  demoComponent: React.ComponentType<any>;
  demoProps: Record<string, any>;
}

interface DeviceFeatureMap {
  phone: FeatureData[];
  watch: FeatureData[];
  tablet: FeatureData[];
}

interface InteractiveDeviceDemoProps {
  deviceType: 'phone' | 'watch' | 'tablet';
}

const InteractiveDeviceDemo: React.FC<InteractiveDeviceDemoProps> = ({ deviceType = 'phone' }) => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  
  // Загружаем модель в зависимости от типа устройства
  const modelPath = 
    deviceType === 'phone' ? '/samsung_galaxy_s22_ultra.glb' :
    deviceType === 'watch' ? './samsung__galaxy__watch_5.glb' :
    './galaxy_tab_s8_ultra.glb';
    
  const { scene } = useGLTF(modelPath);
  
  // Данные о функциях устройства и их расположении
  const featureData: DeviceFeatureMap = {
    phone: [
      {
        id: 'camera',
        name: 'Зум камеры',
        description: '200-мегапиксельная камера с 100-кратным космическим зумом',
        position: [0, 0.5, 0.5], // Позиция модуля камеры
        demoComponent: CameraZoomDemo,
        demoProps: {
          position: [0, 0.5, 0.5]
        }
      },
      {
        id: 'waterproof',
        name: 'Водонепроницаемость',
        description: 'Защита IP68 позволяет погружаться на глубину до 1.5м в течение 30 минут',
        position: [0, 0, 0], // Центр устройства
        demoComponent: WaterproofDemo,
        demoProps: {
          position: [0, 0, 0]
        }
      },
      {
        id: 'durability',
        name: 'Тест на падение',
        description: 'Усиленный корпус и Gorilla Glass Victus+ защищают от повреждений при падении',
        position: [0, -1, 0], // Нижняя часть устройства
        demoComponent: DropTestDemo,
        demoProps: {}
      }
    ],
    watch: [
      // Похожие данные для часов
      {
        id: 'waterproof',
        name: 'Водонепроницаемость',
        description: 'Защита 5ATM позволяет плавать и заниматься водными видами спорта',
        position: [0, 0, 0],
        demoComponent: WaterproofDemo,
        demoProps: {
          position: [0, 0, 0]
        }
      }
    ],
    tablet: [
      // Похожие данные для планшета
      {
        id: 'durability',
        name: 'Прочный корпус',
        description: 'Алюминиевый корпус повышенной прочности',
        position: [0, -1, 0],
        demoComponent: DropTestDemo,
        demoProps: {}
      }
    ]
  };
  
  // Выбираем данные в зависимости от устройства
  const currentFeatures = featureData[deviceType] || featureData.phone;
  
  // Обработка активации функции
  const handleFeatureActivation = (featureId: string) => {
    if (activeFeature === featureId) {
      setActiveFeature(null);
    } else {
      setActiveFeature(featureId);
    }
  };
  
  // Клонируем сцену для использования в демонстрациях
  useEffect(() => {
    if (scene) {
      const clonedScene = scene.clone();
      modelRef.current = clonedScene;
    }
  }, [scene]);
  
  return (
    <div className="interactive-device-demo">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Stage environment="city" intensity={0.6}>
          <primitive object={scene} position={[0, 0, 0]} />
          
          {/* Размещаем интерактивные точки */}
          {currentFeatures.map((feature) => (
            <FeatureHotspot
              key={feature.id}
              position={feature.position}
              featureName={feature.name}
              description={feature.description}
              onActivate={() => handleFeatureActivation(feature.id)}
            />
          ))}
          
          {/* Отображаем активную демонстрацию */}
          {currentFeatures.map((feature) => {
            const DemoComponent = feature.demoComponent;
            return DemoComponent && (
              <DemoComponent
                key={feature.id}
                active={activeFeature === feature.id}
                model={modelRef.current}
                {...feature.demoProps}
              />
            );
          })}
        </Stage>
        
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
      
      {/* Информационная панель с описанием активной функции */}
      <div className={`feature-info-panel ${activeFeature ? 'active' : ''}`}>
        {activeFeature && (
          <div className="feature-details">
            <h3>{currentFeatures.find(f => f.id === activeFeature)?.name}</h3>
            <p>{currentFeatures.find(f => f.id === activeFeature)?.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveDeviceDemo;