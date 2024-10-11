import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import i18n from '../../translations/i18n';
import "../../css/Payment.css";
import done from '../../assets/Payment/Cash/done.png';
import done_click from '../../assets/Payment/Cash/done_click.png';

// Go Back
import goback_en from '../../assets/Common/goback.png';
import goback_en_hover from '../../assets/Common/gobackhover.png';
import goback_kr from '../../assets/Common/kr/goback.png';
import goback_kr_hover from '../../assets/Common/kr/gobackhover.png';
import goback_vn from '../../assets/Common/vn/goback.png';
import goback_vn_hover from '../../assets/Common/vn/gobackhover.png';

// Background
import background_en from '../../assets/Payment/Cash/BG.png';
import background_vn from '../../assets/Payment/Cash/vn/BG.png';
import background_kr from '../../assets/Payment/Cash/kr/BG.png';

// Inserted Money
import inserted from '../../assets/Payment/Cash/inserted.png';
import inserted_kr from '../../assets/Payment/Cash/kr/inserted.png';
import inserted_vn from '../../assets/Payment/Cash/vn/inserted.png';
// Paid
import paid_en from '../../assets/Payment/Cash/paid.png';
import paid_kr from '../../assets/Payment/Cash/kr/paid.png';
import paid_vn from '../../assets/Payment/Cash/vn/paid.png';
// Done
import done_en from '../../assets/Payment/Cash/done.png';
import done_kr from '../../assets/Payment/Cash/kr/done.png';
import done_vn from '../../assets/Payment/Cash/vn/done.png';
// Done Click
import done_click_en from '../../assets/Payment/Cash/done_click.png';
import done_click_kr from '../../assets/Payment/Cash/kr/done_click.png';
import done_click_vn from '../../assets/Payment/Cash/vn/done_click.png';

import axios from 'axios';

function Cash() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [hoveredImage, setHoveredImage] = useState(null);
  const [orderCode, setOrderCode] = useState(null);
  const [amountToPay, setAmountToPay] = useState(0);
  const [insertedMoney, setInsertedMoney] = useState(0);
  const [language, setLanguage] = useState('en');
  const [goBackButton, setGoBackButton] = useState([]);
  const [background, setBackground] = useState(background_en);
  const [insertedImage, setInsertedImage] = useState(inserted);
  const [paidImage, setPaidImage] = useState(null);
  const [doneImage, setDoneImage] = useState(null);  

  useEffect(() => {
    const storedLanguage = sessionStorage.getItem('language');
    if (storedLanguage) {
      setLanguage(storedLanguage);
      if (storedLanguage === 'en') {
        setBackground(background_en);
        setGoBackButton(goback_en);
        setInsertedImage(inserted);
        setPaidImage(paid_en);
        setDoneImage(done_en);
      } else if (storedLanguage === 'ko') {
        setBackground(background_kr);
        setGoBackButton(goback_kr);
        setInsertedImage(inserted_kr);
        setPaidImage(paid_kr);
        setDoneImage(done_kr);
      } else if (storedLanguage === 'vi') {
        setBackground(background_vn);
        setGoBackButton(goback_vn);
        setInsertedImage(inserted_vn);
        setPaidImage(paid_vn);
        setDoneImage(done_vn);
      }
    }
  }, []);

  useEffect(() => {
    const startCashPayment = async () => {
      try {
        const requestOptions = {
          method: "POST",
          redirect: "follow"
        };

        fetch("http://127.0.0.1:8001/api/start/", requestOptions)
          .then((response) => response.text())
          .then((result) => console.log(result))
          .catch((error) => console.error(error));
      } catch (error) {
        console.error(error);
      }
    }

    startCashPayment();
  }, []);

  useEffect(() => {
    const fetchCashPayment = async () => {
      try {
        const deviceNumber = import.meta.env.VITE_REACT_APP_DEVICE_NUMBER;
        const framePrice = sessionStorage.getItem('framePrice');
        setAmountToPay(framePrice);

        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND}/payments/api/cash/create?device=${deviceNumber}&amount=${framePrice}`)

        const responseData = await response.json();
        if (responseData) {
          sessionStorage.setItem('orderCodeNum', responseData.order_code);
          setOrderCode(responseData.order_code);
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (!orderCode) {
      fetchCashPayment();
    }
  }, []);

  useEffect(() => {
    const checkPaymentStatus = async (orderCodeNum) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND}/payments/api/cash/webhook?order=${orderCodeNum}`)
        const responseData = await response.json();
        setInsertedMoney(responseData.total_money);
        if (parseInt(responseData.total_money) >= parseInt(amountToPay)) {
          setHoveredImage(done);
        }
      } catch (error) {
        console.error(error);
      }
    }

    const intervalId = setInterval(() => {
      const ooCode = sessionStorage.getItem('orderCodeNum');
      if (ooCode) {        
        console.log(ooCode);
        checkPaymentStatus(ooCode);
      }
    }, 3000);

    return () => {
      clearInterval(intervalId);
    }
  }, []);

  const continuePay = () => {
    if (orderCode) {
      if (parseInt(insertedMoney) >= parseInt(amountToPay)) {
        axios.post(
          `${import.meta.env.VITE_REACT_APP_BACKEND}/payments/api/cash/stop`,
          {}
        );
        navigate("/payment-result");
      }
    }
  }

  const handleMouseEnter = (image) => {
    setHoveredImage(image);
  }

  const handleMouseLeave = () => {
    setHoveredImage(null);
  }

  const hoverGoBackButton = (lang) => {
    if (lang === 'en') {
      setGoBackButton(goBackButton == goback_en_hover ? goback_en : goback_en_hover);
    } else if (lang === 'ko') {
      setGoBackButton(goBackButton == goback_kr_hover ? goback_kr : goback_kr_hover);
    } else if (lang === 'vi') {
      setGoBackButton(goBackButton == goback_vn_hover ? goback_vn : goback_vn_hover);
    }
  }

  const hoverDoneImage = (lang) => {
    if (lang == 'en') {
      setDoneImage(doneImage == done_click_en ? done_en : done_click_en);
    } else if (lang == 'ko') {
      setDoneImage(doneImage == done_click_kr ? done_kr : done_click_kr);
    } else if (lang == 'vi') {
      setDoneImage(doneImage == done_click_vn ? done : done_click_vn);
    }
  }

  return (
    <div className='cash-container' style={{ backgroundImage: `url(${background})` }}>
      <div className="go-back" style={{ backgroundImage: `url(${goBackButton})` }} onClick={() => navigate("/payment")} onMouseEnter={() => hoverGoBackButton(language)} onMouseLeave={() => handleMouseLeave(language)}></div>
      <div className="paid-cash" style={{ backgroundImage: `url(${paidImage})` }}>
        <div className="paid-cash-text">{amountToPay}</div>
      </div>
      <div className="insert-cash" style={{ backgroundImage: `url(${insertedImage})` }}>
        <div className="insert-cash-text">{insertedMoney}</div>
      </div>
      <div style={{ backgroundImage: `url(${doneImage})` }} className="done-button" onClick={continuePay} onMouseEnter={() => hoverDoneImage(language)} onMouseLeave={() => handleMouseLeave(language)}></div>
    </div>
  );
}

export default Cash;