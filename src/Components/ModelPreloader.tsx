import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

export function ModelPreloader() {
  useEffect(() => {
    const modelPaths = [
      '/samsung_galaxy_s22_ultra.glb',
      '/samsung__galaxy__watch_5.glb',
      '/samsung_base_store.glb',
      '/samsung_pro_store2.glb',
      '/samsung_ultra_store.glb'
    ];

    modelPaths.forEach(path => {
      useGLTF.preload(path);
    });

    return () => {
      modelPaths.forEach(path => {
        useGLTF.clear(path);
      });
    };
  }, []);

  return null;
}