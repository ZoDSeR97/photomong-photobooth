import React, { useState, useRef, useEffect } from 'react';
import '../css/StickerCarousel.css';

const StickerCarousel = ({ stickers,backgroundImage }) => {
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
            const itemHeight = carousel.querySelector('.sticker-lines').offsetHeight??1;
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
        <div className='sticker-carousel-container' ref={carouselRef}
        
        style={{
            // backgroundColor:"red",
            // overflowY:"hidden",
            backgroundImage: `url(${backgroundImage})`
       }}
        >
            <div className='sticker-carousel-lines'>
                {stickers.map((lines, index) => (
                    <div
                        className='sticker-lines'
                      
                    >{lines}</div>
                ))}
            </div>
        </div>
    );
};

export default StickerCarousel;
