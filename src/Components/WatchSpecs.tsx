import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Heart, Watch, Battery, Smartphone, Droplets } from 'lucide-react';
import '../styles/WatchSpecs.css';

const WatchSpecs = () => {
  const specs = [
    {
      icon: Watch,
      title: "Дисплей",
      specs: [
        "Super AMOLED",
        "450 x 450 пикселей",
        "Всегда активный режим"
      ]
    },
    {
      icon: Battery,
      title: "Батарея",
      specs: [
        "До 50 часов работы",
        "Быстрая зарядка",
        "Беспроводная зарядка"
      ]
    },
    {
      icon: Heart,
      title: "Здоровье",
      specs: [
        "ЭКГ датчик",
        "Пульсоксиметр",
        "Мониторинг сна"
      ]
    },
    {
      icon: Activity,
      title: "Фитнес",
      specs: [
        "90+ режимов тренировок",
        "GPS трекинг",
        "Автоопределение активности"
      ]
    },
    {
      icon: Smartphone,
      title: "Связь",
      specs: [
        "Bluetooth 5.2",
        "Wi-Fi",
        "NFC для платежей"
      ]
    },
    {
      icon: Droplets,
      title: "Защита",
      specs: [
        "5ATM + IP68",
        "Закаленное стекло",
        "Прочный корпус"
      ]
    }
  ];

  return (
    <div className="watch-specs-container">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="watch-specs-title"
      >
        Технические характеристики
      </motion.h2>
      
      <div className="specs-grid">
        {specs.map((spec, index) => (
          <motion.div
            key={spec.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="spec-card"
          >
            <div className="spec-header">
              <spec.icon className="spec-icon" />
              <h3 className="spec-title">{spec.title}</h3>
            </div>
            <ul className="spec-list">
              {spec.specs.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: (index * 0.1) + (i * 0.1) }}
                  className="spec-item"
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WatchSpecs;