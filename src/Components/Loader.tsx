import React from 'react';
import '../styles/Loader.css';

const Loader: React.FC<{ progress: number }> = ({ progress }) => {
    return (
        <div className="loader-container">
            <div className="loader-content">
                <div className="loader-logo">
                    noNamePhone
                </div>
                <div className="loader-progress-container">
                    <div 
                        className="loader-progress-bar"
                        style={{ width: `${progress}%` }}
                    />
                    <span className="loader-progress-text">{Math.round(progress)}%</span>
                </div>
            </div>
        </div>
    );
};

export default Loader;