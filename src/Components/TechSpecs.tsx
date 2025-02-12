import React from 'react';
import { motion } from 'framer-motion';
import '../styles/TechSpecs.css';

const TechSpecs: React.FC = () => {
    const specs = [
        {
            category: "Дисплей",
            items: [
                { label: "Тип", value: "Dynamic AMOLED 2X" },
                { label: "Размер", value: "6.8 дюймов" },
                { label: "Разрешение", value: "3088 x 1440 (500 ppi)" },
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
    ];

    return (
        <div className="specs-container">
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="specs-title"
            >
                Технические характеристики
            </motion.h2>
            <div className="specs-grid">
                {specs.map((category, index) => (
                    <motion.div 
                        key={category.category}
                        className="spec-card"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        transition={{ 
                            duration: 0.4,
                            delay: index * 0.15,
                            type: "spring",
                            stiffness: 100
                        }}
                    >
                        <h3>{category.category}</h3>
                        <div className="spec-items">
                            {category.items.map((item, i) => (
                                <motion.div 
                                    key={item.label}
                                    className="spec-item"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ delay: (index * 0.2) + (i * 0.1) }}
                                >
                                    <span className="spec-label">{item.label}</span>
                                    <span className="spec-value">{item.value}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default TechSpecs; 