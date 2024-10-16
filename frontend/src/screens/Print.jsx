import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import i18n from '../translations/i18n';
import "../css/Print.css";

// Background
import background_en from '../assets/Prints/BG.png';
import background_kr from '../assets/Prints/kr/BG.png';
import background_vn from '../assets/Prints/vn/BG.png';
import background_mn from '../assets/Prints/mn/BG.png';

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

     /* const playAudio = async() => {
          const res=await getAudio({file_name:"thank_being.wav"})
            }
      useEffect(()=>{
      playAudio()
      },[]) */
  
     const handleMouseEnter = (image) => {
          setHoveredImage(image);
     }

     const handleMouseLeave = () => {
          setHoveredImage(null);
     }

     const clearSessionStorageAndLeaveOut = () => {
          sessionStorage.clear();
          navigate('/landing');
     }

     const QRCodeComponent = () => {
          const myImage = sessionStorage.getItem('uploadedCloudPhotoUrl');
          console.log("!@#");
          console.log("!@#");
          console.log(myImage);
          // myImage = myImage.replace("get_photo","download_photo")
          return (
               <QRCodeSVG
                    value={myImage}
                    size={160}
               />
          )
     }
     const GifQRCodeComponent = () => {
          const myImage = sessionStorage.getItem('gifPhoto');
          console.log("!@#");
          console.log("!@#");
          console.log("!@#");
          // console.log(myImage);;
          // myImage = str(myImage).replace("get_photo","download_photo")
          console.log(myImage);
          return (
               <QRCodeSVG
                    value={myImage}
                    size={160}
               />
          )
     }

     return (
          <div className='print-container' style={{ backgroundImage: `url(${background})` }} onClick={clearSessionStorageAndLeaveOut}>
               <div className="qr-code-container">
                    <QRCodeComponent />
               </div>
               <div className="gif-qr-code-container">
                    <GifQRCodeComponent />
               </div>
          </div>
     );
}

export default Print;