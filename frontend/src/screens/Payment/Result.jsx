import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import i18n from '../../translations/i18n';
import "../../css/Payment.css";

//Background
import background_en from '../../assets/Payment/Result/BG.png';
import background_vn from '../../assets/Payment/Result/vn/BG.png';
import backgrond_kr from '../../assets/Payment/Result/kr/BG.png';

// Continue
import continue_en from '../../assets/Common/continue.png';
import continue_en_hover from '../../assets/Common/continue_click.png';
import continue_kr from '../../assets/Common/kr/continue.png';
import continue_kr_hover from '../../assets/Common/kr/continue_click.png';
import continue_vn from '../../assets/Common/vn/continue.png';
import continue_vn_hover from '../../assets/Common/vn/continue_click.png';

function QR() {
     const { t } = useTranslation();
     const navigate = useNavigate();
     const [hoveredImage, setHoveredImage] = useState(null);
     const [backround, setBackround] = useState(background_en);
     const [continueButton, setContinueButton] = useState(continue_en);

     useEffect(() => {
          const storedLanguage = sessionStorage.getItem('language');
          if (storedLanguage) {
               if (storedLanguage === 'en') {
                    setBackround(background_en);
                    setContinueButton(continue_en);
               } else if (storedLanguage === 'ko') {
                    setBackround(backgrond_kr);
                    setContinueButton(continue_kr);
               } else if (storedLanguage === 'vi') {
                    setBackround(background_vn);
                    setContinueButton(continue_vn);
               }
          }
     }, []);

     const hoverContinueButton = () => {
          const storedLanguage = sessionStorage.getItem('language');
          if (storedLanguage === 'en') {
               setContinueButton(continueButton == continue_en ? continue_en_hover : continue_en);
          } else if (storedLanguage === 'ko') {
               setContinueButton(continueButton == continue_kr ? continue_kr_hover : continue_kr);
          } else if (storedLanguage === 'vi') {
               setContinueButton(continueButton == continue_vn ? continue_vn_hover : continue_vn);
          }
     }

     return (
          <div className='payment-result-container' style={{ backgroundImage: `url(${backround})` }}>
               <div style={{ backgroundImage: `url(${continueButton})` }} className="done-result-button" onClick={() => navigate('/photo')} onMouseEnter={hoverContinueButton} onMouseLeave={hoverContinueButton}></div>
          </div>
     );
}

export default QR;