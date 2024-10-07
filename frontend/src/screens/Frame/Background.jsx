import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import i18n from '../../translations/i18n';
import "../../css/Frame.css";
import axios from 'axios';

// Go Back
import goback_en from '../../assets/Common/goback.png';
import goback_en_hover from '../../assets/Common/gobackhover.png';
import goback_kr from '../../assets/Common/kr/goback.png';
import goback_kr_hover from '../../assets/Common/kr/gobackhover.png';
import goback_vn from '../../assets/Common/vn/goback.png';
import goback_vn_hover from '../../assets/Common/vn/gobackhover.png';
import goback_mn from '../../assets/Common/mn/goback.png';
import goback_mn_hover from '../../assets/Common/mn/gobackhover.png';
//임시 카드 이미지--시작
//season
import season_default_mn from '../../assets/Common/mn/season-default.png'
import season_pressed_mn from '../../assets/Common/mn/season-pressed.png'
//party
import party_default_mn from '../../assets/Common/mn/party-default.png'
import party_pressed_mn from '../../assets/Common/mn/party-pressed.png'
//cartoon
import cartoon_default_mn from '../../assets/Common/mn/cartoon-default.png'
import cartoon_pressed_mn from '../../assets/Common/mn/cartoon-pressed.png'
//minimalism
import minimalism_default_mn from '../../assets/Common/mn/minimalism-default.png'
import minimalism_pressed_mn from '../../assets/Common/mn/minimalism-pressed.png'
//collab
import collab_default_mn from '../../assets/Common/mn/collab-default.png'
import collab_pressed_mn from '../../assets/Common/mn/collab-pressed.png'
//임시 카드 이미지--끝
// Background
import background_en from '../../assets/Frame/Style/BG.png';
import background_kr from '../../assets/Frame/Style/kr/BG.png';
import background_vn from '../../assets/Frame/Style/vn/BG.png';
import background_mn from '../../assets/Frame/Style/mn/BG.png';
import { originAxiosInstance } from '../../api/config';

function Background() {
     const { t } = useTranslation();
     const navigate = useNavigate();
     const [hoveredImage, setHoveredImage] = useState(null);
     const [backgrounds, setBackgrounds] = useState([]);

     const [language, setLanguage] = useState('en');
     const [goBackBg, setGoBackBg] = useState([]);
     const [backgroundContainer, setBackgroundContainer] = useState([]);
     const [selectedFrame, setSelectedFrame] = useState(null);

     useEffect(() => {
          const storedLanguage = sessionStorage.getItem('language');
          if (storedLanguage) {
               setLanguage(storedLanguage);

               if (storedLanguage === 'en') {
                    setBackgroundContainer(background_en);
                    setGoBackBg(goback_en);
               } else if (storedLanguage === 'ko') {
                    setBackgroundContainer(background_kr);
                    setGoBackBg(goback_kr);
               } else if (storedLanguage === 'vi') {
                    setBackgroundContainer(background_vn);
                    setGoBackBg(goback_vn);
               }
               else if (storedLanguage === 'mn') {
                    setBackgroundContainer(background_mn);
                    setGoBackBg(goback_mn);
               }
          }

          const frame = sessionStorage.getItem('selectedFrame');
          if (frame) {
               setSelectedFrame(JSON.parse(frame).frame);
          }
     })

     useEffect(() => {
          fetchBackgrounds()
     }, [])

     const fetchBackgrounds = async () => {
          try {
              // const response = await originAxiosInstance.get(`${import.meta.env.VITE_REACT_APP_BACKEND}/backgrounds/api`)
              const response = await originAxiosInstance.get(`/backgrounds/api`);
              const backgroundDatas = response.data;
              const storedLanguage = sessionStorage.getItem('language');
      
              const newBackgrounds = backgroundDatas.map(item => {
               let photo, photo_hover;
               switch (storedLanguage) {
                   case 'en':
                       photo = import.meta.env.VITE_REACT_APP_BACKEND + item.photo;
                       photo_hover = import.meta.env.VITE_REACT_APP_BACKEND + item.photo_hover;
                       break;
                   case 'ko':
                       photo = import.meta.env.VITE_REACT_APP_BACKEND + item.photo_kr;
                       photo_hover = import.meta.env.VITE_REACT_APP_BACKEND + item.photo_kr_hover;
                       break;
                   case 'vi':
                       photo = import.meta.env.VITE_REACT_APP_BACKEND + item.photo_vn;
                       photo_hover = import.meta.env.VITE_REACT_APP_BACKEND + item.photo_vn_hover;
                       break;
                   case 'mn':
                       switch (item.title) {
                           case 'Season':
                               photo = season_default_mn;
                               photo_hover=season_pressed_mn;
                               break;
                           case 'Party':
                               photo = party_default_mn;
                               photo_hover=party_pressed_mn
                               break;
                           case 'Cartoon':
                               photo = cartoon_default_mn;
                               photo_hover=cartoon_pressed_mn
                               break;
                               case 'Minimalism':
                                   photo = minimalism_default_mn;
                                   photo_hover=minimalism_pressed_mn
                                   break;
                           default:
                               photo = season_default_mn; // default value if title is not Season, Party, or Cartoon
                               photo_hover=season_pressed_mn
                               break;
                       }
                    //    photo_hover = import.meta.env.VITE_REACT_APP_BACKEND + item.photo_mn_hover;
                       break;
                   default:
                       photo = import.meta.env.VITE_REACT_APP_BACKEND + item.photo;
                       photo_hover = import.meta.env.VITE_REACT_APP_BACKEND + item.photo_hover;
               }
           
               return {
                   title: item.title,
                   photo: photo,
                   photo_hover: photo_hover
               };
           });
           
              setBackgrounds(backgrounds.concat(newBackgrounds));
          } catch (error) {
              console.error(error);
          }
      }
      

     const handleMouseEnter = (image) => {
          setHoveredImage(image);
     }

     const handleMouseLeave = () => {
          setHoveredImage(null);
     }

     const goToLayout = (title) => {
          sessionStorage.setItem('styleBg', title);
          navigate('/layout');
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
     return (
          <div className='style-container' style={{ backgroundImage: `url(${backgroundContainer})` }}>
               <div className="go-back" style={{ backgroundImage: `url(${goBackBg})` }} onClick={() => navigate("/frame")} onMouseEnter={() => hoverGoBackBtn(language)} onMouseLeave={() => hoverGoBackBtn(language)}></div>
               <div className="style-section">
                    {backgrounds.map((item, index) => (
                         <div key={index} className="style-column">
                              <div className="image-style-div" style={{ backgroundImage: `url(${hoveredImage === item.photo ? item.photo_hover : item.photo})` }} onMouseEnter={() => handleMouseEnter(item.photo)} onMouseLeave={handleMouseLeave} onClick={() => goToLayout(item.title)}></div>
                         </div>
                    ))}
               </div>
          </div>
     );
}

export default Background;