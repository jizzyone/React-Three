import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollSliderProps {
    scrollProgress: number;
}

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

const ScrollSlider: React.FC<ScrollSliderProps> = () => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sliderRef,
        offset: ["start start", "end end"]
    });

    const containerX = useTransform(
        scrollYProgress,
        [0, 1],
        ['0%', `-${(images.length - 1) * 120}%`] // Увеличиваем смещение для учета отступов
    );

    const containerY = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        ['0%', '-10%', '0%']
    );

    const opacity = useTransform(
        scrollYProgress,
        [0, 0.1, 0.9, 1],
        [0, 1, 1, 0]
    );

    return (
        <div 
            ref={sliderRef} 
            className="w-full h-[300vh] relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800"
        >
            <motion.div 
                className="sticky top-1/2 flex items-center justify-start w-full h-screen"
                style={{
                    opacity
                }}
            >
                <motion.div 
                    className="flex items-center gap-8 pl-16"
                    style={{
                        x: containerX,
                        y: containerY
                    }}
                >
                    {images.map((image, index) => (
                        <motion.div
                            key={image.id}
                            className="relative flex-shrink-0 rounded-xl overflow-hidden shadow-2xl"
                            initial={{ scale: 0.25, opacity: 0 }}
                            whileInView={{ scale: 0.25, opacity: 1 }}
                            transition={{ 
                                duration: 0.8,
                                delay: index * 0.2
                            }}
                        >
                            <img
                                src={image.url}
                                alt={image.alt}
                                className="w-96 h-96 object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                                <h3 className="text-white text-lg font-semibold">
                                    {image.alt}
                                </h3>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ScrollSlider;