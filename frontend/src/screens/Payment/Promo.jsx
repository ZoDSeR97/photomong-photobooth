import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import i18n from '../../translations/i18n';
import "../../css/Payment.css";

// Image
import promo_form from '../../assets/Payment/Promo/promo_form.png';
import promo_form_kr from '../../assets/Payment/Promo/kr/promo_form.png';
import promo_form_vn from '../../assets/Payment/Promo/vn/promo_form.png';
import promo_form_mn from '../../assets/Payment/Promo/mn/promo_form.png';

import promo_input from '../../assets/Payment/Promo/promo_input.png';

import redeem from '../../assets/Payment/Promo/redeem.png';
import redeem_kr from '../../assets/Payment/Promo/kr/redeem.png';
import redeem_vn from '../../assets/Payment/Promo/vn/redeem.png';
import redeem_mn from '../../assets/Payment/Promo/mn/redeem.png';

import redeem_click from '../../assets/Payment/Promo/redeem_click.png';
import redeem_click_kr from '../../assets/Payment/Promo/kr/redeem_click.png';
import redeem_click_vn from '../../assets/Payment/Promo/vn/redeem_click.png';
import redeem_click_mn from '../../assets/Payment/Promo/mn/redeem_click.png';

// Promo images
import button0 from '../../assets/Payment/Promo/button0.png';
import button1 from '../../assets/Payment/Promo/button1.png';
import button2 from '../../assets/Payment/Promo/button2.png';
import button3 from '../../assets/Payment/Promo/button3.png';
import button4 from '../../assets/Payment/Promo/button4.png';
import button5 from '../../assets/Payment/Promo/button5.png';
import button6 from '../../assets/Payment/Promo/button6.png';
import button7 from '../../assets/Payment/Promo/button7.png';
import button8 from '../../assets/Payment/Promo/button8.png';
import button9 from '../../assets/Payment/Promo/button9.png';
import x from '../../assets/Payment/Promo/x.png';
import numx_click from '../../assets/Payment/Promo/numx_click.png';
import num0_click from '../../assets/Payment/Promo/num0_click.png';
import num1_click from '../../assets/Payment/Promo/num1_click.png';
import num2_click from '../../assets/Payment/Promo/num2_click.png';
import num3_click from '../../assets/Payment/Promo/num3_click.png';
import num4_click from '../../assets/Payment/Promo/num4_click.png';
import num5_click from '../../assets/Payment/Promo/num5_click.png';
import num6_click from '../../assets/Payment/Promo/num6_click.png';
import num7_click from '../../assets/Payment/Promo/num7_click.png';
import num8_click from '../../assets/Payment/Promo/num8_click.png';
import num9_click from '../../assets/Payment/Promo/num9_click.png';

// Background
import background_en from '../../assets/Payment/Promo/BG.png';
import background_kr from '../../assets/Payment/Promo/kr/BG.png';
import background_vn from '../../assets/Payment/Promo/vn/BG.png';
import background_mn from '../../assets/Payment/Promo/mn/BG.png';

// Go Back
import goback_en from '../../assets/Common/goback.png';
import goback_en_hover from '../../assets/Common/gobackhover.png';
import goback_kr from '../../assets/Common/kr/goback.png';
import goback_kr_hover from '../../assets/Common/kr/gobackhover.png';
import goback_vn from '../../assets/Common/vn/goback.png';
import goback_vn_hover from '../../assets/Common/vn/gobackhover.png';
import goback_mn from '../../assets/Common/mn/goback.png';
import goback_mn_hover from '../../assets/Common/mn/gobackhover.png';

import { playAudio } from '../../api/config';

function Cash() {
     const { t } = useTranslation();
     const navigate = useNavigate();
     const [hoveredImage, setHoveredImage] = useState(null);
     const [hoveredRedeem, setHoveredRedeem] = useState(null);
     const [redeemCode, setRedeemCode] = useState('');
     const [frameAmount, setFrameAmount] = useState(0);
     const [background, setBackground] = useState(background_en);
     const [promoForm, setPromoForm] = useState(promo_form);
     const [redeemButton, setRedeemButton] = useState(redeem);
     const [language, setLanguage] = useState('en');
     const [goBackButton, setGoBackButton] = useState(null);

     useEffect(() => {
          const storedLanguage = sessionStorage.getItem('language');
          if (storedLanguage) {
               setLanguage(storedLanguage);
               if (storedLanguage === 'en') {
                    setBackground(background_en);
                    setPromoForm(promo_form);
                    setRedeemButton(redeem);
                    setGoBackButton(goback_en);
               } else if (storedLanguage === 'ko') {
                    setBackground(background_kr);
                    setPromoForm(promo_form_kr);
                    setRedeemButton(redeem_kr);
                    setGoBackButton(goback_kr);
               } else if (storedLanguage === 'vi') {
                    setBackground(background_vn);
                    setPromoForm(promo_form_vn);
                    setRedeemButton(redeem_vn);
                    setGoBackButton(goback_vn);
               } else if (storedLanguage === 'mn') {
                    setBackground(background_mn);
                    setPromoForm(promo_form_mn);
                    setRedeemButton(redeem_mn);
                    setGoBackButton(goback_mn);
               }
          }
     }, []);

     const handleMouseEnter = (image) => {
          setHoveredImage(image);
     }

     const handleMouseLeave = () => {
          setHoveredImage(null);
     }

     const hoverRedeemButton = (lang) => {
          if (lang === 'en') {
               setRedeemButton(redeemButton == redeem_click ? redeem : redeem_click);
          } else if (lang === 'ko') {
               setRedeemButton(redeemButton == redeem_click_kr ? redeem_kr : redeem_click_kr);
          } else if (lang === 'vi') {
               setRedeemButton(redeemButton == redeem_click_vn ? redeem_vn : redeem_click_vn);
          } else if (lang === 'mn') {
               setRedeemButton(redeemButton == redeem_click_mn ? redeem_mn : redeem_click_mn);
          }
     }

     const handleRedeemEnter = (image) => {
          setHoveredRedeem(image);
     }

     const handleRedeemLeave = () => {
          setHoveredRedeem(null);
     }

     const handleRedeem = (buttonClick) => {
          if (redeemCode.length > 10) {
               return;
          }
          if (buttonClick) {
               playAudio("click_sound.wav")
               setRedeemCode(redeemCode + buttonClick);
          }
     }

     const handleBackspace = () => {
          setRedeemCode(redeemCode.slice(0, -1));
     }

     const redeemClick = () => {
          playAudio("click_sound.wav")
          checkReedeem();
     }

     const hoverGoBackButton = (lang) => {
          if (lang === 'en') {
               setGoBackButton(goBackButton == goback_en_hover ? goback_en : goback_en_hover);
          } else if (lang === 'ko') {
               setGoBackButton(goBackButton == goback_kr_hover ? goback_kr : goback_kr_hover);
          } else if (lang === 'vi') {
               setGoBackButton(goBackButton == goback_vn_hover ? goback_vn : goback_vn_hover);
          } else if (lang === 'mn') {
               setGoBackButton(goBackButton == goback_mn_hover ? goback_mn : goback_mn_hover);
          }
     }

     useEffect(() => {
          const storedLanguage = sessionStorage.getItem('language');
          if (storedLanguage) {
               i18n.changeLanguage(storedLanguage);
          }

          const storedFrameAmount = sessionStorage.getItem('framePrice');
          console.log(storedFrameAmount);
          if (storedFrameAmount) {
               setFrameAmount(storedFrameAmount);
          }
     }, []);

     const checkReedeem = async () => {
          try {
               const deviceNumber = import.meta.env.VITE_REACT_APP_DEVICE_NUMBER;
               const response = await fetch(`${import.meta.env.VITE_REACT_APP_BE_PROD}/payments/api/redeem?device=${deviceNumber}&code=${redeemCode}&amount=${frameAmount}`);
               const paymentData = await response.json();
               if (paymentData.status === "OK") {
                    sessionStorage.setItem('orderCodeNum', paymentData.order_code);
                    navigate("/payment-result");
               }
          } catch (error) {
               console.error(error);
          }
     }

     useEffect(() => {
          playAudio("enter_pro.wav")
     }, [])

     return (
          <div className='promo-container' style={{ backgroundImage: `url(${background})` }}>
               <div className="go-back" style={{ backgroundImage: `url(${goBackButton})`, top: `4.4%`, left: `6%` }} onClick={() => {
                    playAudio("click_sound.wav")
                    navigate("/payment")}}></div>
               <div className="promo-form" style={{ backgroundImage: `url(${promoForm})` }}>
                    <div className="code-input" style={{ backgroundImage: `url(${promo_input})` }}></div>
                    <div className='code-input-code'>{redeemCode}</div>
                    <div className="redeem-button" style={{ backgroundImage: `url(${redeemButton})` }} onMouseEnter={() => hoverRedeemButton(language)} onMouseLeave={() => hoverRedeemButton(language)} onClick={redeemClick}></div>
                    <div className="form-buttons">
                         <div className="form-button-container">
                              <div className="form-button" style={{ backgroundImage: `url(${hoveredImage === button1 ? num1_click : button1})` }} onMouseEnter={() => handleMouseEnter(button1)} onMouseLeave={handleMouseLeave} onClick={() => handleRedeem(1)}></div>
                              <div className="form-button" style={{ backgroundImage: `url(${hoveredImage === button2 ? num2_click : button2})` }} onMouseEnter={() => handleMouseEnter(button2)} onMouseLeave={handleMouseLeave} onClick={() => handleRedeem(2)}></div>
                              <div className="form-button" style={{ backgroundImage: `url(${hoveredImage === button3 ? num3_click : button3})` }} onMouseEnter={() => handleMouseEnter(button3)} onMouseLeave={handleMouseLeave} onClick={() => handleRedeem(3)}></div>
                         </div>
                         <div className="form-button-container">
                              <div className="form-button" style={{ backgroundImage: `url(${hoveredImage === button4 ? num4_click : button4})` }} onMouseEnter={() => handleMouseEnter(button4)} onMouseLeave={handleMouseLeave} onClick={() => handleRedeem(4)}></div>
                              <div className="form-button" style={{ backgroundImage: `url(${hoveredImage === button5 ? num5_click : button5})` }} onMouseEnter={() => handleMouseEnter(button5)} onMouseLeave={handleMouseLeave} onClick={() => handleRedeem(5)}></div>
                              <div className="form-button" style={{ backgroundImage: `url(${hoveredImage === button6 ? num6_click : button6})` }} onMouseEnter={() => handleMouseEnter(button6)} onMouseLeave={handleMouseLeave} onClick={() => handleRedeem(6)}></div>
                         </div>
                         <div className="form-button-container">
                              <div className="form-button" style={{ backgroundImage: `url(${hoveredImage === button7 ? num7_click : button7})` }} onMouseEnter={() => handleMouseEnter(button7)} onMouseLeave={handleMouseLeave} onClick={() => handleRedeem(7)}></div>
                              <div className="form-button" style={{ backgroundImage: `url(${hoveredImage === button8 ? num8_click : button8})` }} onMouseEnter={() => handleMouseEnter(button8)} onMouseLeave={handleMouseLeave} onClick={() => handleRedeem(8)}></div>
                              <div className="form-button" style={{ backgroundImage: `url(${hoveredImage === button9 ? num9_click : button9})` }} onMouseEnter={() => handleMouseEnter(button9)} onMouseLeave={handleMouseLeave} onClick={() => handleRedeem(9)}></div>
                         </div>
                         <div className="form-button-container">
                              <div className="form-button"></div>
                              <div className="form-button" style={{ backgroundImage: `url(${hoveredImage === button0 ? num0_click : button0})` }} onMouseEnter={() => handleMouseEnter(button0)} onMouseLeave={handleMouseLeave} onClick={() => handleRedeem('0')}></div>
                              <div className="form-button" style={{ backgroundImage: `url(${hoveredImage === x ? numx_click : x})` }} onMouseEnter={() => handleMouseEnter(x)} onMouseLeave={handleMouseLeave} onClick={() => handleBackspace()}></div>
                         </div>
                    </div>
               </div>
          </div>
     );
}

export default Cash;