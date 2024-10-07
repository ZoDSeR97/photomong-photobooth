import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import i18n from '../../translations/i18n';
import '../../css/Frame.css';
import axios from 'axios';

// Background
import background_en from '../../assets/Frame/Type/BG.png';
import background_kr from '../../assets/Frame/Type/kr/BG.png';
import background_vn from '../../assets/Frame/Type/vn/BG.png';
import background_mn from '../../assets/Frame/Type/mn/BG.png';
// Go Back
import goback_en from '../../assets/Common/goback.png';
import goback_en_hover from '../../assets/Common/gobackhover.png';
import goback_kr from '../../assets/Common/kr/goback.png';
import goback_kr_hover from '../../assets/Common/kr/gobackhover.png';
import goback_vn from '../../assets/Common/vn/goback.png';
import goback_vn_hover from '../../assets/Common/vn/gobackhover.png';
import goback_mn from '../../assets/Common/mn/goback.png';
import goback_mn_hover from '../../assets/Common/mn/gobackhover.png';
import { getAudio, getClickAudio, originAxiosInstance } from '../../api/config';


function Frame() {
  const [hoveredImage, setHoveredImage] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [language, setLanguage] = useState('en');

  // Frames 
  const [frameRow11, setFrameRow11] = useState([]);
  const [frameRow11Hover, setFrameRow11Hover] = useState([]);
  const [frameRow12, setFrameRow12] = useState([]);
  const [frameRow12Hover, setFrameRow12Hover] = useState([]);
  const [frameRow13, setFrameRow13] = useState([]);
  const [frameRow13Hover, setFrameRow13Hover] = useState([]);
  const [frameRow21, setFrameRow21] = useState([]);
  const [frameRow21Hover, setFrameRow21Hover] = useState([]);
  const [frameRow22, setFrameRow22] = useState([]);
  const [frameRow22Hover, setFrameRow22Hover] = useState([]);
  const [frameRow23, setFrameRow23] = useState([]);
  const [frameRow23Hover, setFrameRow23Hover] = useState([]);
  const [frameBackground, setFrameBackground] = useState([]);

  const [goBackBg, setGoBackBg] = useState([]);
  useEffect(() => {
    const storedLanguage = sessionStorage.getItem('language');
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);
      setLanguage(storedLanguage);

      if (storedLanguage === 'ko') {
        setFrameBackground(background_kr);
        setGoBackBg(goback_kr);
      } else if (storedLanguage === 'vi') {
        setFrameBackground(background_vn);
        setGoBackBg(goback_vn);
      }
      else if(storedLanguage==="mn"){
        setFrameBackground(background_mn);
        setGoBackBg(goback_mn);

      }
      
      else {
        setFrameBackground(background_en);
        setGoBackBg(goback_en);
      }
    }
  }, []);

  useEffect(() => {
    fetchFrames();
  }, []);
  const playAudio = async() => {
    const res=await getAudio({file_name:"choose_frame_layout.wav"})
      }
useEffect(()=>{
playAudio()
},[])
  const fetchFrames = async () => {
    try {
      const response = await originAxiosInstance.get(`${import.meta.env.VITE_REACT_APP_BACKEND}/frames/api`)
      const frames = response.data

      frames.forEach(frame => {
        if (frame.position === 'row-1-1') {
          setFrameRow11(import.meta.env.VITE_REACT_APP_BACKEND + frame.photo);
          setFrameRow11Hover(import.meta.env.VITE_REACT_APP_BACKEND + frame.photo_hover)
        }
        if (frame.position === 'row-1-2') {
          setFrameRow12(import.meta.env.VITE_REACT_APP_BACKEND + frame.photo);
          setFrameRow12Hover(import.meta.env.VITE_REACT_APP_BACKEND + frame.photo_hover);
        }
        // if (frame.position === 'row-1-3') {
        //   setFrameRow13(import.meta.env.VITE_REACT_APP_BACKEND + frame.photo);
        //   setFrameRow13Hover(import.meta.env.VITE_REACT_APP_BACKEND + frame.photo_hover)
        // }
        if (frame.position === 'row-2-1') {
          setFrameRow21(import.meta.env.VITE_REACT_APP_BACKEND + frame.photo);
          setFrameRow21Hover(import.meta.env.VITE_REACT_APP_BACKEND + frame.photo_hover);
        }
        if (frame.position === 'row-2-2') {
          setFrameRow22(import.meta.env.VITE_REACT_APP_BACKEND + frame.photo);
          setFrameRow22Hover(import.meta.env.VITE_REACT_APP_BACKEND + frame.photo_hover);
        }
        // if (frame.position === 'row-2-3') {
        //   setFrameRow23(import.meta.env.VITE_REACT_APP_BACKEND + frame.photo);
        //   setFrameRow23Hover(import.meta.env.VITE_REACT_APP_BACKEND + frame.photo_hover);
        // }
      });
    } catch (error) {
      console.error('Error fetching frames:', error);
    }
  }

  const handleMouseEnter = (image) => {
    setHoveredImage(image);
  }

  const handleMouseLeave = () => {
    setHoveredImage(null);
  }

  const hoverGoBackBtn = (goBackBG) => {
    if (goBackBG === 'ko') {
      setGoBackBg(goBackBg === goback_kr ? goback_kr_hover : goback_kr);
    } else if (goBackBG === 'vi') {
      setGoBackBg(goBackBg === goback_vn ? goback_vn_hover : goback_vn);
    } 
    else if (goBackBG === 'mn') {
      setGoBackBg(goBackBg === goback_mn ? goback_mn_hover : goback_mn);
    } 
    else {
      setGoBackBg(goBackBg === goback_en ? goback_en_hover : goback_en);
    }
  }

  const goToBackground = (titleFrame, price) => {
    getClickAudio()
    sessionStorage.setItem('selectedFrame', JSON.stringify({
      frame: titleFrame
    }))
    sessionStorage.setItem('framePrice', price);
    navigate('/background');
  }

  return (
    <div className='frame-container' style={{ backgroundImage: `url(${frameBackground})` }}>
      <div className="go-back" style={{ backgroundImage: `url(${goBackBg})` }} onClick={() =>{
        getClickAudio()
        navigate("/")}} onMouseEnter={() => hoverGoBackBtn(language)} onMouseLeave={() => hoverGoBackBtn(language)}></div>
      <div className="topSection">
        <div className="column">
          <div className="imageDiv-top-left" style={{ backgroundImage: `url( ${hoveredImage === frameRow11 ? frameRow11Hover : frameRow11})` }} onMouseEnter={() => handleMouseEnter(frameRow11)} onMouseLeave={handleMouseLeave} onClick={() => goToBackground('Stripx2', 70000)}></div>
        </div>
        <div className="column">
          <div className="imageDiv-top-right" style={{ backgroundImage: `url(${hoveredImage === frameRow12 ? frameRow12Hover : frameRow12})`, marginLeft: '-40%', }} onMouseEnter={() => handleMouseEnter(frameRow12)} onMouseLeave={handleMouseLeave} onClick={() => goToBackground('2cut-x2', 100000)}></div>
        </div>
      </div>
      <div className="bottomSection">
        <div className="column">
          <div className="imageDiv-bottom-left" style={{ backgroundImage: `url(${hoveredImage === frameRow21 ? frameRow21Hover : frameRow21})` }} onMouseEnter={() => handleMouseEnter(frameRow21)} onMouseLeave={() => handleMouseLeave} onClick={() => goToBackground('4-cutx2', 100000)}></div>
        </div>
        <div className="column">
          <div className="imageDiv-bottom-right" style={{ backgroundImage: `url(${hoveredImage === frameRow22 ? frameRow22Hover : frameRow22})`, marginLeft: '-40%', }} onMouseEnter={() => handleMouseEnter(frameRow22)} onMouseLeave={() => handleMouseLeave} onClick={() => goToBackground('6-cutx2', 100000)}></div>
        </div>

      </div>
    </div>
  );
};

export default Frame;