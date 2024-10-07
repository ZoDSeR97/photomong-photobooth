import React, { useState, useRef, useEffect } from 'react';
import '../css/CustomCarousel.css';

const CustomCarousel=({ images }) => {
    const carouselRef = useRef(null);
    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    useEffect(() => {
        const carousel = carouselRef.current;

        const handleMouseDown = (e) => {
            setIsDown(true);
            if (carousel) {
                setStartX(e.pageX - carousel.offsetLeft);
                setScrollLeft(carousel.scrollLeft);
            }
        };

        const handleMouseLeave = () => {
            setIsDown(false);
        };

        const handleMouseUp = () => {
            setIsDown(false);
        };

        const handleMouseMove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            if (carousel) {
                const x = e.pageX - carousel.offsetLeft;
                const walk = (x - startX) * 3; // Scroll speed
                carousel.scrollLeft = scrollLeft - walk;
            }
        };

        if (carousel) {
            carousel.addEventListener('mousedown', handleMouseDown);
            carousel.addEventListener('mouseleave', handleMouseLeave);
            carousel.addEventListener('mouseup', handleMouseUp);
            carousel.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            if (carousel) {
                carousel.removeEventListener('mousedown', handleMouseDown);
                carousel.removeEventListener('mouseleave', handleMouseLeave);
                carousel.removeEventListener('mouseup', handleMouseUp);
                carousel.removeEventListener('mousemove', handleMouseMove);
            }
        };
    }, [isDown, startX, scrollLeft]);

    return (
        <div 
        className='carousel-container'
        ref={carouselRef}>
        <div
        className='carousel-images'
        >
            {images.map((src, index) => (
                <div
                className='image'
                key={index} 
                        
                style={{
                    // backgroundColor:"red",
                    // overflowY:"hidden",
                    backgroundImage: `url(${src})`
               }}
                />
            ))}
        </div>
    </div>
    );
};

export default CustomCarousel;
