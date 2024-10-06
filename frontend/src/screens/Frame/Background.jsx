import { useEffect, useState } from 'react';
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

// Background
import background_en from '../../assets/Frame/Style/BG.png';
import background_kr from '../../assets/Frame/Style/kr/BG.png';
import background_vn from '../../assets/Frame/Style/vn/BG.png';

function Background() {
     const { t } = useTranslation();
     const navigate = useNavigate();
     const [hoveredImage, setHoveredImage] = useState(null);
     const [backgrounds, setBackgrounds] = useState([]);

     const [language, setLanguage] = useState('en');
     const [goBackBg, setGoBackBg] = useState([]);
     const [backgroundContainer, setBackgroundContainer] = useState([]);

     // This to save the selected frame in session storage
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
               const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND}/backgrounds/api`)
               const backgroundDatas = response.data
               const storedLanguage = sessionStorage.getItem('language');

               const newBackgrounds = backgroundDatas.map(item => ({
                    title: item.title,
                    photo: (storedLanguage === 'en' ? import.meta.env.VITE_REACT_APP_BACKEND + item.photo : (storedLanguage === 'ko' ? import.meta.env.VITE_REACT_APP_BACKEND + item.photo_kr : import.meta.env.VITE_REACT_APP_BACKEND + item.photo_vn)),
                    photo_hover: (storedLanguage === 'en' ? import.meta.env.VITE_REACT_APP_BACKEND + item.photo_hover : (storedLanguage === 'ko' ? import.meta.env.VITE_REACT_APP_BACKEND + item.photo_kr_hover : import.meta.env.VITE_REACT_APP_BACKEND + item.photo_vn_hover))
               }));
               setBackgrounds(backgrounds.concat(newBackgrounds));
          } catch (error) {
               console.error(error)
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
          } else {
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