import React, { useState, useEffect, useRef, useLayoutEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import gsap from 'gsap';
import Scene from './Components/Scene';
import Header from './Components/Header';
import TechSpecs from './Components/TechSpecs';
import Loader from './Components/Loader';
import RotatingPhone from './Components/RotatingPhone';
import WatchScene from './Components/WatchScene';
import TabletScene from './Components/TabletScene';
import Store from './Components/Store';
import ProductDetail from './Components/ProductDetail';
import './App.css';
import './styles/MobileResponsive.css';
import './styles/browser-compatibility.css';
import './styles/MobileMenu.css';
import { useDeviceDetect } from './hooks/useDeviceDetect';
import MobileDeviceDisplay from './Components/MobileDeviceDisplay';
// Импортируем и адаптируем функцию для предзагрузки окружений
import { preloadEnvironments } from './utils/environment-preload';

// Создаём массив путей для предзагрузки изображений-заглушек
const fallbackImagePaths = [
  '/fallbacks/phone_hero.png',
  '/fallbacks/phone_detail.png',
  '/fallbacks/phone_rotate.png',
  '/fallbacks/watch_hero.png',
  '/fallbacks/watch_detail.png',
  '/fallbacks/watch_rotate.png',
  '/fallbacks/tablet_hero.png',
  '/fallbacks/tablet_detail.png',
  '/fallbacks/tablet_rotate.png'
];

// Мобильные изображения для всех устройств
const mobileImagePaths = [
  '/mobile/phone_hero_black.png',
  '/mobile/watch_hero.png',
  '/mobile/tablet_hero.png',
  '/mobile/phone_detail_black.png'
];

function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentDevice, setCurrentDevice] = useState<'phone' | 'watch' | 'tablet'>('phone');
  const loaderRef = useRef(null);
  const contentRef = useRef(null);
  const { isMobile, isTablet, isSamsungBrowser, supportsWebGL } = useDeviceDetect();
  const loadingTimeoutRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [currentDevice]);

  useEffect(() => {
    gsap.set(contentRef.current, { opacity: 0 });

    // Принудительно завершаем загрузку через 10 секунд
    loadingTimeoutRef.current = window.setTimeout(() => {
      if (loading) {
        console.log('Loading timeout reached, forcing completion');
        completeLoading();
      }
    }, 10000); // 10 секунд максимум на загрузку

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  // Выносим completeLoading в отдельную функцию, чтобы использовать её и в таймауте и при обычной загрузке
  const completeLoading = () => {
    // Очищаем таймаут, если загрузка завершилась нормально
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }

    const tl = gsap.timeline({
      onComplete: () => setLoading(false)
    });

    tl.to(loaderRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut'
    })
    .to(contentRef.current, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.3');
  };

  useEffect(() => {
    const preloadAssets = async () => {
      try {
        // Используем разные стратегии загрузки в зависимости от браузера
        if (isSamsungBrowser) {
          // Для Samsung Browser упрощаем процесс загрузки
          // Загружаем только самые необходимые изображения
          preloadMinimalAssets();
        } else {
          // Для остальных браузеров используем полную загрузку
          preloadFullAssets();
        }
      } catch (error) {
        console.error('Error preloading assets:', error);
        // Даже в случае ошибки, завершаем загрузку
        completeLoading();
      }
    };

    // Упрощенная загрузка активов для проблемных браузеров
    const preloadMinimalAssets = () => {
      // Загружаем только основные изображения для мобильной версии
      const criticalImageUrl = isMobile || isTablet ? 
        '/mobile/phone_hero_black.png' : 
        fallbackImagePaths[0];
      
      const img = new Image();
      img.onload = () => {
        // Устанавливаем промежуточный прогресс, чтобы пользователь видел движение
        setProgress(50);
        
        // Небольшая задержка для плавности
        setTimeout(() => {
          setProgress(100);
          setTimeout(completeLoading, 300);
        }, 500);
      };
      
      img.onerror = () => {
        // Даже если изображение не загрузилось, продолжаем
        console.warn('Failed to load critical image, continuing anyway');
        setProgress(100);
        setTimeout(completeLoading, 300);
      };
      
      img.src = criticalImageUrl;
    };

    // Полная загрузка активов для нормальных браузеров
    const preloadFullAssets = async () => {
      // Общие изображения для предзагрузки (фоны и заглушки)
      let imageUrls = [...fallbackImagePaths];

      // Добавляем мобильные изображения для мобильных устройств
      if (isMobile || isTablet) {
        imageUrls = [...imageUrls, ...mobileImagePaths];
      } else {
        // Для десктопа загружаем дополнительные изображения
        imageUrls = [
          ...imageUrls,
          'https://images.samsung.com/levant/smartphones/galaxy-s23-ultra/images/galaxy-s23-ultra-highlights-kv.jpg',
          'https://images.samsung.com/levant/smartphones/galaxy-s23-ultra/images/galaxy-s23-ultra-highlights-camera.jpg',
          'https://images.samsung.com/levant/smartphones/galaxy-s23-ultra/images/galaxy-s23-ultra-highlights-spen.jpg'
        ];
        
        // Предзагружаем HDR-окружения только для десктопа с поддержкой WebGL
        if (supportsWebGL) {
          try {
            await preloadEnvironments();
          } catch (error) {
            console.warn('Failed to preload environments:', error);
          }
        }
      }
      
      // Устанавливаем минимальный прогресс, чтобы пользователь видел, что что-то происходит
      setProgress(10);
      
      let loadedImages = 0;
      const totalImages = imageUrls.length;
      
      // Минимальный порог для завершения загрузки (70% изображений)
      const minThreshold = Math.floor(totalImages * 0.7);

      const updateProgress = () => {
        loadedImages++;
        const percentage = Math.min(90, (loadedImages / totalImages) * 100);
        setProgress(percentage);
        
        // Если загрузили минимальный порог или все изображения, завершаем загрузку
        if (loadedImages >= minThreshold || loadedImages === totalImages) {
          setProgress(100);
          setTimeout(completeLoading, 300);
        }
      };

      if (totalImages === 0) {
        setProgress(100);
        setTimeout(completeLoading, 300);
        return;
      }

      // Устанавливаем максимальный таймаут для каждого изображения
      const loadImageWithTimeout = (url: string) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          
          // Таймаут для загрузки отдельного изображения (3 секунды)
          const timeout = setTimeout(() => {
            console.warn(`Image loading timeout for: ${url}`);
            resolve();
          }, 3000);
          
          img.onload = img.onerror = () => {
            clearTimeout(timeout);
            resolve();
          };
          
          img.src = url;
        });
      };

      // Загружаем все изображения с таймаутом и обновляем прогресс
      for (const url of imageUrls) {
        await loadImageWithTimeout(url);
        updateProgress();
      }
    };

    preloadAssets();
  }, [isMobile, isTablet, isSamsungBrowser, supportsWebGL]);

  // Генерируем контент в зависимости от типа устройства и браузера
  const MainContent = () => {
    // Для Samsung Internet браузера или устройств без поддержки WebGL используем альтернативный контент без 3D-моделей
    if (isSamsungBrowser || !supportsWebGL) {
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
          </>
        );
      }
    }
    
    // Стандартный контент для других браузеров
    if (currentDevice === 'phone') {
      return (
        <>
          <Scene />
          <TechSpecs />
          <RotatingPhone />
        </>
      );
    } else if (currentDevice === 'watch') {
      return <WatchScene />;
    } else {
      return <TabletScene />;
    }
  };

  return (
    <BrowserRouter>
    <div className={`finlandica-text ${isMobile ? 'mobile-view' : ''} ${isTablet ? 'tablet-view' : ''} ${isSamsungBrowser ? 'samsung-browser' : ''} ${!supportsWebGL ? 'no-webgl' : ''}`}>
      <div className="app">
        <div ref={loaderRef} style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1000,
          display: loading ? 'block' : 'none'
        }}>
          <Loader progress={progress} />
        </div>
        
        <div ref={contentRef}>
          <Header
            currentDevice={currentDevice}
            onDeviceChange={setCurrentDevice}
          />
          <Suspense fallback={<Loader progress={progress} />}>
            <Routes>
              <Route path="/store/*" element={<Store />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/" element={<MainContent />} />
              <Route path="/phone" element={
                isSamsungBrowser || !supportsWebGL ? (
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
                    <Scene />
                    <TechSpecs />
                    <RotatingPhone />
                  </>
                )
              } />
              <Route path="/watch" element={
                isSamsungBrowser || !supportsWebGL ? (
                  <MobileDeviceDisplay 
                    deviceType="watch"
                    variant="hero"
                    imageUrl="/mobile/watch_hero.png"
                  />
                ) : (
                  <WatchScene />
                )
              } />
              <Route path="/tablet" element={
                isSamsungBrowser || !supportsWebGL ? (
                  <MobileDeviceDisplay 
                    deviceType="tablet"
                    variant="hero"
                    imageUrl="/mobile/tablet_hero.png"
                  />
                ) : (
                  <TabletScene />
                )
              } />
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
    </BrowserRouter>
  );
}

export default App;