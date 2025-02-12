import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../styles/Loader.css';
import { motion } from 'framer-motion';

const Loader: React.FC<{ progress: number }> = ({ progress }) => {
    const progressBarRef = useRef(null);
    const logoRef = useRef(null);

    useEffect(() => {
        // Анимация прогресс-бара
        gsap.to(progressBarRef.current, {
            width: `${progress}%`,
            duration: 0.4,
            ease: 'power2.out'
        });

        // Пульсация логотипа
        gsap.to(logoRef.current, {
            scale: 1.05,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
        });
    }, [progress]);

    const loaderVariants = {
        initial: { scale: 0.8, opacity: 0 },
        animate: { 
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="loader-container">
            <div className="loader-content">
                <motion.div
                    ref={logoRef}
                    className="loader-logo"
                    variants={loaderVariants}
                    initial="initial"
                    animate="animate"
                >
                    noNamePhone
                </motion.div>
                <div className="loader-progress-container">
                    <div 
                        ref={progressBarRef} 
                        className="loader-progress-bar"
                        style={{ width: '0%' }}
                    />
                    <span className="loader-progress-text">{Math.round(progress)}%</span>
                </div>
            </div>
        </div>
    );
};

export default Loader; 