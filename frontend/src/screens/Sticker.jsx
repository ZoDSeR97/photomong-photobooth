import { useEffect, useState, createRef, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/Sticker.css";
import sticker_frame from '../assets/Sticker/sticker_frame.png';
import sticker_taskbar from '../assets/Sticker/sticker_taskbar.png';
import { Image as KonvaImage, Layer, Stage } from 'react-konva';
import { StickerItem } from '../screens/StickerItem';
// Sticker
import { stickers } from './stickers.data';

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
import background_en from '../assets/Sticker/BG.png';
import background_kr from '../assets/Sticker/kr/BG.png';
import background_vn from '../assets/Sticker/vn/BG.png';
import background_mn from '../assets/Sticker/mn/BG.png';

// Sticker
import mood_en from '../assets/Sticker/mood.png';
import mood_en_click from '../assets/Sticker/mood-click.png';
import mood_kr from '../assets/Sticker/kr/mood-default.png';
import mood_kr_click from '../assets/Sticker/kr/mood-pressed.png';
import mood_vn from '../assets/Sticker/vn/mood-default.png';
import mood_vn_click from '../assets/Sticker/vn/mood-pressed.png';
import mood_mn from '../assets/Sticker/mn/mood-default.png';
import mood_mn_click from '../assets/Sticker/mn/mood-pressed.png';

import lovely_en from '../assets/Sticker/lovely.png';
import lovely_en_click from '../assets/Sticker/lovely-click.png';
import lovely_kr from '../assets/Sticker/kr/lovely-default.png';
import lovely_kr_click from '../assets/Sticker/kr/lovely-pressed.png';
import lovely_vn from '../assets/Sticker/vn/lovely-default.png';
import lovely_vn_click from '../assets/Sticker/vn/lovely-pressed.png';
import lovely_mn from '../assets/Sticker/mn/lovely-default.png';
import lovely_mn_click from '../assets/Sticker/mn/lovely-pressed.png';

import cartoon_en from '../assets/Sticker/cartoon.png';
import cartoon_en_click from '../assets/Sticker/cartoon-click.png';
import cartoon_kr from '../assets/Sticker/kr/cartoon-default.png';
import cartoon_kr_click from '../assets/Sticker/kr/cartoon-pressed.png';
import cartoon_vn from '../assets/Sticker/vn/cartoon-default.png';
import cartoon_vn_click from '../assets/Sticker/vn/cartoon-pressed.png';
import cartoon_mn from '../assets/Sticker/mn/cartoon-default.png';
import cartoon_mn_click from '../assets/Sticker/mn/cartoon-pressed.png';

import y2k_en from '../assets/Sticker/y2k.png';
import y2k_en_click from '../assets/Sticker/y2k-click.png';
import y2k_kr from '../assets/Sticker/kr/y2k-default.png';
import y2k_kr_click from '../assets/Sticker/kr/y2k-pressed.png';
import y2k_vn from '../assets/Sticker/vn/y2k-default.png';
import y2k_vn_click from '../assets/Sticker/vn/y2k-pressed.png';
import y2k_mn from '../assets/Sticker/mn/y2k-default.png';
import y2k_mn_click from '../assets/Sticker/mn/y2k-pressed.png';

import print from '../assets/Sticker/print.png';
import print_click from '../assets/Sticker/print_click.png';
import print_kr from '../assets/Sticker/kr/print-default.png';
import print_kr_click from '../assets/Sticker/kr/print-pressed.png';
import print_vn from '../assets/Sticker/vn/print-default.png';
import print_vn_click from '../assets/Sticker/vn/print-pressed.png';
import print_mn from '../assets/Sticker/mn/print-default.png';
import print_mn_click from '../assets/Sticker/mn/print-pressed.png';
//frame나오는 공간
import frame_box from '../assets/Sticker/frame_box.png';
import CustomCarousel from '../components/CustomCarousel';
import VerticalCustomCarousel from '../components/VerticalCustomCarousel';
import { getPhotos, originAxiosInstance, playAudio } from '../api/config';
function Sticker() {
     const navigate = useNavigate();
     const uuid = sessionStorage.getItem("uuid")
     const photoNum = sessionStorage.getItem("photoNum")
     const [selectedLayout, setSelectedLayout] = useState(null);
     const [selectedPhotos, setSelectedPhotos] = useState([]);
     const [filterEffect, setFilterEffect] = useState(null);
     const [layoutList, setLayoutList] = useState([]);
     const [myBackgrounds, setMyBackgrounds] = useState([]);
     const [selectedFrame, setSelectedFrame] = useState(null);
     const [images, setImages] = useState([]);
     const [selectedId, selectShape] = useState(null);
     const [clickPrint, setClickPrint] = useState(false);
     const [language, setLanguage] = useState('en');

     const [backgroundImage, setBackgroundImage] = useState(background_en);
     //스크롤 인덱스
     const [scrollIdx, setScrollIdx] = useState(0);
     const [dragStartY, setDragStartY] = useState(0);
     const [bgIdx, setBgIdx] = useState(0);
     const [stickerImgs, setStickerImgs] = useState([]);
     // Sticker
     const [isSel, setIsSel] = useState(false);
     const [mood, setMood] = useState(null);
     const [lovely, setLovely] = useState(null);
     const [cartoon, setCartoon] = useState(null);
     const [y2k, setY2k] = useState(null);
     const [printButton, setPrintButton] = useState(null);
     const [printRefs, setPrintRefs] = useState([]);
     const [goBackButton, setGoBackButton] = useState(goback_en);
     const [stickerDrag, setStickerDrag] = useState(false);
     const [photos, setPhotos] = useState([]);
     const [width, setWidth] = useState(0);
     const [height, setHeight] = useState(0);
     const [selectedCategory, setSelectedCategory] = useState('MOOD');
     const [backgroundList, setBackgroundList] = useState([]);
     const [tempImage, setTempImage] = useState();
     const [stageRefs, setStageRefs] = useState([]);
     const [isRendered, setIsRendered] = useState(false);
     const [frameSize, setFrameSize] = useState({
          width: "",
          height: ""
     });

     function getPrintRatio() {
          return 5;
     }
     const chunkArray = (arr, size) => {
          return arr.reduce((acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]), []);
     };

     useEffect(() => {
          const photos = JSON.parse(sessionStorage.getItem('photos'));
          if (photos === null) return;
          setPhotos(photos);
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
               else if (storedLanguage === 'mn') {
                    setBackgroundImage(background_mn);
                    setMood(mood_mn);
                    setLovely(lovely_mn);
                    setCartoon(cartoon_mn);
                    setY2k(y2k_mn);
                    setPrintButton(print_mn);
                    setGoBackButton(goback_mn);
               }
          }

          const sessionSelectedLayout = sessionStorage.getItem('selectedLayout');
          if (sessionSelectedLayout) {
               const parsedSelectedLayout = [JSON.parse(sessionSelectedLayout)];

               setSelectedLayout(parsedSelectedLayout.map(it => it.photo_cover));
               setMyBackgrounds(parsedSelectedLayout.map(it => it.photo));
               setStageRefs((refs) =>
                    parsedSelectedLayout
                         .map((_, i) => refs[i] || createRef()),
               );
               setPrintRefs((refs) =>
                    parsedSelectedLayout
                         .map((_, i) => refs[i] || createRef()),
               );
               const imgs = [];
               for (let i = 0; i < parsedSelectedLayout.length; i++) {
                    imgs.push([]);
               }
               setImages(imgs);
               setStickerImgs(imgs);
               setImages(parsedSelectedLayout.map(b => []));
          }

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

     const applyStyles = (img, styles) => {
          Object.assign(img, styles);
     };

     const applyFilters = (img, filters) => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          // canvas.style.objectFit="cover"

          // 필터를 적용
          context.filter = filters;
          context.scale(-1, 1)
          context.drawImage(img, 0, 0, -img.width, img.height);

          const newImage = new window.Image();
          newImage.src = canvas.toDataURL();
          return newImage;
     };

     const addStickerToPanel = ({ bgIdx, src, width, x, y }) => {
          const uiRatio = 1; // UI용 스티커 배율
          const printRatio = getPrintRatio(); // 프린트용 스티커 배율

          const item = {
               width: width,
               x: x,
               y: y,
               src,
               resetButtonRef: createRef()
          };

          const printItem = {
               width: width * printRatio,
               x: x * printRatio,
               y: y * printRatio,
               src,
               resetButtonRef: createRef()
          };

          setImages((currentImages) => {
               const newImages = currentImages.map((subList, index) => {
                    if (index === bgIdx) {
                         return [...subList, item];
                    }
                    return subList;
               });

               return newImages;
          });

          setStickerImgs((currentImages) => {
               const newImages = currentImages.map((subList, index) => {
                    if (index === bgIdx) {
                         return [...subList, printItem];
                    }
                    return subList;
               });

               return newImages;
          });
     };

     const resetAllButtons = useCallback(() => {
          images.forEach((subList) => {
               subList.forEach((image) => {
                    if (image.resetButtonRef.current) {
                         image.resetButtonRef.current();
                    }
               });
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
     };

     const filterStickerByCategory = (category) => {
          playAudio("click_sound.wav")
          setSelectedCategory(category);
     };

     const printFrameWithSticker = async (event,) => {
          if (clickPrint === true) {
               return;
          }

          playPrintAudio()
          setClickPrint(true);
          await callPrinter();
          await uploadCloud();

          // setTimeout(() => {
          //     navigate("/print");
          // }, 3000);
     };

     function rotateImageDataURL(dataURL, degrees) {
          return new Promise((resolve, reject) => {
               const image = new Image();
               image.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const { width, height } = image;

                    // Canvas 크기를 이미지 크기와 동일하게 설정
                    canvas.width = width;
                    canvas.height = height;

                    // 이미지를 회전시키고 Canvas에 그리기
                    ctx.translate(height / 2, width / 2);
                    ctx.rotate(degrees * Math.PI / 180);
                    ctx.drawImage(image, -width / 2, -height / 2);

                    // 회전된 이미지를 Data URL로 변환하여 반환
                    resolve(canvas.toDataURL());
               };
               image.onerror = reject;
               image.src = dataURL;
          });
     }

     const uploadCloud = () => {
          try {
               const stageRef = printRefs[bgIdx];
               const originalDataURL = stageRef.current.toDataURL(); // This file path is way too long need to reduce it somehow
               let rotated = null;
               rotateImageDataURL(originalDataURL, 90)
                    .then(rotatedDataURL => {
                         const formData = new FormData();
                         formData.append("photo", originalDataURL);
                         formData.append("order_code", sessionStorage.getItem('orderCodeNum'));

                         originAxiosInstance.post(
                              `${import.meta.env.VITE_REACT_APP_BACKEND}/frames/api/upload_cloud`,
                              formData,
                              {
                                   headers: {
                                        'Content-Type': 'multipart/form-data'
                                   }
                              })
                              .then(response => {
                                   const data = response.data;
                                   const qrVal = data.photo_url;
                                   if (qrVal) {
                                        sessionStorage.setItem('uploadedCloudPhotoUrl', qrVal);
                                        sessionStorage.setItem('qr', qrVal);
                                        console.log("qr val>>>", qrVal)
                                        navigate("/print");
                                   }

                              })
                              .catch(error => {
                                   console.log(error);
                              });
                    })
                    .catch(error => {
                         console.error('이미지 회전 중 오류 발생:', error);
                    });

          } catch (error) {
               console.log(error);
          }
     };
     const convertUrl = (url) => {
          // 'uploads'를 'get_photos/uploads'로 변경
          // let newUrl = url.replace('uploads', 'get_photo/uploads');
          let newUrl = url

          // // URL을 슬래시('/')로 분리
          // const urlParts = newUrl.split('/');

          // // UUID를 제거하고 슬래시를 하나로 유지
          // const newUrlParts = urlParts.filter((part, index) => {
          //     // UUID의 형태를 가지는 부분을 제거
          //     if (index === 4 && /^[0-9a-fA-F-]{36}$/.test(part)) {
          //         return false;
          //     }
          //     return true;
          // });

          // // URL 다시 합치기
          // newUrl = newUrlParts.join('/');

          return newUrl;
     };

     const callPrinter = async () => {
          const stageRef = printRefs[bgIdx];
          if (!stageRef.current) {
               return;
          }

          const originalDataURL = stageRef.current.toDataURL();
          const blobBin = atob(originalDataURL.split(',')[1]);
          const array = [];
          for (let i = 0; i < blobBin.length; i++) {
               array.push(blobBin.charCodeAt(i));
          }
          const newFile = new Blob([new Uint8Array(array)], { type: 'image/png' });

          const formData = new FormData();
          formData.append("photo", newFile);
          let newPhotoNum = selectedFrame === "Stripx2" ? photoNum : (parseInt(photoNum) + 1).toString();
          formData.append("uuid", uuid);
          formData.append("frame", selectedFrame);
          // formData.append("photoNum", newPhotoNum);
          console.log(formData.keys);
          // try {
          const response = await originAxiosInstance.post(
               `${import.meta.env.VITE_REACT_APP_API}/api/print`,
               formData,
               {
                    headers: {
                         'Content-Type': 'multipart/form-data'
                    }
               }
          );

          console.log('Print response:', response.data);
          console.log(response.data);

          const printUrl = response.data.print_url;
          const printData = response.data.print_data;
          /* const uploadsDataPath = response.data.print_data.file_path;

          console.log(uploadsDataPath)
          console.log(uploadsDataPath)
          console.log(uploadsDataPath)
          console.log(uploadsDataPath) */

          const res = await getPhotos(uuid);
          console.log(res)
          // const filtered = res.unsorted_images.filter(img => img.url.includes(uploadsDataPath));

          let newUrl = convertUrl(res.images.url);
          const fileResponse = await fetch(newUrl);
          const fileBlob = await fileResponse.blob();

          const formDataToFlask = new FormData();
          formDataToFlask.append('file', new File([fileBlob], "print_image.png", { type: fileBlob.type }));
          formDataToFlask.append('frame', printData.frame);
          console.log("photoNum")
          console.log(photoNum)
          const myImage = sessionStorage.getItem('uploadedCloudPhotoUrl');

          for (let i = 0; i < newPhotoNum; i++) {
               // const fileResponse = await fetch(res.images[i].url.replace('uploads', 'get_photo/uploads'));
               // const fileResponse = await fetch(res.images[i].url);
               const fileResponse = await fetch(myImage);
               const fileBlob = await fileResponse.blob();

               const formDataToFlask = new FormData();
               formDataToFlask.append('file', new File([fileBlob], "print_image.png", { type: fileBlob.type }));
               formDataToFlask.append('frame', printData.frame);

               console.log(`${i} : ` + String(formDataToFlask))

               const localPrintResponse = await fetch(printUrl, {
                    method: 'POST',
                    body: formDataToFlask,
               });

               if (localPrintResponse.ok) {
                    console.log(`Print job ${i + 1} started successfully.`);
               } else {
                    console.log(`Failed to start print job ${i + 1}.`);
               }
          }
          // } catch (error) {
          //     console.error('Error during printing process:', error);
          // }
     };

     const hoverGoBackButton = () => {
          if (language === 'en') {
               setGoBackButton(goBackButton === goback_en_hover ? goback_en : goback_en_hover);
          } else if (language === 'vi') {
               setGoBackButton(goBackButton === goback_vn_hover ? goback_vn : goback_vn_hover);
          } else if (language === 'ko') {
               setGoBackButton(goBackButton === goback_kr_hover ? goback_kr : goback_kr_hover);
          } else if (language === 'mn') {
               setGoBackButton(goBackButton === goback_mn_hover ? goback_mn : goback_mn_hover);
          }
     };

     const hoverStickerButton = (stickerEffect) => {
          if (stickerEffect === 'mood') {
               if (language === 'en') {
                    setMood(mood === mood_en_click ? mood_en : mood_en_click);
               } else if (language === 'vi') {
                    setMood(mood === mood_vn_click ? mood_vn : mood_vn_click);
               } else if (language === 'ko') {
                    setMood(mood === mood_kr_click ? mood_kr : mood_kr_click);
               } else if (language === 'mn') {
                    setMood(mood === mood_mn_click ? mood_mn : mood_mn_click);
               }
          } else if (stickerEffect === 'lovely') {
               if (language === 'en') {
                    setLovely(lovely === lovely_en_click ? lovely_en : lovely_en_click);
               } else if (language === 'vi') {
                    setLovely(lovely === lovely_vn_click ? lovely_vn : lovely_vn_click);
               } else if (language === 'ko') {
                    setLovely(lovely === lovely_kr_click ? lovely_kr : lovely_kr_click);
               } else if (language === 'mn') {
                    setLovely(lovely === lovely_mn_click ? lovely_mn : lovely_mn_click);
               }
          } else if (stickerEffect === 'cartoon') {
               if (language === 'en') {
                    setCartoon(cartoon === cartoon_en_click ? cartoon_en : cartoon_en_click);
               } else if (language === 'vi') {
                    setCartoon(cartoon === cartoon_vn_click ? cartoon_vn : cartoon_vn_click);
               } else if (language === 'ko') {
                    setCartoon(cartoon === cartoon_kr_click ? cartoon_kr : cartoon_kr_click);
               } else if (language === 'mn') {
                    setCartoon(cartoon === cartoon_mn_click ? cartoon_mn : cartoon_mn_click);
               }
          } else if (stickerEffect === 'y2k') {
               if (language === 'en') {
                    setY2k(y2k === y2k_en_click ? y2k_en : y2k_en_click);
               } else if (language === 'vi') {
                    setY2k(y2k === y2k_vn_click ? y2k_vn : y2k_vn_click);
               } else if (language === 'ko') {
                    setY2k(y2k === y2k_kr_click ? y2k_kr : y2k_kr_click);
               } else if (language === 'mn') {
                    setY2k(y2k === y2k_mn_click ? y2k_mn : y2k_mn_click);
               }
          }
     };

     const hoverPrintButton = () => {
          if (language === 'en') {
               setPrintButton(printButton === print_click ? print : print_click);
          } else if (language === 'vi') {
               setPrintButton(printButton === print_vn_click ? print_vn : print_vn_click);
          } else if (language === 'ko') {
               setPrintButton(printButton === print_kr_click ? print_kr : print_kr_click);
          } else if (language === 'mn') {
               setPrintButton(printButton === print_mn_click ? print_mn : print_mn_click);
          }
     };

     // Chunk the selected photos array into arrays of 2 photos each
     const stickersData = stickers.filter(sticker => sticker.category === selectedCategory);
     //스크롤 하면 인덱스에 따라 스티커 타입 정하기
     const myStickers = chunkArray(stickersData, 4);

     const onDragStart = (event) => {
          setDragStartY(event.clientY); // 드래그 시작 위치의 Y 좌표를 저장
     };

     const onDragEnd = (event) => {
          const dragEndY = event.clientY; // 드래그 끝 위치의 Y 좌표

          if (dragEndY > dragStartY) { // 드래그가 위에서 아래로 일어났는지 확인
               setScrollIdx(prevIdx => (prevIdx + 1) % 4);
               const nextScrollIdx = (scrollIdx + 1) % 4;
               if (nextScrollIdx === 0) {
                    setSelectedCategory("MOOD");
               }
               else if (nextScrollIdx === 1) {
                    setSelectedCategory("LOVELY");
               }
               else if (nextScrollIdx === 2) {
                    setSelectedCategory("CARTOON");
               }
               else if (nextScrollIdx === 3) {
                    setSelectedCategory("Y2K");
               }
          }
     };

     const carouselRef = useRef(null);
     const [isDown, setIsDown] = useState(false);
     const [startY, setStartY] = useState(0);
     const [scrollTop, setScrollTop] = useState(0);

     useEffect(() => {
          const carousel = carouselRef.current;
          const dragging = stickerDrag;

          const handleMouseDown = (e) => {
               setIsDown(true);
               if (carousel) {
                    if (stickerDrag) return;
                    setStartY(e.pageY - carousel.offsetTop);
                    setScrollTop(carousel.scrollTop);
               }
          };

          const handleMouseLeave = () => {
               setIsDown(false);
          };

          const handleMouseUp = () => {
               setIsDown(false);
               snapToClosestItem();
          };

          const handleMouseMove = (e) => {
               if (dragging) return;

               if (!isDown) return;
               e.preventDefault();
               if (carousel) {
                    const y = e.pageY - carousel.offsetTop;
                    const walk = (y - startY) * 3; // Scroll speed
                    carousel.scrollTop = scrollTop - walk;
               }
          };

          const snapToClosestItem = () => {
               if (!carousel) return;
               const itemHeight = carousel.querySelector('.image').offsetHeight;
               const scrollY = carousel.scrollTop;
               const index = Math.round(scrollY / itemHeight);
               setBgIdx(index);
               carousel.scrollTo({ top: index * itemHeight, behavior: 'smooth' });
          };

          if (carousel) {
               carousel.addEventListener('mousedown', handleMouseDown);
               carousel.addEventListener('mouseleave', handleMouseLeave);
               carousel.addEventListener('mouseup', handleMouseUp);
               carousel.addEventListener('mousemove', handleMouseMove);
          }

          return () => {
               if (carousel) {
                    carousel.removeEventListener('mousedown', handleMouseDown);
                    carousel.removeEventListener('mouseleave', handleMouseLeave);
                    carousel.removeEventListener('mouseup', handleMouseUp);
                    carousel.removeEventListener('mousemove', handleMouseMove);
               }
          };
     }, [isDown, startY, scrollTop, stickerDrag]);

     function adjustStickerToBackgroundSize(width, height, stickerX, stickerY, stickerWidth, stickerHeight) {
          const backgroundImageSize = { width: width, height: height };
          const backgroundWidth = backgroundImageSize.width;
          const backgroundHeight = backgroundImageSize.height;

          // 배경 이미지와 스티커의 가로 및 세로 비율을 계산
          const backgroundAspectRatio = backgroundWidth / backgroundHeight;
          const stickerAspectRatio = stickerWidth / stickerHeight;

          let newStickerWidth, newStickerHeight, newStickerX, newStickerY;

          if (stickerAspectRatio > backgroundAspectRatio) {
               newStickerWidth = backgroundWidth * (stickerWidth / 1200);
               newStickerHeight = newStickerWidth * (stickerHeight / stickerWidth);
               newStickerX = stickerX * (backgroundWidth / 1200);
               newStickerY = stickerY * (backgroundWidth / 1200);
          } else {
               newStickerHeight = backgroundHeight * (stickerHeight / 1000);
               newStickerWidth = newStickerHeight * (stickerWidth / stickerHeight);
               newStickerY = stickerY * (backgroundHeight / 1000);
               newStickerX = stickerX * (backgroundHeight / 1000);
          }

          return { x: newStickerX, y: newStickerY, width: newStickerWidth, height: newStickerHeight };
     }
     useEffect(() => {
          const loadImages = () => {
               const imagePromises = selectedPhotos.map(index => {
                    return new Promise((resolve, reject) => {
                         const photo = photos[index];
                         const tempImg = new Image();
                         tempImg.crossOrigin = 'Anonymous';
                         tempImg.src = photo.url;

                         tempImg.onload = () => {
                              applyStyles(tempImg, { width: 2400, height: 1600, filter: filterEffect });
                              // tempImg.style.filter= photo.filter
                              resolve(tempImg);
                         };

                         tempImg.onerror = (err) => reject(err);
                    });
               });

               Promise.all(imagePromises)
                    .then((tempImgs) => {
                         const filterapply = tempImgs.map(img => applyFilters(img, filterEffect))
                         setTempImage(filterapply);
                    })
                    .catch((error) => {
                         console.error("Error loading images:", error);
                    });
          };

          loadImages();
     }, [selectedPhotos]);

     useEffect(() => {
          if (frameSize.width === "" || frameSize.height === "") return;

          const loadImages = () => {
               // const tempImgs = selectedPhotos.map(index => {
               //     const photo = photos[index];
               //     const tempImg = new Image();
               //     tempImg.crossOrigin = 'Anonymous';
               //     tempImg.src = photo.url;
               //     applyStyles(tempImg, { width: 800, height: 800, filter: photo.filter });
               //     return tempImg;
               // });

               // setTempImage(tempImgs);

               const element = document.querySelector('.image');
               if (element) {
                    const targetWidth = frameSize.width;
                    const targetHeight = frameSize.height;

                    const loadedImages = myBackgrounds.map((imageUrl) => {
                         return new Promise((resolve, reject) => {
                              const img = new Image();
                              img.crossOrigin = 'Anonymous';
                              img.src = imageUrl;

                              img.onload = () => {
                                   const aspectRatio = img.width / img.height;

                                   let width, height;
                                   if (aspectRatio > 1) {
                                        width = targetWidth;
                                        height = targetWidth / aspectRatio;
                                   } else {
                                        height = targetHeight;
                                        width = targetHeight * aspectRatio;
                                   }

                                   setWidth(width);
                                   setHeight(height);

                                   resolve({
                                        img,
                                        width,
                                        height
                                   });
                              };
                              img.onerror = (err) => reject(err);
                         });
                    });

                    Promise.all(loadedImages)
                         .then((images) => {
                              setBackgroundList(images);
                         })
                         .catch((error) => {
                              console.error("Error loading images:", error);
                         });
               }
          };

          loadImages();
     }, [selectedPhotos, myBackgrounds]);

     useEffect(() => {
          if (frameSize.width === "" || frameSize.height === "") return;

          const loadImages = () => {
               const element = document.querySelector('.image');
               if (element) {
                    const targetWidth = frameSize.width;
                    const targetHeight = frameSize.height;

                    const loadedImages = selectedLayout.map((imageUrl) => {
                         return new Promise((resolve, reject) => {
                              const img = new Image();
                              img.crossOrigin = 'Anonymous';
                              img.src = imageUrl;

                              img.onload = () => {
                                   const aspectRatio = img.width / img.height;

                                   let width, height;
                                   if (aspectRatio > 1) {
                                        width = targetWidth;
                                        height = targetWidth / aspectRatio;
                                   } else {
                                        height = targetHeight;
                                        width = targetHeight * aspectRatio;
                                   }

                                   setWidth(width);
                                   setHeight(height);

                                   resolve({
                                        img,
                                        width,
                                        height
                                   });
                              };
                              img.onerror = (err) => reject(err);
                         });
                    });

                    Promise.all(loadedImages)
                         .then((images) => {
                              setLayoutList(images);
                         })
                         .catch((error) => {
                              console.error("Error loading images:", error);
                         });
               }
          };

          loadImages();
     }, [selectedLayout]);
     const getCrop = (image, newSize) => {
          const aspectRatio = newSize.width / newSize.height;
          const imageRatio = image.width / image.height;

          let newWidth = image.width;
          let newHeight = image.height;
          let x = 0;
          let y = 0;

          if (imageRatio > aspectRatio) {
               newWidth = image.height * aspectRatio;
               x = (image.width - newWidth) / 2;
          } else {
               newHeight = image.width / aspectRatio;
               y = (image.height - newHeight) / 2;
          }

          return {
               x: x,
               y: y,
               width: newWidth,
               height: newHeight
          };
     };

     const showKonvaImgLayout = useCallback((selectedFrame, width, height, imgTag, ratio) => {
               if (!imgTag.length) return <></>;

               // Frame configurations
               const frameConfigs = {
                    "3-cutx2": {
                         calcedHeight: height / 5.3,
                         calcedWidth: (height / 5.3) * 1.02,
                         xOffset: [17, 17 + (height / 5.3) * 1.02 + 10],
                         yOffset: 18,
                         chunkSize: 2,
                         extraImage: false,
                    },
                    "5-cutx2": {
                         calcedWidth: width / 2 - 22,
                         calcedHeight: height / 2 - 30,
                         xOffset: [17, 17 + width / 2 - 22 + 10],
                         yOffset: 18,
                         chunkSize: 2,
                         extraImage: true,
                    },
                    "Stripx2": {
                         calcedHeight: height / 6 + 20,
                         calcedWidth: (height / 6 + 20) * 1.48,
                         xOffset: [170, 170 + (height / 6 + 20) * 1.48 + 30],
                         yOffset: 32,
                         chunkSize: 2,
                         extraImage: false,
                         scaleX: -1,
                    },
                    "2cut-x2": {
                         calcedWidth: width / 2.1,
                         calcedHeight: (width / 2.1) * 1.13,
                         xOffset: [220, 220 + width / 2.1 + 7],
                         yOffset: 29,
                         chunkSize: 2,
                         scaleX: -1,
                    },
                    "4-cutx2": {
                         calcedHeight: height / 2.4,
                         calcedWidth: (height / 2.4) * 1.33,
                         xOffset: [222.5, 222.5 + (height / 2.4) * 1.33 + 17],
                         yOffset: 20,
                         chunkSize: 2,
                         scaleX: -1,
                    },
                    default: {
                         calcedWidth: (width / 2.3) * 1.0,
                         calcedHeight: width / 2.4,
                         xOffset: [155, 155 + (width / 2.3) * 1.0 + 5],
                         yOffset: 20,
                         chunkSize: 2,
                         scaleX: -1,
                    },
               };

               const {
                    calcedWidth,
                    calcedHeight,
                    xOffset,
                    yOffset,
                    chunkSize,
                    extraImage = false,
                    scaleX = 1,
               } = frameConfigs[selectedFrame] || frameConfigs.default;

               // Render logic
               const renderImages = () =>
                    chunkArray(imgTag, chunkSize).map((row, rowIndex) =>
                         row.map((tag, photoIndex) => {
                              const x = xOffset[photoIndex];
                              const y = yOffset + rowIndex * (calcedHeight + 10);
                              const crop = getCrop(
                                   { width: tag.width, height: tag.height },
                                   { width: calcedWidth, height: calcedHeight }
                              );
                              return (
                                   <KonvaImage
                                        crop={{
                                             x: crop.x,
                                             y: crop.y,
                                             width: crop.width - crop.x,
                                             height: crop.height - crop.y,
                                        }}
                                        width={calcedWidth * ratio}
                                        height={calcedHeight * ratio}
                                        x={x * ratio}
                                        y={y * ratio}
                                        image={tag}
                                        key={`${rowIndex}-${photoIndex}`}
                                        scaleX={scaleX}
                                   />
                              );
                         })
                    );
               return (
                    <>
                         {renderImages()}
                         {extraImage && (
                              <KonvaImage
                                   width={calcedWidth * 2 + 10}
                                   height={calcedHeight}
                                   x={xOffset[0]}
                                   y={yOffset + 2 * (calcedHeight + 10)}
                                   image={imgTag[chunkSize]}
                              />
                         )}
                    </>
               );
          },
          [selectedFrame, width, height, tempImage]
     );

     useEffect(()=>{
          setIsRendered(false);
          const timer = setTimeout(()=>setIsRendered(true),0);
          return () => clearTimeout(timer)
     }, [selectedFrame, width, height, tempImage])

     useEffect(() => {
          const smallRatio = 0.8;
          const largeRatio = 1.45;
          if (selectedFrame === "6-cutx2") {
               setFrameSize({ width: 1920 * 1 / 6, height: 2900 * 1 / 6 });
               // setFrameSize({ width:6000, height: 4000 });
          }
          else if (selectedFrame === "Stripx2") {
               setFrameSize({ width: 257.79 * largeRatio, height: 384 * largeRatio });
          }
          else if (selectedFrame === "2cut-x2") {
               setFrameSize({ width: 560 * smallRatio, height: 384 * smallRatio });
          }
          else {
               setFrameSize({ width: 576 * smallRatio, height: 384 * smallRatio });
          }

     }, [
          selectedFrame
     ]);

     const getKonvaClassName = (selectedFrame) => {
          if (selectedFrame === "6-cutx2" || selectedFrame === "Stripx2") {
               return "konva-vertical-image";
          } else {
               return "konva-horizontal-image";
          }
     };
     // 670번째 줄
     const updateStickerPositionAndSize = (index, newX, newY, newWidth, newHeight) => {
          const printRatio = getPrintRatio()
          setImages((currentImages) => {
               const newImages = [...currentImages];
               newImages[bgIdx][index] = {
                    ...newImages[bgIdx][index],
                    x: newX,
                    y: newY,
                    width: newWidth,
                    height: newHeight,
               };
               return newImages;
          });

          setStickerImgs((currentImages) => {
               const newImages = [...currentImages];
               newImages[bgIdx][index] = {
                    ...newImages[bgIdx][index],
                    x: newX * printRatio,
                    y: newY * printRatio,
                    width: newWidth * printRatio,
                    height: newHeight * printRatio,
               };
               return newImages;
          });
     };

     const getCarouselStyle = (selFrame) => {
          //  return "77%"
          if (selFrame === "Stripx2") {
               return { height: "74%", bottom: "16%", right: "12%" }
          }
          else if (selFrame === "6-cutx2") {
               return {
                    transform: "scale(1.1)",
                    height: "70%", bottom: "18%", right: "8%"
               }
          }
          else if (selFrame === "2cut-x2") {
               return {
                    transform: "scale(1.4)",
                    width: "48%",
                    height: "65%", bottom: "18%", right: "20%"
               }
          }
          else if (selFrame === "4-cutx2") {
               return {
                    transform: "scale(1.4)",
                    width: "48%",
                    height: "65%", bottom: "18%", right: "20%"
               }
          }

     }
     const playPrintAudio = async () => {
          const res = await playAudio("print.wav")
     }

     useEffect(() => {
          playAudio("add_emoji.wav")
     }, [])

     return (
          <div className='sticker-container' style={{ backgroundImage: `url(${backgroundImage})` }}>
               <div className="go-back" style={{ backgroundImage: `url(${goBackButton})`, top: `4.4%`, left: `6%` }} onClick={() => {
                    playAudio("click_sound.wav")
                    navigate("/filter")
               }} onMouseEnter={hoverGoBackButton} onMouseLeave={hoverGoBackButton}></div>
               {/* 프린트용 */}
               <div className='print'>
                    <Stage
                         width={frameSize.width * getPrintRatio()}
                         height={frameSize.height * getPrintRatio()}
                         scale={{ x: 1, y: 1 }}
                         x={0}
                         y={0}
                         onClick={handleCanvasClick}
                         onTap={handleCanvasClick}
                         className={getKonvaClassName(selectedFrame)}
                         onMouseDown={checkDeselect}
                         onTouchStart={checkDeselect}
                         ref={printRefs[bgIdx]}
                    >
                         <Layer>
                              {backgroundList[bgIdx] && (
                                   <KonvaImage
                                        image={backgroundList[bgIdx].img}
                                        width={frameSize.width * getPrintRatio()}
                                        height={frameSize.height * getPrintRatio() - 20}
                                        x={0}
                                        y={10}
                                   />
                              )}
                              {tempImage && showKonvaImgLayout(selectedFrame, frameSize.width, frameSize.height, tempImage, getPrintRatio())}
                         </Layer>
                         <Layer>
                              {layoutList[bgIdx] && (
                                   <KonvaImage
                                        image={layoutList[bgIdx].img}
                                        width={frameSize.width * getPrintRatio()}
                                        height={frameSize.height * getPrintRatio() - 20}
                                        x={0}
                                        y={10}
                                   />
                              )}
                         </Layer>
                         <Layer>
                              {stickerImgs[bgIdx] && stickerImgs[bgIdx].map((image, i) => (
                                   <StickerItem
                                        isStickerDrag={stickerDrag}
                                        isSelected={isSel}
                                        setStickerDrag={setStickerDrag}
                                        // onTransform={() => console.log("이미지 리사이징 중")}
                                        // onSelect={() => {
                                        //     setIsSel(p => !p);
                                        // }}
                                        // onDelete={() => {
                                        //     const newImages = [...stickerImgs];
                                        //     newImages.splice(i, 1);
                                        //     setStickerImgs(newImages);
                                        // }}
                                        // onDragEnd={(event) => {
                                        //     image.x = event.target.x();
                                        //     image.y = event.target.y();
                                        // }}
                                        // onChange={(x, y, width, height) => {
                                        // }}
                                        key={i}
                                        image={image}
                                        shapeProps={image}
                                   />
                              ))}
                         </Layer>
                    </Stage>
               </div>
               <div className="left-sticker">
                    <div className='frame-box' style={{ backgroundImage: `url(${frame_box})` }} />
                    <div className='v-carousel-container' ref={carouselRef}

                         style={
                              getCarouselStyle(selectedFrame)
                         }
                    >
                         <div className='v-carousel-images'>
                              {myBackgrounds.map((src, index) => (
                                   <div className='image' key={index}>
                                        <Stage
                                             width={frameSize.width}
                                             height={frameSize.height}
                                             scale={{ x: 1, y: 1 }}
                                             onClick={handleCanvasClick}
                                             onTap={handleCanvasClick}
                                             className={getKonvaClassName(selectedFrame)}
                                             onMouseDown={checkDeselect}
                                             onTouchStart={checkDeselect}
                                             ref={stageRefs[index]}
                                        >
                                             <Layer>
                                                  {backgroundList[bgIdx] && (
                                                       <KonvaImage
                                                            image={backgroundList[bgIdx].img}
                                                            width={frameSize.width}
                                                            height={frameSize.height}
                                                            x={0}
                                                            y={0}
                                                       />
                                                  )}
                                                  {tempImage && showKonvaImgLayout(selectedFrame, frameSize.width, frameSize.height, tempImage, 1)}
                                             </Layer>
                                             <Layer>
                                                  {layoutList[bgIdx] && (
                                                       <KonvaImage
                                                            image={layoutList[bgIdx].img}
                                                            width={frameSize.width}
                                                            height={frameSize.height}
                                                            x={0}
                                                            y={0}
                                                       />
                                                  )}
                                             </Layer>
                                             <Layer>
                                                  {images[bgIdx] && images[bgIdx].map((image, i) => (
                                                       // 1627번째 줄
                                                       <StickerItem
                                                            isStickerDrag={stickerDrag}
                                                            isSelected={isSel}
                                                            setStickerDrag={setStickerDrag}
                                                            onTransform={(x, y, width, height) => {
                                                                 updateStickerPositionAndSize(i, x, y, width, height);
                                                            }}
                                                            onSelect={() => {
                                                                 setIsSel(p => !p);
                                                            }}
                                                            onDelete={() => {
                                                                 const newPrintImages = [...stickerImgs];
                                                                 newPrintImages[bgIdx].splice(i, 1);
                                                                 setStickerImgs(newPrintImages);

                                                                 const newUiImages = [...images];
                                                                 newUiImages[bgIdx].splice(i, 1);
                                                                 setImages(newUiImages);
                                                            }}
                                                            onDragEnd={(event) => {
                                                                 const newX = event.target.x();
                                                                 const newY = event.target.y();
                                                                 updateStickerPositionAndSize(i, newX, newY, image.width, image.height);
                                                            }}
                                                            key={i}
                                                            image={image}
                                                            shapeProps={image}
                                                       />
                                                  ))}
                                             </Layer>
                                        </Stage>
                                   </div>
                              ))}
                         </div>
                    </div>
               </div>
               <div className="middle-sticker"
                    draggable={true}
                    onDragStart={onDragStart}
                    onDrag={() => {
                    }}
                    onDragEnd={onDragEnd}
                    style={{
                         backgroundImage: `url(${sticker_frame})`
                    }}>
                    {myStickers.map((group, index) => (
                         <div key={index} className={index === 0 ? 'sticker-line-1' : 'sticker-line'}>
                              {group.map((mySticker, photoIndex) => (
                                   <div
                                        key={photoIndex}
                                        className="sticker"
                                        onClick={() => {
                                             const element = document.querySelector('.image');
                                             const width = element.offsetWidth;
                                             const height = element.offsetHeight;
                                             addStickerToPanel({
                                                  bgIdx: bgIdx,
                                                  src: mySticker.photo,
                                                  width: 100,
                                                  ...adjustStickerToBackgroundSize(width, height, 500, 500, 200, 200)
                                             });
                                        }}
                                   >
                                        <img className="sticker-image"
                                             alt={mySticker.title} src={mySticker.photo} width='90px' height='90px' />
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
                    {
                         isRendered
                         &&
                         <div className="sticker-print-btn" style={{ backgroundImage: `url(${printButton})` }} onClick={printFrameWithSticker} onMouseEnter={hoverPrintButton} onMouseLeave={hoverPrintButton}></div>
                    }
               </div>
          </div>
     );
}

export default Sticker;