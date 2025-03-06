import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../styles/Loader.css';
import { motion } from 'framer-motion';

const Loader: React.FC<{ progress: number }> = ({ progress }) => {
    const progressBarRef = useRef(null);
    const logoRef = useRef(null);
    const animationRef = useRef<gsap.core.Tween | null>(null);

    useEffect(() => {
        // Безопасное применение анимации
        try {
            // Анимация прогресс-бара
            if (progressBarRef.current) {
                if (animationRef.current) {
                    animationRef.current.kill();
                }
                
                animationRef.current = gsap.to(progressBarRef.current, {
                    width: `${progress}%`,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            }

            // Пульсация логотипа (только если logoRef существует)
            if (logoRef.current) {
                gsap.to(logoRef.current, {
                    scale: 1.05,
                    duration: 1,
                    repeat: -1,
                    yoyo: true,
                    ease: 'power1.inOut'
                });
            }
        } catch (error) {
            console.error("Error in Loader animation:", error);
            
            // Если анимация не работает, обновляем ширину напрямую через DOM
            if (progressBarRef.current) {
                (progressBarRef.current as HTMLElement).style.width = `${progress}%`;
            }
        }
    }, [progress]);

    // Более надежные варианты для анимации
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
                <div
                    ref={logoRef}
                    className="loader-logo"
                    style={{ 
                        opacity: 1, 
                        transform: 'scale(1)',
                        transition: 'transform 0.5s ease-out, opacity 0.5s ease-out'
                    }}
                >
                    noNamePhone
                </div>
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