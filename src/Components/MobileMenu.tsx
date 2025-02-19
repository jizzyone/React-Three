import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../styles/MobileMenu.css';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentDevice: 'phone' | 'watch' | 'tablet';
  onDeviceChange: (device: 'phone' | 'watch' | 'tablet') => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  onClose, 
  currentDevice,
  onDeviceChange 
}) => {
  const navigate = useNavigate();

  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, y: -20 },
    open: { opacity: 1, y: 0 }
  };

  const handleDeviceClick = (device: 'phone' | 'watch' | 'tablet') => {
    onDeviceChange(device);
    onClose();
    navigate(`/${device}`);
  };

  const handleNavClick = (path: string) => {
    onClose();
    if (path === '/store') {
      navigate(path);
    } else {
      // Для якорных ссылок
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Упрощенный вариант без AnimatePresence - просто используем условный рендеринг
  if (!isOpen) return null;

  return (
    <motion.div 
      className="mobile-menu"
      initial="closed"
      animate="open"
      variants={menuVariants}
    >
      <motion.div className="mobile-menu__header">
        <motion.div
          className="mobile-menu__logo"
          variants={itemVariants}
        >
          <span className="mobile-menu__logo-prefix">no</span>
          <span className="mobile-menu__logo-brand">Name</span>
        </motion.div>
        <motion.button
          className="mobile-menu__close"
          onClick={onClose}
          variants={itemVariants}
          whileTap={{ scale: 0.95 }}
        >
          <span className="mobile-menu__close-icon"></span>
        </motion.button>
      </motion.div>

      <div className="mobile-menu__content">
        <motion.div className="mobile-menu__section" variants={itemVariants}>
          <h3 className="mobile-menu__section-title">Устройства</h3>
          <div className="mobile-menu__devices">
            <motion.button
              className={`mobile-menu__device-btn ${currentDevice === 'phone' ? 'active' : ''}`}
              onClick={() => handleDeviceClick('phone')}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants}
            >
              Телефон
            </motion.button>
            <motion.button
              className={`mobile-menu__device-btn ${currentDevice === 'watch' ? 'active' : ''}`}
              onClick={() => handleDeviceClick('watch')}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants}
            >
              Часы
            </motion.button>
            <motion.button
              className={`mobile-menu__device-btn ${currentDevice === 'tablet' ? 'active' : ''}`}
              onClick={() => handleDeviceClick('tablet')}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants}
            >
              Планшет
            </motion.button>
          </div>
        </motion.div>

        <motion.div className="mobile-menu__section" variants={itemVariants}>
          <h3 className="mobile-menu__section-title">Навигация</h3>
          <motion.nav className="mobile-menu__nav">
            <motion.a
              href="#futures"
              className="mobile-menu__nav-link"
              onClick={() => handleNavClick('#futures')}
              variants={itemVariants}
            >
              Особенности
            </motion.a>
            <motion.a
              href="#gallery"
              className="mobile-menu__nav-link"
              onClick={() => handleNavClick('#gallery')}
              variants={itemVariants}
            >
              Галерея
            </motion.a>
            <motion.a
              href="#tech"
              className="mobile-menu__nav-link"
              onClick={() => handleNavClick('#tech')}
              variants={itemVariants}
            >
              Технологии
            </motion.a>
          </motion.nav>
        </motion.div>

        <motion.button
          className="mobile-menu__cta-button"
          onClick={() => handleNavClick('/store')}
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Купить сейчас
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MobileMenu;