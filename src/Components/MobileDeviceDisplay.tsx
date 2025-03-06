import React, { useState, useEffect } from 'react';
import '../styles/MobileDeviceDisplay.css';

interface MobileDeviceDisplayProps {
  deviceType: 'phone' | 'watch' | 'tablet';
  variant: 'hero' | 'detail' | 'rotate';
  imageUrl: string;
}

const MobileDeviceDisplay: React.FC<MobileDeviceDisplayProps> = ({ 
  deviceType, 
  variant, 
  imageUrl 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  
  // Создаем эффект для предзагрузки изображения с таймаутом
  useEffect(() => {
    let isActive = true; // Флаг для предотвращения обновления состояния после размонтирования
    
    // Таймаут для случая, если изображение не загружается слишком долго
    const timeout = setTimeout(() => {
      if (isActive && !imageLoaded) {
        console.warn('Image load timeout for:', imageUrl);
        setLoadError(true);
        loadFallbackImage();
      }
    }, 5000); // 5 секунд таймаут
    
    // Создаем новый объект Image для предзагрузки
    const preloadImage = new Image();
    
    // Устанавливаем обработчики событий
    preloadImage.onload = () => {
      if (isActive) {
        clearTimeout(timeout);
        setImageLoaded(true);
      }
    };
    
    preloadImage.onerror = () => {
      if (isActive) {
        clearTimeout(timeout);
        setLoadError(true);
        loadFallbackImage();
      }
    };
    
    // Начинаем загрузку
    preloadImage.src = imageUrl;
    
    // Если изображение уже в кеше, onload не сработает
    if (preloadImage.complete) {
      clearTimeout(timeout);
      setImageLoaded(true);
    }
    
    return () => {
      // Очищаем таймаут и устанавливаем флаг неактивности
      clearTimeout(timeout);
      isActive = false;
    };
  }, [imageUrl]);

  // Определяем fallback изображение в случае ошибки загрузки
  const getFallbackImage = () => {
    return `/fallbacks/${deviceType}_${variant}.png`;
  };
  
  // Функция загрузки запасного изображения
  const loadFallbackImage = () => {
    setUsingFallback(true);
    const fallbackImg = new Image();
    fallbackImg.onload = () => {
      setImageLoaded(true);
      setLoadError(false);
    };
    fallbackImg.onerror = () => {
      console.error('Failed to load even fallback image');
      // Оставляем placeholder в качестве последнего запасного варианта
    };
    fallbackImg.src = getFallbackImage();
  };

  // Обработчики загрузки изображения
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setLoadError(true);
    loadFallbackImage();
  };

  const getDeviceTypePlaceholderText = () => {
    switch (deviceType) {
      case 'phone':
        return 'NoName Phone';
      case 'watch':
        return 'NoName Watch';
      case 'tablet':
        return 'NoName Tablet';
      default:
        return 'NoName Device';
    }
  };
  
  // Определяем текущий URL изображения (основной или fallback)
  const currentImageUrl = loadError || usingFallback ? getFallbackImage() : imageUrl;

  return (
    <div className={`mobile-device-display ${deviceType}-display ${variant}-variant`}>
      <div className="device-image-container">
        {!imageLoaded && (
          <div className="device-placeholder">
            <div className="device-placeholder-content">
              <div className="device-placeholder-icon">⌛</div>
              <div className="device-placeholder-text">Загрузка {getDeviceTypePlaceholderText()}...</div>
            </div>
          </div>
        )}
        
        <img
          src={currentImageUrl}
          alt={`${deviceType} ${variant} view`}
          className="device-image"
          style={{ display: imageLoaded ? 'block' : 'none' }}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        <div className="glass-effect"></div>
        <div className="light-effect"></div>
      </div>
    </div>
  );
};

export default MobileDeviceDisplay;