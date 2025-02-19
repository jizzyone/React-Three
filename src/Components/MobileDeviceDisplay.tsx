// Components/MobileDeviceDisplay.tsx
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
  
  // Создаем эффект для предзагрузки изображения
  useEffect(() => {
    // Создаем новый объект Image для предзагрузки
    const preloadImage = new Image();
    
    // Устанавливаем обработчики событий
    preloadImage.onload = () => {
      setImageLoaded(true);
    };
    
    preloadImage.onerror = () => {
      setLoadError(true);
      // Пробуем загрузить fallback изображение
      const fallbackImg = new Image();
      fallbackImg.src = getFallbackImage();
    };
    
    // Начинаем загрузку
    preloadImage.src = imageUrl;
    
    // Если изображение уже в кеше, onload не сработает
    if (preloadImage.complete) {
      setImageLoaded(true);
    }
  }, [imageUrl]);

  // Определяем fallback изображение в случае ошибки загрузки
  const getFallbackImage = () => {
    return `/fallbacks/${deviceType}_${variant}.png`;
  };

  // Обработчики загрузки изображения
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setLoadError(true);
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

  return (
    <div className={`mobile-device-display ${deviceType}-display ${variant}-variant`}>
      <div className="device-image-container">
        {!imageLoaded && !loadError ? (
          <div className="device-placeholder">
            <div className="device-placeholder-content">
              <div className="device-placeholder-icon">⌛</div>
              <div className="device-placeholder-text">Загрузка {getDeviceTypePlaceholderText()}...</div>
            </div>
          </div>
        ) : loadError ? (
          <div className="device-placeholder">
            <div className="device-placeholder-content">
              <div className="device-placeholder-icon">📱</div>
              <div className="device-placeholder-text">{getDeviceTypePlaceholderText()}</div>
            </div>
          </div>
        ) : null}
        
        <img
          src={loadError ? getFallbackImage() : imageUrl}
          alt={`${deviceType} ${variant} view`}
          className="device-image"
          style={{ display: imageLoaded && !loadError ? 'block' : 'none' }}
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