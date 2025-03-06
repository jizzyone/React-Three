import React, { useState, useEffect, useRef, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import TechSpecs from './Components/TechSpecs';
import Loader from './Components/Loader';
import Store from './Components/Store';
import ProductDetail from './Components/ProductDetail';
import BrowserCompatibleFallback from './Components/BrowserCompatibleFallback';
import './App.css';
import './styles/MobileResponsive.css';
import './styles/MobileMenu.css';
import './styles/BrowserCompatibleFallback.css';
import { useDeviceDetect } from './hooks/useDeviceDetect';

// Лениво загружаем тяжелые компоненты для быстрой первоначальной загрузки
const Scene = React.lazy(() => import('./Components/Scene'));
const RotatingPhone = React.lazy(() => import('./Components/RotatingPhone'));
const WatchScene = React.lazy(() => import('./Components/WatchScene'));
const TabletScene = React.lazy(() => import('./Components/TabletScene'));

// Данные для контента заглушек
const phoneData = {
  title: "Новый noNamePhone Ultra",
  subtitle: "Переосмысление технологий",
  mainImageUrl: "/mobile/phone_hero_black.png",
  features: [
    {
      title: "Революционная камера",
      description: "200 МП основная камера с продвинутой системой ИИ для идеальных фото в любых условиях."
    },
    {
      title: "Мощный процессор",
      description: "Snapdragon 8 Gen 2 для исключительной производительности и энергоэффективности."
    },
    {
      title: "Впечатляющий дисплей",
      description: "6.8\" Dynamic AMOLED 2X с частотой 120 Гц для плавной анимации и ярких цветов."
    }
  ],
  specs: [
    {
      category: "Дисплей",
      items: [
        { label: "Тип", value: "Dynamic AMOLED 2X" },
        { label: "Размер", value: "6.8 дюймов" },
        { label: "Разрешение", value: "3088 x 1440" },
        { label: "Частота", value: "1-120 Гц адаптивная" }
      ]
    },
    {
      category: "Производительность",
      items: [
        { label: "Процессор", value: "Snapdragon 8 Gen 2" },
        { label: "ОЗУ", value: "8/12 ГБ LPDDR5X" },
        { label: "Накопитель", value: "256/512 ГБ UFS 4.0" }
      ]
    },
    {
      category: "Камера",
      items: [
        { label: "Основная", value: "200 МП, f/1.7" },
        { label: "Ультраширокая", value: "12 МП, f/2.2" },
        { label: "Телефото", value: "10 МП, 3x/10x зум" }
      ]
    }
  ]
};

const watchData = {
  title: "NoName Watch 5 Pro",
  subtitle: "Инновационные часы для активной жизни",
  mainImageUrl: "/mobile/watch_hero.png",
  features: [
    {
      title: "Мониторинг здоровья",
      description: "Непрерывное отслеживание пульса, качества сна и уровня стресса с расширенными алгоритмами анализа данных."
    },
    {
      title: "Защита от воды",
      description: "Водонепроницаемость 5ATM и защита IP68 позволяют использовать часы при плавании и занятиях водными видами спорта."
    },
    {
      title: "Батарея",
      description: "До 50 часов работы без подзарядки благодаря оптимизированному энергопотреблению и емкому аккумулятору."
    }
  ],
  specs: [
    {
      category: "Дисплей",
      items: [
        { label: "Тип", value: "Super AMOLED" },
        { label: "Разрешение", value: "450 x 450 пикселей" },
        { label: "Размер", value: "1.4 дюйма" }
      ]
    },
    {
      category: "Процессор",
      items: [
        { label: "Чип", value: "Exynos W930" },
        { label: "Ядра", value: "Dual Core 1.18GHz" },
        { label: "ОЗУ", value: "1.5GB" }
      ]
    },
    {
      category: "Батарея",
      items: [
        { label: "Емкость", value: "590 мАч" },
        { label: "Время работы", value: "До 50 часов" },
        { label: "Зарядка", value: "Беспроводная" }
      ]
    }
  ]
};

const tabletData = {
  title: "NoName Tab S8 Ultra",
  subtitle: "Инновационный планшет для творчества и продуктивности",
  mainImageUrl: "/mobile/tablet_hero.png",
  features: [
    {
      title: "Большой экран",
      description: "14.6-дюймовый Super AMOLED дисплей с частотой 120 Гц для максимального удобства работы и развлечений."
    },
    {
      title: "Производительность",
      description: "Snapdragon 8 Gen 1 для максимальной мощности и плавной работы любых приложений и игр."
    },
    {
      title: "Батарея",
      description: "11200 мАч для длительной работы без подзарядки даже при интенсивном использовании."
    }
  ],
  specs: [
    {
      category: "Дисплей",
      items: [
        { label: "Тип", value: "Super AMOLED" },
        { label: "Размер", value: "14.6 дюймов" },
        { label: "Разрешение", value: "2960 x 1848" },
        { label: "Частота", value: "120 Гц" }
      ]
    },
    {
      category: "Процессор и память",
      items: [
        { label: "Процессор", value: "Snapdragon 8 Gen 1" },
        { label: "ОЗУ", value: "8/12/16 ГБ" },
        { label: "Память", value: "128/256/512 ГБ" }
      ]
    },
    {
      category: "Батарея",
      items: [
        { label: "Емкость", value: "11200 мАч" },
        { label: "Быстрая зарядка", value: "45 Вт" },
        { label: "Время работы", value: "До 14 часов" }
      ]
    }
  ]
};

function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentDevice, setCurrentDevice] = useState<'phone' | 'watch' | 'tablet'>('phone');
  const loaderRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { isMobile, isTablet, isSamsungBrowser, isYandexBrowser } = useDeviceDetect();
  
  // Определяем, нужно ли использовать упрощенный рендеринг
  const useSimplifiedRendering = isSamsungBrowser || isYandexBrowser;
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Эффект для установки максимального времени загрузки
  useEffect(() => {
    // Максимальное время загрузки - 5 секунд
    loadingTimeoutRef.current = setTimeout(() => {
      if (loading) {
        console.log('Loading timeout reached');
        setProgress(100);
        setTimeout(() => setLoading(false), 200);
      }
    }, 5000);

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [loading]);

  // Эффект для имитации загрузки
  useEffect(() => {
    // Для проблемных браузеров ускоряем загрузку
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 200);
          return 100;
        }
        // Быстрее увеличиваем прогресс для проблемных браузеров
        return prev + (useSimplifiedRendering ? 10 : 5);
      });
    }, 150);

    return () => {
      clearInterval(interval);
    };
  }, [useSimplifiedRendering]);

  // Эффект для прокрутки страницы наверх при смене устройства
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentDevice]);

  // Рендеринг соответствующего контента в зависимости от типа устройства и браузера
  const renderDeviceContent = () => {
    // Для Samsung Browser и Yandex Browser используем упрощенный рендеринг
    if (useSimplifiedRendering) {
      switch (currentDevice) {
        case 'phone':
          return (
            <BrowserCompatibleFallback 
              deviceType="phone"
              {...phoneData}
            />
          );
        case 'watch':
          return (
            <BrowserCompatibleFallback 
              deviceType="watch"
              {...watchData}
            />
          );
        case 'tablet':
          return (
            <BrowserCompatibleFallback 
              deviceType="tablet"
              {...tabletData}
            />
          );
        default:
          return <div>Неизвестное устройство</div>;
      }
    }

    // Стандартный контент для современных браузеров
    switch (currentDevice) {
      case 'phone':
        return (
          <>
            <Suspense fallback={<div className="loading-placeholder">Загрузка...</div>}>
              <Scene />
            </Suspense>
            <TechSpecs />
            <Suspense fallback={<div className="loading-placeholder">Загрузка...</div>}>
              <RotatingPhone />
            </Suspense>
          </>
        );
      case 'watch':
        return (
          <Suspense fallback={<div className="loading-placeholder">Загрузка...</div>}>
            <WatchScene />
          </Suspense>
        );
      case 'tablet':
        return (
          <Suspense fallback={<div className="loading-placeholder">Загрузка...</div>}>
            <TabletScene />
          </Suspense>
        );
      default:
        return <div>Неизвестное устройство</div>;
    }
  };

  return (
    <BrowserRouter>
      <div className={`
        finlandica-text 
        ${isMobile ? 'mobile-view' : ''} 
        ${isTablet ? 'tablet-view' : ''} 
        ${isSamsungBrowser ? 'samsung-browser' : ''} 
        ${isYandexBrowser ? 'yandex-browser' : ''} 
        ${useSimplifiedRendering ? 'simplified-rendering' : ''}
      `}>
        <div className="app">
          {loading && (
            <div 
              ref={loaderRef} 
              style={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 1000
              }}
            >
              <Loader progress={progress} />
            </div>
          )}
          
          <div ref={contentRef} style={{ opacity: loading ? 0 : 1 }}>
            <Header
              currentDevice={currentDevice}
              onDeviceChange={setCurrentDevice}
            />
            
            <Routes>
              <Route path="/store/*" element={<Store />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/" element={renderDeviceContent()} />
              <Route path="/phone" element={renderDeviceContent()} />
              <Route path="/watch" element={renderDeviceContent()} />
              <Route path="/tablet" element={renderDeviceContent()} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;