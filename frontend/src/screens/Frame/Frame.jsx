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
import scroll_left from '../../assets/Photo/Snap/ScrollLeft.png';
import scroll_right from '../../assets/Photo/Snap/ScrollRight.png';
import { playAudio, originAxiosInstance } from '../../api/config';

// Language
import confirm_en from '../../assets/Frame/Layout/confirm.png';
import confirm_en_hover from '../../assets/Frame/Layout/confirm_click.png';

// Other
import FrameCarousel from '../../components/FrameCarousel';


function Frame() {
  const [hoveredImage, setHoveredImage] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const definedWidth = '100%';

  const [language, setLanguage] = useState('en');

  // Frames 
  const [frameBackground, setFrameBackground] = useState([]);

  // Frames
  const [frames, setFrames] = useState([]);

  // Frame Page  
  const [goBackBg, setGoBackBg] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [sliceIdx, setSliceIdx] = useState(0);
  const [clickedTitles, setClickedTitles] = useState([]);
  const [confirmClick, setConfirmClick] = useState(false);
  const [confirmButton, setConfirmButton] = useState(confirm_en);
  const [confirmHoverButton, setConfirmHoverButton] = useState(confirm_en_hover);

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
      } else if (storedLanguage === "mn") {
        setFrameBackground(background_mn);
        setGoBackBg(goback_mn);
      } else {
        setFrameBackground(background_en);
        setGoBackBg(goback_en);
      }
    }
  }, []);

  useEffect(() => {
    fetchFrames();
  }, []);

  useEffect(() => {
    playAudio("choose_frame_layout.wav")
  }, [])

  /**
   * API frames
   */
  const fetchFrames = async () => {
    try {
      const response = await originAxiosInstance.get(`${import.meta.env.VITE_REACT_APP_BACKEND}/frames/api`)
      const frames = response.data

      setFrames(frames.map(frame => ({
        ...frame,
        title: frame.title,
        photo_full: import.meta.env.VITE_REACT_APP_BACKEND + frame.photo,
        photo_hover: import.meta.env.VITE_REACT_APP_BACKEND + frame.photo_hover
      })));
    } catch (error) {
      console.error('Error fetching frames:', error);
    }
  }

  const onDrag = (e) => {
    setDragging(true);
  }

  const onDragEnd = (e) => {
    setSliceIdx(prevIdx => (prevIdx + 1) % 4);
    const nextSliceIdx = (sliceIdx + 1) % 4;
    setDragging(false);
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

  const handleClick = (index, clickedTitle) => {
    if (dragging) return;

    playAudio("click_sound.wav")

    if (clickedTitles.includes(clickedTitle)) {
      setClickedTitles(prevTitles => prevTitles.filter(clickedTitle => clickedTitle != clickedTitle));
    } else {
      setClickedTitles(prevTitles => [...prevTitles, clickedTitle]);
    }

    setConfirmClick(confirmButton);
    let price = 0;
    frames.forEach(frame => {
      if (frame.title === clickedTitle) {
        price = frame.price
      }
    })
    goToBg(clickedTitle, price);
  }

  const goToBg = (titleFrame, price) => {
    playAudio("click_sound.wav")
    console.log(titleFrame)
    sessionStorage.setItem('selectedFrame', JSON.stringify({
      frame: titleFrame
    }))
    sessionStorage.setItem('framePrice', price);
    navigate('/background');
  }

  const scrollPage = (scrollOffset) => {
    const frameContainer = document.querySelector('.frame-carousel-container');
    frameContainer.scrollLeft += scrollOffset;
  }

  return (
    <div className='layout-container'
      style={{
        backgroundImage: `url(${frameBackground})`
      }}
    >
      <div className="go-back-frame" style={{ backgroundImage: `url(${goBackBg})`,  top:`7.6%`, left: `6%`}} onClick={() => {
        playAudio("click_sound.wav")
        navigate("/")}} onMouseEnter={() => hoverGoBackBtn(language)} onMouseLeave={() => hoverGoBackBtn(language)}></div>
      <div className="style-section"
        draggable={false}
        onDragStart={onDrag}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        style={{
        }}
      >
        <div className="scroll-left" style={{ backgroundImage: `url(${scroll_left})` }} onClick={() => scrollPage(-200)}></div>
        <FrameCarousel
          clickedTitles={clickedTitles}
          images={frames}
          handleClick={handleClick}
          width={definedWidth}
        />
        <div className="scroll-right" style={{ backgroundImage: `url(${scroll_right})` }} onClick={() => scrollPage(200)}></div>
      </div>
    </div>
  );
};

export default Frame;