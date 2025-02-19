import React, { useState, useEffect, useRef, useLayoutEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import Scene from './Components/Scene';
import Header from './Components/Header'; // Обновлённый компонент
import TechSpecs from './Components/TechSpecs';
import Loader from './Components/Loader';
import RotatingPhone from './Components/RotatingPhone';
import WatchScene from './Components/WatchScene';
import TabletScene from './Components/TabletScene';
import Store from './Components/Store';
import { useGLTF } from '@react-three/drei';
import ProductDetail from './Components/ProductDetail';
import './App.css';
import './styles/MobileResponsive.css';
import './styles/MobileMenu.css'; // Стили для мобильного меню
import { ModelPreloader } from './Components/ModelPreloader';
import { useDeviceDetect } from './hooks/useDeviceDetect';

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

function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentDevice, setCurrentDevice] = useState<'phone' | 'watch' | 'tablet'>('phone');
  const loaderRef = useRef(null);
  const contentRef = useRef(null);
  const { isMobile, isTablet } = useDeviceDetect();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [currentDevice]);

  useEffect(() => {
    gsap.set(contentRef.current, { opacity: 0 });

    const preloadAssets = () => {
      // Общие изображения для предзагрузки (фоны и заглушки)
      let imageUrls = [
        ...fallbackImagePaths
      ];

      // Для мобильных устройств загружаем только необходимые статические изображения
      if (isMobile || isTablet) {
        imageUrls = [
          ...imageUrls,
          '/mobile/phone_hero_black.png',
          '/mobile/watch_hero.png',
          '/mobile/tablet_hero.png',
          '/mobile/phone_detail_black.png'
        ];
      } else {
        // Для десктопа загружаем изображения и 3D модели
        imageUrls = [
          ...imageUrls,
          'https://images.samsung.com/levant/smartphones/galaxy-s23-ultra/images/galaxy-s23-ultra-highlights-kv.jpg',
          'https://images.samsung.com/levant/smartphones/galaxy-s23-ultra/images/galaxy-s23-ultra-highlights-camera.jpg',
          'https://images.samsung.com/levant/smartphones/galaxy-s23-ultra/images/galaxy-s23-ultra-highlights-spen.jpg'
        ];
      }
      
      let loadedImages = 0;
      const totalImages = imageUrls.length;

      const updateProgress = () => {
        loadedImages++;
        setProgress((loadedImages / totalImages) * 100);
        
        if (loadedImages === totalImages) {
          completeLoading();
        }
      };

      if (totalImages === 0) {
        completeLoading();
        return;
      }

      imageUrls.forEach(url => {
        const img = new Image();
        img.onload = updateProgress;
        img.onerror = updateProgress; // Даже если изображение не загрузилось, продолжаем
        img.src = url;
      });
    };

    const completeLoading = () => {
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

    preloadAssets();
  }, [isMobile, isTablet]);

  const MainContent = () => {
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
    <div className={`finlandica-text ${isMobile ? 'mobile-view' : ''} ${isTablet ? 'tablet-view' : ''}`}>
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
                <>
                  <Scene />
                  <TechSpecs />
                  <RotatingPhone />
                </>
              } />
              <Route path="/watch" element={<WatchScene />} />
              <Route path="/tablet" element={<TabletScene />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
    </BrowserRouter>
  );
}

export default App;