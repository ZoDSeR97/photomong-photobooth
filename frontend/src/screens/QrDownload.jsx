import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {QRCodeSVG} from 'qrcode.react';

function PhotoChoose() {
    const [capturePhotos, setCapturePhotos] = useState([]);
    const [videoUrl, setVideoUrl] = useState('');
    const navigate = useNavigate();
    const uuid = sessionStorage.getItem("uuid");

    useEffect(() => {
        if (capturePhotos.length === 8) {
            sessionStorage.setItem("uuid", uuid);
        }
        if (capturePhotos.length === 9) {
            console.log("mp4 in list", capturePhotos.filter(photo => photo.url.includes(".mp4")))
            if (capturePhotos.filter(photo => photo.url.includes(".mp4")).length > 0) {
                const idx = capturePhotos.findIndex(photo => photo.url.includes(".mp4"))
                const videoUrl = capturePhotos[idx].url
                sessionStorage.setItem("videoUrl", videoUrl);
                setVideoUrl(videoUrl);
            }
            navigate('/photo-choose');
        }
    }, [capturePhotos, navigate, uuid]);

    // useEffect(() => {
    //     if (uuid) {
    //         const url = `http://3.26.21.10:5000/video/${uuid}`;
    //         setVideoUrl(url);
    //     }
    // }, [uuid]);

    const handleImageDownload = async () => {
        // 이미지 다운로드 로직 구현
        console.log("Image download not implemented");
    };

    const handleVideoDownload = () => {
        if (videoUrl) {
            window.open(videoUrl, '_blank');
        } else {
            alert('No video URL available.');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <button style={{ marginBottom: '20px' }} onClick={handleImageDownload}>
                Image Download
            </button>
            <button style={{ marginBottom: '20px' }} onClick={handleVideoDownload}>
                Video Download
            </button>
            {videoUrl && (
                <div>
                    <p>Scan this QR code to download the video:</p>
                    <QRCodeSVG value={videoUrl} />
                </div>
            )}
        </div>
    );
}

export default PhotoChoose;