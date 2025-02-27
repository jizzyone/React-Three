import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../styles/Store.css';

interface Product {
  name: string;
  price: string;
  image: string;
}

interface ProductCardProps {
    name: string;
    price: string;
    image: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, image }) => {
    const navigate = useNavigate();
    
    const handleDetailsClick = () => {
      const productUrl = name.toLowerCase().replace(/ /g, '-');
      navigate(`/product/${productUrl}`);
    };
  
    return (
      <motion.div
        className="product-card"
        whileHover={{ scale: 1.03 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="product-image-container">
          <img 
            src={image} 
            alt={name} 
            className="product-image" 
          />
        </div>
        <div className="product-info">
            <h3>{name}</h3>
            <p className="product-price">{price}</p>
            <motion.button
                className="product-button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDetailsClick}
            >
                Подробнее
            </motion.button>
        </div>
      </motion.div>
    );
  };

const ProductSection: React.FC<{ title: string; products: Product[] }> = ({ title, products }) => (
  <div className="product-section">
    <motion.h2 
      className="section-title"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {title}
    </motion.h2>
    <div className="products-grid">
      {products.map((product, index) => (
        <ProductCard key={index} {...product} />
      ))}
    </div>
  </div>
);

const Store: React.FC = () => {
    const phones = [
        { 
          name: "NoName Phone 256GB", 
          price: "89 999 ₽", 
          image: "/phone_new1.png"
        },
        { 
          name: "NoName Phone Pro 512GB", 
          price: "99 999 ₽", 
          image: "/phone_new2.png"
        },
        { 
          name: "NoName Phone Ultra 1TB", 
          price: "109 999 ₽", 
          image: "/phone_new3.png"
        }
      ];

      const watches = [
        { 
          name: "NoName Watch 5 41mm", 
          price: "29 999 ₽", 
          image: "/watch_new1.png"
        },
        {
          name: "NoName Watch 5 45mm", 
          price: "34 999 ₽", 
          image: "/watch_new2.png"
        },
        { 
          name: "NoName Watch 5 Pro", 
          price: "44 999 ₽", 
          image: "/watch_new3.png"
        }
      ];
      
      const tablets = [
        { 
          name: "NoName Tab S8 Ultra 128GB", 
          price: "79 999 ₽", 
          image: "/tablet_new1.png"
        },
        { 
          name: "NoName Tab S8 Ultra 256GB", 
          price: "89 999 ₽", 
          image: "/tablet_new2.png"
        },
        { 
          name: "NoName Tab S8 Ultra 512GB", 
          price: "99 999 ₽", 
          image: "/tablet_new3.png"
        }
      ];

  return (
    <div className="store-container">
      <div className="background-effects">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="store-content">
        <motion.h1 
          className="store-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Магазин NoName
        </motion.h1>

        <ProductSection title="NoName Phone" products={phones} />
        <ProductSection title="NoName Watch 5" products={watches} />
        <ProductSection title="NoName Tab S8 Ultra" products={tablets} />
      </div>
    </div>
  );
};

export default Store;