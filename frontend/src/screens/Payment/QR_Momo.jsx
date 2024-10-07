import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import i18n from '../../translations/i18n';
import "../../css/Payment.css";
import {QRCodeSVG} from 'qrcode.react';

// Go Back
import goback_en from '../../assets/Common/goback.png';
import goback_en_hover from '../../assets/Common/gobackhover.png';
import goback_kr from '../../assets/Common/kr/goback.png';
import goback_kr_hover from '../../assets/Common/kr/gobackhover.png';
import goback_vn from '../../assets/Common/vn/goback.png';
import goback_vn_hover from '../../assets/Common/vn/gobackhover.png';

// Background
import background_en from '../../assets/Payment/QR/BG.png';
import background_vn from '../../assets/Payment/QR/vn/BG.png';
import background_kr from '../../assets/Payment/QR/kr/BG.png';

function QR_Momo() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [hoveredImage, setHoveredImage] = useState(null);
    const [qrCode, setQrCode] = useState(null);
    const [orderCode, setOrderCode] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [goBackBg, setGoBackBg] = useState([]);
    const [background, setBackground] = useState(background_en);

    useEffect(() => {
        const storedLanguage = sessionStorage.getItem('language');
        if (storedLanguage === 'ko') {
            setGoBackBg(goback_kr);
            setBackground(background_kr);
        } else if (storedLanguage === 'vi') {
            setGoBackBg(goback_vn);
            setBackground(background_vn);
        } else {
            setGoBackBg(goback_en);
            setBackground(background_en);
        }
    });

    useEffect(() => {
        if (paymentStatus === 'Success') {
            navigate("/payment-result"); // Redirect to the next page
        }
    }, [paymentStatus, navigate]);

    const handleMouseEnter = (image) => {
        setHoveredImage(image);
    }

    const handleMouseLeave = () => {
        setHoveredImage(null);
    }

    const goBack = () => {
        navigate("/payment");
    }

    const hoverGoBackButton = () => {
        setGoBackBg([goback_en_hover, goback_en_hover]);
    }

    return (
        <div className='qr-container' style={{ backgroundImage: `url(${background})` }}>
            <div className='qr-code'>
                {qrCode && <QRCodeSVG value={qrCode} size={200}/>}
            </div>
            <div className="go-back" style={{ backgroundImage: `url(${goBackBg})` }} onClick={goBack} ></div>
        </div>
    );
};

export default QR_Momo;