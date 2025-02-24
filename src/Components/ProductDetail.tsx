import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { motion } from 'framer-motion';
import ColoredProductModel from './ColoredProductModel';
import { useDeviceDetect } from '../hooks/useDeviceDetect';
import '../styles/ProductDetail.css';

interface ColorOption {
  name: string;
  color: string;
  hex: string;
}

const getPrice = (productId?: string) => {
  switch(productId) {
    case 'noname-phone-256gb':
      return '89 999 ₽';
    case 'noname-phone-pro-512gb':
      return '99 999 ₽';
    case 'noname-phone-ultra-1tb':
      return '109 999 ₽';
    case 'noname-watch-5-41mm':
      return '29 999 ₽';
    case 'noname-watch-5-45mm':
      return '34 999 ₽';
    case 'noname-watch-5-pro':
      return '44 999 ₽';
    case 'noname-tab-s8-ultra-128gb':
      return '79 999 ₽';
    case 'noname-tab-s8-ultra-256gb':
      return '89 999 ₽';
    case 'noname-tab-s8-ultra-512gb':
      return '99 999 ₽';
    default:
      return '89 999 ₽';
  }
};

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [selectedColor, setSelectedColor] = useState(0);
  const { isMobile } = useDeviceDetect();
  
  const colorOptions: ColorOption[] = [
    { name: 'Phantom Black', color: 'Черный', hex: '#2B2B2B' },
    { name: 'Cream', color: 'Кремовый', hex: '#F5E6D3' },
    { name: 'Green', color: 'Зеленый', hex: '#2D4B4A' },
    { name: 'Lavender', color: 'Лавандовый', hex: '#E4D0E3' }
  ];

  const getModelPath = () => {
    switch(productId) {
      case 'noname-phone-256gb':
        return '/samsung_base_store.glb';
      case 'noname-phone-pro-512gb':
        return '/samsung_pro_store2.glb';
      case 'noname-phone-ultra-1tb':
        return '/samsung_ultra_store.glb';
      case 'noname-watch-5-41mm':
        return '/watch_41_store.glb';
      case 'noname-watch-5-45mm':
        return '/watch_41_store.glb';
      case 'noname-watch-5-pro':
        return '/watch_41_store.glb';
      case 'noname-tab-s8-ultra-128gb':
        return '/tab_base_store.glb';
      case 'noname-tab-s8-ultra-256gb':
        return '/tab_base_store.glb';
      case 'noname-tab-s8-ultra-512gb':
        return '/tab_base_store.glb';
      default:
        return '/samsung_base_store.glb';
    }
  };

  if (isMobile) {
    return (
      <div className="product-detail product-detail--mobile">
        <div className="product-detail__model">
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={0.3} />
            <spotLight 
              position={[5, 5, 5]} 
              angle={0.25} 
              penumbra={0.8} 
              intensity={1.2} 
            />
            <spotLight 
              position={[-5, 3, -5]} 
              angle={0.3} 
              penumbra={0.5} 
              intensity={0.8} 
              color="#b0d0ff"
            />
            <Stage environment="city" intensity={0.6}>
              <ColoredProductModel 
                modelPath={getModelPath()} 
                color={colorOptions[selectedColor].hex}
              />
            </Stage>
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.5}
            />
          </Canvas>
        </div>
        
        <div className="product-detail__info--mobile">
          <h1 className="product-detail__title">
            {productId?.split('-').join(' ').toUpperCase() || 'Телефон'}
          </h1>
          
          <div className="product-detail__price">
            <span className="price">{getPrice(productId)}</span>
          </div>

          <div className="product-detail__colors">
            <h3>Выберите цвет</h3>
            <div className="color-options">
              {colorOptions.map((option, index) => (
                <motion.div
                  key={option.name}
                  className={`color-option ${selectedColor === index ? 'active' : ''}`}
                  onClick={() => setSelectedColor(index)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div 
                    className="color-circle"
                    style={{ backgroundColor: option.hex }}
                  />
                  <span className="color-name">{option.color}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.button
            className="buy-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Добавить в корзину
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="product-detail__model">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.3} />
          <spotLight 
            position={[5, 5, 5]} 
            angle={0.25} 
            penumbra={0.8} 
            intensity={1.2} 
          />
          <spotLight 
            position={[-5, 3, -5]} 
            angle={0.3} 
            penumbra={0.5} 
            intensity={0.8} 
            color="#b0d0ff"
          />
          <Stage environment="city" intensity={0.6}>
            <ColoredProductModel 
              modelPath={getModelPath()} 
              color={colorOptions[selectedColor].hex}
            />
          </Stage>
          <OrbitControls 
            enableZoom={true}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Canvas>
      </div>
      
      <div className="product-detail__info">
        <h1 className="product-detail__title">
          {productId?.split('-').join(' ').toUpperCase() || 'Телефон'}
        </h1>
        
        <div className="product-detail__colors">
          <h3>Выберите цвет</h3>
          <div className="color-options">
            {colorOptions.map((option, index) => (
              <motion.div
                key={option.name}
                className={`color-option ${selectedColor === index ? 'active' : ''}`}
                onClick={() => setSelectedColor(index)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div 
                  className="color-circle"
                  style={{ backgroundColor: option.hex }}
                />
                <span className="color-name">{option.color}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="product-detail__price">
          <h3>Цена</h3>
          <span className="price">{getPrice(productId)}</span>
          <motion.button
            className="buy-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Добавить в корзину
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;