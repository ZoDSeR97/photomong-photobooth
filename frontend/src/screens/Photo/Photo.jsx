import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import i18n from '../../translations/i18n';
import Webcam from 'react-webcam';
import "../../css/Photo.css";
import countdownImg from '../../assets/Photo/Snap/countdown.png';
import photocountImg from '../../assets/Photo/Snap/photocount.png';
import frame from '../../assets/Photo/Snap/frame.png';

import background_en from '../../assets/Photo/Snap/BG.png';
import background_kr from '../../assets/Photo/Snap/kr/BG.png';
import background_vn from '../../assets/Photo/Snap/vn/BG.png';


function Photo() {
     const { t } = useTranslation();
     const webcamRef = useRef(null);
     const navigate = useNavigate();
     const [hoveredImage, setHoveredImage] = useState(null);
     const [countdown, setCountdown] = useState(8);
     const [photoCount, setPhotoCount] = useState(0);
     const [intervalId, setIntervalId] = useState(null);
     const [photos, setPhotos] = useState([]);
     const [flash, setFlash] = useState(false);
     const [clickedButton, setClickedButton] = useState(false);

     const [backgroundImage, setBackgroundImage] = useState(background_en);

     const rightCornerDivValue = (photoCount + 1) * (1 / 8);

     const takeSnapshot = () => {
          setFlash(true);
          const imageSrc = webcamRef.current.getScreenshot();
          const newPhotoArray = [...photos, imageSrc];
          setPhotos(newPhotoArray);
          setPhotoCount((prevCount) => prevCount + 1);

          setTimeout(() => {
               setFlash(false);
          }, 100);

          if (photoCount == 7) {
               const photosWithIds = newPhotoArray.map((photo, index) => ({
                    id: index,
                    url: photo
               }));
               sessionStorage.setItem('photos', JSON.stringify(photosWithIds));
               navigate('/photo-choose')
          } else {
               setCountdown(8);
          }
     };

     useEffect(() => {
          const timer = setInterval(() => {
               if (countdown > 0) {
                    setCountdown(countdown - 1);
               } else {
                    takeSnapshot();
               }
          }, 1000);

          return () => clearInterval(timer); // Cleanup timer on unmount
     }, [countdown]);

     useEffect(() => {
          const language = sessionStorage.getItem('language');
          if (language === 'en') {
               setBackgroundImage(background_en);
          } else if (language === 'ko') {
               setBackgroundImage(background_kr);
          } else if (language === 'vi') {
               setBackgroundImage(background_vn);
          }
     }, [])

     const handleMouseEnter = (image) => {
          setHoveredImage(image);
     }

     const handleMouseLeave = () => {
          setHoveredImage(null);
     }

     return (
          <div className={`photo-container ${flash ? ' animate' : ''}`} style={{ backgroundImage: `url(${backgroundImage})` }}>
               <div className="left-photo-div" style={{ backgroundImage: `url(${countdownImg})` }}>
                    <div className="photo-countdown">{countdown}</div>
               </div>
               <div className="right-photo-div" style={{ backgroundImage: `url(${photocountImg})` }}>
                    <div className="photo-count">{photoCount}/8</div>
               </div>
               <div className="middle-photo-div">
                    <Webcam
                         audio={false}
                         ref={webcamRef}
                         forceScreenshotSourceSize={true}
                         videoConstraints={{
                              height: 720,
                              width: 1280
                         }}
                         screenshotFormat='image/jpeg'
                         className='photo-webcam'
                    />
               </div>
          </div>
     );
}

export default Photo;