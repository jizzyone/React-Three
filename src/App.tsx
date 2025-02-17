import React, { useState, useEffect, useRef, useLayoutEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import Scene from './Components/Scene';
import Header from './Components/Header';
import TechSpecs from './Components/TechSpecs';
import Loader from './Components/Loader';
import RotatingPhone from './Components/RotatingPhone';
import WatchScene from './Components/WatchScene';
import TabletScene from './Components/TabletScene';
import Store from './Components/Store';
import { useGLTF } from '@react-three/drei';
import ProductDetail from './Components/ProductDetail';
import './App.css'
import { ModelPreloader } from './Components/ModelPreloader';



function App() {

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentDevice, setCurrentDevice] = useState<'phone' | 'watch' | 'tablet'>('phone');
  const loaderRef = useRef(null);
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [currentDevice]);

  useEffect(() => {
    gsap.set(contentRef.current, { opacity: 0 });

    const preloadAssets = () => {
      const imageUrls = [
        'https://images.samsung.com/levant/smartphones/galaxy-s23-ultra/images/galaxy-s23-ultra-highlights-kv.jpg',
        'https://images.samsung.com/levant/smartphones/galaxy-s23-ultra/images/galaxy-s23-ultra-highlights-camera.jpg',
        'https://images.samsung.com/levant/smartphones/galaxy-s23-ultra/images/galaxy-s23-ultra-highlights-spen.jpg',
        'https://images.samsung.com/levant/smartphones/galaxy-s23-ultra/images/galaxy-s23-ultra-highlights-display.jpg'
      ];
      
      let loadedImages = 0;
      const totalImages = imageUrls.length;

      const updateProgress = () => {
        loadedImages++;
        setProgress((loadedImages / totalImages) * 100);
        
        if (loadedImages === totalImages) {
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
        }
      };

      imageUrls.forEach(url => {
        const img = new Image();
        img.onload = updateProgress;
        img.src = url;
      });
    };

    preloadAssets();
  }, []);

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
    <div className='finlandica-text'>
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