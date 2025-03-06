import React from 'react';
import '../styles/Loader.css';

const Loader: React.FC<{ progress: number }> = ({ progress }) => {
    // Полностью избегаем использования gsap и motion для максимальной надежности
    return (
        <div className="loader-container">
            <div className="loader-content">
                <div 
                    className="loader-logo"
                    style={{ 
                        transform: 'scale(1)',
                        animation: 'pulsate 1.5s infinite alternate'
                    }}
                >
                    noNamePhone
                </div>
                <div className="loader-progress-container">
                    <div 
                        className="loader-progress-bar"
                        style={{ width: `${progress}%`, transition: 'width 0.2s linear' }}
                    />
                    <span className="loader-progress-text">{Math.round(progress)}%</span>
                </div>
            </div>
        </div>
    );
};

export default Loader;