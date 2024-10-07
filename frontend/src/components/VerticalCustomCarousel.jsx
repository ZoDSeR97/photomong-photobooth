import React, { useState, useRef, useEffect } from 'react';
import '../css/CustomCarousel.css';

const VerticalCustomCarousel = ({ images,stage }) => {
    const carouselRef = useRef(null);
    const [isDown, setIsDown] = useState(false);
    const [startY, setStartY] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);

    useEffect(() => {
        const carousel = carouselRef.current;

        const handleMouseDown = (e) => {
            setIsDown(true);
            if (carousel) {
                setStartY(e.pageY - carousel.offsetTop);
                setScrollTop(carousel.scrollTop);
            }
        };

        const handleMouseLeave = () => {
            setIsDown(false);
        };

        const handleMouseUp = () => {
            setIsDown(false);
            snapToClosestItem();
        };

        const handleMouseMove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            if (carousel) {
                const y = e.pageY - carousel.offsetTop;
                const walk = (y - startY) * 3; // Scroll speed
                carousel.scrollTop = scrollTop - walk;
            }
        };

        const snapToClosestItem = () => {
            if (!carousel) return;
            const itemHeight = carousel.querySelector('.image').offsetHeight;
            const scrollY = carousel.scrollTop;
            const index = Math.round(scrollY / itemHeight);
            carousel.scrollTo({ top: index * itemHeight, behavior: 'smooth' });
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
    }, [isDown, startY, scrollTop]);

    return (
        <div className='v-carousel-container' ref={carouselRef}>
            <div className='v-carousel-images'>
                {images.map((src, index) => (
                    <div
                        className='image'
                        key={index}
                        style={{
                            backgroundImage: `url(${src})`
                        }}
                    >
                        {stage}
                    
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VerticalCustomCarousel;
