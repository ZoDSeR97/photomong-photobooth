import { useEffect, useState, createRef, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import i18n from '../translations/i18n';
import "../css/Sticker.css";
import frame from '../assets/Sticker/frame.png';
import sticker_frame from '../assets/Sticker/sticker_frame.png';
import sticker_taskbar from '../assets/Sticker/sticker_taskbar.png';
import { Image as KonvaImage, Layer, Stage, Rect, Transformer } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';
import { StickerItem } from '../screens/StickerItem';
import axios from 'axios';
// Sticker
import { stickers } from './stickers.data';

// Go Back
import goback_en from '../assets/Common/goback.png';
import goback_en_hover from '../assets/Common/gobackhover.png';
import goback_kr from '../assets/Common/kr/goback.png';
import goback_kr_hover from '../assets/Common/kr/gobackhover.png';
import goback_vn from '../assets/Common/vn/goback.png';
import goback_vn_hover from '../assets/Common/vn/gobackhover.png';

// Background
import background_en from '../assets/Sticker/BG.png';
import background_kr from '../assets/Sticker/kr/BG.png';
import background_vn from '../assets/Sticker/vn/BG.png';

// Sticker
import mood_en from '../assets/Sticker/mood.png';
import mood_en_click from '../assets/Sticker/mood-click.png';
import mood_kr from '../assets/Sticker/kr/mood-default.png';
import mood_kr_click from '../assets/Sticker/kr/mood-pressed.png';
import mood_vn from '../assets/Sticker/vn/mood-default.png';
import mood_vn_click from '../assets/Sticker/vn/mood-pressed.png';

import lovely_en from '../assets/Sticker/lovely.png';
import lovely_en_click from '../assets/Sticker/lovely-click.png';
import lovely_kr from '../assets/Sticker/kr/lovely-default.png';
import lovely_kr_click from '../assets/Sticker/kr/lovely-pressed.png';
import lovely_vn from '../assets/Sticker/vn/lovely-default.png';
import lovely_vn_click from '../assets/Sticker/vn/lovely-pressed.png';

import cartoon_en from '../assets/Sticker/cartoon.png';
import cartoon_en_click from '../assets/Sticker/cartoon-click.png';
import cartoon_kr from '../assets/Sticker/kr/cartoon-default.png';
import cartoon_kr_click from '../assets/Sticker/kr/cartoon-pressed.png';
import cartoon_vn from '../assets/Sticker/vn/cartoon-default.png';
import cartoon_vn_click from '../assets/Sticker/vn/cartoon-pressed.png';

import y2k_en from '../assets/Sticker/y2k.png';
import y2k_en_click from '../assets/Sticker/y2k-click.png';
import y2k_kr from '../assets/Sticker/kr/y2k-default.png';
import y2k_kr_click from '../assets/Sticker/kr/y2k-pressed.png';
import y2k_vn from '../assets/Sticker/vn/y2k-default.png';
import y2k_vn_click from '../assets/Sticker/vn/y2k-pressed.png';

import print from '../assets/Sticker/print.png'; 
import print_click from '../assets/Sticker/print_click.png';
import print_kr from '../assets/Sticker/kr/print-default.png';
import print_kr_click from '../assets/Sticker/kr/print-pressed.png';
import print_vn from '../assets/Sticker/vn/print-default.png';
import print_vn_click from '../assets/Sticker/vn/print-pressed.png';


function Filter() {
     const { t } = useTranslation();
     const navigate = useNavigate();
     const [hoveredImage, setHoveredImage] = useState(null);
     const [selectedLayout, setSelectedLayout] = useState(null);
     const [selectedPhotos, setSelectedPhotos] = useState([]);
     const [filterEffect, setFilterEffect] = useState(null);
     const [myBackground, setMyBackground] = useState(null);
     const [selectedFrame, setSelectedFrame] = useState(null);
     const [images, setImages] = useState([]);
     const [selectedId, selectShape] = useState(null);
     const [clickPrint, setClickPrint] = useState(false);
     const [orderCode, setOrderCode] = useState(null);
     const [language, setLanguage] = useState('en');

     const [backgroundImage, setBackgroundImage] = useState(background_en);

     // Sticker
     const [mood, setMood] = useState(null);
     const [lovely, setLovely] = useState(null);
     const [cartoon, setCartoon] = useState(null);
     const [y2k, setY2k] = useState(null);
     const [printButton, setPrintButton] = useState(null);

     const [goBackButton, setGoBackButton] = useState(goback_en);
     const [clickedButton, setClickedButton] = useState(false);

     const background = new Image();
     background.crossOrigin = 'Anonymous';
     background.src = sessionStorage.getItem('downloaded-image');

     const [selectedCategory, setSelectedCategory] = useState('MOOD');

     const stageRef = useRef(null);

     const chunkArray = (arr, size) => {
          return arr.reduce((acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]), []);
     };

     const photos = JSON.parse(sessionStorage.getItem('photos'));

     useEffect(() => {
          if (!background.src) {
            window.location.reload();
          }
     }, []);

     useEffect(() => {
          const storedLanguage = sessionStorage.getItem('language');
          if (storedLanguage) {
               setLanguage(storedLanguage);
               if (storedLanguage === 'en') {
                    setBackgroundImage(background_en);
                    setMood(mood_en);
                    setLovely(lovely_en);
                    setCartoon(cartoon_en);
                    setY2k(y2k_en);
                    setPrintButton(print);
                    setGoBackButton(goback_en);
               } else if (storedLanguage === 'ko') {
                    setBackgroundImage(background_kr);
                    setMood(mood_kr);
                    setLovely(lovely_kr);
                    setCartoon(cartoon_kr);
                    setY2k(y2k_kr);
                    setPrintButton(print_kr);
                    setGoBackButton(goback_kr);
               } else if (storedLanguage === 'vi') {
                    setBackgroundImage(background_vn);
                    setMood(mood_vn);
                    setLovely(lovely_vn);
                    setCartoon(cartoon_vn);
                    setY2k(y2k_vn);
                    setPrintButton(print_vn);  
                    setGoBackButton(goback_vn);                  
               }                    
          }

          // get session storage selectedLayout
          const sessionSelectedLayout = sessionStorage.getItem('selectedLayout');
          if (sessionSelectedLayout) {
               const parsedSelectedLayout = JSON.parse(sessionSelectedLayout);
               setSelectedLayout(parsedSelectedLayout.photo_cover);
               setMyBackground(parsedSelectedLayout.photo);
          }

          // Retrieve selected photos from session storage
          const storedSelectedPhotos = JSON.parse(sessionStorage.getItem('choosePhotos'));
          if (storedSelectedPhotos) {
               setSelectedPhotos(storedSelectedPhotos);
          }

          // Filter
          const filterSession = sessionStorage.getItem('filter');
          if (filterSession) {
               setFilterEffect(filterSession);
          }

          // Retrieve selected frame from session storage
          const storedSelectedFrame = JSON.parse(sessionStorage.getItem('selectedFrame'));
          if (storedSelectedFrame) {
               setSelectedFrame(storedSelectedFrame.frame);
          }
     }, []);

     const handleMouseEnter = (image) => {
          setHoveredImage(image);
     }

     const handleMouseLeave = () => {
          setHoveredImage(null);
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
          return filterEffect;
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
          if (selectedFrame == '3-cutx2' && selectedPhotos.length > 1) {
               const firstPhotoTpl = (
                    <div className="choose-photo-row">
                         <div
                              className="choose-photo-item-3cut-top-line"
                              style={{ backgroundImage: `url(${photos[selectedPhotos[0]].url})` }}
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
                                        style={{ backgroundImage: `url(${photos[selectedIndex].url})` }}
                                   />
                              ))}
                         </div>
                    ))]
               );
          } else if (selectedFrame == '5-cutx2' && selectedPhotos.length > 1) {
               const lastPhotoTpl = (
                    <div className="choose-photo-row">
                         <div
                              className="choose-photo-item-5cut-last-line"
                              style={{ backgroundImage: `url(${photos[selectedPhotos[selectedPhotos.length - 1]].url})` }}
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
                                        style={{ backgroundImage: `url(${photos[selectedIndex].url})` }}
                                   />
                              ))}
                         </div>
                    )), lastPhotoTpl]
               );
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

     const addStickerToPanel = ({ src, width, x, y }) => {
          setImages((currentImages) => [
               ...currentImages,
               {
                    width,
                    x,
                    y,
                    src,
                    resetButtonRef: createRef()
               }
          ]);
     };

     const resetAllButtons = useCallback(() => {
          images.forEach((image) => {
               if (image.resetButtonRef.current) {
                    image.resetButtonRef.current();
               }
          });
     }, [images]);

     const handleCanvasClick = useCallback(
          (event) => {
               if (event.target.attrs.id === "backgroundImage") {
                    resetAllButtons();
               }
          },
          [resetAllButtons]
     );

     const checkDeselect = (e) => {
          const clickedOnEmpty = e.target === e.target.getStage();
          if (clickedOnEmpty) {
               selectShape(null);
          }
     }

     const filterStickerByCategory = (category) => {
          setSelectedCategory(category);
     }

     const printFrameWithSticker = (event) => {
          if (clickPrint == true) {
               return;
          }
          setClickPrint(true);

          callPrinter();
          uploadCloud();

          setTimeout(() => {
               navigate("/print");
          }, 3000);
     }

     const uploadCloud = () => {
          try {
               const formData = new FormData();
               formData.append("photo", stageRef.current.toDataURL());
               formData.append("order_code", sessionStorage.getItem('orderCodeNum'));

               axios.post(
                    `${import.meta.env.VITE_REACT_APP_BACKEND}/frames/api/upload_cloud`,
                    formData,
                    {
                         headers: {
                              'Content-Type': 'multipart/form-data'
                         }
                    })
                    .then(response => {
                         const data = response.data;
                         if (data.photo_url) {
                              sessionStorage.setItem('uploadedCloudPhotoUrl', data.photo_url);
                              console.log(data.photo_url);
                         }
                    })
                    .catch(error => {
                         console.log(error);
                    });
          } catch (error) {
               console.log(error);
          }
     }

     // TODO
     const callPrinter = () => {
          try {
               const formData = new FormData();
               formData.append('photo', stageRef.current.toDataURL());
               formData.append('frame', selectedFrame);

               axios.post(
                    `${import.meta.env.VITE_REACT_APP_BACKEND}/frames/api/print`,
                    formData,
                    {
                         headers: {
                              'Content-Type': 'multipart/form-data'
                         }
                    })
                    .then(response => {
                         console.log(response);
                    })
                    .catch(error => {
                         console.log(error);
                    });
          } catch (error) {
               console.log(error);
          }
     }

     const hoverGoBackButton = () => {
          if (language == 'en') {
               setGoBackButton(goBackButton == goback_en_hover ? goback_en : goback_en_hover);
          } else if (language == 'vi') {
               setGoBackButton(goBackButton == goback_vn_hover ? goback_vn : goback_vn_hover);
          } else if (language == 'ko') {
               setGoBackButton(goBackButton == goback_kr_hover ? goback_kr : goback_kr_hover);
          }
     }

     const hoverStickerButton = (stickerEffect) => {
          if (stickerEffect == 'mood') {
               if (language == 'en') {
                    setMood(mood == mood_en_click ? mood_en : mood_en_click);
               } else if (language == 'vi') {
                    setMood(mood == mood_vn_click ? mood_vn : mood_vn_click);
               } else if (language == 'ko') {
                    setMood(mood == mood_kr_click ? mood_kr : mood_kr_click);                    
               }
          } else if (stickerEffect == 'lovely') {
               if (language == 'en') {
                    setLovely(lovely == lovely_en_click ? lovely_en : lovely_en_click);
               } else if (language == 'vi') {
                    setLovely(lovely == lovely_vn_click ? lovely_vn : lovely_vn_click);
               } else if (language == 'ko') {
                    setLovely(lovely == lovely_kr_click ? lovely_kr : lovely_kr_click);
               }
          } else if (stickerEffect == 'cartoon') {
               if (language == 'en') {
                    setCartoon(cartoon == cartoon_en_click ? cartoon_en : cartoon_en_click);
               } else if (language == 'vi') {
                    setCartoon(cartoon == cartoon_vn_click ? cartoon_vn : cartoon_vn_click);
               } else if (language == 'ko') {
                    setCartoon(cartoon == cartoon_kr_click ? cartoon_kr : cartoon_kr_click);
               }
          } else if (stickerEffect == 'y2k') {
               if (language == 'en') {
                    setY2k(y2k == y2k_en_click ? y2k_en : y2k_en_click);
               } else if (language == 'vi') {
                    setY2k(y2k == y2k_vn_click ? y2k_vn : y2k_vn_click);
               } else if (language == 'ko') {
                    setY2k(y2k == y2k_kr_click ? y2k_kr : y2k_kr_click);
               }
          }
     }

     const hoverPrintButton = () => {
          if (language == 'en') {
               setPrintButton(printButton == print_click ? print : print_click);
          } else if (language == 'vi') {
               setPrintButton(printButton == print_vn_click ? print_vn : print_vn_click);
          } else if (language == 'ko') {
               setPrintButton(printButton == print_kr_click ? print_kr : print_kr_click);
          }
     }

     // Chunk the selected photos array into arrays of 2 photos each
     const stickersData = stickers.filter(sticker => sticker.category === selectedCategory);
     const selectedPhotoRows = chunkArray(selectedPhotos, 2);

     const myStickers = chunkArray(stickersData, 4);
     return (
          <div className='sticker-container' style={{ backgroundImage: `url(${backgroundImage})` }}>
               <div className="go-back" style={{ backgroundImage: `url(${goBackButton})` }} onClick={() => navigate("/filter")} onMouseEnter={hoverGoBackButton} onMouseLeave={hoverGoBackButton}></div>
               <div className="left-sticker">
                    <Stage
                         width={1200}
                         height={1000}
                         onClick={handleCanvasClick}
                         onTap={handleCanvasClick}
                         className="konva-image"
                         onMouseDown={checkDeselect}
                         onTouchStart={checkDeselect}
                         ref={stageRef}
                    >
                         <Layer>
                              <KonvaImage
                                   image={background}
                                   height={1000}
                                   width={1200}
                                   id="backgroundImage"
                              />
                              {images.map((image, i) => {
                                   return (
                                        <StickerItem
                                             onDelete={() => {
                                                  const newImages = [...images];
                                                  newImages.splice(i, 1);
                                                  setImages(newImages);
                                             }}
                                             onDragEnd={(event) => {
                                                  image.x = event.target.x();
                                                  image.y = event.target.y();
                                             }}
                                             key={i}
                                             image={image}
                                             shapeProps={image}
                                        />
                                   );
                              })}
                         </Layer>
                    </Stage>
               </div>
               <div className="middle-sticker" style={{ backgroundImage: `url(${sticker_frame})` }}>
                    {myStickers.map((group, index) => (
                         <div key={index} className={index === 0 ? 'sticker-line-1' : 'sticker-line'}>
                              {group.map((mySticker, photoIndex) => (

                                   <div
                                        key={photoIndex}
                                        className="sticker"
                                        onClick={() => {
                                             addStickerToPanel({
                                                  src: mySticker.photo,
                                                  width: 100,
                                                  x: 500,
                                                  y: 500
                                             });
                                        }}
                                   >
                                        <img className="sticker-image" alt={mySticker.title} src={mySticker.photo} width='140px' height='140px' />
                                   </div>
                              ))}
                         </div>
                    ))}
               </div>
               <div className="right-sticker" style={{ backgroundImage: `url(${sticker_taskbar})` }}>
                    <div className="sticker-category">
                         <div className="sticker-category-item" style={{ backgroundImage: `url(${mood})` }} onClick={() => filterStickerByCategory('MOOD')} onMouseEnter={() => hoverStickerButton('mood')} onMouseLeave={() => hoverStickerButton('mood')}></div>
                         <div className="sticker-category-item" style={{ backgroundImage: `url(${lovely})` }} onClick={() => filterStickerByCategory('LOVELY')} onMouseEnter={() => hoverStickerButton('lovely')} onMouseLeave={() => hoverStickerButton('lovely')}></div>
                         <div className="sticker-category-item" style={{ backgroundImage: `url(${cartoon})` }} onClick={() => filterStickerByCategory('CARTOON')} onMouseEnter={() => hoverStickerButton('cartoon')} onMouseLeave={() => hoverStickerButton('cartoon')}></div>
                         <div className="sticker-category-item" style={{ backgroundImage: `url(${y2k})` }} onClick={() => filterStickerByCategory('Y2K')} onMouseEnter={() => hoverStickerButton('y2k')} onMouseLeave={() => hoverStickerButton('y2k')}></div>
                    </div>
                    <div className="sticker-print-btn" style={{ backgroundImage: `url(${printButton})` }} onClick={printFrameWithSticker} onMouseEnter={hoverPrintButton} onMouseLeave={hoverPrintButton}></div>
               </div>
          </div>
     );
}

export default Filter;