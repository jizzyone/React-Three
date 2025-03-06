import React, { useEffect, useState } from 'react';
import '../styles/BrowserCompatibleFallback.css';

// Типы для компонента
interface BrowserCompatibleFallbackProps {
  deviceType: 'phone' | 'watch' | 'tablet';
  title: string;
  subtitle: string;
  mainImageUrl: string;
  features: {
    title: string;
    description: string;
  }[];
  specs: {
    category: string;
    items: {
      label: string;
      value: string;
    }[];
  }[];
}

/**
 * Компонент-заглушка для проблемных браузеров
 * Рендерит простой HTML/CSS интерфейс без сложных 3D моделей
 */
const BrowserCompatibleFallback: React.FC<BrowserCompatibleFallbackProps> = ({
  deviceType,
  title,
  subtitle,
  mainImageUrl,
  features,
  specs
}) => {
  // Добавляем состояние для отслеживания загрузки изображения
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Эффект для установки классов на body
  useEffect(() => {
    document.body.classList.add('simplified-view');
    return () => {
      document.body.classList.remove('simplified-view');
    };
  }, []);

  return (
    <div className="browser-compatible-fallback">
      {/* Секция героя */}
      <section className="fallback-hero">
        <h1 className="fallback-title">{title}</h1>
        <p className="fallback-subtitle">{subtitle}</p>
        
        <div className="fallback-image-container">
          <div className="fallback-glow-effect"></div>
          {!imageLoaded && <div className="fallback-image-placeholder">Загрузка...</div>}
          <img 
            src={mainImageUrl} 
            alt={title} 
            className="fallback-main-image"
            style={{ opacity: imageLoaded ? 1 : 0 }}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      </section>
      
      {/* Секция особенностей */}
      <section className="fallback-features">
        <h2>Особенности</h2>
        
        <div className="fallback-features-grid">
          {features.map((feature, index) => (
            <div key={index} className="fallback-feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Секция характеристик */}
      <section className="fallback-specs">
        <h2>Технические характеристики</h2>
        
        <div className="fallback-specs-grid">
          {specs.map((spec, index) => (
            <div key={index} className="fallback-spec-card">
              <h3>{spec.category}</h3>
              <div className="fallback-spec-items">
                {spec.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="fallback-spec-item">
                    <span className="fallback-spec-label">{item.label}</span>
                    <span className="fallback-spec-value">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BrowserCompatibleFallback;