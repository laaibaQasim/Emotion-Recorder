import React, { useEffect, useRef } from 'react';

const CameraViewer = ({ onCameraUnmount }) => {
  const videoElementRef = useRef(null);

  useEffect(() => {
    const videoElement = videoElementRef.current;

    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoElement.srcObject = stream;
        videoElement.play();
      })
      .catch((error) => {
        console.error('Error accessing camera:', error);
      });

    return () => {
      // Cleanup when component unmounts
      if (videoElement.srcObject) {
        const tracks = videoElement.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      videoElement.remove();
      onCameraUnmount(); // Notify parent component about camera unmount
    };
  }, [onCameraUnmount]);

  return (
    <div>
      <video ref={videoElementRef} />
    </div>
  );
};

export default CameraViewer;