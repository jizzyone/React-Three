import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DeviceSelector from './DeviceSelector';
import MobileMenu from './MobileMenu';
import { useDeviceDetect } from '../hooks/useDeviceDetect';
import '../styles/Header.css';

interface HeaderProps {
  currentDevice: 'phone' | 'watch' | 'tablet';
  onDeviceChange: (device: 'phone' | 'watch' | 'tablet') => void;
}

const Header: React.FC<HeaderProps> = ({ currentDevice, onDeviceChange }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const { isMobile, isTablet } = useDeviceDetect();

  // Перемещаем функцию внутрь компонента
  const handleDeviceChange = (device: 'phone' | 'watch' | 'tablet') => {
    onDeviceChange(device);
    const path = `/${device}`;
    navigate(path);
  };

  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ['rgba(17, 17, 27, 0)', 'rgba(17, 17, 27, 0.7)']
  );

  const headerHeight = useTransform(
    scrollY,
    [0, 100],
    ['88px', '64px']
  );

  useEffect(() => {
    const updateScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', updateScroll);
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  useEffect(() => {
    // Блокируем прокрутку при открытом мобильном меню
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (section: string) => {
    setActiveSection(section);
  };

  const handleStoreClick = () => {
    navigate('/store');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <motion.header
        className={`header ${isScrolled ? 'header--scrolled' : ''} ${isMobileMenuOpen ? 'header--menu-open' : ''}`}
        style={{
          height: headerHeight,
          background: headerBg
        }}
      >
        <div className="header__container">
          <motion.div 
            className="header__logo"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          >
            <span className="header__logo-prefix">no</span>
            <span className="header__logo-brand">Name</span>
          </motion.div>

          {(!isMobile && !isTablet) ? (
            <nav className="header__nav">
              <div className="header__nav-device">
                <DeviceSelector
                  currentDevice={currentDevice}
                  onDeviceChange={handleDeviceChange}
                />
              </div>
              
              <div className="header__nav-links">
                <motion.a 
                  href="#futures"
                  className={`header__nav-link ${activeSection === 'futures' ? 'active' : ''}`}
                  onClick={() => handleNavClick('futures')}
                  whileHover={{ y: -2 }}
                >
                  Особенности
                </motion.a>
                <motion.a 
                  href="#gallery"
                  className={`header__nav-link ${activeSection === 'gallery' ? 'active' : ''}`}
                  onClick={() => handleNavClick('gallery')}
                  whileHover={{ y: -2 }}
                >
                  Галерея
                </motion.a>
                <motion.a 
                  href="#tech"
                  className={`header__nav-link ${activeSection === 'tech' ? 'active' : ''}`}
                  onClick={() => handleNavClick('tech')}
                  whileHover={{ y: -2 }}
                >
                  Технологии
                </motion.a>
              </div>

              <motion.button
                className="header__cta-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStoreClick}
              >
                Купить сейчас
              </motion.button>
            </nav>
          ) : (
            <button 
              className={`header__mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={toggleMobileMenu}
            >
              <span className="header__mobile-menu-icon"></span>
            </button>
          )}
        </div>
      </motion.header>

      {/* Мобильное меню */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentDevice={currentDevice}
        onDeviceChange={onDeviceChange}
      />
    </>
  );
};

export default Header;