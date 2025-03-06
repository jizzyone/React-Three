import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isSamsungBrowser: boolean;
  supportsWebGL: boolean;
  isYandexBrowser: boolean; // Добавляем поддержку Яндекс браузера
}

// Функция для проверки поддержки WebGL с запасным вариантом
const checkWebGLSupport = (): boolean => {
  try {
    // Первая попытка получить WebGL контекст
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || 
               canvas.getContext('experimental-webgl');
    
    // Если получили контекст, значит WebGL поддерживается
    if (gl) {
      return true;
    }
    return false;
  } catch (e) {
    console.warn('WebGL detection error:', e);
    return false;
  }
};

export const useDeviceDetect = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isSamsungBrowser: false,
    supportsWebGL: true,
    isYandexBrowser: false
  });

  useEffect(() => {
    const checkDevice = () => {
      try {
        const userAgent = navigator.userAgent.toLowerCase();
        const width = window.innerWidth;
        
        // Определение мобильного устройства
        const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent);
        const isTabletWidth = width >= 768 && width <= 1024;
        
        // Определение браузеров
        const isSamsungBrowser = userAgent.includes('samsungbrowser') || 
                               (userAgent.includes('samsung') && userAgent.includes('chrome'));
        
        const isYandexBrowser = userAgent.includes('yabrowser');
        
        // Проверка поддержки WebGL с повышенной надежностью
        let supportsWebGL = checkWebGLSupport();
        
        // Для Samsung Browser принудительно отключаем WebGL
        if (isSamsungBrowser) {
          supportsWebGL = false;
        }
        
        // Определяем тип устройства
        const isMobile = isMobileDevice && width < 768;
        const isTablet = (isMobileDevice && isTabletWidth) || (!isMobileDevice && isTabletWidth);
        const isDesktop = (!isMobileDevice && width > 1024) || (isMobileDevice && width > 1024);
        
        setDeviceInfo({
          isMobile,
          isTablet,
          isDesktop,
          isSamsungBrowser,
          supportsWebGL,
          isYandexBrowser
        });
        
        // Добавляем классы к body для глобального CSS-стилизации
        document.body.classList.toggle('mobile-device', isMobile);
        document.body.classList.toggle('tablet-device', isTablet);
        document.body.classList.toggle('desktop-device', isDesktop);
        document.body.classList.toggle('samsung-browser', isSamsungBrowser);
        document.body.classList.toggle('yandex-browser', isYandexBrowser);
        document.body.classList.toggle('no-webgl-support', !supportsWebGL);
      } catch (error) {
        console.error('Error in device detection:', error);
        // В случае ошибки используем безопасные настройки
        setDeviceInfo({
          isMobile: false,
          isTablet: false,
          isDesktop: true,
          isSamsungBrowser: false,
          supportsWebGL: false,
          isYandexBrowser: false
        });
      }
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