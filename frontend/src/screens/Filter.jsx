import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import i18n from '../translations/i18n';
import "../css/Filter.css";
import photo_frame from '../assets/Filter/photo_frame.png';
import filter from '../assets/Filter/filter.png';
import filter_hover from '../assets/Filter/filter_hover.png';
import continue_btn from '../assets/Filter/continue_btn.png';
import continue_btn_click from '../assets/Filter/continue_btn_click.png';
import plus_icon from '../assets/Filter/plus.png';
import minus_icon from '../assets/Filter/minus.png';
import html2canvas from 'html2canvas';
import axios from 'axios';

// Go Back
import goback_en from '../assets/Common/goback.png';
import goback_en_hover from '../assets/Common/gobackhover.png';
import goback_kr from '../assets/Common/kr/goback.png';
import goback_kr_hover from '../assets/Common/kr/gobackhover.png';
import goback_vn from '../assets/Common/vn/goback.png';
import goback_vn_hover from '../assets/Common/vn/gobackhover.png';
import goback_mn from '../assets/Common/mn/goback.png';
import goback_mn_hover from '../assets/Common/mn/gobackhover.png';

// Background
import background_en from '../assets/Filter/BG.png';
import background_kr from '../assets/Filter/kr/BG.png';
import background_vn from '../assets/Filter/vn/BG.png';
import background_mn from '../assets/Filter/mn/BG.png';

// Filter
import personal_en from '../assets/Filter/personal.png';
import personal_en_click from '../assets/Filter/personal_click.png';
import personal_kr from '../assets/Filter/kr/personality-default.png';
import personal_kr_click from '../assets/Filter/kr/personality-pressed.png';
import personal_vn from '../assets/Filter/vn/personality-default.png';
import personal_vn_click from '../assets/Filter/vn/personality-pressed.png';
import personal_mn from '../assets/Filter/mn/personality-default.png';
import personal_mn_click from '../assets/Filter/mn/personality-pressed.png';

import natural_en from '../assets/Filter/natural.png';
import natural_en_click from '../assets/Filter/natural_click.png';
import natural_kr from '../assets/Filter/kr/natural-default.png';
import natural_kr_click from '../assets/Filter/kr/natural-pressed.png';
import natural_vn from '../assets/Filter/vn/natural-default.png';
import natural_vn_click from '../assets/Filter/vn/natural-pressed.png';
import natural_mn from '../assets/Filter/mn/natural-default.png';
import natural_mn_click from '../assets/Filter/mn/natural-pressed.png';

import pink_en from '../assets/Filter/pink.png';
import pink_en_click from '../assets/Filter/pink_click.png';
import pink_kr from '../assets/Filter/kr/pink-default.png';
import pink_kr_click from '../assets/Filter/kr/pink-pressed.png';
import pink_vn from '../assets/Filter/vn/pink-default.png';
import pink_vn_click from '../assets/Filter/vn/pink-pressed.png';
import pink_mn from '../assets/Filter/mn/pink-default.png';
import pink_mn_click from '../assets/Filter/mn/pink-pressed.png';

import classic_en from '../assets/Filter/classic.png';
import classic_en_click from '../assets/Filter/classic_click.png';
import classic_kr from '../assets/Filter/kr/classic-default.png';
import classic_kr_click from '../assets/Filter/kr/classic-pressed.png';
import classic_vn from '../assets/Filter/vn/classic-default.png';
import classic_vn_click from '../assets/Filter/vn/classic-pressed.png';
import classic_mn from '../assets/Filter/mn/classic-default.png';
import classic_mn_click from '../assets/Filter/mn/classic-pressed.png';


import bw_en from '../assets/Filter/bnw.png';
import bw_en_click from '../assets/Filter/bnw_click.png';
import bw_kr from '../assets/Filter/kr/bw-default.png';
import bw_kr_click from '../assets/Filter/kr/bw-pressed.png';
import bw_vn from '../assets/Filter/vn/bw-default.png';
import bw_vn_click from '../assets/Filter/vn/bw-pressed.png';
import bw_mn from '../assets/Filter/mn/bw-default.png';
import bw_mn_click from '../assets/Filter/mn/bw-pressed.png';

import skin_en from '../assets/Filter/smooth.png';
import skin_en_click from '../assets/Filter/smooth_click.png';
import skin_kr from '../assets/Filter/kr/smooth-default.png';
import skin_kr_click from '../assets/Filter/kr/smooth-pressed.png';
import skin_vn from '../assets/Filter/vn/smooth-default.png';
import skin_vn_click from '../assets/Filter/vn/smooth-pressed.png';
import skin_mn from '../assets/Filter/mn/smooth-default.png';
import skin_mn_click from '../assets/Filter/mn/smooth-pressed.png';

import intensity_en from '../assets/Filter/intensity.png';
import intensity_kr from '../assets/Filter/kr/intensity.png';
import intensity_vn from '../assets/Filter/vn/intensity.png';
import intensity_mn from '../assets/Filter/mn/intensity.png';

// Continue
import continue_en from '../assets/Common/continue.png';
import continue_en_hover from '../assets/Common/continue_click.png';
import continue_kr from '../assets/Common/kr/continue.png';
import continue_kr_hover from '../assets/Common/kr/continue_click.png';
import continue_vn from '../assets/Common/vn/continue.png';
import continue_vn_hover from '../assets/Common/vn/continue_click.png';
import continue_mn from '../assets/Common/mn/continue.png';
import continue_mn_hover from '../assets/Common/mn/continue_click.png';

function Filter() {
     const { t } = useTranslation();
     const navigate = useNavigate();
     const [hoveredImage, setHoveredImage] = useState(null);
     const [selectedLayout, setSelectedLayout] = useState(null);
     const [selectedPhotos, setSelectedPhotos] = useState([]);
     const [filterEffect, setFilterEffect] = useState(null);
     const [myBackground, setMyBackground] = useState(null);
     const [selectedFrame, setSelectedFrame] = useState(null);
     const [confirmButton, setConfirmButton] = useState(false);
     const [percentage, setPercentage] = useState(350);
     const [options, setOptions] = useState([]);
     const [sliderChange, setSliderChange] = useState(false);
     const [filterIndex, setFilterIndex] = useState(1);
     const [language, setLanguage] = useState('en');

     const [background, setBackground] = useState(background_en);
     const [personality, setPersonality] = useState(personal_en);
     const [natural, setNatural] = useState(natural_en);
     const [pink, setPink] = useState(pink_en);
     const [classic, setClassic] = useState(classic_en);
     const [bw, setBw] = useState(bw_en);
     const [smooth, setSmooth] = useState(skin_en);
     const [intensity, setIntensity] = useState(intensity_en);

     const [continueButton, setContinueButton] = useState(continue_en);
     const [goBackButton, setGoBackButton] = useState(goback_en);
     const [clickedButton, setClickedButton] = useState(false);

     const selectedFilterEffects = [
          {
               id: 1,
               name: 'personality',
               effect: [
                    { property: 'brightness', value: '1.2', unit: '' },
                    { property: 'saturate', value: '1.1', unit: '' },
                    { property: 'contrast', value: '1.1', unit: '' },
               ]
          },
          {
               id: 2,
               name: 'natural',
               effect: [
                    { property: 'contrast', value: '180', unit: '%' },
                    { property: 'brightness', value: '1.1', unit: '' },
               ]
          },
          {
               id: 3,
               name: 'perfect',
               effect: [
                    { property: 'staturate', value: '1.2', unit: '' },
                    { property: 'contrast', value: '1.1', unit: '' },
                    { property: 'brightness', value: '1.1', unit: '' },
               ]
          },
          {
               id: 4,
               name: 'classic',
               effect: [
                    { property: 'sepia', value: '0.3', unit: '' },
                    { property: 'saturate', value: '1.2', unit: '' },
                    { property: 'contrast', value: '0.8', unit: '' },
                    { property: 'brightness', value: '1.1', unit: '' },
               ]
          },
          {
               id: 5,
               name: 'bnw',
               effect: [
                    { property: 'grayscale', value: '1', unit: '' },
                    { property: 'brightness', value: '1.1', unit: '' },
               ]
          },
          {
               id: 6,
               name: 'skin',
               effect: [
                    { property: 'brightness', value: '1.1', unit: '' },
                    { property: 'blur', value: '1', unit: 'px' },
                    { property: 'contrast', value: '1.1', unit: '' },
                    { property: 'saturate', value: '0.8', unit: '' },
               ]
          }
     ];

     const handlePhotoClick = (selectedIndex) => {
          if (selectedId.includes(selectedIndex)) {
               const filteredIds = selectedId.filter((id) => id !== selectedIndex);
               setSelectedId(filteredIds);

               const { [selectedIndex]: _, ...rest } = filterEffect;
               setFilterEffect(rest);
          } else {
               setSelectedId([selectedIndex]);
          }
     };

     const chunkArray = (arr, size) => {
          return arr.reduce((acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]), []);
     };

     const photos = JSON.parse(sessionStorage.getItem('photos'));

     useEffect(() => {
          const storedLanguage = sessionStorage.getItem('language');
          if (storedLanguage) {
               setLanguage(storedLanguage);
               if (storedLanguage == 'en') {
                    setBackground(background_en);
                    setPersonality(personal_en);
                    setNatural(natural_en);
                    setPink(pink_en);
                    setClassic(classic_en);
                    setBw(bw_en);
                    setSmooth(skin_en);
                    setContinueButton(continue_en);
                    setIntensity(intensity_en);
                    setGoBackButton(goback_en);
               } else if (storedLanguage == 'ko') {
                    setBackground(background_kr);
                    setPersonality(personal_kr);
                    setNatural(natural_kr);
                    setPink(pink_kr);
                    setClassic(classic_kr);
                    setBw(bw_kr);
                    setSmooth(skin_kr);
                    setContinueButton(continue_kr);
                    setIntensity(intensity_kr);
                    setGoBackButton(goback_kr);
               } else if (storedLanguage == 'vi') {
                    setBackground(background_vn);
                    setPersonality(personal_vn);
                    setNatural(natural_vn);
                    setPink(pink_vn);
                    setClassic(classic_vn);
                    setBw(bw_vn);
                    setSmooth(skin_vn);
                    setContinueButton(continue_vn);
                    setIntensity(intensity_vn);
                    setGoBackButton(goback_vn);
               } else if (storedLanguage === 'mn') {
                    setBackground(background_mn);
                    setPersonality(personal_mn);
                    setNatural(natural_mn);
                    setPink(pink_mn);
                    setClassic(classic_mn);
                    setBw(bw_mn);
                    setSmooth(skin_mn);
                    setContinueButton(continue_mn);
                    setIntensity(intensity_mn);
                    setGoBackButton(goback_mn);
               }
          }

          // Retrieve selected photos from session storage
          const storedSelectedPhotos = JSON.parse(sessionStorage.getItem('choosePhotos'));
          if (storedSelectedPhotos) {
               setSelectedPhotos(storedSelectedPhotos);
          }

          // Retrieve selected frame from session storage
          const storedSelectedFrame = JSON.parse(sessionStorage.getItem('selectedFrame'));
          if (storedSelectedFrame) {
               setSelectedFrame(storedSelectedFrame.frame);
          }
     }, []);

     useEffect(() => {
          const sessionSelectedLayout = sessionStorage.getItem('selectedLayout');
          const parsedSelectedLayout = JSON.parse(sessionSelectedLayout);
          const layoutData = parsedSelectedLayout;
          if (layoutData) {
               setMyBackground(layoutData.photo);
               setSelectedLayout(layoutData.photo_cover);
          }
     }, []);

     const handleMouseEnter = (image) => {
          setHoveredImage(image);
     }

     const handleMouseLeave = () => {
          setHoveredImage(null);
     }

     const handleFilter = (index) => {
          setSliderChange(false);
          setPercentage(350);
          setFilterIndex(index);
          setFilterEffect(selectedFilterEffects[index].effect);
          setOptions([]);
     };

     const increasePercentage = () => {
          setSliderChange(true);
          if (percentage < 570) {
               setPercentage(percentage + 10);
          }


          if (filterEffect == null) {
               return;
          }


          if (options.length === 0) {
               let newOptions = [];
               filterEffect.forEach(effect => {
                    if (effect.property === 'brightness') {
                         effect.value = parseFloat(effect.value) + 0.01;
                         newOptions.push(effect);
                    } else {
                         newOptions.push(effect);
                    }
               });
               setOptions(newOptions);
          } else {
               let newOptions = [...options];
               newOptions = newOptions.map(option => {
                    if (option.property === 'brightness') {
                         return { ...option, value: parseFloat(option.value) + 0.01 };
                    }
                    return option;
               });
               setOptions(newOptions);
          }
     }

     const decreasePercentage = () => {
          setSliderChange(true);
          if (percentage > 10) {
               setPercentage(percentage - 10);
          }

          if (filterEffect == null) {
               return;
          }

          if (options.length === 0) {
               let newOptions = [];
               filterEffect.forEach(effect => {
                    if (effect.property === 'brightness') {
                         effect.value = parseFloat(effect.value) - 0.01;
                         newOptions.push(effect);
                    } else {
                         newOptions.push(effect);
                    }
               });
               setOptions(newOptions);
          } else {
               let newOptions = [...options];
               newOptions = newOptions.map(option => {
                    if (option.property === 'brightness') {
                         return { ...option, value: parseFloat(option.value) - 0.01 };
                    }
                    return option;
               });
               setOptions(newOptions);
          }
     }

     const displayClassNameForBackground = () => {
          if (selectedFrame == '2cut-x2') {
               return 'left-choose-photos-2cut';
          } else if (selectedFrame == '4-cutx2') {
               return 'left-choose-photos-4cut';
          } else if (selectedFrame == '5-cutx2') {
               return 'left-choose-photos-5cut';
          } else {
               return 'left-choose-photos';
          }
     }

     const getImageStyle = () => {
          if (filterEffect == null) {
               return '';
          }
          if (sliderChange == false) {
               const filters = filterEffect.map(option => {
                    return `${option.property}(${option.value}${option.unit})`;
               })

               return filters.join(' ')
          }

          const filters = options.map(option => {
               return `${option.property}(${option.value}${option.unit})`;
          })

          return filters.join(' ')
     }

     const storeImageCanvas = async () => {
          const element = document.getElementsByClassName('left-big-frame')[0];
          const oldBackgroundImage = element.style.backgroundImage;
          element.style.backgroundImage = 'none';

          html2canvas(element, {
               backgroundColor: null,
          }).then(canvas => {
               const photo_data = canvas.toDataURL('image/png');
               const uploadImageUrl = `${import.meta.env.VITE_REACT_APP_BACKEND}/frames/api/upload-full`

               const formData = new FormData();
               formData.append('photo', photo_data);

               axios.post(uploadImageUrl, formData, {
                    headers: {
                         'Content-Type': 'multipart/form-data'
                    }
               })
                    .then(response => {
                         const data = response.data;
                         if (data.photo_url) {
                              element.style.backgroundImage = oldBackgroundImage;
                              element.style.backgroundColor = '';
                              sessionStorage.setItem('downloaded-image', data.photo_url);
                         }
                    })
                    .catch(error => {
                         console.error(`Failed to copy image: ${error}`);
                    })
          })
     }

     const displayClassNameForLayout = () => {
          if (selectedFrame == '2cut-x2') {
               return 'left-choose-container-2cut';
          } else if (selectedFrame == '4-cutx2') {
               return 'left-choose-container-4cut';
          } else if (selectedFrame == '5-cutx2') {
               return 'left-choose-container-5cut';
          } else {
               return 'left-choose-container';
          }
     }

     const displayClassNameForPhoto = (rowIndex, photoIndex) => {
          if (selectedFrame === 'Stripx2') {
               if (rowIndex === 0 && photoIndex === 0) {
                    return 'choose-photo-item-0-0';
               } else if (rowIndex === 0 && photoIndex === 1) {
                    return 'choose-photo-item-0-1';
               } else if (rowIndex === 1 && photoIndex === 0) {
                    return 'choose-photo-item-1-0';
               } else if (rowIndex === 1 && photoIndex === 1) {
                    return 'choose-photo-item-1-1';
               } else if (rowIndex === 2 && photoIndex === 0) {
                    return 'choose-photo-item-2-0';
               } else if (rowIndex === 2 && photoIndex === 1) {
                    return 'choose-photo-item-2-1';
               } else if (rowIndex === 3 && photoIndex === 0) {
                    return 'choose-photo-item-3-0';
               } else if (rowIndex === 3 && photoIndex === 1) {
                    return 'choose-photo-item-3-1';
               }
          } else if (selectedFrame === '6-cutx2') {
               if (rowIndex === 0 && photoIndex === 0) {
                    return 'choose-photo-item6-0-0';
               } else if (rowIndex === 0 && photoIndex === 1) {
                    return 'choose-photo-item6-0-1';
               } else if (rowIndex === 1 && photoIndex === 0) {
                    return 'choose-photo-item6-1-0';
               } else if (rowIndex === 1 && photoIndex === 1) {
                    return 'choose-photo-item6-1-1';
               } else if (rowIndex === 2 && photoIndex === 0) {
                    return 'choose-photo-item6-2-0';
               } else if (rowIndex === 2 && photoIndex === 1) {
                    return 'choose-photo-item6-2-1';
               }
          } else if (selectedFrame === '2cut-x2') {
               if (rowIndex === 0 && photoIndex === 0) {
                    return 'choose-photo-item-2cut-0-0';
               } else if (rowIndex === 0 && photoIndex === 1) {
                    return 'choose-photo-item-2cut-0-1';
               }
          } else if (selectedFrame === '3-cutx2') {
               if (rowIndex === 0 && photoIndex === 0) {
                    return 'choose-photo-item-3cut-0-0';
               } else if (rowIndex === 0 && photoIndex === 1) {
                    return 'choose-photo-item-3cut-0-1';
               } else if (rowIndex === 1 && photoIndex === 0) {
                    return 'choose-photo-item-3cut-0-1';
               }
          } else if (selectedFrame === '4-cutx2') {
               if (rowIndex === 0 && photoIndex === 0) {
                    return 'choose-photo-item-4cut-0-0';
               } else if (rowIndex === 0 && photoIndex === 1) {
                    return 'choose-photo-item-4cut-0-1';
               } else if (rowIndex === 1 && photoIndex === 0) {
                    return 'choose-photo-item-4cut-1-0';
               } else if (rowIndex === 1 && photoIndex === 1) {
                    return 'choose-photo-item-4cut-1-1';
               }
          } else if (selectedFrame === '5-cutx2') {
               if (rowIndex === 0 && photoIndex === 0) {
                    return 'choose-photo-item-5cut-0-0';
               } else if (rowIndex === 0 && photoIndex === 1) {
                    return 'choose-photo-item-5cut-0-1';
               } else if (rowIndex === 1 && photoIndex === 0) {
                    return 'choose-photo-item-5cut-1-0';
               } else if (rowIndex === 1 && photoIndex === 1) {
                    return 'choose-photo-item-5cut-1-1';
               }
          }
          return 'choose-photo-item';
     }

     const showSelectedPhotos = () => {
          if (selectedFrame == '3-cutx2' && selectedPhotos.length > 0) {
               const firstPhotoTpl = (
                    <div className="choose-photo-row">
                         <div
                              className="choose-photo-item-3cut-top-line"
                              style={{ backgroundImage: `url(${photos[selectedPhotos[0]].url})`, filter: getImageStyle() }}
                         />
                    </div>
               )
               const selectedPhotoRows = chunkArray(selectedPhotos.slice(1), 2);
               return (
                    [firstPhotoTpl, ...selectedPhotoRows.map((row, rowIndex) => (
                         <div key={rowIndex} className="choose-photo-row">
                              {row.map((selectedIndex, photoIndex) => (
                                   <div
                                        key={photoIndex}
                                        className={displayClassNameForPhoto(rowIndex, photoIndex)}
                                        style={{ backgroundImage: `url(${photos[selectedIndex].url})`, filter: getImageStyle() }}
                                   />
                              ))}
                         </div>
                    ))]
               );
          } else if (selectedFrame == '5-cutx2' && selectedPhotos.length > 0) {
               if (selectedPhotos.length == 5) {
                    const lastPhotoTpl = (
                         <div className="choose-photo-row">
                              <div
                                   className="choose-photo-item-5cut-last-line"
                                   style={{ backgroundImage: `url(${photos[selectedPhotos[selectedPhotos.length - 1]].url})`, filter: getImageStyle() }}
                              />
                         </div>
                    )
                    const selectedPhotoRows = chunkArray(selectedPhotos.slice(0, selectedPhotos.length - 1), 2);
                    return (
                         [selectedPhotoRows.map((row, rowIndex) => (
                              <div key={rowIndex} className="choose-photo-row">
                                   {row.map((selectedIndex, photoIndex) => (
                                        <div
                                             key={photoIndex}
                                             className={displayClassNameForPhoto(rowIndex, photoIndex)}
                                             style={{ backgroundImage: `url(${photos[selectedIndex].url})`, filter: getImageStyle() }}
                                        />
                                   ))}
                              </div>
                         )), lastPhotoTpl]
                    );
               } else {
                    const selectedPhotoRows = chunkArray(selectedPhotos, 2);
                    return (
                         [selectedPhotoRows.map((row, rowIndex) => (
                              <div key={rowIndex} className="choose-photo-row">
                                   {row.map((selectedIndex, photoIndex) => (
                                        <div
                                             key={photoIndex}
                                             className={displayClassNameForPhoto(rowIndex, photoIndex)}
                                             style={{ backgroundImage: `url(${photos[selectedIndex].url})`, filter: getImageStyle() }}
                                        />
                                   ))}
                              </div>
                         ))]
                    );
               }
          } else {
               const selectedPhotoRows = chunkArray(selectedPhotos, 2);
               return (
                    selectedPhotoRows.map((row, rowIndex) => (
                         <div key={rowIndex} className="choose-photo-row">
                              {row.map((selectedIndex, photoIndex) => (
                                   <div
                                        key={photoIndex}
                                        className={displayClassNameForPhoto(rowIndex, photoIndex)}
                                        style={{ backgroundImage: `url(${photos[selectedIndex].url})`, filter: getImageStyle() }}
                                   />
                              ))}
                         </div>
                    ))
               );
          }
     }

     const goToSticker = () => {
          if (clickedButton) {
               return;
          }

          setClickedButton(true);
          sessionStorage.setItem('filter', getImageStyle());
          storeImageCanvas();
          navigate('/sticker')
     }

     const hoverFilterEffect = (effect) => {
          if (effect == 'personality') {
               if (language == 'en') {
                    setPersonality(personality == personal_en ? personal_en_click : personal_en);
               } else if (language == 'vi') {
                    setPersonality(personality == personal_vn ? personal_vn_click : personal_vn);
               } else if (language == 'ko') {
                    setPersonality(personality == personal_kr ? personal_kr_click : personal_kr);
               } else if (language === 'mn') {
                    setPersonality(personality === personal_mn ? personal_mn_click : personal_mn);
               }
          } else if (effect == 'natural') {
               if (language == 'en') {
                    setNatural(natural == natural_en ? natural_en_click : natural_en);
               } else if (language == 'vi') {
                    setNatural(natural == natural_vn ? natural_vn_click : natural_vn);
               } else if (language == 'ko') {
                    setNatural(natural == natural_kr ? natural_kr_click : natural_kr);
               } else if (language === 'mn') {
                    setNatural(natural === natural_mn ? natural_mn_click : natural_mn);
               }
          } else if (effect == 'pink') {
               if (language == 'en') {
                    setPink(pink == pink_en ? pink_en_click : pink_en);
               } else if (language == 'vi') {
                    setPink(pink == pink_vn ? pink_vn_click : pink_vn);
               } else if (language == 'ko') {
                    setPink(pink == pink_kr ? pink_kr_click : pink_kr);
               } else if (language === 'mn') {
                    setPink(pink === pink_mn ? pink_mn_click : pink_mn);
               }
          } else if (effect == 'classic') {
               if (language == 'en') {
                    setClassic(classic == classic_en ? classic_en_click : classic_en);
               } else if (language == 'vi') {
                    setClassic(classic == classic_vn ? classic_vn_click : classic_vn);
               } else if (language == 'ko') {
                    setClassic(classic == classic_kr ? classic_kr_click : classic_kr);
               } else if (language === 'mn') {
                    setClassic(classic === classic_mn ? classic_mn_click : classic_mn);
               }
          } else if (effect == 'bw') {
               if (language == 'en') {
                    setBw(bw == bw_en ? bw_en_click : bw_en);
               } else if (language == 'vi') {
                    setBw(bw == bw_vn ? bw_vn_click : bw_vn);
               } else if (language == 'ko') {
                    setBw(bw == bw_kr ? bw_kr_click : bw_kr);
               } else if (language === 'mn') {
                    setBw(bw === bw_mn ? bw_mn_click : bw_mn);
               }
          } else if (effect == 'smooth') {
               if (language == 'en') {
                    setSmooth(smooth == skin_en ? skin_en_click : skin_en);
               } else if (language == 'vi') {
                    setSmooth(smooth == skin_vn ? skin_vn_click : skin_vn);
               } else if (language == 'ko') {
                    setSmooth(smooth == skin_kr ? skin_kr_click : skin_kr);
               } else if (language === 'mn') {
                    setSmooth(smooth === skin_mn ? skin_mn_click : skin_mn);
               }
          }
     }

     const hoverGoBackButton = () => {
          if (language == 'en') {
               setGoBackButton(goBackButton == goback_en_hover ? goback_en : goback_en_hover);
          } else if (language == 'vi') {
               setGoBackButton(goBackButton == goback_vn_hover ? goback_vn : goback_vn_hover);
          } else if (language == 'ko') {
               setGoBackButton(goBackButton == goback_kr_hover ? goback_kr : goback_kr_hover);
          } else if (language === 'mn') {
               setGoBackButton(goBackButton === goback_mn_hover ? goback_mn : goback_mn_hover);
          }
     }

     const hoverContinueButton = () => {
          if (language == 'en') {
               setContinueButton(continueButton == continue_en_hover ? continue_en : continue_en_hover);
          } else if (language == 'vi') {
               setContinueButton(continueButton == continue_vn_hover ? continue_vn : continue_vn_hover);
          } else if (language == 'ko') {
               setContinueButton(continueButton == continue_kr_hover ? continue_kr : continue_kr_hover);
          } else if (language === 'mn') {
               setContinueButton(continueButton === continue_mn_hover ? continue_mn : continue_mn_hover);
          }
     }

     // Chunk the selected photos array into arrays of 2 photos each
     const selectedPhotoRows = chunkArray(selectedPhotos, 2);

     return (
          <div className='filter-container' style={{ backgroundImage: `url(${background})`, cursor: 'none' }}>
               <div className="go-back" style={{ backgroundImage: `url(${goBackButton})`, top:`4.2%`, left: `11%` }} onClick={() => navigate("/photo-choose")} onMouseEnter={() => hoverGoBackButton()} onMouseLeave={() => hoverGoBackButton()}></div>
               <div className="left-big-frame">
                    <div className={displayClassNameForBackground()} style={{ backgroundImage: `url(${myBackground})` }}>
                         {showSelectedPhotos()}
                    </div>
                    <div className={displayClassNameForLayout()} style={{ backgroundImage: `url(${selectedLayout})` }}></div>
               </div>
               <div className="middle-filter">
                    <div className="pink-section" style={{ height: `${percentage}px`, maxHeight: 1000 }}></div>
               </div>
               <div className='plus-icon' style={{ backgroundImage: `url(${plus_icon})` }} onClick={() => increasePercentage()}></div>
               <div className='minus-icon' style={{ backgroundImage: `url(${minus_icon})` }} onClick={() => decreasePercentage()}></div>
               <div className='intensity-icon' style={{ backgroundImage: `url(${intensity})` }}></div>
               <div className="right-filter">
                    <div className="filter-line">
                         <div className="filter-image" style={{ backgroundImage: `url(${personality})` }} onClick={() => handleFilter(0)} onMouseEnter={() => hoverFilterEffect('personality')} onMouseLeave={() => hoverFilterEffect('personality')}></div>
                         <div className="filter-image" style={{ backgroundImage: `url(${natural})` }} onClick={() => handleFilter(1)} onMouseEnter={() => hoverFilterEffect('natural')} onMouseLeave={() => hoverFilterEffect('natural')}></div>
                         <div className="filter-image" style={{ backgroundImage: `url(${pink})` }} onClick={() => handleFilter(2)} onMouseEnter={() => hoverFilterEffect('pink')} onMouseLeave={() => hoverFilterEffect('pink')}></div>
                    </div>
                    <div className="filter-line">
                         <div className="filter-image" style={{ backgroundImage: `url(${classic})` }} onClick={() => handleFilter(3)} onMouseEnter={() => hoverFilterEffect('classic')} onMouseLeave={() => hoverFilterEffect('classic')}></div>
                         <div className="filter-image" style={{ backgroundImage: `url(${bw})` }} onClick={() => handleFilter(4)} onMouseEnter={() => hoverFilterEffect('bw')} onMouseLeave={() => hoverFilterEffect('bw')}></div>
                         <div className="filter-image" style={{ backgroundImage: `url(${smooth})` }} onClick={() => handleFilter(5)} onMouseEnter={() => hoverFilterEffect('smooth')} onMouseLeave={() => hoverFilterEffect('smooth')}></div>
                    </div>
               </div>
               <div
                    className="bottom-filter"
                    style={{ backgroundImage: `url(${continueButton})` }}
                    onMouseEnter={() => hoverContinueButton()}
                    onMouseLeave={() => hoverContinueButton()}
                    onClick={() => goToSticker()}
               ></div>
          </div>
     );
}

export default Filter;