import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import i18n from '../../translations/i18n';
import '../../css/Frame.css';
import Background from './Background';
import axios from 'axios';

// Import images
import confirm from '../../assets/Frame/Layout/confirm.png';
import confirm_click from '../../assets/Frame/Layout/confirm_click.png';

// Go Back
import goback_en from '../../assets/Common/goback.png';
import goback_en_hover from '../../assets/Common/gobackhover.png';
import goback_kr from '../../assets/Common/kr/goback.png';
import goback_kr_hover from '../../assets/Common/kr/gobackhover.png';
import goback_vn from '../../assets/Common/vn/goback.png';
import goback_vn_hover from '../../assets/Common/vn/gobackhover.png';
import goback_mn from '../../assets/Common/mn/goback.png';
import goback_mn_hover from '../../assets/Common/mn/gobackhover.png';

// Confirm
import confirm_en from '../../assets/Frame/Layout/confirm.png';
import confirm_en_hover from '../../assets/Frame/Layout/confirm_click.png';
import confirm_kr from '../../assets/Frame/Layout/Confirm/kr/confirm.png';
import confirm_kr_hover from '../../assets/Frame/Layout/Confirm/kr/confirm_click.png';
import confirm_vn from '../../assets/Frame/Layout/Confirm/vn/confirm.png';
import confirm_vn_hover from '../../assets/Frame/Layout/Confirm/vn/confirm_click.png';
import confirm_mn from '../../assets/Frame/Layout/Confirm/mn/confirm.png';
import confirm_mn_hover from '../../assets/Frame/Layout/Confirm/mn/confirm_click.png';
import { getAudio, getClickAudio, originAxiosInstance } from '../../api/config';
import FrameCarousel from '../../components/FrameCarousel';

function Layout() {
     const [layoutBackground, setLayoutBackground] = useState(null);
     const [layouts, setLayouts] = useState([]);
     // const [clickedIndex, setClickedIndex] = useState(null);
     const [clickedTitles, setClickedTitles] = useState([]);
     const [selectedFrame, setSelectedFrame] = useState(null);
     const [goBackBg, setGoBackBg] = useState([]);
     const [language, setLanguage] = useState(null);
     const [confirmButton, setConfirmButton] = useState(confirm_en);
     const [confirmHoverButton, setConfirmHoverButton] = useState(confirm_en_hover);
     const [confirmClick, setConfirmClick] = useState(false);
     // const [slicedLayouts,setSlicedLayouts]=useState([])
     //드래그 끝나면 기존 레이아웃중에 5개 다음거 담기
     const [sliceIdx, setSliceIdx] = useState(0)
     //드래그 중일때 카드 선택 안되도록 하기
     const [draging, setDraging] = useState(false)
     const { t } = useTranslation();
     const navigate = useNavigate();
     const onDragEnd = (e) => {
          // e.preventDefault()
          setSliceIdx(prevIdx => (prevIdx + 1) % 4);
          const nextSliceIdx = (sliceIdx + 1) % 4; // 다음에 가져올 slicedLayouts의 시작 인덱스
          // 0,5
          // 5,10
          //     const nextSlicedLayouts = layouts[nextSliceIdx];
          //     getBackground(nextSliceIdx)
          //     setSlicedLayouts(...nextSlicedLayouts);
          setDraging(false)
     };
     const onDrag = (e) => {
          // e.preventDefault()
          setDraging(true)
     }
     useEffect(() => {
          const storedLanguage = sessionStorage.getItem('language');
          if (storedLanguage) {
               i18n.changeLanguage(storedLanguage);
               setLanguage(storedLanguage);
          }

          const frame = sessionStorage.getItem('selectedFrame');
          if (frame) {
               setSelectedFrame(JSON.parse(frame).frame);
          }

          const sessionStyleBg = sessionStorage.getItem('styleBg');
          if (sessionStyleBg) {
               let layoutBg = '';

               // Define the base path for the session style
               const basePath = `../../assets/Frame/Layout/${sessionStyleBg}`;

               // Determine the image path based on the stored language
               const languagePathMap = {
                    ko: `${basePath}/kr/BG.png`,
                    vi: `${basePath}/vn/BG.png`,
                    default: `${basePath}/BG.png`
               };

               // Use async function to load the image dynamically
               const loadImage = async () => {
                    const path = languagePathMap[storedLanguage] || languagePathMap.default;
                    layoutBg = (await import(path)).default; // Use .default to access the imported image
                    setLayoutBackground(layoutBg);
               };

               loadImage();
          }

          if (storedLanguage === 'en') {
               setGoBackBg(goback_en);
               setConfirmButton(confirm_en);
               setConfirmHoverButton(confirm_en_hover);
          } else if (storedLanguage === 'ko') {
               setGoBackBg(goback_kr);
               setConfirmButton(confirm_kr);
               setConfirmHoverButton(confirm_kr_hover);
          } else if (storedLanguage === 'vi') {
               setGoBackBg(goback_vn);
               setConfirmButton(confirm_vn);
               setConfirmHoverButton(confirm_vn_hover);
          }
          else if (storedLanguage === 'mn') {
               setGoBackBg(goback_mn);
               setConfirmButton(confirm_mn);
               setConfirmHoverButton(confirm_mn_hover);
          }
     }, []);

     useEffect(() => {
          const fetchLayoutsByBackground = async () => {
               try {
                    const frame = JSON.parse(sessionStorage.getItem('selectedFrame')).frame;


                    const bgStyle = sessionStorage.getItem('styleBg')
                    console.log(bgStyle)
                    console.log(String(`${import.meta.env.VITE_REACT_APP_BACKEND}/layouts/api/by-background/` + bgStyle + '/frame/' + frame))
                    const response = await originAxiosInstance.get(`${import.meta.env.VITE_REACT_APP_BACKEND}/layouts/api/by-background/` + bgStyle + '/frame/' + frame);
                    const layoutDatas = response.data
                    const newBackgrounds = layoutDatas.map(item => ({
                         title: item.title,
                         photo: import.meta.env.VITE_REACT_APP_BACKEND + item.photo,
                         photo_cover: import.meta.env.VITE_REACT_APP_BACKEND + item.photo_cover,
                         photo_full: import.meta.env.VITE_REACT_APP_BACKEND + item.photo_full
                    }));
                    /*
                    Stripx2
                    2cut-x2
                    4-cutx2
                    6-cutx2
                    */
                    const resAll = newBackgrounds

                    console.log("collab bg>>>", resAll)

                    if (frame === "4-cutx2") {
                         setLayouts(resAll.filter(r => r.title != "Cartoon-5cut-4"))
                    } else {

                         setLayouts(resAll);
                    }
                    //[...seasonsNewBackgrounds,...partyNewBackgrounds,...cartoonNewBackgrounds,...minNewBackgrounds]


               } catch (error) {
                    console.error(error)
               }
          }

          fetchLayoutsByBackground()
     }, []);

     const handleClick = (index, clickedTitle) => {
          if (draging) return
          //라우팅 할 때 리스트 한번에 보내기
          // sessionStorage.setItem('selectedLayout', JSON.stringify(layouts));
          // setClickedIndex(index === clickedIndex ? null : index);
          //getClickAudio()
          if (clickedTitles.includes(clickedTitle)) {
               setClickedTitles(prevTitles => prevTitles.filter(clickedTitle => clickedTitle != clickedTitle));


          } else {
               setClickedTitles(prevTitles => [...prevTitles, clickedTitle]);

          }


          setConfirmClick(confirmButton)
     }

     const goToPayment = () => {

          if (confirmClick === confirmButton) {
               const selectedLayouts = []

               for (let i = 0; i < layouts.length; i++) {
                    const fiveLayout = layouts[i];
                    for (let j = 0; j < fiveLayout.length; j++) {
                         const layout = fiveLayout[j];


                         for (let k = 0; k < layout.length; k++) {
                              const element = layout[k];
                              //   const filtered=layout.filter(l=>l.title)

                              for (let l = 0; l < clickedTitles.length; l++) {
                                   if (element.title === clickedTitles[l]) {
                                        selectedLayouts.push(element)
                                   }

                              }
                         }
                    }

               }
               sessionStorage.setItem('selectedLayout', JSON.stringify(layouts.findLast(layout=>clickedTitles.includes(layout.title))));
               navigate('/payment-number');
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
     useEffect(() => {
          const storedLanguage = sessionStorage.getItem('language');
          if (storedLanguage) {
               i18n.changeLanguage(storedLanguage);
               setLanguage(storedLanguage);
          }

          const frame = sessionStorage.getItem('selectedFrame');
          if (frame) {
               setSelectedFrame(JSON.parse(frame).frame);
          }
          const sessionStyleBg = sessionStorage.getItem('styleBg');
          if (sessionStyleBg) {
               let layoutBg = '';

               // Define the base path for the session style
               const basePath = `../../assets/Frame/Layout/${sessionStyleBg}`;

               // Determine the image path based on the stored language
               const languagePathMap = {
                    ko: `${basePath}/kr/BG.png`,
                    vi: `${basePath}/vn/BG.png`,
                    default: `${basePath}/BG.png`
               };

               // Use async function to load the image dynamically
               const loadImage = async () => {
                    const path = languagePathMap[storedLanguage] || languagePathMap.default;
                    layoutBg = (await import(path)).default; // Use .default to access the imported image
                    setLayoutBackground(layoutBg);
               };

               loadImage();
          }

          if (storedLanguage === 'en') {
               setGoBackBg(goback_en);
               setConfirmButton(confirm_en);
               setConfirmHoverButton(confirm_en_hover);
          } else if (storedLanguage === 'ko') {
               setGoBackBg(goback_kr);
               setConfirmButton(confirm_kr);
               setConfirmHoverButton(confirm_kr_hover);
          } else if (storedLanguage === 'vi') {
               setGoBackBg(goback_vn);
               setConfirmButton(confirm_vn);
               setConfirmHoverButton(confirm_vn_hover);
          }
     }, []);
     const playAudio = async () => {
          const res = await getAudio({ file_name: "choose_frame_style.wav" })
     }
     useEffect(() => {
          playAudio()
     }, [])
     return (
          <div className='layout-container'
               // onDragStart={onDrag}
               // onDrag={onDrag}
               // onDragEnd={onDragEnd}
               // onClick={onDrag}
               style={{
                    backgroundImage: `url(${layoutBackground})`
                    // backgroundColor:"red"
               }}
          >
               <div className="go-back" style={{ backgroundImage: `url(${goBackBg})` }} onClick={() => navigate("/background")} onMouseEnter={() => hoverGoBackBtn(language)} onMouseLeave={() => hoverGoBackBtn(language)}></div>
               <div className="style-section"
                    draggable={false}
                    onDragStart={onDrag}
                    onDrag={onDrag}
                    onDragEnd={onDragEnd}

                    // onClick={onDrag}
                    style={{
                    }}
               >
                    <FrameCarousel
                         clickedTitles={clickedTitles}
                         images={layouts}
                         handleClick={handleClick}
                    />
               </div>
               <div
                    className="confirm-layout-button"
                    style={{ backgroundImage: `url(${confirmClick === confirmButton ? confirmHoverButton : confirmButton})` }}
                    onClick={goToPayment}
               ></div>
          </div>
     );
};

export default Layout;