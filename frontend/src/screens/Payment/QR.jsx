import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import i18n from '../../translations/i18n';
import "../../css/Payment.css";
import { QRCodeSVG } from 'qrcode.react';
import PropTypes from 'prop-types';
import axios from "axios";

// Go Back
import goback_en from '../../assets/Common/goback.png';
import goback_en_hover from '../../assets/Common/gobackhover.png';
import goback_kr from '../../assets/Common/kr/goback.png';
import goback_kr_hover from '../../assets/Common/kr/gobackhover.png';
import goback_vn from '../../assets/Common/vn/goback.png';
import goback_vn_hover from '../../assets/Common/vn/gobackhover.png';
import goback_mn from '../../assets/Common/mn/goback.png';
import goback_mn_hover from '../../assets/Common/mn/gobackhover.png';

// Background
import background_en from '../../assets/Payment/QR/BG.png';
import background_vn from '../../assets/Payment/QR/vn/BG.png';
import background_kr from '../../assets/Payment/QR/kr/BG.png';
import background_mn from '../../assets/Payment/QR/mn/BG.png';

QRPayment.propTypes = {
    method: PropTypes.string.isRequired,  // Ensures 'method' is a string and is required
};

function QRPayment({ method }) { // 'method' can be 'momo', 'vnpay', or 'zalopay'
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [hoveredImage, setHoveredImage] = useState(null);
    const [qrCode, setQrCode] = useState(null);
    const [orderCode, setOrderCode] = useState(null);
    const [invoice, setInvoice] = useState(null);
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
        } else if (storedLanguage === 'mn') {
            setGoBackBg(goback_mn);
            setBackground(background_mn);
        }
        else {
            setGoBackBg(goback_en);
            setBackground(background_en);
        }
    }, []);

    useEffect(() => {
        const fetchQRPayment = async () => {
            try {
                const deviceNumber = import.meta.env.VITE_REACT_APP_DEVICE_NUMBER;
                const framePrice = sessionStorage.getItem('sales');
                const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND}/${method}/api?device=${deviceNumber}&amount=${framePrice}`);
                const qrCodeData = await response.json();
                setQrCode(qrCodeData.qr_code);
                setOrderCode(qrCodeData.order_code);
                if (method === "qpay"){
                    setInvoice(qrCodeData.invoice_id)
                }

                if (qrCodeData.return_code == 1) {
                    setPaymentStatus(qrCodeData.status);
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchQRPayment();
    }, [method]);

    useEffect(() => {
        const checkPaymentStatus = async (orderCodeNum) => {
            try {
                if (method === "qpay") {
                    const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND}/${method}/api`, 
                        {
                            method:"POST",
                            headers: {
                                "Content-Type":"application/json"
                            },
                            body:JSON.stringify({
                                "invoice_id":invoice,
                                "order_code":orderCode,
                            })
                        });
                    const paymentData = await response.json();
                    if (paymentData.status === "Success") {
                        clearInterval(intervalId);
                        navigate("/payment-result");
                    }
                } else {
                    const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND}/${method}/api/webhook?order=${orderCodeNum}`);
                    const paymentData = await response.json();
                    if (paymentData.status === "Success") {
                        clearInterval(intervalId);
                        navigate("/payment-result");
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };

        const intervalId = setInterval(() => {
            if (orderCode) {
                checkPaymentStatus(orderCode);
            }
        }, 8000);

        return () => {
            clearInterval(intervalId);
        }
    }, [orderCode, method, navigate]);

    // WebSocket setup to listen for payment status updates
    /* useEffect(() => {
        const socket = new WebSocket('ws://localhost:8000/ws/payment-status/'); // Adjust the URL for your production server

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Payment Status Update:", data);
            if (data.order_code === orderCode) {
                setPaymentStatus(data.status);
                if (data.status === "Success") {
                    navigate("/payment-result");
                }
            }
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            socket.close();
        };
    }, [orderCode, navigate]); */

    useEffect(() => {
        if (paymentStatus === 'Success') {
            navigate("/payment-result");
        }
    }, [paymentStatus, navigate]);

    const goBack = () => {
        navigate("/payment");
    }

    return (
        <div className='qr-container' style={{ backgroundImage: `url(${background})` }}>
            <div className='qr-code'>
                {qrCode && <QRCodeSVG value={qrCode} size={200} />}
            </div>
            <div className="go-back" style={{ backgroundImage: `url(${goBackBg})`, top: `4.2%`, left: `11%` }} onClick={goBack}></div>
        </div>
    );
};

export default QRPayment;
