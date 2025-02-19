import React from 'react';
import { motion } from 'framer-motion';
import '../styles/PhoneSvgAnimation.css';

const PhoneSvgAnimation = () => {
  return (
    <div className="phone-svg-container">
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 600 700"  // Расширил viewBox для лучших пропорций
        className="phone-svg"
        initial={{ rotateY: -3 }}
        animate={{ 
          rotateY: [-3, 3, -3],
          y: [0, -5, 0]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Тень под телефоном */}
        <motion.ellipse 
          cx={300}  // Центрируем по обновленному viewBox
          cy={650} 
          rx={180}  // Расширяем тень
          ry={20} 
          fill="rgba(0,0,0,0.2)"
          animate={{
            opacity: [0.2, 0.15, 0.2],
            scale: [1, 0.95, 1]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Корпус телефона с горизонтальной ориентацией */}
        <motion.rect
          x={150}
          y={100}
          width={300}  // Широкий корпус
          height={500}
          rx={30}  // Увеличиваем радиус скругления
          fill="linear-gradient(145deg, #1a1a2e 0%, #2b2b4c 50%, #151525 100%)"
          stroke="#333355"
          strokeWidth={2}
          animate={{
            fill: [
              "linear-gradient(145deg, #1a1a2e 0%, #2b2b4c 50%, #151525 100%)",
              "linear-gradient(145deg, #151525 0%, #2b2b4c 50%, #1a1a2e 100%)",
              "linear-gradient(145deg, #1a1a2e 0%, #2b2b4c 50%, #151525 100%)"
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Экран телефона */}
        <motion.rect
          x={165}  // Увеличиваем отступ для рамки
          y={120}
          width={270}  // Широкий экран
          height={450}
          rx={20}  // Увеличиваем радиус скругления
          fill="#000"
          animate={{
            opacity: [0.95, 1, 0.95]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Контент экрана */}
        <motion.rect
          x={170}
          y={125}
          width={260}
          height={440}
          rx={18}
          fill="linear-gradient(180deg, #4a0072 0%, #1a1a2e 50%, #2b2b4c 100%)"
          animate={{
            fill: [
              "linear-gradient(180deg, #4a0072 0%, #1a1a2e 50%, #2b2b4c 100%)",
              "linear-gradient(180deg, #2b2b4c 0%, #4a0072 50%, #1a1a2e 100%)",
              "linear-gradient(180deg, #4a0072 0%, #1a1a2e 50%, #2b2b4c 100%)"
            ]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Вырез для фронтальной камеры - перемещен в центр */}
        <circle cx={300} cy={135} r={8} fill="#000" />
        <circle cx={300} cy={135} r={5} fill="#111" />
        <circle cx={300} cy={135} r={2} fill="#333" />
        
        {/* Иконки на экране - смещены в центр */}
        <g transform="translate(300, 305) scale(1.2)">
          {/* Сетка иконок */}
          <rect x={-80} y={-60} width={160} height={120} rx={18} fill="rgba(255,255,255,0.05)" />
          
          {/* Иконки приложений - сетка 4x3 для широкого экрана */}
          {[...Array(12)].map((_, i) => {
            const row = Math.floor(i / 4);
            const col = i % 4;
            const x = (col - 1.5) * 30;
            const y = (row - 1) * 30;
            const colors = [
              "#ff6b6b", "#48dbfb", "#1dd1a1", "#feca57", 
              "#ff9ff3", "#54a0ff", "#5f27cd", "#ff9f43",
              "#00d2d3", "#ff6348", "#a29bfe", "#55efc4"
            ];
            
            return (
              <motion.rect
                key={i}
                x={x - 8}
                y={y - 8}
                width={16}
                height={16}
                rx={4}
                fill={colors[i]}
                animate={{
                  opacity: [0.8, 1, 0.8],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            );
          })}
        </g>
        
        {/* Блик на экране */}
        <motion.path
          d="M220 180 Q300 220 350 250 T270 400"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={60}
          strokeLinecap="round"
          fill="none"
          animate={{
            opacity: [0, 0.07, 0],
            pathLength: [0, 1, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        {/* Кнопки на широком корпусе */}
        <rect x={145} y={200} width={5} height={40} rx={2} fill="#222" /> {/* Левая кнопка */}
        <rect x={450} y={200} width={5} height={40} rx={2} fill="#222" /> {/* Правая кнопка */}
        
        {/* Логотип NoName */}
        <motion.text
          x={300}
          y={580}
          textAnchor="middle"
          fill="white"
          opacity={0.9}
          fontFamily="Arial, sans-serif"
          fontSize={22}  // Увеличен размер шрифта
          fontWeight="bold"
          animate={{
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          NoName
        </motion.text>
      </motion.svg>
      
      {/* Эффект свечения вокруг телефона */}
      <div className="phone-glow-effect wide"></div>
    </div>
  );
};

export default PhoneSvgAnimation;