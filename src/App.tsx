import React, { useState, useEffect, useRef, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import TechSpecs from './Components/TechSpecs';
import Loader from './Components/Loader';
import Store from './Components/Store';
import ProductDetail from './Components/ProductDetail';
import './App.css';
import './styles/MobileResponsive.css';
import './styles/MobileMenu.css';
import './styles/browser-compatibility.css';
import { useDeviceDetect } from './hooks/useDeviceDetect';
import MobileDeviceDisplay from './Components/MobileDeviceDisplay';

// Лениво загружаем тяжелые компоненты чтобы ускорить первоначальную загрузку
const Scene = React.lazy(() => import('./Components/Scene'));
const RotatingPhone = React.lazy(() => import('./Components/RotatingPhone'));
const WatchScene = React.lazy(() => import('./Components/WatchScene'));
const TabletScene = React.lazy(() => import('./Components/TabletScene'));

// Объявляем максимальное время загрузки
const MAX_LOADING_TIME = 5000; // 5 секунд максимум

function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentDevice, setCurrentDevice] = useState<'phone' | 'watch' | 'tablet'>('phone');
  const loaderRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { isMobile, isTablet, isSamsungBrowser, isYandexBrowser } = useDeviceDetect();
  
  // Создаем ссылку на таймер
  const forceLoadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Метод для установки CSS свойства с учетом совместимости
  const setOpacityStyle = (element: HTMLElement | null, value: number) => {
    if (!element) return;
    element.style.opacity = value.toString();
    element.style.visibility = value === 0 ? 'hidden' : 'visible';
  };

  // Функция для принудительного завершения загрузки
  const forceCompleteLoading = () => {
    console.log('Force completing loading...');
    
    // Очищаем таймаут если он существует
    if (forceLoadTimeoutRef.current) {
      clearTimeout(forceLoadTimeoutRef.current);
      forceLoadTimeoutRef.current = null;
    }
    
    // Максимально упрощенное завершение загрузки без анимаций
    setProgress(100);
    
    // Проверяем, существуют ли DOM элементы
    if (loaderRef.current && contentRef.current) {
      try {
        // Прямое изменение стилей через DOM API для максимальной надежности
        setOpacityStyle(loaderRef.current, 0);
        setOpacityStyle(contentRef.current, 1);
        
        // Устанавливаем display:none для лоадера после короткой задержки
        setTimeout(() => {
          if (loaderRef.current) {
            loaderRef.current.style.display = 'none';
          }
          setLoading(false);
        }, 100);
      } catch (error) {
        console.error('Error during force load completion:', error);
        // В случае ошибки просто устанавливаем состояние
        setLoading(false);
      }
    } else {
      // Если DOM элементы не найдены, просто меняем состояние
      setLoading(false);
    }
  };

  // Эффект для начальной загрузки
  useEffect(() => {
    // Предустанавливаем opacity для контента
    if (contentRef.current) {
      setOpacityStyle(contentRef.current, 0);
    }
    
    // Устанавливаем forced timeout, который гарантированно завершит загрузку
    forceLoadTimeoutRef.current = setTimeout(forceCompleteLoading, MAX_LOADING_TIME);
    
    // Быстрая загрузка для Samsung Browser
    if (isSamsungBrowser || isYandexBrowser) {
      console.log('Using fast loading for Samsung/Yandex browser');
      // Показываем минимальный прогресс
      setProgress(30); 
      
      // Программируем псевдо-прогресс загрузки
      const incrementInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 5;
          if (newProgress >= 100) {
            clearInterval(incrementInterval);
            setTimeout(forceCompleteLoading, 300);
            return 100;
          }
          return newProgress;
        });
      }, 150);
      
      // Очистка интервала при размонтировании
      return () => {
        clearInterval(incrementInterval);
        if (forceLoadTimeoutRef.current) {
          clearTimeout(forceLoadTimeoutRef.current);
        }
      };
    } else {
      // Стандартный механизм загрузки для нормальных браузеров
      // Имитируем прогресс загрузки
      const increment = 5;
      const interval = setInterval(() => {
        setProgress(prev => {
          const newVal = prev + increment;
          if (newVal >= 90) {
            clearInterval(interval);
            
            // Завершаем загрузку через секунду
            setTimeout(() => {
              setProgress(100);
              setTimeout(forceCompleteLoading, 300);
            }, 1000);
            
            return 90;
          }
          return newVal;
        });
      }, 200);
      
      return () => {
        clearInterval(interval);
        if (forceLoadTimeoutRef.current) {
          clearTimeout(forceLoadTimeoutRef.current);
        }
      };
    }
  }, [isSamsungBrowser, isYandexBrowser]);

  // Эффект для прокрутки страницы наверх при смене устройства
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentDevice]);

  // Выбираем контент в зависимости от типа устройства и браузера
  const MainContent = () => {
    // Для Samsung Browser или Yandex Browser всегда используем только MobileDeviceDisplay
    if (isSamsungBrowser || isYandexBrowser) {
      if (currentDevice === 'phone') {
        return (
          <>
            <MobileDeviceDisplay 
              deviceType="phone"
              variant="hero"
              imageUrl="/mobile/phone_hero_black.png"
            />
            <TechSpecs />
            <MobileDeviceDisplay 
              deviceType="phone"
              variant="rotate"
              imageUrl="/mobile/phone_rotate_black.png"
            />
          </>
        );
      } else if (currentDevice === 'watch') {
        return (
          <>
            <MobileDeviceDisplay 
              deviceType="watch"
              variant="hero"
              imageUrl="/mobile/watch_hero.png"
            />
            <TechSpecs />
          </>
        );
      } else {
        return (
          <>
            <MobileDeviceDisplay 
              deviceType="tablet"
              variant="hero"
              imageUrl="/mobile/tablet_hero.png"
            />
            <TechSpecs />
          </>
        );
      }
    }
    
    // Стандартный контент для других браузеров
    if (currentDevice === 'phone') {
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
    } else if (currentDevice === 'watch') {
      return (
        <Suspense fallback={<div className="loading-placeholder">Загрузка...</div>}>
          <WatchScene />
        </Suspense>
      );
    } else {
      return (
        <Suspense fallback={<div className="loading-placeholder">Загрузка...</div>}>
          <TabletScene />
        </Suspense>
      );
    }
  };

  return (
    <BrowserRouter>
      <div className={`finlandica-text ${isMobile ? 'mobile-view' : ''} ${isTablet ? 'tablet-view' : ''} ${isSamsungBrowser ? 'samsung-browser' : ''} ${isYandexBrowser ? 'yandex-browser' : ''}`}>
        <div className="app">
          <div 
            ref={loaderRef} 
            style={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1000,
              display: loading ? 'block' : 'none'
            }}
          >
            <Loader progress={progress} />
          </div>
          
          <div ref={contentRef} style={{ opacity: loading ? 0 : 1 }}>
            <Header
              currentDevice={currentDevice}
              onDeviceChange={setCurrentDevice}
            />
            
            <Routes>
              <Route path="/store/*" element={<Store />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/" element={<MainContent />} />
              <Route path="/phone" element={
                isSamsungBrowser || isYandexBrowser ? (
                  <>
                    <MobileDeviceDisplay 
                      deviceType="phone"
                      variant="hero"
                      imageUrl="/mobile/phone_hero_black.png"
                    />
                    <TechSpecs />
                    <MobileDeviceDisplay 
                      deviceType="phone"
                      variant="rotate"
                      imageUrl="/mobile/phone_rotate_black.png"
                    />
                  </>
                ) : (
                  <>
                    <Suspense fallback={<div className="loading-placeholder">Загрузка...</div>}>
                      <Scene />
                    </Suspense>
                    <TechSpecs />
                    <Suspense fallback={<div className="loading-placeholder">Загрузка...</div>}>
                      <RotatingPhone />
                    </Suspense>
                  </>
                )
              } />
              <Route path="/watch" element={
                isSamsungBrowser || isYandexBrowser ? (
                  <>
                    <MobileDeviceDisplay 
                      deviceType="watch"
                      variant="hero"
                      imageUrl="/mobile/watch_hero.png"
                    />
                    <TechSpecs />
                  </>
                ) : (
                  <Suspense fallback={<div className="loading-placeholder">Загрузка...</div>}>
                    <WatchScene />
                  </Suspense>
                )
              } />
              <Route path="/tablet" element={
                isSamsungBrowser || isYandexBrowser ? (
                  <>
                    <MobileDeviceDisplay 
                      deviceType="tablet"
                      variant="hero"
                      imageUrl="/mobile/tablet_hero.png"
                    />
                    <TechSpecs />
                  </>
                ) : (
                  <Suspense fallback={<div className="loading-placeholder">Загрузка...</div>}>
                    <TabletScene />
                  </Suspense>
                )
              } />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;