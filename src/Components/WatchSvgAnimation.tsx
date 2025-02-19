import React from 'react';
import { motion } from 'framer-motion';
import '../styles/WatchSvgAnimation.css';

const WatchSvgAnimation: React.FC = () => {
  const currentTime = new Date();
  const hours = currentTime.getHours() % 12;
  const minutes = currentTime.getMinutes();
  
  const hourHandRotation = 30 * hours + minutes / 2;
  const minuteHandRotation = 6 * minutes;

  return (
    <div className="watch-svg-container">
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 400"
        className="watch-svg"
        initial={{ rotateZ: -5 }}
        animate={{ 
          rotateZ: [-5, 5, -5],
          y: [0, -10, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Тень под часами */}
        <motion.ellipse 
          cx={200} 
          cy={350} 
          rx={80} 
          ry={15} 
          fill="rgba(0,0,0,0.15)"
          animate={{
            rx: [80, 70, 80],
            opacity: [0.15, 0.1, 0.15]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Ремешок - верхняя часть */}
        <motion.path
          d="M160 90 C160 60, 240 60, 240 90 L250 120 C250 130, 150 130, 150 120 Z"
          fill="linear-gradient(to right, #4a0072, #6a0092)"
          animate={{
            fill: [
              "linear-gradient(to right, #4a0072, #6a0092)",
              "linear-gradient(to right, #3a0062, #5a0082)",
              "linear-gradient(to right, #4a0072, #6a0092)"
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Ремешок - нижняя часть */}
        <motion.path
          d="M150 280 C150 270, 250 270, 250 280 L240 310 C240 340, 160 340, 160 310 Z"
          fill="linear-gradient(to right, #4a0072, #6a0092)"
          animate={{
            fill: [
              "linear-gradient(to right, #4a0072, #6a0092)",
              "linear-gradient(to right, #3a0062, #5a0082)",
              "linear-gradient(to right, #4a0072, #6a0092)"
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Основной корпус часов */}
        <motion.circle
          cx={200}
          cy={200}
          r={80}
          fill="linear-gradient(135deg, #2a2a40, #1a1a2e)"
          stroke="#444466"
          strokeWidth={5}
          animate={{
            boxShadow: [
              "0 0 20px rgba(0,0,0,0.5)",
              "0 0 30px rgba(0,0,0,0.7)",
              "0 0 20px rgba(0,0,0,0.5)"
            ]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Внешний ободок циферблата */}
        <circle
          cx={200}
          cy={200}
          r={75}
          fill="none"
          stroke="#666688"
          strokeWidth={2}
        />
        
        {/* Циферблат */}
        <circle
          cx={200}
          cy={200}
          r={70}
          fill="linear-gradient(135deg, #050510, #101020)"
        />
        
        {/* Часовые метки */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30) * Math.PI / 180;
          const x1 = 200 + 60 * Math.sin(angle);
          const y1 = 200 - 60 * Math.cos(angle);
          const x2 = 200 + 68 * Math.sin(angle);
          const y2 = 200 - 68 * Math.cos(angle);
          
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#ffffff"
              strokeWidth={i % 3 === 0 ? 3 : 1.5}
              opacity={0.8}
            />
          );
        })}
        
        {/* Логотип NoName */}
        <text
          x={200}
          y={150}
          textAnchor="middle"
          fill="#ffffff"
          fontSize={14}
          fontWeight="bold"
          opacity={0.9}
        >
          NoName
        </text>
        
        {/* Текст Watch */}
        <text
          x={200}
          y={170}
          textAnchor="middle"
          fill="#aaaacc"
          fontSize={10}
          opacity={0.7}
        >
          WATCH
        </text>
        
        {/* Часовая стрелка */}
        <motion.line
          x1={200}
          y1={200}
          x2={200}
          y2={165}
          stroke="#ffffff"
          strokeWidth={4}
          strokeLinecap="round"
          initial={{ rotate: hourHandRotation }}
          animate={{ rotate: hourHandRotation + 5 }}
          transition={{
            duration: 120,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ transformOrigin: '200px 200px' }}
        />
        
        {/* Минутная стрелка */}
        <motion.line
          x1={200}
          y1={200}
          x2={200}
          y2={145}
          stroke="#ffffff"
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ rotate: minuteHandRotation }}
          animate={{ rotate: minuteHandRotation + 60 }}
          transition={{
            duration: 120,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ transformOrigin: '200px 200px' }}
        />
        
        {/* Секундная стрелка */}
        <motion.line
          x1={200}
          y1={210}
          x2={200}
          y2={130}
          stroke="#ff66dd"
          strokeWidth={1}
          strokeLinecap="round"
          animate={{ rotate: 360 }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ transformOrigin: '200px 200px' }}
        />
        
        {/* Центральный круг */}
        <circle
          cx={200}
          cy={200}
          r={5}
          fill="#ffffff"
        />
        
        {/* Кнопки на боковой стороне */}
        <rect
          x={285}
          y={195}
          width={10}
          height={5}
          rx={2}
          fill="#aaaacc"
        />
        <rect
          x={285}
          y={210}
          width={8}
          height={4}
          rx={2}
          fill="#aaaacc"
        />
        
        {/* Отблески на стекле */}
        <motion.path
          d="M170 160 Q200 180 230 160"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={20}
          fill="none"
          animate={{
            opacity: [0.05, 0.15, 0.05],
            y: [0, 5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.svg>
      
      {/* Эффект свечения вокруг часов */}
      <div className="watch-glow-effect"></div>
    </div>
  );
};

export default WatchSvgAnimation;