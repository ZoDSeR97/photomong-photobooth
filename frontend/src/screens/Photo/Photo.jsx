import { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import "../../css/Photo.css";
import countdownImg from '../../assets/Photo/Snap/countdown.png';
import photocountImg from '../../assets/Photo/Snap/photocount.png';
import background_en from '../../assets/Photo/Snap/BG.png';
import background_kr from '../../assets/Photo/Snap/kr/BG.png';
import background_vn from '../../assets/Photo/Snap/vn/BG.png';
import background_mn from '../../assets/Photo/Snap/mn/BG.png';
import load_en from '../../assets/Photo/Load/BG.png';
import load_kr from '../../assets/Photo/Load/kr/BG.png';
import load_vn from '../../assets/Photo/Load/vn/BG.png';
import load_mn from '../../assets/Photo/Load/mn/BG.png';
import ok_button from '../../assets/Photo/Snap/OK.png';
import ok_button_inactive from '../../assets/Photo/Snap/OkInactive.png';
import take_again_button from '../../assets/Photo/Snap/TakeAgain.png';
import take_again_button_inactive from '../../assets/Photo/Snap/TakeAgainInactive.png';
import { playAudio, getPhotos, sendCaptureReq, startLiveView, videoFeedUrl } from '../../api/config';
import Uid from "react-uuid"

function Photo() {
     const { t } = useTranslation();
     const navigate = useNavigate();
     const webcamRef = useRef(null);
     const [cameraConnected, setCameraConnected] = useState(true);
     const [countdown, setCountdown] = useState(5);
     const [photoCount, setPhotoCount] = useState(0);
     const [flash, setFlash] = useState(false);
     const [backgroundImage, setBackgroundImage] = useState(background_en);
     const [loadBgImage, setLoadBgImage] = useState(load_en);
     const [capturing, setCapturing] = useState(false);
     const [capturePhotos, setCapturePhotos] = useState([]);
     const [captureVideos, setCaptureVideos] = useState([]);
     const [webphotos, setWebPhotos] = useState([]);

     const [showFirstSet, setShowFirstSet] = useState(true);
     const [uuid, setUuid] = useState(sessionStorage.getItem("uuid") || null);
     const [selectedFrame, setSelectedFrame] = useState(null);
     const [myBackground, setMyBackground] = useState(null);
     const [selectedLayout, setSelectedLayout] = useState(null);
     const [totalSnapshotPhoto, setTotalSnapshotPhoto] = useState(8);
     const [totalNeededPhoto, setTotalNeededPhoto] = useState(8);

     const [okButtonUrl, setOkButtonUrl] = useState(ok_button_inactive);
     const [takeAgainButtonUrl, setTakeAgainButtonUrl] = useState(take_again_button_inactive);
     const [selectedReTakePhotos, setSelectedReTakePhotos] = useState([]);

     const [status, setStatus] = useState('working');

     const timerRef = useRef(null);

     useEffect(() => {
          const newUuid = Uid().toString();
          setUuid(newUuid);

          const storedSelectedFrame = JSON.parse(sessionStorage.getItem('selectedFrame'));
          if (storedSelectedFrame) {
               setSelectedFrame(storedSelectedFrame.frame);
          }

          /* if (storedSelectedFrame.frame === 'Stripx2') {
               setTotalSnapshotPhoto(8);
          } else if (storedSelectedFrame.frame === '2cut-x2') {
               setTotalSnapshotPhoto(2);
          } else if (storedSelectedFrame.frame === '4-cutx2') {
               setTotalSnapshotPhoto(4);
          } else if (storedSelectedFrame.frame === '6-cutx2') {
               setTotalSnapshotPhoto(6);
          } else if (storedSelectedFrame.frame === '4.2-cutx2') {
               setTotalSnapshotPhoto(4);
          } */

          if (storedSelectedFrame.frame === 'Stripx2') {
               setTotalNeededPhoto(8);
          } else if (storedSelectedFrame.frame === '2cut-x2') {
               setTotalNeededPhoto(2);
          } else if (storedSelectedFrame.frame === '4-cutx2') {
               setTotalNeededPhoto(4);
          } else if (storedSelectedFrame.frame === '6-cutx2') {
               setTotalNeededPhoto(6);
          } else if (storedSelectedFrame.frame === '4.2-cutx2') {
               setTotalNeededPhoto(4);
          }

          const sessionSelectedLayout = sessionStorage.getItem('selectedLayout');
          const parsedSelectedLayout = [JSON.parse(sessionSelectedLayout)];
          const layoutData = parsedSelectedLayout[0];
          // console.log(parsedSelectedLayout);
          if (layoutData) {
               setSelectedLayout(layoutData.photo_cover);
          }
     }, []);

     useEffect(() => {
          const sessionSelectedLayout = sessionStorage.getItem('selectedLayout');
          const parsedSelectedLayout = [JSON.parse(sessionSelectedLayout)];
          const layoutData = parsedSelectedLayout[0];
          if (layoutData) {
               setMyBackground(layoutData.photo);
          }
     }, []);

     const handleRetakePhoto = (selectedId) => {
          if (capturePhotos.length < totalSnapshotPhoto || status === 'working')
               return;
          // console.log('Selected retake:', selectedId);
          setTakeAgainButtonUrl(take_again_button);

          // only set one item selectedID for retake
          setSelectedReTakePhotos([selectedId]);
     };

     const sleep = (ms) => {
          return new Promise(resolve => setTimeout(resolve, ms));
     };

     const chunkArray = (array, chunkSize) => {
          const chunks = [];
          for (let i = 0; i < array.length; i += chunkSize) {
               chunks.push(array.slice(i, i + chunkSize));
          }
          return chunks;
     }

     const displayClassNameForPhoto = (rowIndex, photoIndex, selectedIndex) => {
          let className = 'choose-photo-item';

          if (selectedFrame === 'Stripx2') {
               if (rowIndex === 0 && photoIndex === 0) {
                    className = 'choose-photo-item-0-0-right';
               } else if (rowIndex === 0 && photoIndex === 1) {
                    className = 'choose-photo-item-0-1-right';
               } else if (rowIndex === 1 && photoIndex === 0) {
                    className = 'choose-photo-item-1-0-right';
               } else if (rowIndex === 1 && photoIndex === 1) {
                    className = 'choose-photo-item-1-1-right';
               } else if (rowIndex === 2 && photoIndex === 0) {
                    className = 'choose-photo-item-2-0-right';
               } else if (rowIndex === 2 && photoIndex === 1) {
                    className = 'choose-photo-item-2-1-right';
               } else if (rowIndex === 3 && photoIndex === 0) {
                    className = 'choose-photo-item-3-0-right';
               } else if (rowIndex === 3 && photoIndex === 1) {
                    className = 'choose-photo-item-3-1-right';
               }
          } else if (selectedFrame === '6-cutx2') {
               if (rowIndex === 0 && photoIndex === 0) {
                    className = 'choose-photo-item6-0-0-right';
               } else if (rowIndex === 0 && photoIndex === 1) {
                    className = 'choose-photo-item6-0-1-right';
               } else if (rowIndex === 1 && photoIndex === 0) {
                    className = 'choose-photo-item6-1-0-right';
               } else if (rowIndex === 1 && photoIndex === 1) {
                    className = 'choose-photo-item6-1-1-right';
               } else if (rowIndex === 2 && photoIndex === 0) {
                    className = 'choose-photo-item6-2-0-right';
               } else if (rowIndex === 2 && photoIndex === 1) {
                    className = 'choose-photo-item6-2-1-right';
               }
          } else if (selectedFrame === '2cut-x2') {
               if (rowIndex === 0 && photoIndex === 0) {
                    className = 'choose-photo-item-2cut-0-0-right';
               } else if (rowIndex === 0 && photoIndex === 1) {
                    className = 'choose-photo-item-2cut-0-1-right';
               }
          } else if (selectedFrame === '3-cutx2') {
               if (rowIndex === 0 && photoIndex === 0) {
                    className = 'choose-photo-item-3cut-0-0';
               } else if (rowIndex === 0 && photoIndex === 1) {
                    className = 'choose-photo-item-3cut-0-1';
               } else if (rowIndex === 1 && photoIndex === 0) {
                    className = 'choose-photo-item-3cut-0-1';
               }
          } else if (selectedFrame === '4-cutx2') {
               if (rowIndex === 0 && photoIndex === 0) {
                    className = 'choose-photo-item-4cut-0-0-right';
               } else if (rowIndex === 0 && photoIndex === 1) {
                    className = 'choose-photo-item-4cut-0-1-right';
               } else if (rowIndex === 1 && photoIndex === 0) {
                    className = 'choose-photo-item-4cut-1-0-right';
               } else if (rowIndex === 1 && photoIndex === 1) {
                    className = 'choose-photo-item-4cut-1-1-right';
               }
          } else if (selectedFrame === '5-cutx2') {
               if (rowIndex === 0 && photoIndex === 0) {
                    className = 'choose-photo-item-5cut-0-0';
               } else if (rowIndex === 0 && photoIndex === 1) {
                    className = 'choose-photo-item-5cut-0-1';
               } else if (rowIndex === 1 && photoIndex === 0) {
                    className = 'choose-photo-item-5cut-1-0';
               } else if (rowIndex === 1 && photoIndex === 1) {
                    className = 'choose-photo-item-5cut-1-1';
               }
          }

          // console.log('selectedIndexStyle: ', selectedIndex)
          // console.log('array selectedRetakePhotos: ', selectedReTakePhotos)
          if (selectedReTakePhotos.length > 0 && selectedReTakePhotos[selectedReTakePhotos.length - 1] === selectedIndex) {
               className += ' clicked';
          }
          return className;
     };

     /* const takePhoto = useCallback(() => {
          setFlash(true);
          setCapturing(true);
          const imageSrc = webcamRef.current.getScreenshot();
          const newPhotoArray = [...webphotos, imageSrc];
          setWebPhotos(newPhotoArray);
          setPhotoCount((prevCount) => prevCount + 1);

          setTimeout(() => {
               setFlash(false);
               setCapturing(false);
          }, 100);

          if (photoCount == totalSnapshotPhoto) {
               const photosWithIds = newPhotoArray.map((photo, index) => ({
                    id: index,
                    url: photo
               }));
               sessionStorage.setItem('photos', JSON.stringify(photosWithIds));
               navigate('/photo-choose')
          } else {
               setCountdown(5);
          }
     },[webphotos, photoCount, totalSnapshotPhoto, navigate]); */

     const takeSnapshot = useCallback(async () => {
          await sleep(100);
          setCapturing(true);
          try {
               setFlash(true);
               await sendCaptureReq(uuid);
               setPhotoCount((prevCount) => prevCount + 1);
          } catch (error) {
               console.error('Failed to capture image:', error);
          }
          setFlash(false);
          setCapturing(false);
     }, [uuid]);

     const startTimer = useCallback(() => {
          timerRef.current = setInterval(async () => {
               setCountdown((prevCountdown) => {
                    setTakeAgainButtonUrl(take_again_button_inactive);
                    if (prevCountdown > 0) {
                         if (prevCountdown === 5) 
                              playCntSound();
                         return prevCountdown - 1;
                    } else {
                         clearInterval(timerRef.current);
                         takeSnapshot()
                              .then(() => {
                                   setCountdown(5);
                                   if (status === "working") {
                                        startTimer();
                                   }
                              })
                         return 5;
                    }
               });
          }, 1000);
     },[status, takeSnapshot]);

     const reTakePhoto = () => {
          // if retake button is inactive then do nothing
          if (takeAgainButtonUrl === take_again_button_inactive) {
               return;
          }
          setStatus("working");
          setCountdown(5);
     };

     const getLatestPhoto = async (currentPhotoCount) => {
          // console.log('currentPhotoCount>>>', currentPhotoCount)
          const photos = await getPhotos(uuid);
          console.log("photos: ", photos);
          if (photos?.images?.length > 0) {
               const latestImage = photos.images[photos.images.length - 1];
               //const latestVideo = photos.videos[photos.videos.length - 1];
               console.log("latest image:", latestImage)

               // if retake photo            
               if (selectedReTakePhotos.length > 0) {
                    // get retake photo
                    const firstRetakePhoto = selectedReTakePhotos[0];

                    // get id of firstRetakePhoto
                    const firstRetakePhotoIndex = firstRetakePhoto.id;
                    // console.log('firstRetakePhotoIndex>>>', firstRetakePhotoIndex)

                    // loop capturePhotos and find photo with id = firstRetakePhotoIndex.  then replace url with formattedImage.url.replace(/\\/g, '/').replace('serve_photo', `get_photo/uploads`)
                    const newCapturePhotos = capturePhotos.map((photo) => {
                         if (photo.id === firstRetakePhotoIndex) {
                              return {
                                   ...photo,
                                   url: latestImage.url
                              };
                         }
                         return photo;
                    });

                    /* const newCaptureVideos = captureVideos.map(video => {
                         if(video.id === firstRetakePhotoIndex){
                              return {
                                   ...video,
                                   url: latestVideo.url
                              }
                         }
                    }); */

                    setCapturePhotos(newCapturePhotos);
                    //setCaptureVideos(newCaptureVideos);
                    // remove all photos in selectedReTakePhotos
                    setSelectedReTakePhotos([]);
               } else {
                    setCapturePhotos(prev => [...prev, latestImage]);
                    //setCaptureVideos(prev => [...prev, latestVideo]);
               }
          } else {
               navigate(-1);
               console.log("No photos available.");
          }
     };

     const showSelectedPhotos = () => {
          if (selectedFrame === '3-cutx2' && capturePhotos.length > 0) {
               const firstPhotoTpl = (
                    <div className="choose-photo-row">
                         <div
                              className="choose-photo-item-3cut-top-line"
                              style={{ backgroundImage: `url(${capturePhotos[0].url})`, transform: "scaleX(-1)"}}
                              onClick={() => handleRetakePhoto(0)}
                         />
                    </div>
               );
               const selectedPhotoRows = chunkArray(capturePhotos.slice(1), 2);
               return [
                    firstPhotoTpl,
                    ...selectedPhotoRows.map((row, rowIndex) => (
                         <div key={rowIndex} className="choose-photo-row">
                              {row.map((selectedIndex, photoIndex) => (
                                   <div
                                        key={photoIndex}
                                        className={displayClassNameForPhoto(rowIndex, photoIndex, selectedIndex)}
                                        style={{ backgroundImage: `url(${capturePhotos[selectedIndex].url})`, transform: "scaleX(-1)"}}
                                        onClick={() => handleRetakePhoto(selectedIndex)}
                                   />
                              ))}
                         </div>
                    )),
               ];
          } else if (selectedFrame === '5-cutx2' && capturePhotos.length > 0) {
               if (capturePhotos.length === 5) {
                    const lastPhotoTpl = (
                         <div className="choose-photo-row">
                              <div
                                   className="choose-photo-item-5cut-last-line"
                                   style={{ backgroundImage: `url(${capturePhotos[capturePhotos.length - 1].url})`, transform: "scaleX(-1)"}}
                                   onClick={() => handleRetakePhoto(capturePhotos.length - 1)}
                              />
                         </div>
                    );
                    const selectedPhotoRows = chunkArray(capturePhotos.slice(0, capturePhotos.length - 1), 2);
                    return [
                         selectedPhotoRows.map((row, rowIndex) => (
                              <div key={rowIndex} className="choose-photo-row">
                                   {row.map((selectedIndex, photoIndex) => (
                                        <div
                                             key={photoIndex}
                                             className={displayClassNameForPhoto(rowIndex, photoIndex, selectedIndex)}
                                             style={{ backgroundImage: `url(${capturePhotos[selectedIndex].url})`, transform: "scaleX(-1)"}}
                                             onClick={() => handleRetakePhoto(selectedIndex)}
                                        />
                                   ))}
                              </div>
                         )),
                         lastPhotoTpl,
                    ];
               } else {
                    const selectedPhotoRows = chunkArray(capturePhotos, 2);
                    return [
                         selectedPhotoRows.map((row, rowIndex) => (
                              <div key={rowIndex} className="choose-photo-row">
                                   {row.map((selectedIndex, photoIndex) => (
                                        <div
                                             key={photoIndex}
                                             className={displayClassNameForPhoto(rowIndex, photoIndex, selectedIndex)}
                                             style={{ backgroundImage: `url(${capturePhotos[selectedIndex].url})`, transform: "scaleX(-1)"}}
                                             onClick={() => handleRetakePhoto(selectedIndex)}
                                        />
                                   ))}
                              </div>
                         )),
                    ];
               }
          } else {
               const selectedPhotoRows = chunkArray(capturePhotos.slice(0, totalNeededPhoto), 2);
               return selectedPhotoRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="choose-photo-row">
                         {row.map((selectedIndex, photoIndex) => {
                              const selectedPhotoHere = capturePhotos.find((photo) => photo.id === selectedIndex.id);
                              return (
                                   <div
                                        key={photoIndex}
                                        className={displayClassNameForPhoto(rowIndex, photoIndex, selectedIndex)}
                                        style={{
                                             backgroundImage: `url(${selectedPhotoHere ? selectedPhotoHere.url : ''})`, transform: "scaleX(-1)"
                                        }}
                                        onClick={() => handleRetakePhoto(selectedIndex)}
                                   />
                              );
                         })}
                    </div>
               ));
          }
     };

     const showClickArea = () => {
          if (selectedFrame === '3-cutx2' && capturePhotos.length > 0) {
               const firstPhotoTpl = (
                    <div className="choose-photo-row">
                         <div
                              className="choose-photo-item-3cut-top-line"
                              onClick={() => handleRetakePhoto(0)}
                         />
                    </div>
               );
               const selectedPhotoRows = chunkArray(capturePhotos.slice(1), 2);
               return [
                    firstPhotoTpl,
                    ...selectedPhotoRows.map((row, rowIndex) => (
                         <div key={rowIndex} className="choose-photo-row">
                              {row.map((selectedIndex, photoIndex) => (
                                   <div
                                        key={photoIndex}
                                        className={displayClassNameForPhoto(rowIndex, photoIndex, selectedIndex)}
                                        onClick={() => handleRetakePhoto(selectedIndex)}
                                   />
                              ))}
                         </div>
                    )),
               ];
          } else if (selectedFrame === '5-cutx2' && capturePhotos.length > 0) {
               if (capturePhotos.length === 5) {
                    const lastPhotoTpl = (
                         <div className="choose-photo-row">
                              <div
                                   className="choose-photo-item-5cut-last-line"
                                   onClick={() => handleRetakePhoto(capturePhotos.length - 1)}
                              />
                         </div>
                    );
                    const selectedPhotoRows = chunkArray(capturePhotos.slice(0, capturePhotos.length - 1), 2);
                    return [
                         selectedPhotoRows.map((row, rowIndex) => (
                              <div key={rowIndex} className="choose-photo-row">
                                   {row.map((selectedIndex, photoIndex) => (
                                        <div
                                             key={photoIndex}
                                             className={displayClassNameForPhoto(rowIndex, photoIndex, selectedIndex)}
                                             onClick={() => handleRetakePhoto(selectedIndex)}
                                        />
                                   ))}
                              </div>
                         )),
                         lastPhotoTpl,
                    ];
               } else {
                    const selectedPhotoRows = chunkArray(capturePhotos, 2);
                    return [
                         selectedPhotoRows.map((row, rowIndex) => (
                              <div key={rowIndex} className="choose-photo-row">
                                   {row.map((selectedIndex, photoIndex) => (
                                        <div
                                             key={photoIndex}
                                             className={displayClassNameForPhoto(rowIndex, photoIndex, selectedIndex)}
                                             onClick={() => handleRetakePhoto(selectedIndex)}
                                        />
                                   ))}
                              </div>
                         )),
                    ];
               }
          } else {
               const selectedPhotoRows = chunkArray(capturePhotos.slice(0, totalNeededPhoto), 2);
               return selectedPhotoRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="choose-photo-row">
                         {row.map((selectedIndex, photoIndex) => (
                              <div
                                   key={photoIndex}
                                   className={displayClassNameForPhoto(rowIndex, photoIndex, selectedIndex)}
                                   onClick={() => handleRetakePhoto(selectedIndex)}
                              />
                         ))}
                    </div>
               ));
          }
     };

     const playCntSound = async () => {
          await playAudio("count.wav" );
     };

     useEffect(() => {
          playAudio("look_up_smile.wav");
     }, []);

     useEffect(() => {
          if (uuid && cameraConnected) {
               if (photoCount > 0) {
                    getLatestPhoto(photoCount - 1);
               }
               if (photoCount > 4) {
                    setShowFirstSet(false);
               }
          }
     }, [photoCount, uuid, cameraConnected]);

     useEffect(() => {
          if (capturePhotos.length > 0 && photoCount >= totalSnapshotPhoto && selectedReTakePhotos.length < 1) {
               sessionStorage.setItem("uuid", uuid);
               setStatus("done");
               setOkButtonUrl(ok_button);
               // goToFilter();
          }
     }, [capturePhotos, navigate, selectedReTakePhotos.length, totalSnapshotPhoto, uuid]);

     const goToFilter = async () => {
          // if ok button is inactive, do not go to filter
          if (okButtonUrl === ok_button_inactive) {
               return;
          }
          if (capturePhotos.length > 0 && capturePhotos.length === totalSnapshotPhoto) {
               sessionStorage.setItem("uuid", uuid);

               sessionStorage.setItem('photos', JSON.stringify(capturePhotos));
               sessionStorage.setItem('videos', JSON.stringify(captureVideos));
               // log capturePhotos
               // console.log("Capture photos >>", capturePhotos);


               sessionStorage.setItem('choosePhotos', JSON.stringify(capturePhotos.map(photo => photo.id)));
               // log capturePhotos id
               // console.log("Capture photos >>", capturePhotos.map(photo => photo.id));

               // const result = await copyImageApi();
               await fetch(`${import.meta.env.VITE_REACT_APP_API}/api/stop_live_view`)
               navigate("/photo-choose");
          }
     };

     useEffect(() => {
          const language = sessionStorage.getItem('language');
          if (language === 'en') {
               setBackgroundImage(background_en);
               setLoadBgImage(load_en);
          } else if (language === 'ko') {
               setBackgroundImage(background_kr);
               setLoadBgImage(load_kr);
          } else if (language === 'vi') {
               setBackgroundImage(background_vn);
               setLoadBgImage(load_vn);
          } else if (language === 'mn') {
               setBackgroundImage(background_mn);
               setLoadBgImage(load_mn);
          }
     }, []);

     const displayClassNameForBackground = () => {
          if (selectedFrame === '2cut-x2') {
               return 'right-choose-photos-2cut';
          } else if (selectedFrame === '4-cutx2') {
               return 'right-choose-photos-4cut';
          } else if (selectedFrame === '5-cutx2') {
               return 'left-choose-photos-5cut';
          } else {
               return 'right-choose-photos';
          }
     };

     const displayClassNameForLayout = () => {
          if (selectedFrame === '2cut-x2') {
               return 'right-choose-container-2cut';
          } else if (selectedFrame === '4-cutx2') {
               return 'right-choose-container-4cut';
          } else if (selectedFrame === '5-cutx2') {
               return 'left-choose-container-5cut';
          } else {
               return 'right-choose-container-photo';
          }
     };

     /* useEffect(() => {
          if (!cameraConnected) {
               const timer = setInterval(() => {
                    if (countdown > 0) {
                         if (countdown === 5)
                              playCntSound();
                         setCountdown(countdown - 1);
                    } else {
                         takePhoto();
                    }
               }, 1000);
               return () => clearInterval(timer); // Cleanup timer on unmount
          }
     }, [cameraConnected, countdown, takePhoto]); */

     useEffect(() => {
          if (uuid && status === 'working' && cameraConnected) {
               const initializeLiveView = async () => {
                    await startLiveView(uuid).then(response => console.log(response));
               };
               initializeLiveView();
               startTimer();
          }

          return () => {
               clearInterval(timerRef.current);
          };
     }, [uuid, status, cameraConnected, startTimer]);

     const copyImageApi = async () => {
          const sessionSelectedLayout = sessionStorage.getItem('selectedLayout');
          if (!sessionSelectedLayout) {
               return;
          }

          const parsedSelectedLayout = [JSON.parse(sessionSelectedLayout)];
          const layoutData = parsedSelectedLayout[0];

          const copyImageUrl = `${import.meta.env.VITE_REACT_APP_BACKEND}/frames/api/copy-image`;
          const copyImageData = {
               photo_url: layoutData.photo,
               photo_cover: layoutData.photo_cover
          };

          try {
               const response = await fetch(copyImageUrl, {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(copyImageData)
               });
               const data = await response.json();
               sessionStorage.setItem('copiedPhoto', data.photo_path);
               sessionStorage.setItem('copiedPhotoCover', data.photo_cover_path);
               return true;
          } catch (error) {
               console.error(`Failed to copy image: ${error}`);
               return false;
          }
     };

     const getLiveStyle = () => {
          const baseStyle = {
               objectFit: "cover",
               position: "absolute",
               top: "15%", // Adjust this value to move the element down
               transform: "scaleX(-1)"
          };
          return { ...baseStyle, width: "882px", height: "700px", left: "2%" };
     };

     return (
          flash ? (
               <div>
                    <div className={`photo-container`} style={{ backgroundImage: `url(${loadBgImage})` }} />
               </div>
          ) : (
               <div className={`photo-container`} style={{ backgroundImage: `url(${backgroundImage})` }}>
                    <div className="left-photo-div" style={{ backgroundImage: `url(${countdownImg})` }}>
                         <div className="photo-countdown">{countdown}</div>
                    </div>
                    <div className="right-photo-div" style={{ backgroundImage: `url(${photocountImg})` }}>
                         <div className="photo-count">{photoCount}/{totalSnapshotPhoto}</div>
                    </div>
                    <div className="right-big-frame-11">
                         <div className={displayClassNameForBackground()} style={{ backgroundImage: `url(${myBackground})` }}>
                              {capturePhotos && showSelectedPhotos()}
                         </div>
                         <div className={displayClassNameForLayout()} style={{ backgroundImage: `url(${selectedLayout})` }}></div>
                         {showClickArea()}
                         <div className='ok-photo-button' style={{ backgroundImage: `url(${okButtonUrl})` }} onClick={goToFilter}></div>
                         <div className='take-again-button' style={{ backgroundImage: `url(${takeAgainButtonUrl})` }} onClick={reTakePhoto}></div>
                    </div>
                    <div className="middle-photo-div">
                         {!capturing && (
                              <img
                                   src={videoFeedUrl}
                                   style={getLiveStyle()}
                                   alt="Live View"
                                   className='photo-webcam'
                              />
                         ) /* || (<Webcam
                              audio={false}
                              ref={webcamRef}
                              forceScreenshotSourceSize={true}
                              videoConstraints={{
                                   height: 720,
                                   width: 1280
                              }}
                              style={{
                                   width: 900,
                                   height: 500,
                              }}
                              screenshotFormat='image/jpeg'
                              className='photo-webcam'
                         />) */
                         }
                    </div>
               </div>
          )
     );
}

export default Photo;