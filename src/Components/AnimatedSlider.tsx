import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import '../styles/AnimatedSlider.css';

const images = [
    {
        id: 1,
        url: 'https://images.samsung.com/levant/smartphones/galaxy-s23-ultra/images/galaxy-s23-ultra-highlights-kv.jpg',
        alt: 'Samsung Galaxy S23 Ultra'
    },
    {
        id: 2,
        url: 'https://images.samsung.com/levant/smartphones/galaxy-s23-ultra/images/galaxy-s23-ultra-highlights-camera.jpg',
        alt: 'Galaxy S23 Ultra Camera'
    },
    {
        id: 3,
        url: 'https://images.samsung.com/levant/smartphones/galaxy-s23-ultra/images/galaxy-s23-ultra-highlights-spen.jpg',
        alt: 'Galaxy S23 Ultra with S Pen'
    },
    {
        id: 4,
        url: 'https://images.samsung.com/levant/smartphones/galaxy-s23-ultra/images/galaxy-s23-ultra-highlights-display.jpg',
        alt: 'Galaxy S23 Ultra Display'
    }
];

const Features = () => {
    const features = [
        {
            id: 1,
            title: "Революционная камера",
            description: "200 МП основная камера с продвинутой системой ИИ",
            icon: "📸"
        },
        {
            id: 2,
            title: "Мощный процессор",
            description: "Snapdragon 8 Gen 2 для исключительной производительности",
            icon: "⚡"
        },
        {
            id: 3,
            title: "Впечатляющий дисплей",
            description: "6.8\" Dynamic AMOLED 2X с частотой 120 Гц",
            icon: "✨"
        }
    ];

    return (
        <div className="features-section">
            {features.map((feature, index) => (
                <motion.div
                    key={feature.id}
                    className="feature-card"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ 
                        duration: 0.8,
                        delay: index * 0.2,
                        ease: "easeOut"
                    }}
                    viewport={{ once: false, margin: "-100px" }}
                >
                    <div className="feature-icon">{feature.icon}</div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                </motion.div>
            ))}
        </div>
    );
};

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
    })
};

const AnimatedSlider: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const x = useTransform(
        scrollYProgress,
        [0, 0.3, 0.7, 1],
        ["0%", "0%", `-${(images.length - 1) * 100}%`, `-${(images.length - 1) * 100}%`]
    );

    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 1, 0.8]);

    return (
        <>
            <div ref={containerRef} className="gallery-container">
                <div className="background-effect"></div>
                <motion.div 
                    className="gallery-track"
                    style={{ 
                        x,
                        scale,
                        opacity
                    }}
                >
                    {images.map((image) => (
                        <motion.div 
                            key={image.id} 
                            className="gallery-item"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: false, margin: "-5%" }}
                            transition={{ duration: 1.5 }}
                        >
                            <motion.img 
                                src={image.url} 
                                alt={image.alt}
                                className="gallery-image"
                                loading="eager"
                                initial={{ scale: 0.8 }}
                                whileInView={{ scale: 1 }}
                                transition={{ duration: 1.2 }}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
            <Features />
        </>
    );
};

export default AnimatedSlider; 