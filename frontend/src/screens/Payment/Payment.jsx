import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import i18n from '../../translations/i18n';
import "../../css/Payment.css";

// Payment
import cash from '../../assets/Payment/cash.png';
import cash_click from '../../assets/Payment/cash_click.png';
import cash_kr from '../../assets/Payment/Cash/kr/cash.png';
import cash_kr_click from '../../assets/Payment/Cash/kr/cash_click.png';
import cash_vn from '../../assets/Payment/Cash/vn/cash.png';
import cash_vn_click from '../../assets/Payment/Cash/vn/cash_click.png';
import cash_mn from '../../assets/Payment/Cash/mn/cash.png';
import cash_mn_click from '../../assets/Payment/Cash/mn/cash_click.png';

import momo from '../../assets/Payment/momo.png';
import momo_click from '../../assets/Payment/momo_click.png';
import momo_kr from '../../assets/Payment/momo.png';
import momo_kr_click from '../../assets/Payment/momo_click.png';
import momo_vn from '../../assets/Payment/momo.png';
import momo_vn_click from '../../assets/Payment/momo_click.png';

import zalopay from '../../assets/Payment/zalopay.png';
import zalopay_click from '../../assets/Payment/zalopay_click.png';
import zalopay_kr from '../../assets/Payment/QR/kr/zalopay.png';
import zalopay_kr_click from '../../assets/Payment/QR/kr/zalopay_click.png';
import zalopay_vn from '../../assets/Payment/QR/vn/zalopay.png';
import zalopay_vn_click from '../../assets/Payment/QR/vn/zalopay_click.png';

import vnpay from '../../assets/Payment/vnpay.png';
import vnpay_click from '../../assets/Payment/vnpay_click.png';
import vnpay_kr from '../../assets/Payment/QR/kr/vnpay.png';
import vnpay_kr_click from '../../assets/Payment/QR/kr/vnpay_click.png';
import vnpay_vn from '../../assets/Payment/QR/vn/vnpay.png';
import vnpay_vn_click from '../../assets/Payment/QR/vn/vnpay_click.png';

import qpay_mn from '../../assets/Payment/QR/mn/qpay.png';
import qpay_mn_click from '../../assets/Payment/QR/mn/qpay_click.png';
import bank_mn from '../../assets/Payment/QR/mn/bank.png';
import bank_mn_click from '../../assets/Payment/QR/mn/bank_click.png';

import promo from '../../assets/Payment/promo.png';
import promo_click from '../../assets/Payment/promo_click.png';
import promo_kr from '../../assets/Payment/Promo/kr/promo.png';
import promo_kr_click from '../../assets/Payment/Promo/kr/promo_click.png';
import promo_vn from '../../assets/Payment/Promo/vn/promo.png';
import promo_vn_click from '../../assets/Payment/Promo/vn/promo_click.png';
import promo_mn from '../../assets/Payment/Promo/mn/promo.png';
import promo_mn_click from '../../assets/Payment/Promo/mn/promo_click.png';

// Go Back
import goback_en from '../../assets/Common/goback.png';
import goback_en_hover from '../../assets/Common/gobackhover.png';
import goback_kr from '../../assets/Common/kr/goback.png';
import goback_kr_hover from '../../assets/Common/kr/gobackhover.png';
import goback_vn from '../../assets/Common/vn/goback.png';
import goback_vn_hover from '../../assets/Common/vn/gobackhover.png';
import goback_mn from '../../assets/Common/mn/goback.png';
import goback_mn_hover from '../../assets/Common/mn/gobackhover.png';

//Background
import background_en from '../../assets/Payment/BG.png';
import background_vn from '../../assets/Payment/Common/vn/BG.png';
import backgrond_kr from '../../assets/Payment/Common/kr/BG.png';
import background_mn from '../../assets/Payment/Common/mn/BG.png';
import { getAudio, getClickAudio } from '../../api/config';

function Payment() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [hoveredImage, setHoveredImage] = useState(null);
  const [goBackBg, setGoBackBg] = useState([]);
  const [language, setLanguage] = useState(null);
  const [background, setBackground] = useState(background_en);
  const [cashButton, setCashButton] = useState(cash);
  const [zalopayButton, setZalopayButton] = useState(zalopay);
  const [vnpayButton, setVnpayButton] = useState(vnpay);
  const [momoButton, setMomoButton] = useState(momo);
  const [promoButton, setPromoButton] = useState(promo);
  const [qpayButton, setQpayButton] = useState(qpay_mn);

  useEffect(() => {
    const storedLanguage = sessionStorage.getItem('language');
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }

    if (storedLanguage === 'en') {
      setGoBackBg(goback_en);
      setBackground(background_en);
      setMomoButton(momo);
      setZalopayButton(zalopay);
      setVnpayButton(vnpay);
      setCashButton(cash);
      setPromoButton(promo);
    } else if (storedLanguage === 'ko') {
      setGoBackBg(goback_kr);
      setBackground(backgrond_kr);
      setZalopayButton(zalopay_kr);
      setMomoButton(momo_kr);
      setVnpayButton(vnpay_kr);
      setCashButton(cash_kr);
      setPromoButton(promo_kr);
    } else if (storedLanguage === 'vi') {
      setGoBackBg(goback_vn);
      setBackground(background_vn);
      setZalopayButton(zalopay_vn);
      setMomoButton(momo_vn);
      setVnpayButton(vnpay_vn);
      setCashButton(cash_vn);
      setPromoButton(promo_vn);
    } else if (storedLanguage === 'mn') {
      setGoBackBg(goback_mn);
      setBackground(background_mn);
      setQpayButton(qpay_mn)
      setCashButton(cash_mn);
      setPromoButton(promo_mn);
    }
  }, [])
  const playAudio = async () => {
    const res = await getAudio({ file_name: "choose_pay_method.wav" })
  }

  useEffect(() => {
    playAudio()
  }, [])

  const hoverMouseEffect = (image) => {
    const storedLanguage = sessionStorage.getItem('language');
    if (storedLanguage == 'en') {
      if (image === 'zalopay') {
        setZalopayButton(zalopayButton === zalopay_click ? zalopay : zalopay_click);
      } else if (image === 'momo') {
        setMomoButton(momoButton === momo_click ? momo : momo_click);
      } else if (image === 'vnpay') {
        setVnpayButton(vnpayButton === vnpay_click ? vnpay : vnpay_click);
      } else if (image === 'cash') {
        setCashButton(cashButton === cash_click ? cash : cash_click);
      } else if (image === 'promo') {
        setPromoButton(promoButton === promo_click ? promo : promo_click);
      }
    } else if (storedLanguage == 'ko') {
      if (image === 'zalopay') {
        setZalopayButton(zalopayButton === zalopay_kr_click ? zalopay_kr : zalopay_kr_click);
      } else if (image === 'momo') {
        setMomoButton(momoButton === momo_kr ? momo : momo_kr_click);
      } else if (image === 'vnpay') {
        setVnpayButton(vnpayButton === vnpay_kr_click ? vnpay_kr : vnpay_kr_click);
      } else if (image === 'cash') {
        setCashButton(cashButton === cash_kr_click ? cash_kr : cash_kr_click);
      } else if (image === 'promo') {
        setPromoButton(promoButton === promo_kr_click ? promo_kr : promo_kr_click);
      }
    } else if (storedLanguage == 'mn') {
      if (image === 'qpay') {
        setQpayButton(qpayButton === qpay_mn_click ? qpay_mn : qpay_mn_click);
      } else if (image === 'cash') {
        setCashButton(cashButton === cash_mn_click ? cash_mn : cash_mn_click);
      } else if (image === 'promo') {
        setPromoButton(promoButton === promo_mn_click ? promo_mn : promo_mn_click);
      }
    } else {
      if (image === 'zalopay') {
        setZalopayButton(zalopayButton === zalopay_vn_click ? zalopay_vn : zalopay_vn_click);
      } else if (image === 'momo') {
        setMomoButton(momoButton === momo_vn ? momo : momo_vn_click);
      } else if (image === 'vnpay') {
        setVnpayButton(vnpayButton === vnpay_vn_click ? vnpay_vn : vnpay_vn_click);
      } else if (image === 'cash') {
        setCashButton(cashButton === cash_vn_click ? cash_vn : cash_vn_click);
      } else if (image === 'promo') {
        setPromoButton(promoButton === promo_vn_click ? promo_vn : promo_vn_click);
      }
    }
  }

  const hoverGoBackBtn = (goBackBG) => {
    if (goBackBG === 'ko') {
      setGoBackBg(goBackBg === goback_kr ? goback_kr_hover : goback_kr);
    } else if (goBackBG === 'vi') {
      setGoBackBg(goBackBg === goback_vn ? goback_vn_hover : goback_vn);
    } else if (goBackBG === 'mn') {
      setGoBackBg(goBackBg === goback_mn ? goback_mn_hover : goback_mn);
    }
    else {
      setGoBackBg(goBackBg === goback_en ? goback_en_hover : goback_en);
    }
  }

  const goToPay = (method) => {
    getClickAudio()
    navigate(`/payment-${method}`);
  }

  return (
    <div className='payment-container' style={{ backgroundImage: `url(${background})` }}>
      <div className="go-back" style={{ backgroundImage: `url(${goBackBg})`, top: `4.4%`, left: `6%` }} onClick={() => navigate("/layout")} onMouseEnter={() => hoverGoBackBtn(language)} onMouseLeave={() => hoverGoBackBtn(language)}></div>
      <div className="payment-line">
        <div className="payment-method" style={{ backgroundImage: `url(${cashButton})` }} onMouseEnter={() => hoverMouseEffect('cash')} onMouseLeave={() => hoverMouseEffect('cash')} onClick={() => goToPay('cash')}></div>
        {
          language === 'mn' ?
            <div className="payment-method" style={{ backgroundImage: `url(${qpayButton})` }} onMouseEnter={() => hoverMouseEffect('qpay')} onMouseLeave={() => hoverMouseEffect('qpay')} onClick={() => goToPay('qpay')} />
            :
            <>
              <div className="payment-method" style={{ backgroundImage: `url(${vnpayButton})` }} onMouseEnter={() => hoverMouseEffect('vnpay')} onMouseLeave={() => hoverMouseEffect('vnpay')} onClick={() => goToPay('vnpay')} />
              <div className="payment-method" style={{ backgroundImage: `url(${momoButton})` }} onMouseEnter={() => hoverMouseEffect('momo')} onMouseLeave={() => hoverMouseEffect('momo')} onClick={() => goToPay('momo')} />
              <div className="payment-method" style={{ backgroundImage: `url(${zalopayButton})` }} onMouseEnter={() => hoverMouseEffect('zalopay')} onMouseLeave={() => hoverMouseEffect('zalopay')} onClick={() => goToPay('zalopay')} />
            </>
        }
        <div className="payment-method" style={{ backgroundImage: `url(${promoButton})` }} onMouseEnter={() => hoverMouseEffect('promo')} onMouseLeave={() => hoverMouseEffect('promo')} onClick={() => goToPay('promo')} />
      </div>
    </div>
  );
}

export default Payment;