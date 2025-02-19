import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/MobileDeviceDisplay.css';

interface MobileDeviceDisplayProps {
  deviceType: 'phone' | 'watch' | 'tablet';
  variant?: 'hero' | 'detail' | 'rotate';
  color?: string;
}

// Объект с путями к заглушкам, которые мы будем использовать,
// если нужные изображения не загружены
const fallbackImages = {
  phone: {
    hero: '/fallbacks/phone_hero.png',
    detail: '/fallbacks/phone_detail.png',
    rotate: '/fallbacks/phone_rotate.png'
  },
  watch: {
    hero: '/fallbacks/watch_hero.png',
    detail: '/fallbacks/watch_detail.png',
    rotate: '/fallbacks/watch_rotate.png'
  },
  tablet: {
    hero: '/fallbacks/tablet_hero.png',
    detail: '/fallbacks/tablet_detail.png',
    rotate: '/fallbacks/tablet_rotate.png'
  }
};

const MobileDeviceDisplay: React.FC<MobileDeviceDisplayProps> = ({ 
  deviceType, 
  variant = 'hero',
  color = 'black'
}) => {
  const [imageError, setImageError] = useState(false);

  const getImagePath = () => {
    if (imageError) {
      return fallbackImages[deviceType][variant];
    }
    
    if (deviceType === 'phone') {
      if (variant === 'hero') return `/mobile/phone_hero_${color}.png`;
      if (variant === 'detail') return `/mobile/phone_detail_${color}.png`;
      return `/mobile/phone_rotate_${color}.png`;
    }
    
    if (deviceType === 'watch') {
      return `/mobile/watch_${variant}.png`;
    }
    
    return `/mobile/tablet_${variant}.png`;
  };

  const handleImageError = () => {
    // Если изображение не загрузилось, используем заглушку
    setImageError(true);
  };

  const animations = {
    hero: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.8, ease: 'easeOut' }
    },
    detail: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.5 }
    },
    rotate: {
      initial: { opacity: 0, rotate: -5 },
      animate: { opacity: 1, rotate: 0 },
      transition: { duration: 0.5 }
    }
  };

  // Рендер цветного дива с градиентом, если нужно
  const renderColoredPlaceholder = () => {
    return (
      <div 
        className="device-placeholder"
        style={{
          background: deviceType === 'phone' 
            ? `linear-gradient(135deg, ${color}, #151520)`
            : deviceType === 'watch'
              ? 'linear-gradient(135deg, #4a0072, #00d4ff)'
              : 'linear-gradient(135deg, #1A237E, #7986CB)',
        }}
      >
        <div className="device-placeholder-content">
          <div className="device-placeholder-icon">{getDeviceIcon()}</div>
          <div className="device-placeholder-text">
            NoName {getDeviceTypeName()}
          </div>
        </div>
      </div>
    );
  };

  const getDeviceTypeName = () => {
    switch(deviceType) {
      case 'phone': return 'Phone';
      case 'watch': return 'Watch';
      case 'tablet': return 'Tablet';
    }
  };

  const getDeviceIcon = () => {
    switch(deviceType) {
      case 'phone': return '📱';
      case 'watch': return '⌚';
      case 'tablet': return '📋';
    }
  };

  return (
    <div className={`mobile-device-display ${deviceType}-display ${variant}-variant`}>
      <motion.div
        className="device-image-container"
        {...animations[variant]}
      >
        {imageError ? (
          renderColoredPlaceholder()
        ) : (
          <img 
            src={getImagePath()} 
            alt={`NoName ${deviceType} ${variant}`}
            className="device-image"
            onError={handleImageError}
          />
        )}
        
        {/* Reflection/glass effect overlay */}
        <div className="glass-effect"></div>
        
        {/* Light effect */}
        <div className="light-effect"></div>
      </motion.div>
    </div>
  );
};

export default MobileDeviceDisplay;