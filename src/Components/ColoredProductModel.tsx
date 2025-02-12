import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface ColoredProductModelProps {
  modelPath: string;
  color: string;
}

interface DeviceConfigType {
  meshNames: string[];
  shouldUseIncludes: boolean;
}

interface DeviceConfigsType {
  model1: DeviceConfigType;
  model2: DeviceConfigType;
  model2Pro: DeviceConfigType;
  model2Pro2: DeviceConfigType;
  model3: DeviceConfigType;
  tablet: DeviceConfigType;
}

const ColoredProductModel: React.FC<ColoredProductModelProps> = ({ modelPath, color }) => {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>();

  useEffect(() => {
    if (!scene) return;

    // Вывод для отладки
    console.log('All meshes:');
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = child.material as THREE.MeshStandardMaterial;
        console.log(`${child.name}: vertices=${child.geometry.attributes.position.count}, color=${material.color.getHexString()}`);
      }
    });

    // Создаем новый материал
    const newMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      metalness: 0.4,
      roughness: 0.2,
    });

    // Определяем конфигурацию для разных моделей телефонов
    const deviceConfig: DeviceConfigsType = {
      model1: {
        meshNames: ['Object_17', 'Object_27', 'Object_3', 'Object_4', 'Object_5', 'Object_6', 'Object_8', 'Object_20', 'Object_21'],
        shouldUseIncludes: false
      },
      model2: {
        meshNames: ['Back__Back_0', 'Out_Metal_Metal_Out_0', 'Out_Metal_Material_#101_0'],
        shouldUseIncludes: false
      },
      model2Pro: {
        meshNames: ['Back_Back_0', 'S21ULTRA_BodyFrame_0', 'Logo_BodyFrame_0'],
        shouldUseIncludes: false
      },
      model2Pro2: { // Новая модель samsung_pro_store2.glb
        meshNames: ['Object_52', 'Object_6', 'Object_16', 'Object_26'],
        shouldUseIncludes: false
      },
      model3: {
        meshNames: ['Back_Back_0', 'S21ULTRA_BodyFrame_0', 'Logo_BodyFrame_0'],
        shouldUseIncludes: false
      },
      tablet: {
        meshNames: ['Body_Body', 'PenBody'],
        shouldUseIncludes: true
      }
    };

    // Определяем тип модели
    const isTablet = modelPath.includes('tab');
    let config: DeviceConfigType;

    if (isTablet) {
      config = deviceConfig.tablet;
    } else if (modelPath.includes('samsung_pro_store2')) {
      config = deviceConfig.model2Pro2;
    } else if (modelPath.includes('samsung_pro_store')) {
      config = deviceConfig.model2Pro;
    } else if (modelPath.includes('samsung_base_store')) {
      config = deviceConfig.model2;
    } else if (scene.getObjectByName('S21ULTRA_BodyFrame_0')) {
      config = deviceConfig.model3;
    } else {
      config = deviceConfig.model1;
    }

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const shouldColor = config.shouldUseIncludes
          ? config.meshNames.some(name => child.name.includes(name))
          : config.meshNames.includes(child.name);

        if (shouldColor) {
          console.log('Applying color to:', child.name);
          
          const currentMaterial = child.material as THREE.MeshStandardMaterial;
          const meshMaterial = newMaterial.clone();

          // Копируем свойства материала
          if (currentMaterial.map) meshMaterial.map = currentMaterial.map;
          if (currentMaterial.normalMap) meshMaterial.normalMap = currentMaterial.normalMap;
          if (currentMaterial.roughnessMap) meshMaterial.roughnessMap = currentMaterial.roughnessMap;
          if (currentMaterial.metalnessMap) meshMaterial.metalnessMap = currentMaterial.metalnessMap;
          if (currentMaterial.envMap) meshMaterial.envMap = currentMaterial.envMap;

          meshMaterial.envMapIntensity = currentMaterial.envMapIntensity || 1;
          meshMaterial.transparent = currentMaterial.transparent;
          meshMaterial.opacity = currentMaterial.opacity;

          // Настраиваем материал в зависимости от имени меша для новой модели
          if (child.name === 'Object_52') {
            meshMaterial.metalness = 0.7;
            meshMaterial.roughness = 0.2;
          } else {
            meshMaterial.metalness = 0.6;
            meshMaterial.roughness = 0.3;
          }

          child.material = meshMaterial;
        }
      }
    });
  }, [scene, color, modelPath]);

  return <primitive ref={modelRef} object={scene} />;
};

export default ColoredProductModel;