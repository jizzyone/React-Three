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
  watch: DeviceConfigType;
}

const ColoredProductModel: React.FC<ColoredProductModelProps> = ({ modelPath, color }) => {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>();

  useEffect(() => {
    if (!scene) return;

    // Debug output
    console.log('All meshes:');
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = child.material as THREE.MeshStandardMaterial;
        console.log(`${child.name}: vertices=${child.geometry.attributes.position.count}, color=${material.color.getHexString()}`);
      }
    });

    // New base material
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      metalness: 0.4,
      roughness: 0.2,
    });

    // Configuration for devices
    const deviceConfig: DeviceConfigsType = {
      model1: {
        meshNames: ['Object_17', 'Object_27', 'Object_3', 'Object_4', 'Object_5', 'Object_6', 'Object_8', 'Object_20', 'Object_21'],
        shouldUseIncludes: false,
      },
      model2: {
        meshNames: ['Back__Back_0', 'Out_Metal_Metal_Out_0', 'Out_Metal_Material_#101_0'],
        shouldUseIncludes: false,
      },
      model2Pro: {
        meshNames: ['Back_Back_0', 'S21ULTRA_BodyFrame_0', 'Logo_BodyFrame_0'],
        shouldUseIncludes: false,
      },
      model2Pro2: {
        meshNames: ['Object_52', 'Object_6', 'Object_16', 'Object_26'],
        shouldUseIncludes: false,
      },
      model3: {
        meshNames: ['Back_Back_0', 'S21ULTRA_BodyFrame_0', 'Logo_BodyFrame_0'],
        shouldUseIncludes: false,
      },
      tablet: {
        meshNames: ['Body_Body', 'PenBody'],
        shouldUseIncludes: true,
      },
      // New watch config: color only strap meshes
      watch: {
        meshNames: ['silicon', 'strap', 'band'],
        shouldUseIncludes: true,
      },
    };

    // Select config based on modelPath
    let config: DeviceConfigType;
    if (modelPath.includes('watch')) {
      config = deviceConfig.watch;
    } else if (modelPath.includes('tab')) {
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

    // Apply coloring according to config
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const shouldColor = config.shouldUseIncludes
          ? config.meshNames.some(name => child.name.toLowerCase().includes(name.toLowerCase()))
          : config.meshNames.includes(child.name);

        if (shouldColor) {
          console.log('Applying color to:', child.name);

          const currentMat = child.material as THREE.MeshStandardMaterial;
          const mat = baseMaterial.clone();

          // Preserve original maps
          mat.map = currentMat.map;
          mat.normalMap = currentMat.normalMap;
          mat.roughnessMap = currentMat.roughnessMap;
          mat.metalnessMap = currentMat.metalnessMap;
          mat.envMap = currentMat.envMap;
          mat.envMapIntensity = currentMat.envMapIntensity;
          mat.transparent = currentMat.transparent;
          mat.opacity = currentMat.opacity;

          // Adjust material properties for phone frame parts
          if (!modelPath.includes('watch')) {
            if (child.name === 'Object_52') {
              mat.metalness = 0.7;
              mat.roughness = 0.2;
            } else {
              mat.metalness = 0.6;
              mat.roughness = 0.3;
            }
          }

          child.material = mat;
        }
      }
    });
  }, [scene, color, modelPath]);

  return <primitive ref={modelRef} object={scene} dispose={null} />;
};

export default ColoredProductModel;

useGLTF.preload('/samsung_base_store.glb');
useGLTF.preload('/samsung_pro_store2.glb');
useGLTF.preload('/samsung_ultra_store.glb');
useGLTF.preload('/watch_41_store.glb');
useGLTF.preload('/tab_base_store.glb');
