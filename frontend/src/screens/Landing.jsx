import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import i18n from '../translations/i18n';
import "../css/Print.css";

// Background
import background_en from '../assets/Landing/BG.png';
import background_kr from '../assets/Landing/kr/BG.png';
import background_vn from '../assets/Landing/vn/BG.png';
import background_mn from '../assets/Landing/mn/BG.png';

// QR
import { QRCodeSVG } from 'qrcode.react';
import { getAudio } from '../api/config';

function Print() {
     const { t } = useTranslation();
     const navigate = useNavigate();
     const [hoveredImage, setHoveredImage] = useState(null);

     const [background, setBackground] = useState(background_en);
    
     useEffect(() => {
          const storedLanguage = sessionStorage.getItem('language');
          if (storedLanguage === 'en') {
               setBackground(background_en);
          } else if (storedLanguage === 'ko') {
               setBackground(background_kr);
          } else if (storedLanguage === 'vi') {
               setBackground(background_vn);
          }else if (storedLanguage === 'mn') {
               setBackground(background_mn);
          }
     }, []);



     const clearSessionStorageAndLeaveOut = () => {
          // sessionStorage.clear();
          navigate('/');
     }

  

     return (
          <div className='print-container' style={{ backgroundImage: `url(${background})` }} onClick={clearSessionStorageAndLeaveOut}>
           <iframe width="760" height="515" src="https://www.youtube.com/embed/fhMZQmgYV-o?si=dltO--EukMN6wga6" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          </div>
     );
}

export default Print;