import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

AudioPlayer.propTypes = {
    audioUrl: PropTypes.string.isRequired,  // Ensures 'method' is a string and is required
};
const AudioPlayer = ({ audioUrl }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        setTimeout(() => {
            setIsPlaying(true);
            audioRef.current.play();
        }, 10000); // Wait 10 seconds before repeating
    };

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        setIsPlaying(true);
    }, []);

    return (
        <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md">
            <audio
                ref={audioRef}
                src={audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
                autoPlay
                className="hidden"
            />
        </div>
    );
};

export default AudioPlayer;