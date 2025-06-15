// Сначала создадим утилиту для определения браузера Samsung Internet
// Добавим в файл useDeviceDetect.ts

import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isSamsungBrowser: boolean; // Новое свойство
  supportsWebGL: boolean; // Проверка поддержки WebGL
}

// Функция для проверки поддержки WebGL
const checkWebGLSupport = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || 
               canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
};

export const useDeviceDetect = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isSamsungBrowser: false,
    supportsWebGL: true
  });

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const width = window.innerWidth;
      
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent);
      const isTabletWidth = width >= 768 && width <= 1024;
      
      // Определение Samsung Internet браузера
      const isSamsungBrowser = userAgent.includes('samsungbrowser');
      
      // Проверка поддержки WebGL
      const supportsWebGL = checkWebGLSupport();
      
      // Determine device type based on both user agent and screen width
      const isMobile = isMobileDevice && width < 768;
      const isTablet = (isMobileDevice && isTabletWidth) || (!isMobileDevice && isTabletWidth);
      const isDesktop = (!isMobileDevice && width > 1024) || (isMobileDevice && width > 1024);
      
      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        isSamsungBrowser,
        supportsWebGL
      });
    };

    // Initial check
    checkDevice();
    
    // Re-check on resize
    window.addEventListener('resize', checkDevice);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  return deviceInfo;
};