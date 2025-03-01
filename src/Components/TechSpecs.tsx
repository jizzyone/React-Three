import React from 'react';
import "../styles/TechSpecs.css";

const TechSpecs: React.FC = () => {
  return (
    <section className="tech-specs">
      <h2>Технические характеристики Galaxy Tab S8 Ultra</h2>
      <div className="tech-specs-grid">
        <div className="spec-item">
          <h3>Дисплей</h3>
          <p>14.6" Super AMOLED, 2960 x 1848, 120 Гц</p>
        </div>
        <div className="spec-item">
          <h3>Процессор</h3>
          <p>Qualcomm Snapdragon 8 Gen 1</p>
        </div>
        <div className="spec-item">
          <h3>Оперативная память</h3>
          <p>8/12 ГБ LPDDR5</p>
        </div>
        <div className="spec-item">
          <h3>Встроенная память</h3>
          <p>128/256/512 ГБ UFS 3.1</p>
        </div>
        <div className="spec-item">
          <h3>Батарея</h3>
          <p>11200 мАч</p>
        </div>
        <div className="spec-item">
          <h3>S Pen</h3>
          <p>Поддержка с минимальной задержкой</p>
        </div>
        <div className="spec-item">
          <h3>Камеры</h3>
          <p>13 МП (основная), 6 МП (ультраширокая), 12 МП (фронтальная)</p>
        </div>
        <div className="spec-item">
          <h3>Операционная система</h3>
          <p>Android 12 с One UI 4.1</p>
        </div>
        <div className="spec-item">
          <h3>Подключение</h3>
          <p>Wi-Fi 6E, Bluetooth 5.2, 5G (в некоторых моделях)</p>
        </div>
      </div>
    </section>
  );
};

export default TechSpecs;
