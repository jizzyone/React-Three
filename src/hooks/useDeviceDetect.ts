import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export const useDeviceDetect = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true
  });

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const width = window.innerWidth;
      
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent);
      const isTabletWidth = width >= 768 && width <= 1024;
      
      // Determine device type based on both user agent and screen width
      const isMobile = isMobileDevice && width < 768;
      const isTablet = (isMobileDevice && isTabletWidth) || (!isMobileDevice && isTabletWidth);
      const isDesktop = (!isMobileDevice && width > 1024) || (isMobileDevice && width > 1024);
      
      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop
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